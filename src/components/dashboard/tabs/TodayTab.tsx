// src/components/dashboard/tabs/TodayTab.tsx
"use client";

import { usePlanStore } from "@/store/planStore";
import { Card } from "@/components/ui/Card"; 
import { Flame, Dumbbell, Utensils } from "lucide-react";

type Exercise = {
  name: string;
  series: string;
  reps: string;
  notes?: string;
};

export default function TodayTab() {
  const { days, currentDayIndex } = usePlanStore();

  const day = days && days[currentDayIndex];

  if (!day) {
    return (
      <div className="text-sm text-slate-300">
        Nenhum dia de plano encontrado. Gere um plano para começar. ✨
      </div>
    );
  }

  const training = day.training ?? {};
  const exercises: Exercise[] = Array.isArray(training.exercises)
    ? training.exercises
    : [];

  const nutrition = day.nutrition ?? {};
  const macros = nutrition.macros ?? {};

  return (
    <div className="grid gap-4 md:grid-cols-[2fr,1.5fr]">
      {/* Treino do dia */}
      <Card className="bg-black/40 border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Dumbbell className="w-4 h-4 text-emerald-300" />
          <h2 className="text-sm font-semibold text-white">
            Treino de hoje — {training.title ?? "Treino do dia"}
          </h2>
        </div>
        <p className="text-xs text-white/70 mb-2">
          Duração: {training.duration ?? "--"} min · Intensidade:{" "}
          {training.intensity ?? "--"}
        </p>
        <p className="text-xs text-white/80 mb-3">
          {training.description ?? "Sessão focada no seu objetivo atual."}
        </p>

        {exercises.length > 0 && (
          <div className="space-y-2 mt-4">
            {exercises.map((ex: Exercise, i: number) => (
              <p key={i} className="text-sm text-white/90">
                • <span className="font-semibold">{ex.name}</span> — {ex.series} ×{" "}
                {ex.reps}
                {ex.notes ? (
                  <span className="text-xs text-white/60"> · {ex.notes}</span>
                ) : null}
              </p>
            ))}
          </div>
        )}
      </Card>

      {/* Nutrição resumida */}
      <Card className="bg-black/40 border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Utensils className="w-4 h-4 text-orange-300" />
          <h2 className="text-sm font-semibold text-white">
            Nutrição de hoje
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
          <MacroBox label="Calorias" value={macros.calories} />
          <MacroBox label="Proteínas (g)" value={macros.protein} />
          <MacroBox label="Carboidratos (g)" value={macros.carbs} />
          <MacroBox label="Gorduras (g)" value={macros.fats} />
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-white/75">
          <Flame className="w-3 h-3 text-orange-300" />
          <span>
            Use este dia como base, mas ajuste os horários para sua rotina real.
          </span>
        </div>
      </Card>
    </div>
  );
}

type MacroBoxProps = {
  label: string;
  value: number | string | null | undefined;
};

function MacroBox({ label, value }: MacroBoxProps) {
  return (
    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
      <p className="text-[11px] text-white/70">{label}</p>
      <p className="text-lg font-semibold text-white">
        {value ?? "--"}
      </p>
    </div>
  );
}
