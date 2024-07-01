import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";

import Nav from "./nav";
import Main from "./main";
import Header from "./header";

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const [openNav, setOpenNav] = useState(false);
  const [userData, setUserData] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const tokenParts = token.split(".");
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        setUserData(payload); // Store user data in state
      }
    }
  }, []);


  return (
    <>
      <Header userData={userData} onOpenNav={() => setOpenNav(true)} />

      <Box
        sx={{
          minHeight: 1,
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
        }}
      >
        <Nav userData={userData} openNav={openNav} onCloseNav={() => setOpenNav(false)} />

        <Main>{children}</Main>
      </Box>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
