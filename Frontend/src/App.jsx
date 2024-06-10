import "./App.css";
import Router from './routes/sections';

import useAuth from './routes/hooks/use-auth';

function App() {
  useAuth();

  return (
    <>
      {/* <h1> iGOT KarmaYogi </h1> */}
      <Router />

    </>
  );
}

export default App;
