// src/types/plan.ts

// Um exercício individual do treino
export interface Exercise {
  name: string;
  sets?: number;      // ex: 3
  reps?: string;      // ex: "10-12" ou "até a falha"
  rest?: string;      // ex: "60s" ou dica rápida
}

// Um bloco de treino (ex: sessão principal)
export interface TrainingBlock {
  name: string;       // ex: "Sessão principal", "Força", "HIIT"
  exercises: Exercise[];
}

// Plano de treino do dia
export interface TrainingPlan {
  title: string;      // ex: "Treino de inferiores"
  focus?: string;     // ex: "Hipertrofia", "Emagrecimento"
  blocks: TrainingBlock[];
}

// Uma refeição do dia
export interface Meal {
  name: string;             // ex: "Café da manhã proteico"
  time?: string;            // ex: "07:30"
  description?: string;     // ex: "3 ovos mexidos, 1 banana..."
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  substitutions?: string[]; // 👈 lista de substituições sugeridas
}

// Macros do dia inteiro
export interface DayMacros {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

// Plano de um dia (treino + alimentação + macros)
export interface DayPlan {
  dayIndex: number;   // 0, 1, 2...
  label: string;      // "Dia 1", "Dia 2", ...
  training: TrainingPlan;
  meals: Meal[];
  macros: DayMacros;
  summary?: string;   // resumo do dia (texto)
}

// Item da lista de compras
export interface WeeklyShoppingItem {
  name: string;       // ex: "Frango", "Aveia", "Banana"
  quantity?: string;  // ex: "1kg", "500g", "12 unid."
  category?: string;  // ex: "Proteína", "Carboidrato", "Legume"
}

// Lista semanal de compras
export interface WeeklyShopping {
  items: WeeklyShoppingItem[];
}

// Macros semanais (médias ou totais)
export interface WeeklyMacros {
  averageCalories?: number;
  averageProtein?: number;
  averageCarbs?: number;
  averageFats?: number;
  totalCalories?: number;
  summary?: string;
}

// Metadados gerais do plano
export interface PlanMeta {
  goal?: string;      // ex: "Emagrecimento", "Ganho de massa"
  notes?: string;     // observações gerais
}

// RESPOSTA COMPLETA DA /api/plan
export interface PlanResponse {
  plan: PlanMeta;
  days: DayPlan[];
  weeklyShopping: WeeklyShopping;
  weeklyMacros: WeeklyMacros;
}
