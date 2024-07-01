import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import Avatar from "@mui/material/Avatar";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import ListItemButton from "@mui/material/ListItemButton";
import Link from "@mui/material/Link";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import { usePathname } from "../../routes/hooks";
import { RouterLink } from "../../routes/components";

import navConfig from "./config-navigation";
import logoImage from "../../assets/profile.jpg";
import logo3 from "../../assets/igot_complete.svg";

// layout constants
const NAV_WIDTH_LARGE = 280;
const NAV_WIDTH_MOBILE = 230;

// ----------------------------------------------------------------------
export default function Nav({ openNav, onCloseNav,userData }) {
  const theme = useTheme();
  const pathname = usePathname();

  const upLg = useMediaQuery(theme.breakpoints.up("lg"));

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  const renderAccount = userData ? (
    <Box
      sx={{
        my: 3,
        mx: 2.5,
        py: 2,
        px: 2.5,
        display: "flex",
        borderRadius: 1.5,
        alignItems: "center",
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
      }}
    >
      <Avatar src={logoImage} alt="photoURL" />

      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2">{userData.name}</Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {userData.role}
        </Typography>
      </Box>
    </Box>
  ) : null;

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {navConfig.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
    </Stack>
  );

  const renderContent = (
    <>
      <Box sx={{ mt: 3, mb: 2, mx: 4 }}>
        {/* NavLogo */}
        <Link component={RouterLink} href="/" sx={{ display: "contents" }}>
          <Box
            component="div"
            sx={{
              width: 40,
              height: 40,
              display: "inline-flex",
            }}
          >
            <img src={logo3} alt="igot" style={{ cursor: "pointer" }} />
          </Box>{" "}
        </Link>
      </Box>

      {renderAccount}

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />
    </>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH_LARGE, xs: NAV_WIDTH_MOBILE },
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: "fixed",
            width: NAV_WIDTH_LARGE,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer open={openNav} onClose={onCloseNav}>
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
  userData: PropTypes.any,
};

// ----------------------------------------------------------------------

function NavItem({ item }) {
  const pathname = usePathname();

  const active = item.path === pathname;

  return (
    <ListItemButton
      component={RouterLink}
      href={item.path}
      sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: "body2",
        color: "text.secondary",
        textTransform: "capitalize",
        fontWeight: "fontWeightMedium",
        ...(active && {
          color: "primary.main",
          fontWeight: "fontWeightSemiBold",
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          "&:hover": {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
          },
        }),
      }}
    >
      <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
        <img
          src={`/navbar/${item.icon}.svg`}
          style={{
            width: 24,
            height: 24,
            display: "inline-block",
          }}
          alt={`${item.icon} icon`}
        />
      </Box>

      <Box component="span">{item.title}</Box>
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};
