import { lazy } from "solid-js";

import type { KukuPlugin } from "~/plugins/types";

import { MOMO_TODAY_TAB_TYPE } from "./navigation";

const TodayDashboardView = lazy(() =>
  import("./today_dashboard").then((module) => ({ default: module.TodayDashboard })),
);
const MomoAgentPanelView = lazy(() =>
  import("./agent_panel").then((module) => ({ default: module.MomoAgentPanel })),
);

const momoDashboardPlugin: KukuPlugin = {
  id: "momo-dashboard",
  name: "Momo Dashboard",
  version: "0.1.0",
  description: "Today operating dashboard shell",
  views: [
    {
      id: "momo-dashboard.today",
      label: "Today",
      icon: "kuku",
      location: { slot: "centerTab" },
      tabType: MOMO_TODAY_TAB_TYPE,
      component: TodayDashboardView,
      order: 5,
    },
    {
      id: "momo-dashboard.agent",
      label: "Momo Agent",
      icon: "second-brain",
      location: { slot: "rightPanel" },
      component: MomoAgentPanelView,
      order: 15,
    },
  ],
};

export { momoDashboardPlugin };
