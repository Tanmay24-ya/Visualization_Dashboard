"use client";

import { Insight } from "@/types/insight";
import { Lightbulb, Info } from "lucide-react";
import { useMemo } from "react";

export default function KeyInsights({ data }: { data: Insight[] }) {
  const insights = useMemo(() => {
    if (!data.length) return [];

    const topicCount: Record<string, number> = {};
    const sectorCount: Record<string, number> = {};
    const regionCount: Record<string, number> = {};
    const pestleCount: Record<string, number> = {};

    // For average relevance per topic
    const topicRelevanceSum: Record<string, number> = {};
    const topicRelevanceCount: Record<string, number> = {};

    // For average intensity per region
    const regionIntensitySum: Record<string, number> = {};
    const regionIntensityCount: Record<string, number> = {};

    data.forEach((item) => {
      if (item.topic) {
        topicCount[item.topic] = (topicCount[item.topic] || 0) + 1;
        topicRelevanceSum[item.topic] = (topicRelevanceSum[item.topic] || 0) + (item.relevance || 0);
        topicRelevanceCount[item.topic] = (topicRelevanceCount[item.topic] || 0) + 1;
      }
      if (item.sector) {
        sectorCount[item.sector] = (sectorCount[item.sector] || 0) + 1;
      }
      if (item.region) {
        regionCount[item.region] = (regionCount[item.region] || 0) + 1;
        regionIntensitySum[item.region] = (regionIntensitySum[item.region] || 0) + (item.intensity || 0);
        regionIntensityCount[item.region] = (regionIntensityCount[item.region] || 0) + 1;
      }
      if (item.pestle) {
        pestleCount[item.pestle] = (pestleCount[item.pestle] || 0) + 1;
      }
    });

    const getTop = (obj: Record<string, number>) =>
      Object.entries(obj).sort((a, b) => b[1] - a[1])[0];

    const topTopic = getTop(topicCount);
    const topSector = getTop(sectorCount);
    const topRegion = getTop(regionCount);
    const topPestle = getTop(pestleCount);

    // Calculate highest average relevance topic
    const topicAvgRelevance = Object.entries(topicRelevanceCount).map(([topic, count]) => {
      const avg = topicRelevanceSum[topic] / count;
      return { topic, avg };
    });
    const highestRelevanceTopic = topicAvgRelevance.sort((a, b) => b.avg - a.avg)[0];

    // Calculate region with highest average intensity
    const regionAvgIntensity = Object.entries(regionIntensityCount).map(([region, count]) => {
      const avg = regionIntensitySum[region] / count;
      return { region, avg };
    });
    const highestIntensityRegion = regionAvgIntensity.sort((a, b) => b.avg - a.avg)[0];

    const sectorPercentage = topSector 
      ? ((topSector[1] / data.length) * 100).toFixed(1)
      : "0";

    const bullet1 = topSector
      ? <><strong>{topSector[0]}</strong> leads sector activity with <strong>{topSector[1]}</strong> signals, accounting for <strong>{sectorPercentage}%</strong> of the current selection.</>
      : null;

    const bullet2 = highestIntensityRegion
      ? <><strong>{highestIntensityRegion.region}</strong> shows the highest concentration of average signal intensity (score: <strong>{highestIntensityRegion.avg.toFixed(1)}</strong>).</>
      : null;

    const bullet3 = topTopic && highestRelevanceTopic
      ? <><strong>{topTopic[0]}</strong> is the dominant topic, while <strong>{highestRelevanceTopic.topic}</strong> has the highest average relevance (score: <strong>{highestRelevanceTopic.avg.toFixed(1)}</strong>).</>
      : null;

    const bullet4 = topPestle
      ? <><strong>{topPestle[0]}</strong> PESTLE signals dominate the strategic composition with <strong>{topPestle[1]}</strong> records.</>
      : null;

    return [bullet1, bullet2, bullet3, bullet4].filter(Boolean);
  }, [data]);

  if (!insights.length) return null;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
      <div className="mb-4 flex items-center gap-2">
        <Lightbulb size={18} className="text-amber-400 animate-pulse" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Executive Summary</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {insights.map((insight, i) => (
          <div key={i} className="flex items-start gap-2.5 rounded-xl bg-slate-950/30 p-3.5 text-xs text-slate-300 border border-slate-850">
            <Info size={14} className="mt-0.5 text-indigo-400 flex-shrink-0" />
            <p className="leading-relaxed">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
