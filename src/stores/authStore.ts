import { User } from "firebase/auth";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    uid: null as string | null,
  }),

  actions: {
    definirUsuario(user: User | null) {
      this.uid = user?.uid || null;
    },

    clearUser() {
      this.uid = null;
    },
  },
});
