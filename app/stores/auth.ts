import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useApi } from "~/composables/useApi";
import type {
  AuthUser,
  AuthLoginResponse,
  AuthRegisterResponse,
  ForgotPasswordResponse,
  VerifyOtpResponse,
  ResetPasswordResponse,
} from "~/types/auth";

export const useAuthStore = defineStore(
  "auth",
  () => {
    // ── Persisted state ──────────────────────────────────────────────────────
    const token = useCookie<string | null>("auth_token", {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
      secure: !import.meta.dev, // SEC1: HTTPS-only in production
      default: () => null,
    });

    // User data — persisted via pinia-plugin-persistedstate (localStorage)
    const user = ref<AuthUser | null>(null);

    // Temporary in-memory state for the forgot-password flow
    const resetUid = ref<string | null>(null);
    const resetOtp = ref<string | null>(null);

    let resetClearTimer: ReturnType<typeof setTimeout> | null = null;
    const startResetClearTimer = () => {
      if (resetClearTimer) clearTimeout(resetClearTimer);
      resetClearTimer = setTimeout(
        () => {
          resetUid.value = null;
          resetOtp.value = null;
        },
        10 * 60 * 1000,
      );
    };

    const isLoggedIn = computed(() => !!token.value && !!user.value);

    // ── Helpers ──────────────────────────────────────────────────────────────
    const setAuth = (newToken: string, newUser: AuthUser) => {
      token.value = newToken;
      user.value = newUser;
    };

    const clearAuth = () => {
      token.value = null;
      user.value = null;
    };

    // ── State Guard: لو token موجود بس user اتمسح (أو العكس) → logout تلقائي
    // بيشتغل مرة واحدة لما الـ store يتحمل على الـ client
    const syncAuthState = () => {
      const hasToken = !!token.value;
      const hasUser = !!user.value;
      if (hasToken !== hasUser) {
        // في inconsistency — امسح كل حاجة وسجل خروج
        clearAuth();
      }
    };

    // ── Logout ───────────────────────────────────────────────────────────────
    const logout = async () => {
      try {
        // بعت request للسيرفر عشان يعمل invalidate للتوكن
        // الـ token بيتبعت تلقائياً في الـ Authorization header عن طريق useApi
        await useApi("v1/logout", { method: "POST" });
      } catch {
        // لو الـ logout request فشل (network error, token expired, إلخ)
        // نكمل ونمسح الـ state محلياً على طول
      } finally {
        // دايمًا امسح الـ state المحلي بغض النظر عن نتيجة الـ request
        clearAuth();
        navigateTo("/");
      }
    };

    // ── Login ────────────────────────────────────────────────────────────────
    const login = async (payload: {
      mobile?: string;
      email?: string;
      password: string;
    }) => {
      const response = await useApi<AuthLoginResponse>("v2/web/login", {
        method: "POST",
        body: payload,
      });
      if (response.status && response.data) {
        setAuth(response.data.token, {
          id: response.data.id,
          full_name: response.data.full_name,
          username: response.data.username,
          email: response.data.email,
          mobile: response.data.mobile,
          image: response.data.image,
          total_compelete_courses:response.data.total_compelete_courses
        });
      }
      return response;
    };

    // ── Register ─────────────────────────────────────────────────────────────
    const register = async (payload: {
      full_name: string;
      username: string;
      mobile: string;
      email: string;
      password: string;
      password_confirmation: string;
    }) => {
      const response = await useApi<AuthRegisterResponse>("v2/web/register", {
        method: "POST",
        body: payload,
      });
      if (response.status && response.data) {
        setAuth(response.data.token, {
          id: response.data.id,
          full_name: response.data.full_name,
          username: response.data.username,
          email: response.data.email,
          mobile: response.data.mobile,
          image: response.data.image,
          total_compelete_courses:response.data.total_compelete_courses
        });
      }
      return response;
    };

    // ── Forgot Password ──────────────────────────────────────────────────────
    const forgotPassword = async (payload: { mobile: string }) => {
      const response = await useApi<ForgotPasswordResponse>(
        "v2/web/forgot-password",
        { method: "POST", body: payload },
      );
      if (response.status && response.data?.uId) {
        resetUid.value = response.data.uId;
        startResetClearTimer();
      }
      return response;
    };

    // ── Verify OTP ───────────────────────────────────────────────────────────
    const verifyOtp = async (payload: { uId: string; otp: string }) => {
      return await useApi<VerifyOtpResponse>("v2/web/verify-otp", {
        method: "POST",
        body: payload,
      });
    };

    // ── Reset Password ───────────────────────────────────────────────────────
    const resetPassword = async (payload: {
      uId: string;
      otp: string;
      password: string;
      password_confirmation: string;
    }) => {
      return await useApi<ResetPasswordResponse>("v2/web/reset-password", {
        method: "POST",
        body: payload,
      });
    };

    return {
      token,
      user,
      resetUid,
      resetOtp,
      isLoggedIn,
      syncAuthState,
      login,
      register,
      forgotPassword,
      verifyOtp,
      resetPassword,
      logout,
    };
  },
  {
    persist: {
      pick: ["user"],
    },
  },
);
