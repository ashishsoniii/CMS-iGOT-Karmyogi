import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Icon } from "@iconify/react";

import AccountPopover from "./account-popover.jsx";

// layout constants
const HEADER_MOBILE_HEIGHT = 56;
const HEADER_DESKTOP_HEIGHT = 64;
const NAV_WIDTH = 280;

// ----------------------------------------------------------------------

export default function Header({ onOpenNav,userData }) {
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));

  const renderContent = (
    <>
      {!lgUp && (
        <IconButton onClick={onOpenNav} sx={{ mr: 1, color: "black" }}>
          <Box
            component={Icon}
            className="component-iconify"
            icon="eva:menu-2-fill"
            sx={{ width: 20, height: 20 }}
          />
        </IconButton>
      )}

      <Box sx={{ flexGrow: 1 }} />

      <Stack direction="row" alignItems="center" spacing={1}>
        {/* <LanguagePopover /> */}
        {/* <NotificationsPopover /> */}
        <AccountPopover userData={userData} />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        boxShadow: "none",
        height: lgUp ? HEADER_DESKTOP_HEIGHT : HEADER_MOBILE_HEIGHT,
        backgroundColor: "#FCE5CC",
        zIndex: 1,
        transition: "height 0.3s",
        ...(lgUp && {
          width: `calc(100% - ${NAV_WIDTH + 1}px)`,
        }),
      }}
    >
      <Toolbar sx={{ height: 1, px: { lg: 5 } }}>{renderContent}</Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
  userData: PropTypes.any,
};
