"use client";

import { useMemo } from "react";
import { Insight } from "@/types/insight";

interface MatrixCellProps {
  val: number;
}

function PearsonCell({ val }: MatrixCellProps) {
  const color = val > 0 
    ? `rgba(99, 102, 241, ${val})` 
    : `rgba(239, 68, 68, ${Math.abs(val)})`;

  return (
    <div
      className="flex h-10 w-16 items-center justify-center rounded font-semibold text-sm transition-transform hover:scale-105"
      style={{
        background: color,
        color: Math.abs(val) > 0.4 ? "#ffffff" : "var(--slate-400)",
        border: `1px solid var(--panel-border)`,
      }}
      title={`Correlation: ${val.toFixed(3)}`}
    >
      {val.toFixed(2)}
    </div>
  );
}

export default function CorrelationMatrix({ data }: { data: Insight[] }) {
  const matrix = useMemo(() => {
    if (data.length < 2) {
      return {
        int_lik: 0,
        int_rel: 0,
        lik_rel: 0,
      };
    }

    const calculatePearson = (keyA: keyof Insight, keyB: keyof Insight) => {
      let sumA = 0, sumB = 0, sumAB = 0, sumA2 = 0, sumB2 = 0;
      let count = 0;

      data.forEach((item) => {
        const valA = Number(item[keyA]);
        const valB = Number(item[keyB]);

        if (!isNaN(valA) && !isNaN(valB)) {
          sumA += valA;
          sumB += valB;
          sumAB += valA * valB;
          sumA2 += valA * valA;
          sumB2 += valB * valB;
          count++;
        }
      });

      if (count < 2) return 0;

      const num = count * sumAB - sumA * sumB;
      const den = Math.sqrt(
        (count * sumA2 - sumA * sumA) * (count * sumB2 - sumB * sumB)
      );

      return den === 0 ? 0 : num / den;
    };

    return {
      int_lik: calculatePearson("intensity", "likelihood"),
      int_rel: calculatePearson("intensity", "relevance"),
      lik_rel: calculatePearson("likelihood", "relevance"),
    };
  }, [data]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-1 text-lg font-semibold">Correlation Matrix</h2>
      <p className="mb-6 text-xs text-slate-500">
        Pearson correlation coefficients between key metrics
      </p>

      <div className="flex flex-col items-center justify-center py-4">
        <div className="grid grid-cols-4 gap-3 text-center text-xs text-slate-400 font-medium">
          {/* Row Headers */}
          <div className="h-10 flex items-center justify-end pr-2 text-slate-500 font-normal">
            Metric
          </div>
          <div className="font-semibold text-slate-300">Intensity</div>
          <div className="font-semibold text-slate-300">Likelihood</div>
          <div className="font-semibold text-slate-300">Relevance</div>

          {/* Intensity Row */}
          <div className="h-10 flex items-center justify-end pr-2 text-slate-300 font-medium">
            Intensity
          </div>
          <PearsonCell val={1.0} />
          <PearsonCell val={matrix.int_lik} />
          <PearsonCell val={matrix.int_rel} />

          {/* Likelihood Row */}
          <div className="h-10 flex items-center justify-end pr-2 text-slate-300 font-medium">
            Likelihood
          </div>
          <PearsonCell val={matrix.int_lik} />
          <PearsonCell val={1.0} />
          <PearsonCell val={matrix.lik_rel} />

          {/* Relevance Row */}
          <div className="h-10 flex items-center justify-end pr-2 text-slate-300 font-medium">
            Relevance
          </div>
          <PearsonCell val={matrix.int_rel} />
          <PearsonCell val={matrix.lik_rel} />
          <PearsonCell val={1.0} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500 justify-center">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-indigo-500" /> Positive correlation
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-red-500" /> Negative correlation
        </span>
      </div>
    </div>
  );
}
