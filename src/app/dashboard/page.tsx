"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type WorkoutExercise = {
  name: string;
  sets?: number;
  reps?: string;
  notes?: string;
};

type WorkoutSession = {
  name: string;
  timeOfDay?: string;
  durationMinutes?: number;
  intensity?: string;
  exercises?: WorkoutExercise[];
};

type MealItem = {
  food: string;
  quantity?: string;
  substitutions?: string[];
};

type Meal = {
  name: string;
  timeOfDay?: string;
  items: MealItem[];
};

type Macros = {
  kcal?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
};

type ShoppingList = {
  hortifruti?: string[];
  proteinas?: string[];
  laticinios?: string[];
  graos_e_cereais?: string[];
  oleos_e_gorduras?: string[];
  temperos_e_outros?: string[];
};

type Plan = {
  label?: string;
  workoutPlan?: {
    overview?: string;
    sessions?: WorkoutSession[];
  };
  meals?: Meal[];
  macros?: Macros;
  nutritionalSummary?: string;
  shoppingList?: ShoppingList;
};

export default function DashboardPage() {
  const [user, setUser] = useState<any | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [allDays, setAllDays] = useState<Plan[] | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const router = useRouter();

  // Lê o usuário salvo no onboarding
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("vitaflow-user");
    if (!stored) {
      router.push("/onboarding");
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setUser(parsed);
    } catch {
      router.push("/onboarding");
    }
  }, [router]);

  // Chama a API para gerar o plano assim que o usuário estiver carregado
  useEffect(() => {
    if (!user) return;

    async function fetchPlan() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Erro ao gerar o plano.");
        }

        const data = await res.json();

        const initialPlan: Plan | null = data.plan || null;
        const days: Plan[] | null = Array.isArray(data.days)
          ? (data.days as Plan[])
          : null;

        setPlan(initialPlan);
        setAllDays(days);
        setSelectedDayIndex(0);
      } catch (err: any) {
        console.error("Erro ao buscar plano:", err);
        setError(err.message || "Erro ao gerar o plano.");
      } finally {
        setLoading(false);
      }
    }

    fetchPlan();
  }, [user]);

  const firstName = user?.name?.split(" ")[0] || "Usuária";

  function handleCopyShoppingList() {
    if (!plan?.shoppingList) return;

    const text = buildShoppingListText(plan.shoppingList);

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopyFeedback("Lista copiada para a área de transferência ✅");
          setTimeout(() => setCopyFeedback(null), 2500);
        })
        .catch(() => {
          setCopyFeedback("Não foi possível copiar automaticamente.");
          setTimeout(() => setCopyFeedback(null), 2500);
        });
    } else {
      setCopyFeedback("Não foi possível copiar automaticamente.");
      setTimeout(() => setCopyFeedback(null), 2500);
    }
  }

  function handleChangeDay(index: number) {
    if (!allDays || index < 0 || index >= allDays.length) return;
    setSelectedDayIndex(index);
    setPlan(allDays[index]);
  }

  const currentLabel =
    plan?.label ||
    (allDays && allDays.length > 0
      ? `Dia ${selectedDayIndex + 1}`
      : "Dia único");

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 px-4 py-8 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">
              Seu dia com o VitaFlow
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold">
              Olá, {firstName}! Aqui está o plano inteligente. 💚
            </h1>
            <p className="text-sm text-slate-300 mt-2">
              Você pode alternar entre os dias para ter variação de treino e alimentação,
              mantendo coerência com o seu objetivo.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 text-sm">
            {user?.goal && (
              <span className="inline-flex items-center rounded-full border border-emerald-400/60 bg-emerald-500/10 px-3 py-1 text-emerald-300 text-xs">
                Objetivo:{" "}
                <span className="ml-1 font-medium">
                  {mapGoalToLabel(user.goal)}
                </span>
              </span>
            )}
            {user?.activityLevel && (
              <span className="text-slate-400 text-xs">
                Nível de atividade: {mapActivityToLabel(user.activityLevel)}
              </span>
            )}

            {/* Seletor de dia */}
            {allDays && allDays.length > 1 && (
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className="text-slate-400">Plano do:</span>
                <select
                  className="bg-slate-900/80 border border-slate-700 rounded-full px-3 py-1 text-[11px] text-slate-100 outline-none"
                  value={selectedDayIndex}
                  onChange={(e) => handleChangeDay(Number(e.target.value))}
                >
                  {allDays.map((d, idx) => (
                    <option key={idx} value={idx}>
                      {d.label || `Dia ${idx + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </header>

        {/* Estado de carregamento ou erro */}
        {loading && (
          <div className="w-full py-10 flex items-center justify-center">
            <p className="text-sm text-slate-300">
              Gerando seus planos com a IA... ✨
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {copyFeedback && (
          <div className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-200">
            {copyFeedback}
          </div>
        )}

        {/* Conteúdo principal */}
        {plan && !loading && !error && (
          <>
            <div className="mb-4 text-xs text-slate-400">
              Plano atual:{" "}
              <span className="text-emerald-300 font-medium">
                {currentLabel}
              </span>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 items-start">
              {/* Coluna 1: Treino + Macros */}
              <section className="lg:col-span-1 space-y-4">
                <Card title="Treino do dia 💪">
                  {plan.workoutPlan?.overview && (
                    <p className="text-sm text-slate-300 mb-3">
                      {plan.workoutPlan.overview}
                    </p>
                  )}

                  {plan.workoutPlan?.sessions?.map((session, idx) => (
                    <div
                      key={idx}
                      className="mb-4 rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-semibold">
                          {session.name || "Sessão de treino"}
                        </h3>
                        <span className="text-[11px] text-slate-400">
                          {session.timeOfDay || ""}{" "}
                          {session.durationMinutes
                            ? `• ${session.durationMinutes} min`
                            : ""}
                        </span>
                      </div>
                      {session.intensity && (
                        <p className="text-[11px] text-slate-400 mb-2">
                          Intensidade: {session.intensity}
                        </p>
                      )}
                      {session.exercises && session.exercises.length > 0 && (
                        <ul className="space-y-1 text-xs text-slate-200">
                          {session.exercises.map((ex, eIdx) => (
                            <li key={eIdx} className="flex flex-col">
                              <span className="font-medium">{ex.name}</span>
                              <span className="text-[11px] text-slate-400">
                                {ex.sets && `${ex.sets} séries`}{" "}
                                {ex.reps && `• ${ex.reps} reps`}
                                {ex.notes && ` – ${ex.notes}`}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </Card>

                {/* Macros */}
                <Card title="Resumo de macros do dia 🍽️">
                  {plan.macros ? (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <MacroBadge
                        label="Calorias"
                        value={plan.macros.kcal}
                        unit="kcal"
                      />
                      <MacroBadge
                        label="Proteínas"
                        value={plan.macros.protein_g}
                        unit="g"
                      />
                      <MacroBadge
                        label="Carboidratos"
                        value={plan.macros.carbs_g}
                        unit="g"
                      />
                      <MacroBadge
                        label="Gorduras"
                        value={plan.macros.fat_g}
                        unit="g"
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-slate-300">
                      Macros não informados pela IA.
                    </p>
                  )}
                </Card>
              </section>

              {/* Coluna 2: Refeições + Resumo nutricional */}
              <section className="lg:col-span-1 space-y-4">
                <Card title="Plano alimentar deste dia 🥗">
                  {plan.meals && plan.meals.length > 0 ? (
                    <div className="space-y-4">
                      {plan.meals.map((meal, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-3"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-semibold flex items-center gap-1">
                              <span>•</span>
                              <span>{meal.name}</span>
                            </h3>
                            {meal.timeOfDay && (
                              <span className="text-[11px] text-slate-400">
                                {meal.timeOfDay}
                              </span>
                            )}
                          </div>
                          <ul className="space-y-2 text-xs text-slate-200 mt-2">
                            {meal.items.map((item, iIdx) => (
                              <li
                                key={iIdx}
                                className="border-l border-slate-700 pl-2"
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {item.food}
                                  </span>
                                  {item.quantity && (
                                    <span className="text-[11px] text-slate-400">
                                      {item.quantity}
                                    </span>
                                  )}
                                </div>
                                {item.substitutions &&
                                  item.substitutions.length > 0 && (
                                    <div className="mt-1">
                                      <p className="text-[11px] text-emerald-300 font-medium">
                                        Substituições possíveis:
                                      </p>
                                      <ul className="mt-1 ml-2 list-disc list-inside text-[11px] text-slate-300 space-y-0.5">
                                        {item.substitutions.map((sub, sIdx) => (
                                          <li key={sIdx}>{sub}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-300">
                      A IA não gerou um plano alimentar para este dia.
                    </p>
                  )}
                </Card>

                {/* Resumo nutricional */}
                <Card title="Insights nutricionais do dia 🧠">
                  {plan.nutritionalSummary ? (
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {plan.nutritionalSummary}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-300">
                      Resumo nutricional não retornado pela IA.
                    </p>
                  )}
                </Card>
              </section>

              {/* Coluna 3: Lista de compras */}
              <section className="lg:col-span-1 space-y-4">
                <Card
                  title="Lista de compras da semana 🛒"
                  headerRight={
                    plan?.shoppingList && (
                      <button
                        type="button"
                        onClick={handleCopyShoppingList}
                        className="text-[11px] px-2 py-1 rounded-full border border-emerald-400/60 text-emerald-200 hover:bg-emerald-500/10 transition"
                      >
                        Copiar lista
                      </button>
                    )
                  }
                >
                  {plan.shoppingList ? (
                    <div className="space-y-3 text-sm">
                      {renderShoppingCategory(
                        "Hortifruti",
                        plan.shoppingList.hortifruti
                      )}
                      {renderShoppingCategory(
                        "Proteínas",
                        plan.shoppingList.proteinas
                      )}
                      {renderShoppingCategory(
                        "Laticínios",
                        plan.shoppingList.laticinios
                      )}
                      {renderShoppingCategory(
                        "Grãos e cereais",
                        plan.shoppingList.graos_e_cereais
                      )}
                      {renderShoppingCategory(
                        "Óleos e gorduras",
                        plan.shoppingList.oleos_e_gorduras
                      )}
                      {renderShoppingCategory(
                        "Temperos e outros",
                        plan.shoppingList.temperos_e_outros
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-300">
                      Lista de compras não retornada pela IA.
                    </p>
                  )}
                </Card>
              </section>
            </div>
          </>
        )}

        {/* Se ainda não carregou o plano e não está carregando */}
        {!plan && !loading && !error && (
          <p className="text-sm text-slate-300 mt-6">
            Carregando seus planos... se isso demorar muito, tente voltar ao
            onboarding e preencher novamente.
          </p>
        )}
      </div>
    </main>
  );
}

/* ===================== helpers ===================== */

function Card({
  title,
  children,
  headerRight,
}: {
  title: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-md">
      <div className="flex items-center justify-between mb-3 gap-2">
        <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
        {headerRight}
      </div>
      {children}
    </section>
  );
}

function MacroBadge({
  label,
  value,
  unit,
}: {
  label: string;
  value?: number;
  unit: string;
}) {
  return (
    <div className="rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-2">
      <div className="text-[11px] text-slate-400">{label}</div>
      <div className="text-sm font-semibold">
        {value !== undefined && value !== null ? value : "–"} {unit}
      </div>
    </div>
  );
}

function renderShoppingCategory(label: string, items?: string[]) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h3 className="text-xs font-semibold text-slate-200 mb-1">{label}</h3>
      <ul className="list-disc list-inside text-xs text-slate-400 space-y-0.5">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function mapGoalToLabel(goal: string): string {
  switch (goal) {
    case "emagrecimento":
      return "Emagrecimento";
    case "ganho_massa":
      return "Ganho de massa muscular";
    case "emagrecer_ganhar_massa":
      return "Emagrecer + ganhar massa";
    case "manutencao_peso":
      return "Manutenção de peso";
    case "saude_bem_estar":
      return "Saúde e bem-estar";
    case "performance":
      return "Performance física";
    default:
      return goal;
  }
}

function mapActivityToLabel(activity: string): string {
  switch (activity) {
    case "sedentario":
      return "Sedentária";
    case "leve":
      return "Ativa leve";
    case "moderado":
      return "Ativa moderada";
    case "intenso":
      return "Ativa intensa";
    default:
      return activity;
  }
}

function buildShoppingListText(list: ShoppingList): string {
  const lines: string[] = [];

  const pushBlock = (title: string, items?: string[]) => {
    if (!items || items.length === 0) return;
    lines.push(`== ${title} ==`);
    for (const item of items) {
      lines.push(`- ${item}`);
    }
    lines.push("");
  };

  pushBlock("Hortifruti", list.hortifruti);
  pushBlock("Proteínas", list.proteinas);
  pushBlock("Laticínios", list.laticinios);
  pushBlock("Grãos e cereais", list.graos_e_cereais);
  pushBlock("Óleos e gorduras", list.oleos_e_gorduras);
  pushBlock("Temperos e outros", list.temperos_e_outros);

  return lines.join("\n").trim();
}
