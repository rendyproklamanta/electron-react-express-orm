import { lazy, Suspense } from "react"
import { ChartWrapper } from "./ChartWrapper"

// Lazy load ApexCharts to avoid SSR issues
const ReactApexChart = lazy(() => import("react-apexcharts"))

export function RadarChartDemo() {
   const options = {
      chart: {
         type: "radar" as const,
         height: 350,
         toolbar: {
            show: false,
         },
      },
      colors: ["#3b82f6", "#ef4444"],
      xaxis: {
         categories: ["Speed", "Reliability", "Comfort", "Safety", "Efficiency", "Price"],
      },
      yaxis: {
         show: false,
      },
      markers: {
         size: 4,
         colors: ["#fff"],
         strokeColor: "#3b82f6",
         strokeWidth: 2,
      },
      legend: {
         position: "top" as const,
      },
   }

   const series = [
      {
         name: "Product A",
         data: [80, 50, 30, 40, 100, 20],
      },
      {
         name: "Product B",
         data: [20, 30, 40, 80, 20, 80],
      },
   ]

   return (
      <ChartWrapper title="Radar Chart" description="Multi-dimensional comparison">
         <Suspense fallback={<div className="h-[350px] flex items-center justify-center">Loading chart...</div>}>
            <ReactApexChart options={options} series={series} type="radar" height={350} />
         </Suspense>
      </ChartWrapper>
   )
}
