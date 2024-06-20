import axios from "axios";
import { useState } from "react";
import PropTypes from "prop-types";

import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import TableRow from "@mui/material/TableRow";
import MenuItem from "@mui/material/MenuItem";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import { Icon } from "@iconify/react";

import UserEditDialog from "./user-edit-dialog";
import { Box } from "@mui/material";
import UserNewPasswordDialog from "./user-new-password-dialog";

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  id,
  name,
  user,
  fetchUsers,
  avatarUrl,
}) {
  const [open, setOpen] = useState(null);
  const [isConfirmationDeleteOpen, setConfirmationOpen] = useState(false);
  const [isGenerateNewPasswordOpen, setGenerateNewPasswordOpen] =
    useState(false);
  const [isConfirmationActivateOpen, setConfirmationActivateOpen] =
    useState(false);
  const [isConfirmationEditOpen, setConfirmationEditOpen] = useState(false);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleDelete = async () => {
    setConfirmationOpen(false); // Close the confirmation dialog
    try {
      const token = localStorage.getItem("token");

      // Send DELETE request to delete the user
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/user/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh users after successful deletion
      fetchUsers();
      console.log("User deleted successfully:", response.data);
    } catch (error) {
      console.error("Error deleting user:", error);
    }

    setOpen(null);
  };

  const handleActivate = async () => {
    setConfirmationActivateOpen(false);
    try {
      setOpen(null);
      const token = localStorage.getItem("token");
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/user/users/${id}/activate`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers();

      console.log("User activated successfully:", response.data);
    } catch (error) {
      console.error("Error activating user:", error);
    }
  };

  const handleDeactivate = async () => {
    setConfirmationActivateOpen(false);
    try {
      setOpen(null);
      const token = localStorage.getItem("token");
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/user/users/${id}/deactivate`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers();

      console.log("User deactivated successfully:", response.data);
    } catch (error) {
      console.error("Error deactivating user:", error);
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} selected={selected}>
        <TableCell component="th" scope="row">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {user.name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{user.email}</TableCell>
        <TableCell>{user.phone}</TableCell>
        <TableCell>{user.role}</TableCell>
        <TableCell>
          {new Date(user.createdAt).toISOString().slice(0, 10).split("T")[0]}
        </TableCell>
        <TableCell>
          {new Date(user.updatedAt).toISOString().slice(0, 10).split("T")[0]}
        </TableCell>

        <TableCell>
          <p style={{ color: user.status === "active" ? "green" : "red" }}>
            {user.status === "active" ? "Active" : "Disabled"}
          </p>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Box
              component={Icon}
              className="component-iconify"
              icon={"eva:more-vertical-fill"}
              sx={{ width: 20, height: 20 }}
            />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            setOpen(null);
            setConfirmationEditOpen(true);
          }}
        >
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => setConfirmationOpen(true)}
          sx={{ color: "error.main" }}
        >
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => setGenerateNewPasswordOpen(true)}
          sx={{ color: "primary.main" }}
        >
          Generate New Password
        </MenuItem>

        {user.status === "active" ? (
          <MenuItem onClick={() => setConfirmationActivateOpen(true)}>
            Deactivate
          </MenuItem>
        ) : (
          <MenuItem onClick={() => setConfirmationActivateOpen(true)}>
            Activate
          </MenuItem>
        )}
      </Popover>

      {/* Confirmation Dialog */}
      <Dialog
        open={isConfirmationDeleteOpen}
        onClose={() => setConfirmationOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete {user.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={isConfirmationActivateOpen}
        setOpen={setConfirmationActivateOpen}
        title={
          user.status === "active"
            ? "Confirm Deactivation"
            : "Confirm Activation"
        }
        content={`Are you sure you want to ${
          user.status === "active" ? "deactivate" : "activate"
        } ${user.name}?`}
        onConfirm={user.status === "active" ? handleDeactivate : handleActivate}
      />
      {/* Edit Dialog */}
      <UserEditDialog
        id={user._id}
        isConfirmationEditOpen={isConfirmationEditOpen}
        setConfirmationEditOpen={setConfirmationEditOpen}
        name={user.name}
        email={user.email}
        phone={user.phone}
        role={user.role}
        fetchUsers={fetchUsers}
      />

      {/* New Password Dialog */}
      <UserNewPasswordDialog
        id={user._id}
        isConfirmationEditOpen={isGenerateNewPasswordOpen}
        setConfirmationEditOpen={setGenerateNewPasswordOpen}
        email={user.email}
        fetchUsers={fetchUsers}
      />
    </>
  );
}

UserTableRow.propTypes = {
  id: PropTypes.any,
  user: PropTypes.any,
  fetchUsers: PropTypes.any,
  setcurentUser: PropTypes.any,
  currentDataRow: PropTypes.any,
};

function ConfirmationDialog({ open, setOpen, title, content, onConfirm }) {
  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">{content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="error">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
