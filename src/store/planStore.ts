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
  isLoading: false,
  error: null,
  currentDayIndex: 0,
  activeTab: "today",

  // 🔥 Agora usa os dados reais do onboarding
  async fetchPlan() {
    try {
      set({ isLoading: true, error: null });

      // pega o usuário salvo no onboardingStore
      const user = useOnboardingStore.getState().user;

      if (!user || Object.keys(user).length === 0) {
        throw new Error("Nenhum usuário preenchido no onboarding");
      }

      // log pra conferir no devtools se está vindo certo
      console.log("USER ENVIADO PARA /api/plan:", user);

      const res = await fetch("/api/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error(
          "Erro ao chamar /api/plan:",
          res.status,
          res.statusText,
          text,
        );
        throw new Error("Falha ao buscar o plano");
      }

      const data = (await res.json()) as PlanResponse;

      set({
        plan: data,
        isLoading: false,
        currentDayIndex: 0,
        error: null,
      });
    } catch (err: any) {
      console.error("Erro em fetchPlan():", err);
      set({
        isLoading: false,
        error: err?.message ?? "Erro inesperado ao buscar o plano",
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
