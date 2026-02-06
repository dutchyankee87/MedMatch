"use client";

import { useEffect, useState, useRef } from "react";
import { Building2, Users, TrendingUp, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const stats: StatItem[] = [
  {
    label: "Zorgorganisaties",
    value: 500,
    suffix: "+",
    icon: Building2,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    label: "Aangesloten bureaus",
    value: 150,
    suffix: "+",
    icon: Users,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    label: "Plaatsingen per maand",
    value: 2500,
    suffix: "+",
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    label: "Uren bespaard/week",
    value: 40,
    suffix: "",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
];

function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <span ref={ref}>
      {count.toLocaleString("nl-NL")}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="border-y bg-gray-50/50 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className={`inline-flex p-3 rounded-xl ${stat.bgColor} shadow-sm border border-white mb-4`}
              >
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <p className="text-3xl lg:text-4xl font-bold text-gray-900">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
