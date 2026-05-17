"use client";

import { useEffect, useState, useRef } from "react";

interface ContadoresProps {
  stats: [number, string][];
}

export default function Contadores({ stats }: ContadoresProps) {
  const [counts, setCounts] = useState<number[]>(stats.map(() => 0));
  const sectionRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          
          stats.forEach((stat, i) => {
            const target = stat[0];
            const duration = 1500; // 1.5s
            const start = 0;
            const stepTime = Math.max(Math.floor(duration / target), 15);
            let current = start;
            
            const timer = setInterval(() => {
              current += Math.ceil(target / (duration / stepTime));
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              setCounts((prev) => {
                const next = [...prev];
                next[i] = current;
                return next;
              });
            }, stepTime);
          });
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
    return () => {
      if (section) observer.unobserve(section);
    };
  }, [stats]);

  return (
    <div className="hero_stats" ref={sectionRef}>
      {stats.map((stat, i) => (
        <div className="hstat" key={stat[1]}>
          <div className="hstat_n">
            {counts[i]}
            {stat[1].includes("%") || stat[1] === "% Gratis" ? "" : "+"}
          </div>
          <div className="hstat_l">{stat[1]}</div>
        </div>
      ))}
    </div>
  );
}
