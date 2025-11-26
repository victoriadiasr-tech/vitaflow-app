"use client";

import { usePlanStore } from "@/store/planStore";
import { motion } from "framer-motion";

export function DaySwitcher() {
  const { plan, currentDayIndex, setCurrentDayIndex } = usePlanStore();

  const days = plan?.days ?? [];

  if (!days.length) return null;

  return (
    <div className="flex items-center gap-2 rounded-full bg-white/5 px-2 py-1 border border-white/10">
      {days.map((day: any, index: number) => {
        const isActive = index === currentDayIndex;

        return (
          <button
            key={day.id ?? index}
            onClick={() => setCurrentDayIndex(index)}
            className="relative rounded-full px-3 py-1 text-xs md:text-sm text-zinc-200"
          >
            {isActive && (
              <motion.span
                layoutId="vf-day-pill"
                className="absolute inset-0 rounded-full bg-emerald-500/30 border border-emerald-400/60"
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
              />
            )}

            <span className="relative">
              {day.label ?? `Dia ${index + 1}`}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default DaySwitcher;
