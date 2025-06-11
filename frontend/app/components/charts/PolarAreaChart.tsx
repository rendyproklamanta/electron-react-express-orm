import { lazy, Suspense } from "react"
import { ChartWrapper } from "./ChartWrapper"

// Lazy load ApexCharts to avoid SSR issues
const ReactApexChart = lazy(() => import("react-apexcharts"))

export function PolarAreaChartDemo() {
   const options = {
      chart: {
         type: "polarArea" as const,
         height: 350,
      },
      colors: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"],
      labels: ["Rose A", "Rose B", "Rose C", "Rose D", "Rose E"],
      fill: {
         opacity: 0.8,
      },
      stroke: {
         width: 1,
         colors: undefined,
      },
      yaxis: {
         show: false,
      },
      legend: {
         position: "bottom" as const,
      },
      plotOptions: {
         polarArea: {
            rings: {
               strokeWidth: 0,
            },
            spokes: {
               strokeWidth: 0,
            },
         },
      },
   }

   const series = [14, 23, 21, 17, 15]

   return (
      <ChartWrapper title="Polar Area Chart" description="Radial data visualization">
         <Suspense fallback={<div className="h-[350px] flex items-center justify-center">Loading chart...</div>}>
            <ReactApexChart options={options} series={series} type="polarArea" height={350} />
         </Suspense>
      </ChartWrapper>
   )
}
