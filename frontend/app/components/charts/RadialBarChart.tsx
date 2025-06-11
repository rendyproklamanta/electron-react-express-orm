import { lazy, Suspense } from "react"
import { ChartWrapper } from "./ChartWrapper"

// Lazy load ApexCharts to avoid SSR issues
const ReactApexChart = lazy(() => import("react-apexcharts"))

export function RadialBarChartDemo() {
   const options = {
      chart: {
         type: "radialBar" as const,
         height: 350,
      },
      colors: ["#3b82f6", "#ef4444", "#10b981"],
      plotOptions: {
         radialBar: {
            dataLabels: {
               name: {
                  fontSize: "22px",
               },
               value: {
                  fontSize: "16px",
               },
               total: {
                  show: true,
                  label: "Total",
                  formatter: () => "249",
               },
            },
         },
      },
      labels: ["Apples", "Oranges", "Bananas"],
   }

   const series = [44, 55, 67]

   return (
      <ChartWrapper title="Radial Bar Chart" description="Progress indicators with multiple series">
         <Suspense fallback={<div className="h-[350px] flex items-center justify-center">Loading chart...</div>}>
            <ReactApexChart options={options} series={series} type="radialBar" height={350} />
         </Suspense>
      </ChartWrapper>
   )
}
