import { lazy, Suspense } from "react"
import { ChartWrapper } from "./ChartWrapper"

// Lazy load ApexCharts to avoid SSR issues
const ReactApexChart = lazy(() => import("react-apexcharts"))

export function MixedChartDemo() {
   const options = {
      chart: {
         type: "line" as const,
         height: 350,
         toolbar: {
            show: false,
         },
      },
      colors: ["#3b82f6", "#ef4444", "#10b981"],
      stroke: {
         width: [0, 2, 5],
         curve: "smooth" as const,
      },
      plotOptions: {
         bar: {
            columnWidth: "50%",
         },
      },
      fill: {
         opacity: [0.85, 0.25, 1],
         gradient: {
            inverseColors: false,
            shade: "light",
            type: "vertical",
            opacityFrom: 0.85,
            opacityTo: 0.55,
            stops: [0, 100, 100, 100],
         },
      },
      labels: ["01/01/2003", "02/01/2003", "03/01/2003", "04/01/2003", "05/01/2003", "06/01/2003", "07/01/2003"],
      markers: {
         size: 0,
      },
      xaxis: {
         type: "datetime" as const,
      },
      yaxis: {
         title: {
            text: "Points",
         },
         min: 0,
      },
      tooltip: {
         shared: true,
         intersect: false,
         y: {
            formatter: (y: number) => {
               if (typeof y !== "undefined") {
                  return y.toFixed(0) + " points"
               }
               return y
            },
         },
      },
      legend: {
         position: "top" as const,
      },
   }

   const series = [
      {
         name: "Team A",
         type: "column",
         data: [23, 11, 22, 27, 13, 22, 37],
      },
      {
         name: "Team B",
         type: "area",
         data: [44, 55, 41, 67, 22, 43, 21],
      },
      {
         name: "Team C",
         type: "line",
         data: [30, 25, 36, 30, 45, 35, 64],
      },
   ]

   return (
      <ChartWrapper title="Mixed Chart" description="Combination of column, area, and line charts">
         <Suspense fallback={<div className="h-[350px] flex items-center justify-center">Loading chart...</div>}>
            <ReactApexChart options={options} series={series} type="line" height={350} />
         </Suspense>
      </ChartWrapper>
   )
}
