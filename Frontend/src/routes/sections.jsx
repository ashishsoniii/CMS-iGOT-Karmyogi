import { lazy } from "react";
import { useRoutes } from "react-router-dom";

export const LoginPage = lazy(() => import("../pages/login/"));
export const IndexPage = lazy(() => import("../pages/app/"));

export default function Router() {
  const routes = useRoutes([
    {
      children: [{ element: <IndexPage />, index: true }],
    },
    {
      path: "login",
      element: <LoginPage />,
    },
    // {
    //   path: "*",
    //   element: <Navigate to="/404" replace />,
    // },
  ]);

  return routes;
}
