"use client";

import { usePlanStore } from "@/store/planStore";
import { Card } from "@/components/ui/Card";
import { Utensils, Flame } from "lucide-react";

export default function NutritionTab() {
  const { plan, days, currentDayIndex } = usePlanStore();

  if (!plan || !days || days.length === 0) {
    return (
      <Card>
        <p>Nenhum plano carregado. Gere uma nova versão.</p>
      </Card>
    );
  }

  const day = days[currentDayIndex];
  const meals = day?.nutrition?.meals ?? [];
  const macros = day?.nutrition?.macros;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <Utensils size={22} />
        Plano alimentar do dia
      </h2>

      {/* GRID DE REFEIÇÕES */}
      <div className="grid md:grid-cols-2 gap-6">
        {meals.map((meal: any, idx: number) => (
          <Card key={idx} className="p-6 space-y-4">
            <h3 className="text-xl font-semibold">{meal.name}</h3>

            {meal.items?.map((item: any, i: number) => {
              const itemName = item.name ?? item.food ?? "";
              const itemQty =
                item.quantity ?? item.amount ?? item.qtd ?? "";

              return (
                <div key={i} className="space-y-2">
                  <p className="font-medium">
                    • {itemName}{" "}
                    {itemQty && (
                      <span className="opacity-70">({itemQty})</span>
                    )}
                  </p>

                  {/* SUBSTITUIÇÕES COMPLETAS */}
                  {item.substitutions && (
                    <div className="ml-3 text-sm space-y-1">
                      <p className="text-green-300 font-semibold">
                        Substituições possíveis:
                      </p>

                      {item.substitutions.default?.length > 0 && (
                        <p>
                          <b>Padrão:</b>{" "}
                          {item.substitutions.default.join(", ")}
                        </p>
                      )}
                      {item.substitutions.economica?.length > 0 && (
                        <p>
                          <b>Econômica:</b>{" "}
                          {item.substitutions.economica.join(", ")}
                        </p>
                      )}
                      {item.substitutions.premium?.length > 0 && (
                        <p>
                          <b>Premium:</b>{" "}
                          {item.substitutions.premium.join(", ")}
                        </p>
                      )}
                      {item.substitutions.vegana?.length > 0 && (
                        <p>
                          <b>Vegana:</b>{" "}
                          {item.substitutions.vegana.join(", ")}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </Card>
        ))}
      </div>

      {/* MACROS */}
      {macros && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Flame size={22} /> Macros do dia
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="opacity-60 text-sm">Calorias</p>
              <p className="text-lg font-bold">{macros.calories} kcal</p>
            </div>
            <div>
              <p className="opacity-60 text-sm">Proteína</p>
              <p className="text-lg font-bold">{macros.protein} g</p>
            </div>
            <div>
              <p className="opacity-60 text-sm">Carboidratos</p>
              <p className="text-lg font-bold">{macros.carbs} g</p>
            </div>
            <div>
              <p className="opacity-60 text-sm">Gorduras</p>
              <p className="text-lg font-bold">{macros.fats} g</p>
            </div>
          </div>
        </Card>
      )}

      {/* PSICOLOGIA */}
      {day.psychology && (
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Energia e rotina</h3>
          <p className="opacity-90">{day.psychology}</p>
        </Card>
      )}

      {/* MICROS */}
      {day.micros && (
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Micronutrientes</h3>
          <p className="opacity-90">{day.micros}</p>
        </Card>
      )}

      {/* MOTIVAÇÃO */}
      {day.motivation && (
        <Card className="p-6 bg-green-500/10 border border-green-600/30">
          <p className="italic text-lg">{day.motivation}</p>
        </Card>
      )}
    </div>
  );
}
