import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('tl_token') || null,

  setAuth: (token, user) => {
    localStorage.setItem('tl_token', token);
    set({ token, user });
  },

  clearAuth: () => {
    localStorage.removeItem('tl_token');
    set({ token: null, user: null });
  },
}));

export default useAuthStore;
