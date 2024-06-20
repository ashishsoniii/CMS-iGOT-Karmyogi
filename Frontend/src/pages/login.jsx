import { Helmet } from 'react-helmet-async';

import { LoginView } from '../sections/login/LoginView.jsx';

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Login | iGOT CMS </title>
      </Helmet>

      <LoginView />
    </>
  );
}
