import { DonutChartDemo } from "../components/charts/DonutChart";
import { RadialBarChartDemo } from "../components/charts/RadialBarChart";
import { ScatterChartDemo } from "../components/charts/ScatterChart";
import { BubbleChartDemo } from "../components/charts/BubbleChart";
import { HeatmapChartDemo } from "../components/charts/HeatmapChart";
import { TreemapChartDemo } from "../components/charts/TreemapChart";
import { CandlestickChartDemo } from "../components/charts/CandlestickChart";
import { BoxPlotChartDemo } from "../components/charts/BoxPlotChart";
import { RadarChartDemo } from "../components/charts/RadarChart";
import { PolarAreaChartDemo } from "../components/charts/PolarAreaChart";
import { MixedChartDemo } from "../components/charts/MixedChart";

import Burger from "../components/Burger";

export default function ChartsList() {
   return (
      <>
         <Burger breadcrumbs="Charts" />

         <div className="container p-6 space-y-8">
            <div className="grid gap-8">
               <div className="grid md:grid-cols-2 gap-6">
                  <DonutChartDemo />
                  <RadialBarChartDemo />
                  <ScatterChartDemo />
                  <BubbleChartDemo />
                  <HeatmapChartDemo />
                  <TreemapChartDemo />
                  <CandlestickChartDemo />
                  <BoxPlotChartDemo />
                  <RadarChartDemo />
                  <PolarAreaChartDemo />
                  <MixedChartDemo />
               </div>
            </div>
         </div>
      </>
   )
}