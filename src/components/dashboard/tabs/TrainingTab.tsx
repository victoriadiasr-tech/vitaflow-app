"use client";

import { usePlanStore } from "@/store/planStore";
import Card from "@/components/ui/Card";
import { Dumbbell } from "lucide-react";

export default function WeekTrainingTab() {
  const { days } = usePlanStore();

  if (!days || days.length === 0) {
    return (
      <Card>
        <p>Nenhum plano disponível.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {days.map((day) => (
        <Card key={day.id} className="p-6 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Dumbbell size={20} /> {day.label}
          </h2>

          <p className="opacity-80">{day.training.description}</p>
          <p className="text-sm opacity-60">
            {day.training.duration} min • {day.training.intensity}
          </p>

          <div className="mt-3 space-y-2">
            {day.training.exercises.map((ex, i) => (
              <p key={i} className="text-sm">
                • <strong>{ex.name}</strong> — {ex.series} × {ex.reps}
              </p>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
