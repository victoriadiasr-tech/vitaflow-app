// src/store/userStore.ts
"use client";

import { create } from "zustand";

export type UserData = {
  name: string;
  gender: string;
  age: number;
  weight: number;
  height: number;
  activityLevel: string;
  objective: string;
  bodyFat?: number;
  waist?: number;
  hip?: number;
  chest?: number;
  arm?: number;
  trainingLocation: string;
  foodRestrictions?: string;
  wakeTime?: string;
  sleepTime?: string;
};

interface UserState {
  user: UserData | null;
  setUser: (data: Partial<UserData>) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,

  setUser: (data) =>
    set((state) => ({
      user: { ...state.user, ...data },
    })),

  resetUser: () => set({ user: null }),
}));
