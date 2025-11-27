// src/app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  // Redireciona diretamente para o onboarding
  redirect("/onboarding");
}
