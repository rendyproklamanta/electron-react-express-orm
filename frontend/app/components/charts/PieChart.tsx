import { lazy, Suspense } from "react"
import { ChartWrapper } from "./ChartWrapper"

// Lazy load ApexCharts to avoid SSR issues
const ReactApexChart = lazy(() => import("react-apexcharts"))

export function PieChartDemo() {
   const options = {
      chart: {
         type: "pie" as const,
         height: 350,
      },
      colors: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"],
      labels: ["Chrome", "Safari", "Firefox", "Edge", "Other"],
      responsive: [
         {
            breakpoint: 480,
            options: {
               chart: {
                  width: 200,
               },
               legend: {
                  position: "bottom" as const,
               },
            },
         },
      ],
      legend: {
         position: "bottom" as const,
      },
   }

   const series = [44, 55, 13, 43, 22]

   return (
      <ChartWrapper title="Pie Chart" description="Browser usage statistics">
         <Suspense fallback={<div className="h-[350px] flex items-center justify-center">Loading chart...</div>}>
            <ReactApexChart options={options} series={series} type="pie" height={350} />
         </Suspense>
      </ChartWrapper>
   )
}
