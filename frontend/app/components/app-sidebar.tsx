import * as React from "react"
import {
   AudioWaveform,
   BookOpen,
   Bot,
   ChartArea,
   Command,
   Frame,
   GalleryVerticalEnd,
   Map,
   PieChart,
   Settings2,
   SquareTerminal,
} from "lucide-react"

import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarHeader,
   SidebarRail,
} from './ui/sidebar'
import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./TeamSwitcher"
import { useSelector } from "react-redux"
import { RootState } from "../store/store"



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

   const { user } = useSelector(
      (state: RootState) => state.auth
   );

   // This is sample data.
   const data = {
      user: {
         name: user?.name || "Guest",
         email: user?.email || "guest@example.com",
         avatar: "/avatars/shadcn.jpg",
      },
      teams: [
         {
            name: "Acme Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
         },
         {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
         },
         {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
         },
      ],
      navMain: [
         {
            title: "Playground",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
               {
                  title: "Dashboard",
                  url: "/",
               },
               {
                  title: "Onboarding",
                  url: "/onboarding",
               },
               {
                  title: "Table",
                  url: "/table",
               },
               {
                  title: "Maps",
                  url: "/maps",
               },
            ],
         },
         {
            title: "Charts",
            url: "#",
            icon: ChartArea,
            items: [
               {
                  title: "Line Chart",
                  url: "/charts/linechart",
               },
               {
                  title: "Area Chart",
                  url: "/charts/areachart",
               },
               {
                  title: "Bar Chart",
                  url: "/charts/barchart",
               },
               {
                  title: "Coloumn Chart",
                  url: "/charts/coloumnchart",
               },
               {
                  title: "Pie Chart",
                  url: "/charts/piechart",
               },
            ],
         },
         {
            title: "Documentation",
            url: "#",
            icon: BookOpen,
            items: [
               {
                  title: "Introduction",
                  url: "#",
               },
               {
                  title: "Get Started",
                  url: "#",
               },
               {
                  title: "Tutorials",
                  url: "#",
               },
               {
                  title: "Changelog",
                  url: "#",
               },
            ],
         },
         {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
               {
                  title: "General",
                  url: "#",
               },
               {
                  title: "Team",
                  url: "#",
               },
               {
                  title: "Billing",
                  url: "#",
               },
               {
                  title: "Limits",
                  url: "#",
               },
            ],
         },
      ],
      projects: [
         {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
         },
         {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
         },
         {
            name: "Travel",
            url: "#",
            icon: Map,
         },
      ],
   }

   return (
      <Sidebar collapsible="icon" {...props} className="pt-10">
         <SidebarHeader>
            <TeamSwitcher teams={data.teams} />
         </SidebarHeader>
         <SidebarContent>
            <NavMain items={data.navMain} />
            <NavProjects projects={data.projects} />
         </SidebarContent>
         <SidebarFooter>
            <NavUser user={data.user} />
         </SidebarFooter>
         <SidebarRail />
      </Sidebar>
   )
}
