import { Helmet } from "react-helmet-async";
import ContentUpdaterView from "../sections/contentUpdater/ContentUpdaterView";

export default function ContentUpdater() {
  return (
    <>
      <Helmet>
        <title> Content Updater | iGOT Karmayogi </title>
      </Helmet>

      <ContentUpdaterView />
      
    </>
  );
}
