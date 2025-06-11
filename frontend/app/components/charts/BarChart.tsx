import { lazy, Suspense } from "react"
import { ChartWrapper } from "./ChartWrapper"

const ReactApexChart = lazy(() => import("react-apexcharts"))

export function BarChartDemo() {
   const options = {
      chart: {
         type: "bar" as const,
         height: 350,
         toolbar: {
            show: false,
         },
      },
      colors: ["#3b82f6", "#ef4444", "#10b981"],
      plotOptions: {
         bar: {
            horizontal: true,
            dataLabels: {
               position: "top" as const,
            },
         },
      },
      dataLabels: {
         enabled: true,
         offsetX: -6,
         style: {
            fontSize: "12px",
            colors: ["#fff"],
         },
      },
      xaxis: {
         categories: ["Q1", "Q2", "Q3", "Q4"],
      },
      yaxis: {
         title: {
            text: "Quarters",
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
         name: "Sales",
         data: [44, 55, 41, 67],
      },
      {
         name: "Marketing",
         data: [13, 23, 20, 8],
      },
      {
         name: "Development",
         data: [11, 17, 15, 15],
      },
   ]

   return (
      <ChartWrapper title="Horizontal Bar Chart" description="Multi-series horizontal bar chart">
         <Suspense fallback={<div className="h-[350px] flex items-center justify-center">Loading chart...</div>}>
            <ReactApexChart options={options} series={series} type="bar" height={350} />
         </Suspense>
      </ChartWrapper>
   )
}
