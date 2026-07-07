"use client";

import { Insight } from "@/types/insight";
import { Lightbulb, TrendingUp, Sparkles, AlertTriangle, Layers } from "lucide-react";
import { useMemo } from "react";

export default function KeyInsights({ data }: { data: Insight[] }) {
  const insights = useMemo(() => {
    if (!data.length) return [];

    const topicCount: Record<string, number> = {};
    const sectorCount: Record<string, number> = {};
    const regionCount: Record<string, number> = {};
    const pestleCount: Record<string, number> = {};

    const topicRelevanceSum: Record<string, number> = {};
    const topicRelevanceCount: Record<string, number> = {};

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

    const topicAvgRelevance = Object.entries(topicRelevanceCount).map(([topic, count]) => {
      const avg = topicRelevanceSum[topic] / count;
      return { topic, avg };
    });
    const highestRelevanceTopic = topicAvgRelevance.sort((a, b) => b.avg - a.avg)[0];

    const regionAvgIntensity = Object.entries(regionIntensityCount).map(([region, count]) => {
      const avg = regionIntensitySum[region] / count;
      return { region, avg };
    });
    const highestIntensityRegion = regionAvgIntensity.sort((a, b) => b.avg - a.avg)[0];

    const sectorPercentage = topSector 
      ? ((topSector[1] / data.length) * 100).toFixed(1)
      : "0";

    const items = [];

    if (topSector) {
      items.push({
        title: "Sector Concentration",
        content: <><strong>{topSector[0]}</strong> leads sector activity with <strong>{topSector[1]}</strong> signals, accounting for <strong>{sectorPercentage}%</strong> of the current selection.</>,
        icon: <Layers size={14} className="text-indigo-400" />,
        border: "border-indigo-500/10",
        bg: "bg-indigo-500/5",
      });
    }

    if (highestIntensityRegion) {
      items.push({
        title: "Signal Strength",
        content: <><strong>{highestIntensityRegion.region}</strong> shows the highest concentration of average signal intensity (score: <strong>{highestIntensityRegion.avg.toFixed(1)}</strong>).</>,
        icon: <TrendingUp size={14} className="text-amber-400" />,
        border: "border-amber-500/10",
        bg: "bg-amber-500/5",
      });
    }

    if (topTopic && highestRelevanceTopic) {
      items.push({
        title: "Top Domain Insights",
        content: <><strong>{topTopic[0]}</strong> is the dominant topic, while <strong>{highestRelevanceTopic.topic}</strong> has the highest average relevance (score: <strong>{highestRelevanceTopic.avg.toFixed(1)}</strong>).</>,
        icon: <Sparkles size={14} className="text-cyan-400" />,
        border: "border-cyan-500/10",
        bg: "bg-cyan-500/5",
      });
    }

    if (topPestle) {
      items.push({
        title: "PESTLE Outlook",
        content: <><strong>{topPestle[0]}</strong> PESTLE signals dominate the strategic composition with <strong>{topPestle[1]}</strong> records.</>,
        icon: <AlertTriangle size={14} className="text-green-400" />,
        border: "border-green-500/10",
        bg: "bg-green-500/5",
      });
    }

    return items;
  }, [data]);

  if (!insights.length) return null;

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-md">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
          <Lightbulb size={14} className="animate-pulse" />
        </div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300">Executive Overview Summary</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {insights.map((insight, i) => (
          <div 
            key={i} 
            className={`flex flex-col gap-2.5 rounded-xl border p-4 transition-all duration-300 hover:scale-[1.01] ${insight.border} ${insight.bg}`}
          >
            <div className="flex items-center gap-2 text-slate-400 font-semibold text-[10px] uppercase tracking-wider">
              {insight.icon}
              {insight.title}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">{insight.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
