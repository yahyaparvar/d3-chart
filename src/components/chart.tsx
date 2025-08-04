import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export type ChartPoint = [number, number | number[] | null];

interface ChartProps {
  title: string;
  data: ChartPoint[];
}

export const Chart: React.FC<ChartProps> = ({ title, data }) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const width = 500;
  const height = 300;

  useEffect(() => {
    if (!data || data.length === 0 || data[0] == null) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d[0]) as [number, number])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) =>
          Array.isArray(d[1])
            ? d3.min(d[1].filter((v) => v !== null) as number[])
            : d[1] ?? Infinity
        ) ?? 0,
        d3.max(data, (d) =>
          Array.isArray(d[1])
            ? d3.max(d[1].filter((v) => v !== null) as number[])
            : d[1] ?? 0
        ) ?? 1,
      ])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line<[number, number]>()
      .x((d) => x(d[0]))
      .y((d) => y(d[1]));

    if (Array.isArray(data[0][1])) {
      const seriesCount = (data[0][1] as number[]).length;
      const colors = ["blue", "green", "red"];

      for (let i = 0; i < seriesCount; i++) {
        const lineData: [number, number][] = data
          .map(([ts, values]) => {
            const value = (values as number[])[i];
            return value != null ? [ts, value] : null;
          })
          .filter(Boolean) as [number, number][];

        svg
          .append("path")
          .datum(lineData)
          .attr("fill", "none")
          .attr("stroke", colors[i])
          .attr("stroke-width", 2)
          .attr("d", line);
      }
    } else {
      const filtered = data.filter((d) => d[1] != null) as [number, number][];
      svg
        .append("path")
        .datum(filtered)
        .attr("fill", "none")
        .attr("stroke", "#00bfff")
        .attr("stroke-width", 2)
        .attr("d", line);
    }

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(6));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(6));
  }, [data]);

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h3>{title}</h3>
      <svg ref={ref} width={width} height={height} />
    </div>
  );
};
