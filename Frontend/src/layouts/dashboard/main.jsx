import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// layout constants
const HEADER_MOBILE_HEIGHT = 56;
const HEADER_DESKTOP_HEIGHT = 64;
const NAV_WIDTH = 280;
const SPACING = 8;

// ----------------------------------------------------------------------

export default function Main({ children, sx, ...other }) {
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: 1,
        display: "flex",
        flexDirection: "column",
        py: `${HEADER_MOBILE_HEIGHT + SPACING}px`,
        ...(lgUp && {
          px: 2,
          py: `${HEADER_DESKTOP_HEIGHT + SPACING}px`,
          width: `calc(100% - ${NAV_WIDTH}px)`,
        }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}

Main.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
};
