import { lazy } from "react";
import { useRoutes } from "react-router-dom";

export const LoginPage = lazy(() => import("../pages/login/"));

export default function Router() {
  const routes = useRoutes([
    {
      path: "login",
      element: <LoginPage />,
    },
  ]);

  return routes;
}
