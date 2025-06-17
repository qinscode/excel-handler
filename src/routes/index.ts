import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { ExcelApp } from "../pages/ExcelApp";

// Excel application page route (set as root path)
export const excelRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: ExcelApp,
});

// Export all routes
export const routeTree = rootRoute.addChildren([excelRoute]);
