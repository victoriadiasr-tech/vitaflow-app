"use client";
import { create } from "zustand";

export interface OnboardingUser {
  name: string;
  age: number;
  weight: number;
  height: number;
  sex: string;
  activity: string;
  objective: string;
  trainingMode: string;
  restrictions?: string;
  wakeTime?: string;
  sleepTime?: string;
}

interface OnboardingState {
  user: Partial<OnboardingUser>;
  setUser: (data: Partial<OnboardingUser>) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  user: {},
  setUser: (data) =>
    set((prev) => ({
      user: { ...prev.user, ...data },
    })),
}));
