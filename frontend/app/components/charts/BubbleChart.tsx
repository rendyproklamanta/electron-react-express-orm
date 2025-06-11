import { lazy, Suspense } from "react"
import { ChartWrapper } from "./ChartWrapper"

// Lazy load ApexCharts to avoid SSR issues
const ReactApexChart = lazy(() => import("react-apexcharts"))

export function BubbleChartDemo() {
   const options = {
      chart: {
         type: "bubble" as const,
         height: 350,
         toolbar: {
            show: false,
         },
      },
      colors: ["#3b82f6", "#ef4444", "#10b981"],
      dataLabels: {
         enabled: false,
      },
      fill: {
         opacity: 0.8,
      },
      xaxis: {
         title: {
            text: "GDP per Capita",
         },
         tickAmount: 12,
         type: "category" as const,
      },
      yaxis: {
         title: {
            text: "Life Expectancy",
         },
         max: 90,
      },
      legend: {
         position: "top" as const,
      },
      grid: {
         borderColor: "#e5e7eb",
      },
   }

   const series = [
      {
         name: "Asia",
         data: [
            [40, 70, 30],
            [50, 75, 35],
            [60, 80, 40],
            [70, 82, 45],
         ],
      },
      {
         name: "Europe",
         data: [
            [45, 72, 32],
            [55, 77, 37],
            [65, 83, 42],
            [75, 85, 47],
         ],
      },
      {
         name: "America",
         data: [
            [42, 71, 31],
            [52, 76, 36],
            [62, 81, 41],
            [72, 84, 46],
         ],
      },
   ]

   return (
      <ChartWrapper title="Bubble Chart" description="GDP vs Life Expectancy by region">
         <Suspense fallback={<div className="h-[350px] flex items-center justify-center">Loading chart...</div>}>
            <ReactApexChart options={options} series={series} type="bubble" height={350} />
         </Suspense>
      </ChartWrapper>
   )
}
