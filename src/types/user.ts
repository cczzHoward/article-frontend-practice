export interface User {
    id: string;
    username: string;
    role: 'admin' | 'user';
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}
