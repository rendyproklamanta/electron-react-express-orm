import { lazy, Suspense } from "react"
import { ChartWrapper } from "./ChartWrapper"

const ReactApexChart = lazy(() => import("react-apexcharts"))

export function DonutChartDemo() {
   const options = {
      chart: {
         type: "donut" as const,
         height: 350,
      },
      colors: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"],
      labels: ["Desktop", "Mobile", "Tablet", "Other"],
      plotOptions: {
         pie: {
            donut: {
               size: "70%",
               labels: {
                  show: true,
                  total: {
                     show: true,
                     label: "Total",
                     formatter: (w: any) => w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0),
                  },
               },
            },
         },
      },
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

   const series = [44, 55, 41, 17]

   return (
      <ChartWrapper title="Donut Chart" description="Device usage distribution">
         <Suspense fallback={<div className="h-[350px] flex items-center justify-center">Loading chart...</div>}>
            <ReactApexChart options={options} series={series} type="donut" height={350} />
         </Suspense>
      </ChartWrapper>
   )
}
