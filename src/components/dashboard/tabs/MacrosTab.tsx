"use client";

import { usePlanStore } from "@/store/planStore";
import { Card } from "@/components/ui/Card";
import { Flame } from "lucide-react";

export default function MacrosTab() {
  const { days, currentDayIndex, weeklyMacros } = usePlanStore();

  const day = days?.[currentDayIndex];

  if (!day) {
    return (
      <Card>
        <p>Nenhum plano disponível.</p>
      </Card>
    );
  }

  const macros = day.nutrition.macros;

  return (
    <div className="space-y-6">
      {/* MACROS DO DIA */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Flame size={20} /> Macros do dia
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MacroBox label="Calorias" value={`${macros.calories} kcal`} />
          <MacroBox label="Proteína" value={`${macros.protein} g`} />
          <MacroBox label="Carboidratos" value={`${macros.carbs} g`} />
          <MacroBox label="Gorduras" value={`${macros.fats} g`} />
        </div>
      </Card>

      {/* RESUMO SEMANAL */}
      {weeklyMacros && (
        <Card className="p-6 space-y-2">
          <h3 className="text-lg font-semibold">Resumo semanal</h3>
          <p className="opacity-80">{weeklyMacros.summary}</p>
          <p className="text-sm opacity-60">
            Total semanal estimado: {weeklyMacros.totalCalories} kcal
          </p>
        </Card>
      )}
    </div>
  );
}

type MacroBoxProps = {
  label: string;
  value: number | string | null | undefined;
};

function MacroBox({ label, value }: MacroBoxProps) {
  return (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
      <p className="text-sm opacity-70">{label}</p>
      <p className="text-xl font-semibold">
        {value ?? "--"}
      </p>
    </div>
  );
}

