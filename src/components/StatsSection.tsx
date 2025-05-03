"use client";

import { useEffect, useState } from "react";

interface StatsSectionProps {
  petCount: number;
  shelterCount: number;
}

function AnimatedStat({ value, label }: { value: number; label: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="stats-card">
      <div className="text-3xl font-bold text-primary animate-count">
        {count}
      </div>
      <div className="text-sm text-gray-600 mt-2">{label}</div>
    </div>
  );
}

export function StatsSection({ petCount, shelterCount }: StatsSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <AnimatedStat value={petCount} label="Available Pets" />
      <AnimatedStat value={shelterCount} label="Partner Shelters" />
    </div>
  );
}
