"use client";

import { usePlanStore } from "@/store/planStore";
import { Card } from "@/components/ui/Card";
import { ShoppingCart } from "lucide-react";

export default function ShoppingTab() {
  const { weeklyShopping } = usePlanStore();

  if (!weeklyShopping) {
    return (
      <Card>
        <p>Nenhum dado disponível.</p>
      </Card>
    );
  }

  const groups = [
    { key: "hortifruti", label: "Hortifruti" },
    { key: "proteinas", label: "Proteínas" },
    { key: "graos", label: "Grãos e cereais" },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <ShoppingCart size={20} /> Lista de compras da semana
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {groups.map((g) => (
            <div key={g.key}>
              <h3 className="font-semibold text-green-300 mb-2">{g.label}</h3>

              {(weeklyShopping[g.key] ?? []).map((item: string, i: number) => (
                <p key={i} className="text-sm opacity-90">
                  • {item}
                </p>
              ))}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
