"use client";

import { useEffect, useState } from "react";

type UserData = {
  name: string;
  goal: string;
};

export default function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("vitaflow-user");
      if (raw) {
        try {
          setUser(JSON.parse(raw));
        } catch {
          // se der erro, ignora
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
          <button className="px-6 py-2 rounded-full bg-green-500 hover:bg-green-600 text-black font-semibold text-sm md:text-base transition-transform hover:scale-105">
            Gerar novo plano
          </button>
        </header>

        <section className="grid md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <h2 className="text-sm font-semibold mb-2 text-white/80">
              Metas do dia
            </h2>
            <ul className="text-sm text-white/80 space-y-1">
              <li>💧 2,3 L de água</li>
              <li>🚶‍♀️ 7.000 passos</li>
              <li>🛏️ 7h de sono</li>
              <li>🔥 1.800 kcal totais</li>
            </ul>
          </div>

          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <h2 className="text-sm font-semibold mb-2 text-white/80">
              Treino sugerido
            </h2>
            <p className="text-sm text-white/80 mb-2">Duração: 25 minutos</p>
            <ul className="text-sm text-white/80 space-y-1">
              <li>• Aquecimento leve (5 min)</li>
              <li>• Agachamento, flexão, remada (3x12)</li>
              <li>• Prancha e abdominal (3x30s)</li>
              <li>• Alongamento final (5 min)</li>
            </ul>
          </div>

          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <h2 className="text-sm font-semibold mb-2 text-white/80">
              Alimentação do dia
            </h2>
            <ul className="text-sm text-white/80 space-y-1">
              <li>🍳 Café: ovos + frutas</li>
              <li>🍚 Almoço: proteína + carbo bom + salada</li>
              <li>🥜 Lanche: iogurte ou castanhas</li>
              <li>🥗 Jantar: refeição leve com proteína</li>
            </ul>
          </div>
        </section>

        <section className="bg-white/5 rounded-2xl p-5 border border-white/10 text-xs text-white/60">
          As orientações aqui apresentadas possuem caráter informativo e
          educativo e não substituem avaliação individualizada por médicos,
          nutricionistas ou educadores físicos. Sempre consulte profissionais
          habilitados antes de iniciar qualquer plano de treino ou alimentação.
        </section>
      </div>
    </main>
  );
}
