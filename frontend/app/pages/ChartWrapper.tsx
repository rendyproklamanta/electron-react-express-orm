import { Outlet } from "react-router-dom";
import Burger from "../components/Burger";

export function ChartsWrapper() {
   return (
      <>
         <Burger breadcrumbs="Charts" />

         <div className="container p-6 space-y-8">
            <div className="grid gap-6">
               <Outlet />
            </div>
         </div>
      </>
   )
}