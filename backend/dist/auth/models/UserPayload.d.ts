interface app_metadata {
    provider?: string;
    providers?: string[];
}
interface user_metadata {
    avatar_url?: string;
    email?: string;
    email_verified?: boolean;
    full_name?: string;
    iss?: string;
    name?: string;
    picture?: string;
    provider_id?: string;
    sub?: string;
    role?: string;
}
export interface UserPayload {
    aud?: string;
    exp?: number;
    iat?: number;
    iss?: string;
    sub: string;
    email: string;
    phone?: string;
    app_metadata?: app_metadata;
    user_metadata?: user_metadata;
    role?: string;
    all?: string;
    session_id?: string;
}
export {};
