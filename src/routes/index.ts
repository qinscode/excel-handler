import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { lazy } from "react";

// Lazy load the ExcelApp component for code splitting
const ExcelApp = lazy(() => import("../pages/ExcelApp").then(module => ({ default: module.ExcelApp })));

// Excel application page route (set as root path)
export const excelRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: ExcelApp,
});

// Export all routes
export const routeTree = rootRoute.addChildren([excelRoute]);
