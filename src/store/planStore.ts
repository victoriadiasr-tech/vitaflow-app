// src/store/planStore.ts
"use client";

import { create } from "zustand";
import { PlanResponse } from "@/types/plan";
import { useOnboardingStore } from "./onboardingStore";

export type DashboardTab =
  | "today"
  | "week-training"
  | "nutrition"
  | "macros"
  | "shopping";

interface PlanState {
  plan: PlanResponse | null;
  // array de dias que o PlanTabs usa
  days: PlanResponse["days"] | [];
  isLoading: boolean;
  error: string | null;
  currentDayIndex: number;
  activeTab: DashboardTab;
  fetchPlan: () => Promise<void>;
  regeneratePlan: () => Promise<void>;
  setCurrentDayIndex: (index: number) => void;
  setActiveTab: (tab: DashboardTab) => void;
}

export const usePlanStore = create<PlanState>((set, get) => ({
  plan: null,
  days: [],
  isLoading: false,
  error: null,
  currentDayIndex: 0,
  activeTab: "today",

  async fetchPlan() {
    try {
      set({ isLoading: true, error: null });

      // pega o usuário do onboarding
      const user = useOnboardingStore.getState().user;
      if (!user || Object.keys(user).length === 0) {
        throw new Error("Nenhum usuário preenchido no onboarding");
      }

      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user }),
      });

      if (!res.ok) {
        console.error("Erro ao chamar /api/plan:", res.status, res.statusText);
        throw new Error("Falha ao buscar plano");
      }

      const data = (await res.json()) as PlanResponse;

      // garante que days existe, independente se veio em data.days ou data.plan.days
      const days =
        (data as any).days ??
        (data as any).plan?.days ??
        [];

      set({
        plan: data,
        days,
        isLoading: false,
        currentDayIndex: 0,
        error: null,
      });
    } catch (err: any) {
      console.error("Erro em fetchPlan():", err);
      set({
        isLoading: false,
        error: err?.message ?? "Erro inesperado ao buscar o plano",
        days: [],
      });
    }
  },

  async regeneratePlan() {
    await get().fetchPlan();
  },

  setCurrentDayIndex(index) {
    set({ currentDayIndex: index });
  },

  setActiveTab(tab) {
    set({ activeTab: tab });
  },
}));
