/**
 * useApi — plain $fetch wrapper with global 401 interceptor.
 *
 * NOTE: The backend currently enforces CSRF on /v2/web/* routes (returns 419).
 * This needs to be resolved on the backend side — either by excluding API
 * routes from VerifyCsrfToken middleware, or by fixing CORS to support
 * credentials (specific origin instead of wildcard *).
 *
 * Safe to call from Pinia store actions (uses useNuxtApp() instead of
 * useI18n() / useCookie() directly, avoiding the "must be called at the
 * top of a setup function" error).
 */
export const useApi = <T = any>(
  request: string | (() => string),
  opts?: Parameters<typeof $fetch>[1],
) => {
  const nuxtApp = useNuxtApp();
  const config = useRuntimeConfig();

  // Read locale via the app instance or explicit "lang" cookie which is the source of truth
  const langCookie = useCookie<string>("lang", { default: () => "ar" }).value;
  const rawLocale: string =
    langCookie ??
    (nuxtApp.$i18n as any)?.locale?.value ??
    (nuxtApp.$i18n as any)?.locale ??
    "ar";

  // The backend expects "en" or "ar", but Nuxt might provide "en-US"
  const localePart =
    typeof rawLocale === "string" ? rawLocale.split("-")[0] : "ar";
  const locale = localePart || "ar";

  // Read auth token from cookie — matches the store's useCookie('auth_token')
  const getToken = (): string | null => {
    return useCookie<string | null>("auth_token").value;
  };

  const method = (opts?.method as string | undefined)?.toUpperCase();
  const isMutation =
    !!method && ["POST", "PUT", "PATCH", "DELETE"].includes(method);

  const headers: Record<string, string> = {
    Accept: "application/json",
    // "Accept-Language": locale,
    "X-localization": locale,
  };
  const isFormData = opts?.body instanceof FormData;
  if (isMutation && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return $fetch<T>(request, {
    baseURL: config.public.apiBase as string,
    ...opts,
    credentials: "omit",
    headers: {
      ...headers,
      // caller-supplied headers always win
      ...opts?.headers,
    },
    // ── Global 401 interceptor ────────────────────────────────────────────
    onResponseError({ response }) {
      if (response.status === 401 && import.meta.client) {
        // Token is expired or invalid — clear auth state and redirect
        const authToken = useCookie<string | null>("auth_token");
        authToken.value = null;

        const authOverlayOpen = useState("authOverlayOpen", () => false);
        authOverlayOpen.value = true;
      }
    },
  });
};
