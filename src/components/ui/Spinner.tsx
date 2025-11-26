"use client";

export function Spinner() {
  return (
    <div className="flex items-center gap-2 text-sm text-[color:var(--text-soft)]">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[color:var(--accent)] border-t-transparent" />
      <span>Gerando seu plano VitaFlow...</span>
    </div>
  );
}
