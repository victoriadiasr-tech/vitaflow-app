// src/components/dashboard/tabs/TrainingTab.tsx
"use client";

import { usePlanStore } from "@/store/planStore";
import { Card } from "@/components/ui/Card"; 
import { Dumbbell } from "lucide-react";

type Exercise = {
  name: string;
  series: string;
  reps: string;
  notes?: string;
};

export default function TrainingTab() {
  const { days, currentDayIndex } = usePlanStore();
  const day = days && days[currentDayIndex];

  if (!day) {
    return (
      <div className="text-sm text-slate-300">
        Nenhum plano disponível. Gere um plano para ver o treino. 💪
      </div>
    );
  }

  const training = day.training ?? {};
  const exercises: Exercise[] = Array.isArray(training.exercises)
    ? training.exercises
    : [];

  return (
    <Card className="bg-black/40 border-white/10 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Dumbbell className="w-4 h-4 text-emerald-300" />
        <h2 className="text-sm font-semibold">Treino completo</h2>
      </div>

      <p className="text-xs text-white/70 mb-2">
        <strong>Intensidade:</strong> {training.intensity ?? "--"}
      </p>
      <p className="text-xs text-white/70 mb-2">
        <strong>Duração:</strong> {training.duration ?? "--"} min
      </p>

      <p className="text-xs text-white/80 mb-4">
        {training.description ?? "Sessão de treino focada nos seus objetivos."}
      </p>

      {exercises.length > 0 && (
        <div className="mt-3 space-y-2">
          {exercises.map((ex: Exercise, i: number) => (
            <p key={i} className="text-sm text-white/90">
              • <strong>{ex.name}</strong> — {ex.series} × {ex.reps}
              {ex.notes ? (
                <span className="text-xs text-white/60"> · {ex.notes}</span>
              ) : null}
            </p>
          ))}
        </div>
      )}
    </Card>
  );
}
