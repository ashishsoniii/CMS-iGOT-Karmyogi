import { Helmet } from "react-helmet-async";
import UserView from "../sections/userManagement/UserView";

export default function userManagement() {
  return (
    <>
      <Helmet>
        <title> User Management | iGOT Karmayogi </title>
      </Helmet>

      <UserView />
    </>
  );
}
