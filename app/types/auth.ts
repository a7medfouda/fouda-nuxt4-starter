export interface AuthUser {
  id: number;
  full_name: string;
  email: string;
  username: string;
  mobile: string;
  image: string;
  total_compelete_courses: number;
}

export interface AuthLoginResponse {
  status: boolean;
  message?: string | string[];
  data: {
    token: string;
  } & AuthUser;
}

export interface AuthRegisterResponse {
  status: boolean;
  message?: string | string[];
  /** Field-level validation errors returned on 422 */
  errors?: Record<string, string[]>;
  data: {
    token: string;
  } & AuthUser;
}

export interface ForgotPasswordResponse {
  status: boolean;
  message?: string | string[];
  errors?: string[];
  data?: {
    uId: string;
    mobile: string;
  };
}

export interface VerifyOtpResponse {
  status: boolean;
  message?: string | string[];
  errors?: string[];
  data?:
    | {
        message: string;
      }
    | string;
}

export interface ResetPasswordResponse {
  status: boolean;
  message?: string | string[];
  errors?: string[];
  data?: string;
}

export interface AuthSectionStat {
  title: string;
  number: string;
  icon: string;
}

export interface AuthSection {
  id: number;
  header: string;
  title: string;
  description: string;
  button_1: string;
  button_2: string;
  button_action_1: string;
  button_action_2: string;
  image: string;
  number_sections: AuthSectionStat[];
}

export interface AuthPageResponse {
  status: boolean;
  data: {
    auth_section: AuthSection[];
  };
}
