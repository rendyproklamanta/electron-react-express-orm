import { lazy, Suspense } from "react"
import { ChartWrapper } from "./ChartWrapper"

// Lazy load ApexCharts to avoid SSR issues
const ReactApexChart = lazy(() => import("react-apexcharts"))

export function ScatterChartDemo() {
   const options = {
      chart: {
         type: "scatter" as const,
         height: 350,
         zoom: {
            enabled: true,
            type: "xy" as const,
         },
         toolbar: {
            show: false,
         },
      },
      colors: ["#3b82f6", "#ef4444"],
      xaxis: {
         title: {
            text: "Height (cm)",
         },
         tickAmount: 10,
         min: 150,
         max: 200,
      },
      yaxis: {
         title: {
            text: "Weight (kg)",
         },
         tickAmount: 7,
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
         name: "Male",
         data: [
            [161.2, 51.6],
            [167.5, 59.0],
            [159.5, 49.2],
            [157.0, 63.0],
            [155.8, 53.6],
            [170.0, 59.0],
            [159.1, 47.6],
            [166.0, 69.8],
            [176.2, 66.8],
            [160.2, 75.2],
         ],
      },
      {
         name: "Female",
         data: [
            [151.1, 46.6],
            [157.5, 49.0],
            [149.5, 39.2],
            [147.0, 53.0],
            [145.8, 43.6],
            [160.0, 49.0],
            [149.1, 37.6],
            [156.0, 59.8],
            [166.2, 56.8],
            [150.2, 65.2],
         ],
      },
   ]

   return (
      <ChartWrapper title="Scatter Chart" description="Height vs Weight correlation">
         <Suspense fallback={<div className="h-[350px] flex items-center justify-center">Loading chart...</div>}>
            <ReactApexChart options={options} series={series} type="scatter" height={350} />
         </Suspense>
      </ChartWrapper>
   )
}
