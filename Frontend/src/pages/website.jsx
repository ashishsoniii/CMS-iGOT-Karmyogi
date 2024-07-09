import { Helmet } from 'react-helmet-async';

import UserView from "../sections/website/view/website-view";

export default function WebsitePage() {
  return (
    <>
      <Helmet>
        <title> website | iGOT CMS </title>
      </Helmet>

      <UserView />
    </>
  );
}
