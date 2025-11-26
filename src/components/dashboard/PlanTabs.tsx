"use client";

import React from "react";
import { usePlanStore, DashboardTab } from "@/store/planStore";
import { Card } from "@/components/ui/Card";
import { DaySwitcher } from "./DaySwitcher";

import {
  Flame,
  ListChecks,
  Utensils,
  BarChart3,
  ShoppingCart,
} from "lucide-react";

const navItems: {
  key: DashboardTab;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}[] = [
  { key: "today", label: "Plano de hoje", icon: Flame },
  { key: "week-training", label: "Treinos da semana", icon: ListChecks },
  { key: "nutrition", label: "Plano alimentar", icon: Utensils },
  { key: "macros", label: "Resumo de macros", icon: BarChart3 },
  { key: "shopping", label: "Lista de compras", icon: ShoppingCart },
];

export default function PlanTabs() {
  const { plan, days, activeTab, setActiveTab, currentDayIndex } =
    usePlanStore();

  // Sem plano ainda
  const allDays = days ?? plan?.days ?? [];
  const day = allDays[currentDayIndex] ?? allDays[0];

  if (!day) {
    return (
      <Card className="p-6">
        <p>
          Nenhum plano carregado. Clique em{" "}
          <span className="font-semibold">Gerar nova versão</span> para começar.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Linha superior: plano atual + trocar dia */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="text-sm text-zinc-300">
          Plano atual:{" "}
          <span className="font-semibold">
            {day.label ?? `Dia ${currentDayIndex + 1}`}
          </span>
        </div>
        <DaySwitcher />
      </div>

      {/* Abas */}
      <div className="flex flex-wrap gap-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const selected = item.key === activeTab;

          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-all ${
                selected
                  ? "bg-emerald-600/30 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-500/20"
                  : "bg-white/5 border-white/10 text-zinc-200 hover:bg-white/10"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Conteúdo da aba */}
      <div>
        {activeTab === "today" && <TodayView day={day} />}
        {activeTab === "week-training" && (
          <WeekTrainingView days={allDays} />
        )}
        {activeTab === "nutrition" && <NutritionView day={day} />}
        {activeTab === "macros" && (
          <MacrosView day={day} weeklyMacros={plan?.weeklyMacros} />
        )}
        {activeTab === "shopping" && (
          <ShoppingView weeklyShopping={plan?.weeklyShopping} />
        )}
      </div>
    </div>
  );
}

/* ============== ABA: PLANO DE HOJE ============== */

function TodayView({ day }: { day: any }) {
  const training = day?.training ?? {
    title: day?.label ?? "Treino do dia",
    description: "",
    duration: 0,
    intensity: "",
    exercises: [],
  };

  const nutrition = day?.nutrition ?? {
    meals: [],
    macros: null,
  };

  const meals = nutrition.meals ?? [];

  return (
    <div className="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.1fr)_minmax(0,1fr)] gap-6">
      {/* Treino do dia */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Flame size={20} /> Treino do dia
        </h3>
        <p className="text-sm opacity-80">{training.description}</p>
        <p className="text-xs opacity-60">
          Duração: {training.duration} min • Intensidade: {training.intensity}
        </p>
        <div className="pt-3 space-y-2 text-sm">
          {training.exercises?.map((ex: any, i: number) => (
            <div key={i}>
              <p className="font-medium">
                {ex.name} — {ex.series} × {ex.reps}
              </p>
              {ex.notes && (
                <p className="text-xs opacity-70">{ex.notes}</p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Plano alimentar resumo */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Utensils size={20} /> Plano alimentar do dia
        </h3>
        <div className="space-y-3 text-sm">
          {meals.map((meal: any, idx: number) => (
            <div key={idx}>
              <p className="font-semibold text-emerald-300">{meal.name}</p>
              {meal.items?.map((item: any, i: number) => (
                <p key={i} className="opacity-90">
                  • {item.name} — {item.quantity}
                </p>
              ))}
            </div>
          ))}
        </div>
      </Card>

      {/* Macros + motivação */}
      <Card className="p-6 space-y-3">
        <h3 className="text-lg font-semibold">Resumo do dia</h3>
        {nutrition.macros && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <MacroChip
              label="Calorias"
              value={`${nutrition.macros.calories} kcal`}
            />
            <MacroChip
              label="Proteína"
              value={`${nutrition.macros.protein} g`}
            />
            <MacroChip
              label="Carboidratos"
              value={`${nutrition.macros.carbs} g`}
            />
            <MacroChip
              label="Gorduras"
              value={`${nutrition.macros.fats} g`}
            />
          </div>
        )}
        {day?.motivation && (
          <p className="text-xs mt-2 italic opacity-80">{day.motivation}</p>
        )}
      </Card>
    </div>
  );
}

/* ============== ABA: TREINOS DA SEMANA ============== */

function WeekTrainingView({ days }: { days: any[] }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {days.map((day, idx) => (
        <Card key={day.id ?? idx} className="p-5 space-y-2">
          <p className="text-sm font-semibold text-emerald-300">
            {day.label ?? `Dia ${idx + 1}`}
          </p>
          <p className="text-xs opacity-70">{day.training?.title}</p>
          <p className="text-xs opacity-60">
            {day.training?.duration} min • {day.training?.intensity}
          </p>
          <div className="mt-2 space-y-1 text-xs">
            {day.training?.exercises?.slice(0, 4).map((ex: any, i: number) => (
              <p key={i}>
                • {ex.name} — {ex.series} × {ex.reps}
              </p>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ============== ABA: PLANO ALIMENTAR COMPLETO ============== */

function NutritionView({ day }: { day: any }) {
  const meals = day?.nutrition?.meals ?? [];
  const macros = day?.nutrition?.macros;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {meals.map((meal: any, idx: number) => (
          <Card key={idx} className="p-6 space-y-3">
            <p className="text-lg font-semibold">{meal.name}</p>
            {meal.items?.map((item: any, i: number) => (
              <div key={i} className="space-y-1 text-sm">
                <p className="font-medium">
                  • {item.name} —{" "}
                  <span className="opacity-80">{item.quantity}</span>
                </p>
                {item.substitutions && (
                  <div className="ml-4 space-y-1 text-xs opacity-90">
                    <p className="font-semibold text-emerald-300">
                      Substituições possíveis:
                    </p>
                    {item.substitutions.default?.length > 0 && (
                      <p>
                        <span className="font-medium">Padrão:</span>{" "}
                        {item.substitutions.default.join(", ")}
                      </p>
                    )}
                    {item.substitutions.economica?.length > 0 && (
                      <p>
                        <span className="font-medium">Econômica:</span>{" "}
                        {item.substitutions.economica.join(", ")}
                      </p>
                    )}
                    {item.substitutions.premium?.length > 0 && (
                      <p>
                        <span className="font-medium">Premium:</span>{" "}
                        {item.substitutions.premium.join(", ")}
                      </p>
                    )}
                    {item.substitutions.vegana?.length > 0 && (
                      <p>
                        <span className="font-medium">Vegana:</span>{" "}
                        {item.substitutions.vegana.join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </Card>
        ))}
      </div>

      {macros && (
        <Card className="p-6 space-y-3">
          <h3 className="text-lg font-semibold">Macros do dia</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MacroChip label="Calorias" value={`${macros.calories} kcal`} />
            <MacroChip label="Proteína" value={`${macros.protein} g`} />
            <MacroChip label="Carboidratos" value={`${macros.carbs} g`} />
            <MacroChip label="Gorduras" value={`${macros.fats} g`} />
          </div>
        </Card>
      )}
    </div>
  );
}

/* ============== ABA: RESUMO DE MACROS ============== */

function MacrosView({ day, weeklyMacros }: { day: any; weeklyMacros: any }) {
  const macros = day?.nutrition?.macros;

  if (!macros) {
    return (
      <Card className="p-6">
        <p>Sem dados de macros para este dia.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 size={20} /> Macros do dia
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MacroChip label="Calorias" value={`${macros.calories} kcal`} />
          <MacroChip label="Proteína" value={`${macros.protein} g`} />
          <MacroChip label="Carboidratos" value={`${macros.carbs} g`} />
          <MacroChip label="Gorduras" value={`${macros.fats} g`} />
        </div>
      </Card>

      {weeklyMacros && (
        <Card className="p-6 space-y-2">
          <h3 className="text-lg font-semibold">Resumo semanal</h3>
          <p className="text-sm opacity-80">{weeklyMacros.summary}</p>
          <p className="text-xs opacity-60">
            Total estimado da semana: {weeklyMacros.totalCalories} kcal
          </p>
        </Card>
      )}
    </div>
  );
}

/* ============== ABA: LISTA DE COMPRAS ============== */

function ShoppingView({ weeklyShopping }: { weeklyShopping: any }) {
  if (!weeklyShopping) {
    return (
      <Card className="p-6">
        <p>Nenhuma lista de compras disponível.</p>
      </Card>
    );
  }

  const groups = [
    { key: "hortifruti", label: "Hortifruti" },
    { key: "proteinas", label: "Proteínas" },
    { key: "graos", label: "Grãos e cereais" },
  ] as const;

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <ShoppingCart size={20} /> Lista de compras da semana
      </h3>
      <div className="grid md:grid-cols-3 gap-6 text-sm">
        {groups.map((group) => (
          <div key={group.key}>
            <p className="font-semibold text-emerald-300 mb-1">
              {group.label}
            </p>
            <div className="space-y-1">
              {(weeklyShopping[group.key] ?? []).map(
                (item: string, idx: number) => (
                  <p key={idx}>• {item}</p>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ============== COMPONENTE AUXILIAR ============== */

function MacroChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide opacity-60">
        {label}
      </p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}
