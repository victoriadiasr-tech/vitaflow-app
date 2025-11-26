"use client";

import { usePlanStore } from "@/store/planStore";
import Card from "@/components/ui/Card";
import { Flame, Utensils, ListChecks } from "lucide-react";

export default function TodayTab() {
  const { days, currentDayIndex } = usePlanStore();

  const day = days?.[currentDayIndex];
  if (!day) {
    return (
      <Card>
        <p>Nenhum plano disponível. Gere uma nova versão.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* TREINO DO DIA */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Flame size={20} /> Treino do dia
        </h2>

        <p className="opacity-80">{day.training.description}</p>
        <p className="text-sm opacity-60">
          Duração: {day.training.duration} min • Intensidade:{" "}
          {day.training.intensity}
        </p>

        <div className="space-y-2 mt-4">
          {day.training.exercises.map((ex, i) => (
            <p key={i} className="text-sm">
              • <span className="font-semibold">{ex.name}</span> — {ex.series} ×{" "}
              {ex.reps}
            </p>
          ))}
        </div>
      </Card>

      {/* ALIMENTAÇÃO DO DIA */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Utensils size={20} /> Plano alimentar
        </h2>

        {day.nutrition.meals.map((meal, idx) => (
          <div key={idx} className="pb-4 border-b border-white/10">
            <p className="font-semibold text-green-300">{meal.name}</p>

            {meal.items.map((item, i) => (
              <p key={i} className="text-sm opacity-90">
                • {item.name} — {item.quantity}
              </p>
            ))}
          </div>
        ))}
      </Card>

      {/* MOTIVAÇÃO */}
      {day.motivation && (
        <Card className="p-6 bg-green-700/20">
          <p className="text-lg italic">{day.motivation}</p>
        </Card>
      )}
    </div>
  );
}
