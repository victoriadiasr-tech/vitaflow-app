// src/store/userStore.ts
"use client";

import { create } from "zustand";

type User = {
  name?: string;
  sex?: string;
  age?: number;
  weight?: number;
  height?: number;
  activityLevel?: string;
  goal?: string;
  dietRestrictions?: string;
  trainingMode?: string;
  wakeTime?: string;
  sleepTime?: string;
  bodyFat?: number;
  waist?: number;
  hip?: number;
  shoulder?: number;
  arm?: number;
};

type UserState = {
  user: Partial<User>;
  setUser: (data: Partial<User>) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: {},

  setUser: (data) =>
    set((state) => ({
      user: { ...state.user, ...data },
    })),

  clearUser: () => set({ user: {} }),
}));

