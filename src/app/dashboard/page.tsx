"use client";

import { useEffect } from "react";
import { usePlanStore } from "@/store/planStore";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import PlanTabs from "@/components/dashboard/PlanTabs";
import { Spinner } from "@/components/ui/Spinner";
import { RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const { fetchPlan, regeneratePlan, isLoading, error, plan } = usePlanStore();

  // Busca o plano ao abrir a página
  useEffect(() => {
    if (!plan) {
      fetchPlan();
    }
  }, [plan, fetchPlan]);

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)]">
      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-[color:var(--border-subtle)] bg-[color:var(--bg)]/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:py-4">
          {/* LOGO + TÍTULO */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)] text-[color:var(--accent)] font-bold">
              VF
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wide text-[color:var(--text-soft)]">
                VitaFlow
              </span>
              <span className="text-sm font-semibold">
                Seu painel de performance
              </span>
            </div>
          </div>

          {/* BOTÃO DE TEMA */}
          <ThemeToggle />
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-5xl px-4 pb-10 pt-6 md:pt-8">
        {/* TÍTULO E BOTÃO */}
        <section className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold md:text-2xl">
              Olá! Seja bem-vindo(a) ao seu fluxo ideal. 💚
            </h1>
            <p className="mt-1 text-xs md:text-sm text-[color:var(--text-soft)]">
              Aqui você acompanha treino, alimentação e evolução nutricional.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            {/* BOTÃO GERAR NOVO PLANO */}
            <button
              onClick={regeneratePlan}
              disabled={isLoading}
              className="
                inline-flex items-center gap-2 rounded-full
                bg-[color:var(--accent)]
                px-4 py-2 text-xs md:text-sm font-semibold
                text-white shadow-lg shadow-[color:var(--accent)]/30
                hover:brightness-110
                disabled:opacity-60 disabled:cursor-not-allowed
                transition
              "
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Gerando...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>Gerar nova versão</span>
                </>
              )}
            </button>

            {/* SPINNER EXTRA */}
            {isLoading && <Spinner />}
          </div>
        </section>

        {/* MENSAGEM DE ERRO */}
        {error && (
          <div className="mb-4 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-100">
            <p className="font-semibold">Não foi possível gerar o plano.</p>
            <p className="mt-1 opacity-80">{error}</p>
          </div>
        )}

        {/* ABAS */}
        <PlanTabs />
      </main>
    </div>
  );
}
