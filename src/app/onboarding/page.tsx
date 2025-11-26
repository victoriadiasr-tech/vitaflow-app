"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// ✅ ADIÇÃO: importa o store do onboarding
import { useOnboardingStore } from "@/store/onboardingStore";

const TOTAL_STEPS = 3;

// Frases motivacionais
const MOTIVATIONAL_QUOTES = [
  {
    text: "A maior de todas as vitórias é vencer a si mesmo.",
    author: "Platão",
  },
  {
    text: "Você nunca será capaz de escapar de seu coração. Por isso, é melhor escutar o que ele diz.",
    author: "Paulo Coelho",
  },
  {
    text: "A disciplina é a ponte entre objetivos e conquistas.",
    author: "Jim Rohn",
  },
  {
    text: "Coragem é ir em frente mesmo com medo.",
    author: "Sêneca",
  },
  {
    text: "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
    author: "Robert Collier",
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: "",
    sex: "feminino",
    age: "",
    weight: "",
    height: "",
    activityLevel: "leve",
    goal: "emagrecer",
    dietRestrictions: "",
    wakeTime: "",
    sleepTime: "",
    trainingMode: "casa", // "casa" | "academia" | "hibrido"

    // Campos opcionais novos
    bodyFat: "", // % de gordura
    waist: "", // cintura (cm)
    hip: "", // quadril (cm)
    shoulder: "", // ombro/peito (cm)
    arm: "", // braço (cm)
  });

  // frase motivacional sorteada no cliente
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(
    null
  );

  useEffect(() => {
    const idx = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setQuote(MOTIVATIONAL_QUOTES[idx]);
  }, []);

  const router = useRouter();

  // ✅ ADIÇÃO: pega o setUser do store
  const { setUser } = useOnboardingStore();

  function handleInput(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function saveAndGoDashboard() {
    if (!form.name.trim()) {
      alert("Coloque pelo menos seu primeiro nome 🙂");
      setStep(1);
      return;
    }

    if (!form.goal) {
      alert("Selecione um objetivo principal ✨");
      setStep(2);
      return;
    }

    const user = {
      ...form,
      age: form.age ? Number(form.age) : undefined,
      weight: form.weight ? Number(form.weight) : undefined,
      height: form.height ? Number(form.height) : undefined,
      bodyFat: form.bodyFat ? Number(form.bodyFat) : undefined,
      waist: form.waist ? Number(form.waist) : undefined,
      hip: form.hip ? Number(form.hip) : undefined,
      shoulder: form.shoulder ? Number(form.shoulder) : undefined,
      arm: form.arm ? Number(form.arm) : undefined,
    };

    // ✅ NOVO: salva no Zustand store (é isso que o planStore lê)
    setUser(user);

    // (opcional) mantém o localStorage se você quiser
    if (typeof window !== "undefined") {
      localStorage.setItem("vitaflow-user", JSON.stringify(user));
    }

    // só depois de salvar, vai para o dashboard
    router.push("/dashboard");
  }

  function handleNext() {
    if (step === 1 && !form.name.trim()) {
      alert("Me conta pelo menos seu primeiro nome para continuar 🙂");
      return;
    }

    if (step === 2 && !form.goal) {
      alert("Selecione um objetivo principal para continuar ✨");
      return;
    }

    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      saveAndGoDashboard();
    }
  }

  function handleBack() {
    if (step > 1) setStep(step - 1);
  }

  const progress = (step / TOTAL_STEPS) * 100;

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/95 text-slate-900 placeholder-slate-500 border border-white/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300 outline-none transition";

  const selectClass =
    "w-full px-4 py-3 rounded-xl bg-white/95 text-slate-900 border border-white/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300 outline-none transition";

  // Objetivos estilizados com ícones e descrições
  const goals = [
    {
      value: "emagrecer",
      label: "Emagrecer",
      icon: "🔥",
      description: "Secar gordura de forma consistente e saudável.",
    },
    {
      value: "ganhar_massa",
      label: "Ganhar massa",
      icon: "🏋️‍♀️",
      description: "Construir músculo com treino e nutrição focados.",
    },
    {
      value: "manter",
      label: "Manter",
      icon: "⚖️",
      description: "Manter peso e forma, ajustando rotina e saúde.",
    },
    {
      value: "saude_geral",
      label: "Saúde geral",
      icon: "💚",
      description: "Melhorar exames, disposição e bem-estar.",
    },
    {
      value: "emagrecer_ganhar_massa",
      label: "Emagrecer e ganhar massa",
      icon: "💪🔥",
      description: "Reduzir gordura enquanto aumenta massa magra.",
    },
    {
      value: "hipertrofia",
      label: "Hipertrofia",
      icon: "🧱",
      description: "Foco total em volume muscular e progressão de carga.",
    },
    {
      value: "energia_disposicao",
      label: "Energia e disposição",
      icon: "⚡",
      description: "Acordar melhor, ter gás no dia e menos fadiga.",
    },
    {
      value: "estetica_corporal",
      label: "Estética corporal",
      icon: "✨",
      description: "Afinar, definir e alinhar proporções corporais.",
    },
    {
      value: "condicionamento_fisico",
      label: "Condicionamento físico",
      icon: "🏃‍♀️",
      description: "Melhorar fôlego, resistência e performance geral.",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-500 via-orange-400 to-orange-600 px-6 py-10">
      <div className="max-w-3xl mx-auto bg-black/60 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-white/10 text-white">
        {/* Cabeçalho */}
        <header className="mb-6">
          <p className="text-xs uppercase tracking-[0.25em] text-white/60 mb-2">
            Onboarding VitaFlow
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold">
            Bem-vinda ao VitaFlow
          </h1>
          <p className="text-sm text-white/80 mt-2 max-w-2xl">
            Vamos entender um pouco sobre você para montar um plano inteligente
            de treino, rotina e alimentação.
          </p>
        </header>

        {/* Barra de progresso */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2 text-xs text-white/80">
            <span>
              Etapa {step} de {TOTAL_STEPS}
            </span>
            <span>
              {step === 1 && "Seus dados básicos"}
              {step === 2 && "Objetivo, medidas e treino"}
              {step === 3 && "Rotina e horários"}
            </span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* CONTEÚDO POR ETAPA */}
        <div className="space-y-6 mb-8">
          {/* ETAPA 1 – DADOS BÁSICOS */}
          {step === 1 && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Nome */}
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm text-white/90">
                  Seu nome
                </label>
                <input
                  type="text"
                  placeholder="Digite seu nome"
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => handleInput("name", e.target.value)}
                />
              </div>

              {/* Sexo */}
              <div>
                <label className="block mb-2 text-sm text-white/90">
                  Sexo biológico
                </label>
                <select
                  className={selectClass}
                  value={form.sex}
                  onChange={(e) => handleInput("sex", e.target.value)}
                >
                  <option value="feminino">Feminino</option>
                  <option value="masculino">Masculino</option>
                  <option value="outro">Outro / Prefiro não dizer</option>
                </select>
              </div>

              {/* Idade */}
              <div>
                <label className="block mb-2 text-sm text-white/90">Idade</label>
                <input
                  type="number"
                  min={12}
                  max={99}
                  placeholder="Ex: 34"
                  className={inputClass}
                  value={form.age}
                  onChange={(e) => handleInput("age", e.target.value)}
                />
              </div>

              {/* Peso */}
              <div>
                <label className="block mb-2 text-sm text-white/90">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 68"
                  className={inputClass}
                  value={form.weight}
                  onChange={(e) => handleInput("weight", e.target.value)}
                />
              </div>

              {/* Altura */}
              <div>
                <label className="block mb-2 text-sm text-white/90">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 165"
                  className={inputClass}
                  value={form.height}
                  onChange={(e) => handleInput("height", e.target.value)}
                />
              </div>

              {/* Nível de atividade */}
              <div>
                <label className="block mb-2 text-sm text-white/90">
                  Nível de atividade
                </label>
                <select
                  className={selectClass}
                  value={form.activityLevel}
                  onChange={(e) =>
                    handleInput("activityLevel", e.target.value)
                  }
                >
                  <option value="sedentario">Sedentária</option>
                  <option value="leve">Ativa leve</option>
                  <option value="moderado">Ativa moderada</option>
                  <option value="intenso">Ativa intensa</option>
                </select>
              </div>
            </div>
          )}

          {/* ETAPA 2 – OBJETIVO + MEDIDAS + MODO DE TREINO + RESTRIÇÕES */}
          {step === 2 && (
            <div className="space-y-8">
              {/* Objetivo principal */}
              <div>
                <label className="block mb-3 text-sm text-white/90">
                  Seu objetivo principal
                </label>
                <p className="text-xs text-white/70 mb-3">
                  Isso orienta a IA a montar a lógica do seu treino, calorias e
                  foco do plano.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {goals.map((g) => {
                    const selected = form.goal === g.value;
                    return (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() => handleInput("goal", g.value)}
                        className={`relative flex items-start gap-3 text-left p-3 rounded-2xl border text-sm transition transform
                          ${
                            selected
                              ? "border-emerald-400 bg-emerald-400/15 shadow-lg shadow-emerald-500/20 scale-[1.02]"
                              : "border-white/20 bg-white/5 hover:bg-white/15 hover:border-emerald-300/70 hover:scale-[1.01]"
                          }`}

                      >
                        <div className="text-xl">{g.icon}</div>
                        <div className="flex-1">
                          <div className="font-semibold text-[0.9rem]">
                            {g.label}
                          </div>
                          <p className="text-xs text-white/75 mt-1">
                            {g.description}
                          </p>
                        </div>
                        {selected && (
                          <span className="absolute right-3 top-3 text-[10px] px-2 py-0.5 rounded-full bg-emerald-400 text-black font-semibold">
                            Selecionado
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Campos opcionais: composição corporal */}
              <div className="border border-white/15 rounded-2xl p-4 bg-white/5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white/90">
                      Dados opcionais de composição corporal
                    </h3>
                    <p className="text-[11px] text-white/65">
                      Não são obrigatórios, mas ajudam a IA a ajustar volume,
                      intensidade e meta estética com mais precisão.
                    </p>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                    Opcional
                  </span>
                </div>

                <div className="grid md:grid-cols-5 gap-3 mt-3 text-xs">
                  <div>
                    <label className="block mb-1 text-white/90">
                      % de gordura
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={60}
                      placeholder="Ex: 28"
                      className={inputClass + " py-2 text-xs"}
                      value={form.bodyFat}
                      onChange={(e) => handleInput("bodyFat", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-white/90">
                      Cintura (cm)
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 80"
                      className={inputClass + " py-2 text-xs"}
                      value={form.waist}
                      onChange={(e) => handleInput("waist", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-white/90">
                      Quadril (cm)
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 100"
                      className={inputClass + " py-2 text-xs"}
                      value={form.hip}
                      onChange={(e) => handleInput("hip", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-white/90">
                      Ombro/peito (cm)
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 95"
                      className={inputClass + " py-2 text-xs"}
                      value={form.shoulder}
                      onChange={(e) => handleInput("shoulder", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-white/90">
                      Braço (cm)
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 30"
                      className={inputClass + " py-2 text-xs"}
                      value={form.arm}
                      onChange={(e) => handleInput("arm", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Modo de treino */}
              <div>
                <label className="block mb-3 text-sm text-white/90">
                  Onde você pretende treinar?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      value: "casa",
                      label: "Em casa",
                      desc: "Poucos equipamentos ou só peso corporal.",
                      icon: "🏠",
                    },
                    {
                      value: "academia",
                      label: "Na academia",
                      desc: "Máquinas, anilhas, halteres e estrutura completa.",
                      icon: "🏋️‍♀️",
                    },
                    {
                      value: "hibrido",
                      label: "Híbrido",
                      desc: "Alguns treinos em casa, outros na academia.",
                      icon: "🔁",
                    },
                  ].map((m) => {
                    const selected = form.trainingMode === m.value;
                    return (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => handleInput("trainingMode", m.value)}
                        className={`border text-left p-3 rounded-2xl text-xs transition flex flex-col gap-1
                          ${
                            selected
                              ? "border-sky-300 bg-sky-400/20 text-sky-50 shadow-lg shadow-sky-400/20 scale-[1.02]"
                              : "border-white/25 bg-white/10 hover:bg-white/20 hover:border-sky-200/70 hover:scale-[1.01]"
                          }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base">{m.icon}</span>
                          <div className="font-semibold text-sm">
                            {m.label}
                          </div>
                        </div>
                        <div className="text-[11px] text-white/80">
                          {m.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Restrição / preferência alimentar */}
              <div>
                <label className="block mb-2 text-sm text-white/90">
                  Restrição / preferência alimentar
                </label>
                <input
                  type="text"
                  placeholder="Ex: vegetariana, sem lactose, sem glúten..."
                  className={inputClass}
                  value={form.dietRestrictions}
                  onChange={(e) =>
                    handleInput("dietRestrictions", e.target.value)
                  }
                />
              </div>
            </div>
          )}

          {/* ETAPA 3 – ROTINA */}
          {step === 3 && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Acordar */}
              <div>
                <label className="block mb-2 text-sm text-white/90">
                  Horário que costuma acordar
                </label>
                <input
                  type="time"
                  className={selectClass}
                  value={form.wakeTime}
                  onChange={(e) => handleInput("wakeTime", e.target.value)}
                />
              </div>

              {/* Dormir */}
              <div>
                <label className="block mb-2 text-sm text-white/90">
                  Horário que costuma dormir
                </label>
                <input
                  type="time"
                  className={selectClass}
                  value={form.sleepTime}
                  onChange={(e) => handleInput("sleepTime", e.target.value)}
                />
              </div>

              <div className="md:col-span-2 text-sm text-white/80">
                Com esses horários, o VitaFlow ajusta treinos e refeições para
                caberem na sua rotina real — sem planos impossíveis de seguir.
              </div>
            </div>
          )}
        </div>

        {/* NAVEGAÇÃO */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className={`px-4 py-2 rounded-full text-sm border border-white/30 
              ${
                step === 1
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-white/10 transition"
              }`}
          >
            Voltar
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="ml-auto px-8 py-3 rounded-full bg-green-500 hover:bg-green-600 text-black font-semibold text-sm md:text-base transition-transform hover:scale-[1.02]"
          >
            {step < TOTAL_STEPS ? "Continuar" : "Gerar meu plano"}
          </button>
        </div>

        {/* FRASE + AVISO */}
        <div className="mt-8 space-y-3">
          {quote && (
            <p
              className="text-sm text-white/90 text-center italic"
              style={{
                fontFamily:
                  '"Dancing Script","Pacifico","Segoe UI",system-ui,-apple-system,BlinkMacSystemFont,sans-serif',
                letterSpacing: "0.03em",
              }}
            >
              {quote.text}
              <span className="ml-2 text-xs not-italic opacity-80">
                — {quote.author}
              </span>
            </p>
          )}

          <p className="text-[11px] text-white/60">
            As recomendações geradas têm caráter informativo e não substituem
            avaliação individualizada por médicos, nutricionistas ou educadores
            físicos.
          </p>
        </div>
      </div>
    </main>
  );
}
