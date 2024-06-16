import { useState } from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

const MENU_OPTIONS = [
  {
    label: "Home",
  },
  {
    label: "Profile",
  },
  {
    label: "Settings",
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover({ userData }) {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleLogout = (event) => {
    localStorage.removeItem("token");
    window.location.reload();
    setOpen(null);
  };

  const handleClose = () => {
    setOpen(null);
  };

  if (!userData) {
    return null; // Render nothing if userData is null or undefined
  }

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: "rgba(0, 0, 0, 0.08)",
        }}
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
            border: "solid 2px #ffffff",
          }}
        >
          {userData.name.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {userData.name}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {userData.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem key={option.label} onClick={handleClose}>
            {option.label}
          </MenuItem>
        ))}

        <Divider sx={{ borderStyle: "dashed", m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleLogout}
          sx={{ typography: "body2", color: "red", py: 1.5 }}
        >
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}

AccountPopover.propTypes = {
  userData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }),
};
