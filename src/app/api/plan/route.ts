import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = body?.user;

    if (!client.apiKey) {
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY não configurada." }),
        { status: 500 }
      );
    }

    const prompt = `
Você é um assistente de saúde e bem-estar que cria um plano diário PRÁTICO, SEGURO e REALISTA.

Dados da pessoa:
- Nome: ${user?.name ?? "Não informado"}
- Objetivo principal: ${user?.goal ?? "Não informado"}
- Idade: ${user?.age ?? "Não informado"}
- Peso: ${user?.weight ?? "Não informado"} kg
- Altura: ${user?.height ?? "Não informado"} cm
- Sexo: ${user?.sex ?? "Não informado"}
- Nível de atividade: ${user?.activityLevel ?? "Não informado"}
- Restrições ou preferências alimentares: ${user?.dietRestrictions ?? "Não informado"}
- Horário típico: acorda às ${user?.wakeTime ?? "Não informado"} e dorme às ${user?.sleepTime ?? "Não informado"}

Monte um plano diário COMPLETO, em português, com os tópicos:

1) METAS DO DIA (água, passos, sono, foco principal)
2) ROTINA DE TREINO (duração, tipo, nível iniciante a intermediário, com variações seguras)
3) ALIMENTAÇÃO DO DIA (ideias de refeições para café, almoço, lanche, jantar)
4) RECEITAS SIMPLES (1 ou 2 exemplos com ingredientes básicos)
5) HÁBITOS DE BEM-ESTAR (sono, estresse, pausas, etc.)
6) OBSERVAÇÕES DE SEGURANÇA (deixar claro que é um plano geral, não substitui profissionais)

Regras:
- Respeite restrições alimentares e nível de condicionamento.
- Evite qualquer dieta extrema, jejum louco ou treino de risco.
- Nunca faça promessas milagrosas.
- Deixe claro que é conteúdo geral, não é consulta médica.

Formato de saída:
- Use títulos em MAIÚSCULO (tipo "METAS DO DIA")
- Use listas com bullet points.
- Não use JSON, apenas texto bem organizado.
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é um assistente de saúde responsável, focado em planos diários realistas e seguros.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 900,
    });

    const plan =
      completion.choices[0]?.message?.content ??
      "Não foi possível gerar um plano agora. Tente novamente em alguns instantes.";

    return new Response(JSON.stringify({ plan }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({
        error: "Erro ao gerar plano. Tente novamente.",
      }),
      { status: 500 }
    );
  }
}
