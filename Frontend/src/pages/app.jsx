import { Helmet } from "react-helmet-async";
import DashboardView from "../sections/dashboard/DashboardView";


export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard | iGOT Karmayogi </title>
      </Helmet>

      <DashboardView />
    </>
  );
}
