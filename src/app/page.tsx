export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-500 via-orange-400 to-orange-600 flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl bg-black/70 rounded-3xl p-10 shadow-2xl border border-white/10 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold mb-4 text-white">
          VitaFlow
        </h1>

        <p className="text-lg md:text-xl text-white/80 mb-8">
          Seu plano diário inteligente de saúde, treino, alimentação e bem-estar —
          criado automaticamente para a sua rotina.
        </p>

        <a
          href="/onboarding"
          className="inline-flex items-center justify-center px-10 py-3 rounded-full text-lg font-semibold bg-green-500 hover:bg-green-600 text-black transition-transform hover:scale-105"
        >
          Começar agora
        </a>

        <p className="text-xs text-white/70 mt-6">
          Este aplicativo não substitui profissionais de saúde, nutricionistas ou
          educadores físicos. Consulte sempre um profissional habilitado.
        </p>
      </div>
    </main>
  );
}
