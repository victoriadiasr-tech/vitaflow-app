"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("emagrecer");
  const router = useRouter();

  function handleContinue() {
    if (!name.trim()) {
      alert("Coloque pelo menos seu primeiro nome 🙂");
      return;
    }

    const data = { name, goal };
    if (typeof window !== "undefined") {
      localStorage.setItem("vitaflow-user", JSON.stringify(data));
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-500 via-orange-400 to-orange-600 px-6 py-10">
      <div className="max-w-xl mx-auto bg-black/75 rounded-3xl p-8 shadow-2xl border border-white/10">
        <h1 className="text-3xl font-semibold mb-6 text-white">
          Bem-vinda ao VitaFlow
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm text-white/80">
              Seu nome
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl text-black outline-none"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-white/80">
              Seu objetivo principal
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl text-black outline-none"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            >
              <option value="emagrecer">Emagrecer</option>
              <option value="ganhar massa">Ganhar massa</option>
              <option value="definir">Definir</option>
              <option value="saude">Melhorar a saúde</option>
            </select>
          </div>

          <button
            onClick={handleContinue}
            className="w-full mt-4 px-8 py-3 rounded-full bg-green-500 hover:bg-green-600 text-black font-semibold text-lg transition-transform hover:scale-105"
          >
            Continuar
          </button>
        </div>

        <p className="text-[11px] text-white/60 mt-6">
          As recomendações geradas têm caráter informativo e não substituem
          avaliação individualizada por médicos, nutricionistas ou educadores
          físicos.
        </p>
      </div>
    </main>
  );
}
