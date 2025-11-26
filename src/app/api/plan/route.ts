import { NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

const apiKey =
  process.env.VITAFLOW_OPENAI_API_KEY ?? process.env.OPENAI_API_KEY ?? "";

const client = new OpenAI({
  apiKey: apiKey || "",
});

type AnyUser = Record<string, any>;

/* ============================================================
   🔥 Função que chama a IA e gera o plano
   ============================================================ */
async function generatePlanWithAI(user: AnyUser) {
  if (!apiKey) {
    throw new Error(
      "Chave da OpenAI não configurada. Defina VITAFLOW_OPENAI_API_KEY ou OPENAI_API_KEY."
    );
  }

  const systemPrompt = `
Você é a IA de nutrição e treino do VitaFlow, agindo como um(a) nutricionista e treinador(a) brasileiro(a) especialista em:

- Nutrição humana
- Nutrição esportiva
- Composição corporal
- Rotinas reais de brasileiros

Você vai receber abaixo os dados reais do usuário do aplicativo VitaFlow.

================ DADOS DO USUÁRIO (ONBOARDING) ================
${JSON.stringify(user, null, 2)}

Use TODOS os campos que existirem, inclusive os opcionais:
- sexo biológico
- idade, peso, altura
- nível de atividade (sedentário, leve, moderado, intenso)
- objetivo principal (emagrecer, ganhar massa, manter, saúde geral, hipertrofia etc.)
- local de treino (casa, academia, híbrido)
- restrições / preferências alimentares (ex: vegetariana, sem lactose, sem glúten)
- horários (horário que acorda e dorme)
- medidas opcionais:
  - bodyFat (% de gordura)
  - waist (cintura)
  - hip (quadril)
  - shoulder (ombro/peito)
  - arm (braço)

Use essas medidas opcionais para:
- ajustar volume de treino;
- ajustar intensidade;
- ajustar tamanho das porções;
- dar toques estéticos (ex.: foco em cintura, quadril, braço).

================ ESTILO DE DIETA (OBRIGATÓRIO) ================
- Dieta brasileira caseira, com alimentos que as pessoas realmente comem:
  - arroz, feijão, ovos, carnes, frango, peixe, mandioca, batata doce,
    cuscuz, pães, tapioca, saladas, frutas (banana, maçã, laranja, mamão etc.),
    iogurte, queijo, aveia, granola, café, chá.
- NÃO repita a combinação "frango + arroz + brócolis" o tempo todo.
- Varie:
  - fontes de proteína entre os dias (frango, carne, peixe, ovos, laticínios,
    leguminosas, tofu, grão-de-bico, lentilha etc.);
  - frutas (não repetir a mesma fruta em todas as refeições de todos os dias);
  - legumes e verduras.

Se houver restrições (ex: vegetariana, vegana, sem lactose, sem glúten):
- respeite integralmente;
- adapte as fontes de proteína e carboidrato de forma inteligente.

================ SUBSTITUIÇÕES (OBRIGATÓRIO) ================
Para CADA item alimentar, preencha sempre:

substitutions: {
  "default":   [...opções típicas brasileiras de mesma função nutricional],
  "economica": [...opções mais baratas, acessíveis],
  "premium":   [...opções mais caras / funcionais],
  "vegana":    [...versões veganas equivalentes]
}

Se a pessoa for vegana ou vegetariana:
- a opção principal já deve ser vegana/vegetariana;
- as substituições também devem respeitar isso.

================ TREINO (3 DIAS) ================
- Exatamente 3 dias: id = 1, 2 e 3.
- Adapte ao objetivo, nível de atividade, medidas e local de treino:
  - casa: mais peso corporal, elásticos, objetos simples.
  - academia: máquinas, halteres, barras.
  - híbrido: combinação inteligente.
- Inclua:
  - título do treino;
  - duração em minutos;
  - intensidade (leve / moderado / intenso);
  - descrição;
  - 4 a 6 exercícios com séries, repetições e notas.

================ ALIMENTAÇÃO (3 DIAS) ================
- Por dia:
  - 4 a 6 refeições (café da manhã, almoço, jantar e lanches).
  - 2 a 4 itens por refeição.
- Ajuste calorias ao objetivo:
  - emagrecer: déficit leve ou moderado, alta saciedade, fibras.
  - ganhar massa / hipertrofia: leve superávit, proteína suficiente, carbo adequado.
  - saúde geral / manter: moderado, equilibrado, grande variedade.
- Calcule macros diários aproximados (calorias, proteína, carboidratos, gorduras)
  compatíveis com o peso, objetivo e nível de atividade do usuário.

================ LISTA DE COMPRAS ==================
- weeklyShopping deve refletir a soma aproximada dos alimentos dos 3 dias,
  agrupando em:
  - hortifruti;
  - proteinas;
  - graos.

================ SCHEMA EXATO DO JSON ================
Você DEVE responder exatamente no seguinte formato (chaves fixas):

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
        "duration": number,
        "intensity": string,
        "description": string,
        "exercises": [
          { "name": string, "series": string, "reps": string, "notes": string }
        ]
      },
      "nutrition": {
        "meals": [
          {
            "name": string,
            "items": [
              {
                "name": string,
                "quantity": string,
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
      "psychology": string,
      "micros": string,
      "motivation": string
    }
  ],
  "weeklyShopping": {
    "hortifruti": string[],
    "proteinas": string[],
    "graos": string[]
  },
  "weeklyMacros": {
    "totalCalories": number,
    "summary": string
  }
}

================ REGRAS FINAIS IMPORTANTES ================
- RETORNE APENAS UM JSON VÁLIDO, sem comentários, sem texto fora do JSON.
- NÃO use vírgula sobrando no final de arrays ou objetos.
- NÃO escreva nada antes ou depois do JSON.
- O JSON precisa ser bem formatado, com todas as chaves entre aspas duplas.
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.75,
    // sem response_format para evitar corte por tamanho
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: "Gere agora o plano completo de 3 dias em JSON válido.",
      },
    ],
    // deixa o modelo respirar bem
    max_tokens: 6000,
  });

  const rawContent = completion.choices[0]?.message?.content ?? "";
  console.log("RAW CONTENT FROM OPENAI (primeiros 500 chars):");
  console.log(rawContent.slice(0, 500));

  if (!rawContent) {
    throw new Error("Resposta vazia da IA.");
  }

  // Tentativa 1: parse direto
  try {
    return JSON.parse(rawContent);
  } catch (e) {
    console.warn("Falha no JSON.parse direto. Tentando isolar apenas o JSON…");
  }

  // Tentativa 2: pegar apenas o maior bloco entre { ... }
  try {
    const match = rawContent.match(/\{[\s\S]*\}$/);
    if (!match) {
      throw new Error("Não foi possível isolar um bloco JSON na resposta.");
    }
    const onlyJson = match[0];
    return JSON.parse(onlyJson);
  } catch (e) {
    console.error("Falha ao isolar/parsear JSON da IA:");
    console.error(rawContent.slice(0, 1000));
    throw new Error("IA retornou JSON fora do padrão esperado.");
  }
}

/* ============================================================
   🚀 Rota POST /api/plan
   ============================================================ */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const user: AnyUser = (body as any)?.user ?? body;

    if (!user || Object.keys(user).length === 0) {
      return NextResponse.json(
        { error: "Nenhum dado de usuário enviado." },
        { status: 400 }
      );
    }

    console.log("=== USER RECEBIDO EM /api/plan ===");
    console.log(JSON.stringify(user, null, 2));

    const raw = await generatePlanWithAI(user);

    const days = Array.isArray(raw?.days) ? raw.days : [];
    const meta = raw?.meta ?? null;
    const weeklyShopping = raw?.weeklyShopping ?? null;
    const weeklyMacros = raw?.weeklyMacros ?? null;

    const plan = {
      meta,
      days,
      weeklyShopping,
      weeklyMacros,
    };

    return NextResponse.json({
      plan,
      days,
      meta,
      weeklyShopping,
      weeklyMacros,
      source: "ai",
    });
  } catch (err: any) {
    console.error("Erro em /api/plan:", err);

    return NextResponse.json(
      {
        error:
          err?.message ??
          "Erro inesperado ao gerar plano. Tente novamente em alguns instantes.",
        source: "error",
      },
      { status: 500 }
    );
  }
}
