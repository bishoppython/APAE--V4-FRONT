import { create } from 'zustand';

export interface User {
    id: string;
    name: string;
    email: string;
    cpf: string;
    role: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: !!localStorage.getItem('token'),
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),

    login: (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ isAuthenticated: true, token, user });
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ isAuthenticated: false, token: null, user: null });
    }
}));