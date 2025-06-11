import { lazy, Suspense } from "react"
import { ChartWrapper } from "./ChartWrapper"

// Lazy load ApexCharts to avoid SSR issues
const ReactApexChart = lazy(() => import("react-apexcharts"))

export function HeatmapChartDemo() {
   const options = {
      chart: {
         type: "heatmap" as const,
         height: 350,
         toolbar: {
            show: false,
         },
      },
      colors: ["#3b82f6"],
      dataLabels: {
         enabled: false,
      },
      xaxis: {
         type: "category" as const,
         categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
      title: {
         text: "Monthly Sales Heatmap",
      },
      grid: {
         padding: {
            right: 20,
         },
      },
   }

   const series = [
      {
         name: "Product A",
         data: [
            { x: "Jan", y: 22 },
            { x: "Feb", y: 29 },
            { x: "Mar", y: 13 },
            { x: "Apr", y: 32 },
            { x: "May", y: 25 },
            { x: "Jun", y: 18 },
            { x: "Jul", y: 26 },
            { x: "Aug", y: 28 },
            { x: "Sep", y: 26 },
            { x: "Oct", y: 20 },
            { x: "Nov", y: 23 },
            { x: "Dec", y: 27 },
         ],
      },
      {
         name: "Product B",
         data: [
            { x: "Jan", y: 43 },
            { x: "Feb", y: 43 },
            { x: "Mar", y: 43 },
            { x: "Apr", y: 43 },
            { x: "May", y: 40 },
            { x: "Jun", y: 43 },
            { x: "Jul", y: 43 },
            { x: "Aug", y: 43 },
            { x: "Sep", y: 43 },
            { x: "Oct", y: 43 },
            { x: "Nov", y: 43 },
            { x: "Dec", y: 43 },
         ],
      },
      {
         name: "Product C",
         data: [
            { x: "Jan", y: 17 },
            { x: "Feb", y: 17 },
            { x: "Mar", y: 17 },
            { x: "Apr", y: 17 },
            { x: "May", y: 17 },
            { x: "Jun", y: 17 },
            { x: "Jul", y: 17 },
            { x: "Aug", y: 17 },
            { x: "Sep", y: 17 },
            { x: "Oct", y: 17 },
            { x: "Nov", y: 17 },
            { x: "Dec", y: 17 },
         ],
      },
   ]

   return (
      <ChartWrapper title="Heatmap Chart" description="Product sales intensity by month">
         <Suspense fallback={<div className="h-[350px] flex items-center justify-center">Loading chart...</div>}>
            <ReactApexChart options={options} series={series} type="heatmap" height={350} />
         </Suspense>
      </ChartWrapper>
   )
}
