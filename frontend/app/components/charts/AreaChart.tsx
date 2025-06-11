import { lazy, Suspense } from "react"
import { ChartWrapper } from "./ChartWrapper"
import { useLocation } from "react-router-dom"

// Lazy load ApexCharts to avoid SSR issues
const ReactApexChart = lazy(() => import("react-apexcharts"))

export function AreaChartDemo() {
   const location = useLocation()

   const options = {
      chart: {
         type: "area" as const,
         height: 350,
         toolbar: {
            show: false,
         },
      },
      colors: ["#3b82f6", "#ef4444"],
      dataLabels: {
         enabled: false,
      },
      stroke: {
         curve: "smooth" as const,
      },
      xaxis: {
         categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
      yaxis: {
         title: {
            text: "Revenue ($)",
         },
      },
      fill: {
         type: "gradient",
         gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.3,
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
         name: "Revenue",
         data: [31, 40, 28, 51, 42, 109, 100, 120, 140, 130, 110, 125],
      },
      {
         name: "Profit",
         data: [11, 32, 45, 32, 34, 52, 41, 60, 80, 70, 60, 75],
      },
   ]

   return (
      <ChartWrapper title="Area Chart" description="Stacked area chart with gradient fill">
         <Suspense fallback={<div className="h-[350px] flex items-center justify-center">Loading chart...</div>}>
            <ReactApexChart key={location.pathname} options={options} series={series} type="area" height={350} />
         </Suspense>
      </ChartWrapper>
   )
}
