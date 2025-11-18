import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = body?.user ?? body;

    if (!user) {
      return NextResponse.json(
        { error: "Nenhum dado de usuário enviado." },
        { status: 400 }
      );
    }

    // 🔥 modelo mais inteligente – se ficar lento, troque para "gpt-4o-mini"
    const model = "gpt-4.1";

    const systemPrompt = `
Você é a IA do VitaFlow. Gere um plano COMPLETO de 3 dias de treino + alimentação,
rico em detalhes, mas ainda objetivo.

OUTPUT = APENAS JSON.

===============
DADOS DO USUÁRIO
===============
${JSON.stringify(user, null, 2)}

===============
REGRAS DE QUALIDADE
===============
- Exatamente 3 dias (id 1, 2, 3).
- Treino por dia:
  - 1 sessão principal
  - 4 a 6 exercícios
  - cada exercício com séries e reps bem definidos e lógica do objetivo.
- Alimentação por dia:
  - 4 refeições: café da manhã, almoço, lanche e jantar (pode adaptar nomes).
  - cada refeição com 2 a 4 itens (ex.: proteína + carbo + gordura boa + fruta/legume).
  - use quantidades realistas (g, ml, unidades).
  - sempre preencha substituições (default, econômica, premium, vegana) com 1 a 3 opções.
- Macros do dia coerentes com objetivo (emagrecimento, ganho de massa, etc.)
- Lista de compras semanal:
  - hortifruti, proteínas, grãos (mínimo 5 itens em cada, usando quantidades aproximadas).
- Textos: de 1 a 3 frases por campo de texto – nada de textão.

Respeite o MODO DE TREINO:
- "casa": apenas peso corporal, elásticos, halteres simples, objetos domésticos.
- "academia": pode usar máquinas, barras, cabos, halteres.
- "hibrido": pelo menos 1 dia pensado para casa e 1 dia pensado para academia.

===============
SCHEMA OBRIGATÓRIO
===============
{
  "meta": {
    "objective": string,
    "trainingMode": string,
    "intensity": string
  },
  "days": [
    {
      "id": number,
      "label": string,

      "training": {
        "title": string,
        "duration": number,          // minutos
        "intensity": string,         // leve / moderado / intenso
        "description": string,       // descrição curta do treino e foco
        "exercises": [
          {
            "name": string,
            "series": string,        // "3 séries"
            "reps": string,          // "10-12 reps"
            "notes": string          // dica rápida (ex.: foco, técnica, respiração)
          }
        ]
      },

      "nutrition": {
        "meals": [
          {
            "name": string,          // "Café da manhã"
            "items": [
              {
                "name": string,      // "Ovos mexidos"
                "quantity": string,  // "3 unidades"
                "substitutions": {
                  "default": string[],
                  "economica": string[],
                  "premium": string[],
                  "vegana": string[]
                }
              }
            ]
          }
        ],
        "macros": {
          "calories": number,
          "protein": number,
          "carbs": number,
          "fats": number
        }
      },

      "psychology": string,         // 2-4 frases sobre energia, rotina, adesão
      "micros": string,             // 2-4 frases sobre micronutrientes e qualidade alimentar
      "motivation": string          // 1 frase motivacional bem personalizada
    }
  ],

  "weeklyShopping": {
    "hortifruti": string[],         // ex.: "7 maçãs", "1 maço de brócolis"
    "proteinas": string[],
    "graos": string[]
  },

  "weeklyMacros": {
    "totalCalories": number,
    "summary": string              // resumo rápido da semana
  }
}

RETORNE APENAS JSON VÁLIDO NESSE FORMATO.
    `;

    const completion = await client.chat.completions.create({
      model,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content:
            "Gere o plano completo de 3 dias seguindo exatamente o schema, com boa riqueza de detalhes.",
        },
      ],
    });

    const content = completion.choices[0]?.message?.content ?? "{}";

    let raw: any;
    try {
      raw = JSON.parse(content);
    } catch (e) {
      console.error("Erro ao parsear JSON:", content);
      return NextResponse.json(
        { error: "IA retornou JSON inválido." },
        { status: 500 }
      );
    }

    const days = Array.isArray(raw?.days) ? raw.days : [];
    const first = days[0];

    // 🔁 MAPEIA DIA 1 PARA O FORMATO LEGACY DO DASHBOARD
    let plan = null;
    if (first) {
      plan = {
        label: first.label ?? "Dia 1",
        // Treino
        workoutPlan: {
          overview:
            first.training?.description ||
            first.training?.title ||
            "Treino do dia",
          sessions: [
            {
              name: first.training?.title ?? "Sessão principal",
              timeOfDay: "Indiferente",
              durationMinutes: first.training?.duration ?? 45,
              intensity: first.training?.intensity ?? "moderado",
              exercises:
                first.training?.exercises?.map((ex: any) => ({
                  name: ex.name,
                  sets: ex.series,
                  reps: ex.reps,
                  notes: ex.notes ?? "",
                })) ?? [],
            },
          ],
        },
        // Alimentação
        meals:
          first.nutrition?.meals?.map((m: any) => ({
            name: m.name,
            timeOfDay: "Indiferente",
            items:
              m.items?.map((it: any) => ({
                food: it.name,
                quantity: it.quantity,
                substitutions: [
                  ...(it.substitutions?.default ?? []),
                  ...(it.substitutions?.economica ?? []),
                  ...(it.substitutions?.premium ?? []),
                  ...(it.substitutions?.vegana ?? []),
                ],
              })) ?? [],
          })) ?? [],
        // Macros
        macros: first.nutrition?.macros
          ? {
              kcal: first.nutrition.macros.calories,
              protein_g: first.nutrition.macros.protein,
              carbs_g: first.nutrition.macros.carbs,
              fat_g: first.nutrition.macros.fats,
            }
          : null,
        // Resumo nutricional (uso os micros e psicologia)
        nutritionalSummary:
          first.micros ||
          "Resumo nutricional gerado de forma compacta pela IA para este dia.",
        // Lista compras
        shoppingList: {
          hortifruti: raw.weeklyShopping?.hortifruti ?? [],
          proteinas: raw.weeklyShopping?.proteinas ?? [],
          graos_e_cereais: raw.weeklyShopping?.graos ?? [],
        },
      };
    }

    return NextResponse.json({
      plan,
      days,
      meta: raw.meta ?? null,
      weeklyShopping: raw.weeklyShopping ?? null,
      weeklyMacros: raw.weeklyMacros ?? null,
    });
  } catch (err) {
    console.error("Erro em /api/plan:", err);
    return NextResponse.json(
      { error: "Falha ao gerar plano." },
      { status: 500 }
    );
  }
}
