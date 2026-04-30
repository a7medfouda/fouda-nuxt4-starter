/**
 * useCachedApi — useAsyncData wrapper with time-based client caching.
 *
 * Goals:
 *  - First request always runs on the SERVER (SSR), result is serialised into
 *    the Nuxt payload and reused on the client without a second network call.
 *  - While the cache is still valid, navigating back to the same page is
 *    instant — getCachedData returns the stored payload, no request fires.
 *  - When the cache expires the composable refreshes automatically via a
 *    scheduled setTimeout, and also on tab-focus if the user was away.
 *  - Multiple components sharing the same key share one timer (no duplicates).
 *  - Cleanup is ref-counted so the last unmounted component removes the timer.
 *
 * Usage (must be called at the top level of a <script setup> block):
 *
 *   const { data, status, refresh } = await useCachedApi<HomeApiResponse>(
 *     "home-data",      // unique cache key — must match one URL only
 *     "/v2/web/home",
 *     5 * 60 * 1000,    // optional, default 5 min
 *   );
 */

// ── Module-level singletons (survive across page navigations) ─────────────────

/** Active setTimeout handles, keyed by cache key. */
const _timerMap = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * How many mounted component instances are currently using each key.
 * The timer is only cleared when the count reaches zero.
 */
const _refCount = new Map<string, number>();

// ─────────────────────────────────────────────────────────────────────────────

export const useCachedApi = async <T>(
  baseKey: string,
  url: string,
  durationMs: number = 5 * 60 * 1000,
) => {
  const nuxtApp = useNuxtApp();

  // Read locale via the app instance or explicit "lang" cookie which is the source of truth
  const langCookie = useCookie<string>("lang", { default: () => "ar" }).value;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const rawLocale: string =
    langCookie ??
    (nuxtApp.$i18n as any)?.locale?.value ??
    (nuxtApp.$i18n as any)?.locale ??
    "ar";
  /* eslint-enable @typescript-eslint/no-explicit-any */

  // The backend expects "en" or "ar", but Nuxt might provide "en-US"
  const localePart =
    typeof rawLocale === "string" ? rawLocale.split("-")[0] : "ar";
  const locale = localePart || "ar";

  const key = `${baseKey}-${locale}`;

  // We add `lazy: true` so that client-side navigation doesn't block and we can show skeletons.
  // Note: Nuxt 3's lazy: true does not skip SSR fetch. It only affects client navigation blocking.

  // Persist the cache expiration timestamp across SSR→client hydration.
  // useState is keyed separately from useAsyncData so changing durationMs
  // doesn't invalidate the data key.
  const cacheExpiration = useState<number | null>(
    `__cachedApi_exp_${key}`,
    () => null,
  );

  const asyncDataResult = await useAsyncData<T>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    key as any,
    () =>
      useApi<T>(url, { headers: { "X-localization": locale } }) as Promise<T>,
    {
      lazy: true,
      // getCachedData runs synchronously on every navigation to this page.
      // Return a value  → Nuxt uses it, no network request.
      // Return undefined → Nuxt runs the fetcher and calls this again after.
      getCachedData(nuxtKey) {
        const nuxtApp = useNuxtApp();

        const cachedData =
          nuxtApp.payload.data[nuxtKey] ?? nuxtApp.static.data[nuxtKey];

        // No data in payload yet (first SSR render or hard reload).
        if (cachedData === undefined || cachedData === null) return undefined;

        // Data exists — check whether it has expired.
        // On first hydration cacheExpiration is null (the watch below hasn't
        // fired yet), so we treat the payload as fresh and let the watch set
        // the expiration after mount.
        if (
          cacheExpiration.value !== null &&
          Date.now() > cacheExpiration.value
        ) {
          return undefined; // Expired → trigger a fresh fetch
        }

        return cachedData;
      },
    },
  );

  const { data, refresh } = asyncDataResult;

  // Set / extend expiration every time fresh data arrives.
  watch(
    data,
    (newData) => {
      if (newData !== null && newData !== undefined) {
        cacheExpiration.value = Date.now() + durationMs;
      }
    },
    { immediate: true },
  );

  // ── Client-only: auto-refresh timer + visibility handler ─────────────────
  if (import.meta.client) {
    // Schedules a setTimeout that fires exactly when the cache expires.
    // Clears any previous timer for this key before setting a new one,
    // so multiple components or fast navigations never stack up timers.
    const scheduleRefresh = () => {
      const existing = _timerMap.get(key);
      if (existing) clearTimeout(existing);

      if (!cacheExpiration.value) return;

      const delay = cacheExpiration.value - Date.now();

      if (delay <= 0) {
        _timerMap.delete(key);
        refresh();
      } else {
        _timerMap.set(
          key,
          setTimeout(() => {
            _timerMap.delete(key);
            refresh();
          }, delay),
        );
      }
    };

    // Re-schedule whenever the expiration timestamp changes (i.e. after every
    // successful fetch sets a new expiration value).
    watch(cacheExpiration, scheduleRefresh, { immediate: true });

    // FIX: Debounced visibility handler.
    // Without debounce, rapidly alt-tabbing fires multiple refreshes.
    // 300 ms is enough to ignore accidental tab switches.
    let visibilityDebounce: ReturnType<typeof setTimeout> | null = null;

    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;

      if (visibilityDebounce) clearTimeout(visibilityDebounce);

      visibilityDebounce = setTimeout(() => {
        visibilityDebounce = null;
        if (cacheExpiration.value && Date.now() > cacheExpiration.value) {
          refresh();
        }
      }, 300);
    };

    onMounted(() => {
      // FIX: Reference counting.
      // Increment the count for this key so that only the *last* component
      // to unmount actually removes the shared timer.
      _refCount.set(key, (_refCount.get(key) ?? 0) + 1);
      document.addEventListener("visibilitychange", onVisibilityChange);
    });

    onUnmounted(() => {
      // Always clean up this component's visibility listener.
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (visibilityDebounce) clearTimeout(visibilityDebounce);

      // FIX: Only clear the shared timer when no other component is using
      // this key. Without this, the first component to unmount would cancel
      // the timer even though another component on the same page still needs
      // it.
      const remaining = (_refCount.get(key) ?? 1) - 1;
      if (remaining <= 0) {
        _refCount.delete(key);
        const timer = _timerMap.get(key);
        if (timer) {
          clearTimeout(timer);
          _timerMap.delete(key);
        }
      } else {
        _refCount.set(key, remaining);
      }
    });
  }

  // Return everything from useAsyncData so the component can use
  // data, status, error, refresh, etc. as normal.
  return asyncDataResult;
};
