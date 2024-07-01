import { Helmet } from "react-helmet-async";
import UserView from "../sections/user/view/user-view";

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
