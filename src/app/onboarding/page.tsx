"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("emagrecer");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [sex, setSex] = useState("feminino");
  const [activityLevel, setActivityLevel] = useState("leve");
  const [dietRestrictions, setDietRestrictions] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [sleepTime, setSleepTime] = useState("");

  const router = useRouter();

  function handleContinue() {
    if (!name.trim()) {
      alert("Coloque pelo menos seu primeiro nome 🙂");
      return;
    }

    const user = {
      name,
      goal,
      age: age ? Number(age) : undefined,
      weight: weight ? Number(weight) : undefined,
      height: height ? Number(height) : undefined,
      sex,
      activityLevel,
      dietRestrictions: dietRestrictions || undefined,
      wakeTime: wakeTime || undefined,
      sleepTime: sleepTime || undefined,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("vitaflow-user", JSON.stringify(user));
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-500 via-orange-400 to-orange-600 px-6 py-10">
      <div className="max-w-2xl mx-auto bg-black/75 rounded-3xl p-8 md:p-10 shadow-2xl border border-white/10 text-white">
        <h1 className="text-3xl md:text-4xl font-semibold mb-6">
          Bem-vinda ao VitaFlow
        </h1>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2 text-sm text-white/80">Seu nome</label>
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
              Sexo biológico
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl text-black outline-none"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
            >
              <option value="feminino">Feminino</option>
              <option value="masculino">Masculino</option>
              <option value="outro">Outro / Prefiro não dizer</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm text-white/80">Idade</label>
            <input
              type="number"
              min={12}
              max={99}
              className="w-full px-4 py-3 rounded-xl text-black outline-none"
              placeholder="Ex: 34"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-white/80">
              Peso (kg)
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 rounded-xl text-black outline-none"
              placeholder="Ex: 68"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-white/80">
              Altura (cm)
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 rounded-xl text-black outline-none"
              placeholder="Ex: 165"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-white/80">
              Nível de atividade
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl text-black outline-none"
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
            >
              <option value="sedentario">Sedentária</option>
              <option value="leve">Ativa leve (caminhadas, etc.)</option>
              <option value="moderado">Ativa moderada (3x/semana)</option>
              <option value="intenso">Ativa intensa (5x/semana ou mais)</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
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

          <div>
            <label className="block mb-2 text-sm text-white/80">
              Restrição / preferência alimentar
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl text-black outline-none"
              placeholder="Ex: vegetariana, sem lactose, sem glúten..."
              value={dietRestrictions}
              onChange={(e) => setDietRestrictions(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-white/80">
              Horário que costuma acordar
            </label>
            <input
              type="time"
              className="w-full px-4 py-3 rounded-xl text-black outline-none"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-white/80">
              Horário que costuma dormir
            </label>
            <input
              type="time"
              className="w-full px-4 py-3 rounded-xl text-black outline-none"
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="w-full mt-2 px-8 py-3 rounded-full bg-green-500 hover:bg-green-600 text-black font-semibold text-lg transition-transform hover:scale-105"
        >
          Continuar
        </button>

        <p className="text-[11px] text-white/60 mt-6">
          As recomendações geradas têm caráter informativo e não substituem
          avaliação individualizada por médicos, nutricionistas ou educadores
          físicos.
        </p>
      </div>
    </main>
  );
}
