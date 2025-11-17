"use client";

import { useEffect, useState } from "react";

type UserData = {
  name: string;
  goal: string;
  age?: number;
  weight?: number;
  height?: number;
  sex?: string;
  activityLevel?: string;
  dietRestrictions?: string;
  wakeTime?: string;
  sleepTime?: string;
};

export default function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("vitaflow-user");
      if (raw) {
        try {
          setUser(JSON.parse(raw));
        } catch {
          // ignore erro de parse
        }
      }
    }
  }, []);

  const hoje = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const nome = user?.name || "Você";
  const objetivo = user?.goal || "manter uma rotina saudável";

  async function handleGeneratePlan() {
    if (!user) {
      alert("Preencha o onboarding primeiro 🙂");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user }),
      });

      if (!res.ok) {
        throw new Error("Erro ao gerar plano");
      }

      const data = await res.json();
      setPlan(data.plan as string);
    } catch (e) {
      console.error(e);
      setError("Não foi possível gerar o plano agora. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-500 via-orange-400 to-orange-600 px-6 py-10">
      <div className="max-w-5xl mx-auto bg-black/75 rounded-3xl p-8 md:p-10 shadow-2xl border border-white/10 text-white">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold">
              Plano de hoje, {nome.split(" ")[0]}
            </h1>
            <p className="text-sm text-white/70 mt-1">
              {hoje} • Foco em: {objetivo}.
            </p>
          </div>
          <button
            onClick={handleGeneratePlan}
            disabled={loading}
            className="px-6 py-2 rounded-full bg.green-500 hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold text-sm md:text-base transition-transform hover:scale-105"
          >
            {loading ? "Gerando plano..." : "Gerar novo plano"}
          </button>
        </header>

        {error && (
          <div className="mb-4 text-sm text-red-300 bg-red-900/40 border border-red-500/40 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {plan ? (
          <section className="bg-white/5 rounded-2xl p-5 border border-white/10 text-sm text-white/80 whitespace-pre-wrap">
            {plan}
          </section>
        ) : (
          <section className="bg-white/5 rounded-2xl p-5 border border-white/10 text-sm text-white/80">
            Clique em <strong>“Gerar novo plano”</strong> para criar seu plano
            diário personalizado com base nos seus dados.
          </section>
        )}

        <section className="bg-white/5 rounded-2xl p-5 border border.white/10 text-xs text-white/60 mt-6">
          As orientações aqui apresentadas possuem caráter informativo e
          educativo e não substituem avaliação individualizada por médicos,
          nutricionistas ou educadores físicos. Sempre consulte profissionais
          habilitados antes de iniciar qualquer plano de treino ou alimentação.
        </section>
      </div>
    </main>
  );
}
