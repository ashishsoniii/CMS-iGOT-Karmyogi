import { lazy, Suspense } from "react";
import { Outlet, Navigate, useRoutes } from "react-router-dom";

import DashboardLayout from "../layouts/dashboard";
import WebsitePage from "../pages/website";

const IndexPage = lazy(() => import("../pages/app"));
const LoginPage = lazy(() => import("../pages/login"));
const UserManagementPage = lazy(() => import("../pages/userManagement"));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { element: <UserManagementPage />, path: "user" },
        { element: <WebsitePage />, path: "websites" },
      ],
    },
    {
      path: "login",
      element: <LoginPage />,
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
