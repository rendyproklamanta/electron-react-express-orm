import { lazy, Suspense } from "react"
import { ChartWrapper } from "./ChartWrapper"

const ReactApexChart = lazy(() => import("react-apexcharts"))

export function LineChartDemo() {
   const options = {
      chart: {
         type: "line" as const,
         height: 350,
         toolbar: {
            show: false,
         },
      },
      colors: ["#3b82f6", "#ef4444", "#10b981"],
      dataLabels: {
         enabled: false,
      },
      stroke: {
         curve: "smooth" as const,
         width: 3,
      },
      xaxis: {
         categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
      yaxis: {
         title: {
            text: "Values",
         },
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
         name: "Desktop",
         data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 100, 85, 95],
      },
      {
         name: "Mobile",
         data: [20, 30, 25, 40, 39, 50, 60, 81, 105, 80, 65, 75],
      },
      {
         name: "Tablet",
         data: [10, 20, 15, 30, 29, 40, 50, 71, 95, 70, 55, 65],
      },
   ]

   return (
      <ChartWrapper title="Line Chart" description="Multi-series line chart with smooth curves">
         <Suspense fallback={<div className="h-[350px] flex items-center justify-center">Loading chart...</div>}>
            <ReactApexChart options={options} series={series} type="line" height={350} />
         </Suspense>
      </ChartWrapper>
   )
}
