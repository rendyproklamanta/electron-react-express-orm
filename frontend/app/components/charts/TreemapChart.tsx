import { lazy, Suspense } from "react"
import { ChartWrapper } from "./ChartWrapper"

// Lazy load ApexCharts to avoid SSR issues
const ReactApexChart = lazy(() => import("react-apexcharts"))

export function TreemapChartDemo() {
   const options = {
      chart: {
         type: "treemap" as const,
         height: 350,
         toolbar: {
            show: false,
         },
      },
      colors: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"],
      legend: {
         show: false,
      },
      title: {
         text: "Market Share Distribution",
      },
   }

   const series = [
      {
         data: [
            {
               x: "New Delhi",
               y: 218,
            },
            {
               x: "Kolkata",
               y: 149,
            },
            {
               x: "Mumbai",
               y: 184,
            },
            {
               x: "Ahmedabad",
               y: 55,
            },
            {
               x: "Bangaluru",
               y: 84,
            },
            {
               x: "Pune",
               y: 31,
            },
            {
               x: "Chennai",
               y: 70,
            },
            {
               x: "Jaipur",
               y: 30,
            },
            {
               x: "Surat",
               y: 44,
            },
            {
               x: "Hyderabad",
               y: 68,
            },
            {
               x: "Lucknow",
               y: 28,
            },
            {
               x: "Indore",
               y: 19,
            },
            {
               x: "Kanpur",
               y: 29,
            },
         ],
      },
   ]

   return (
      <ChartWrapper title="Treemap Chart" description="Hierarchical data visualization">
         <Suspense fallback={<div className="h-[350px] flex items-center justify-center">Loading chart...</div>}>
            <ReactApexChart options={options} series={series} type="treemap" height={350} />
         </Suspense>
      </ChartWrapper>
   )
}
