import axios from "axios";
import PropTypes from "prop-types";
import React, { useState } from "react";

import {
  Grid,
  Dialog,
  Button,
  TextField,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";

function UserNewPasswordDialog({
  isConfirmationEditOpen,
  setConfirmationEditOpen,
  email: initialEmail,
  id,
  fetchUsers,
}) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [errorshow, setError] = useState(null);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleEdit = async () => {
    try {
      const token = localStorage.getItem("token");

      // Send PUT request to update the user's email
      const emailResponse = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/user/users/${id}/password`,
        { email, password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (password) {
        // Send PUT request to update the user's password
        const passwordResponse = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/user/users/${id}/password`,
          { password },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Password updated successfully:", passwordResponse.data);
      }

      // Refresh users after successful edit
      fetchUsers();
      console.log("Email updated successfully:", emailResponse.data);
    } catch (error) {
      console.error("Error editing user:", error);
      setError(error.message);
    }

    setConfirmationEditOpen(false);
  };

  return (
    <Dialog
      open={isConfirmationEditOpen}
      onClose={() => setConfirmationEditOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Edit User</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={3}>
          <Grid item xs={12}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              name="email"
              value={email}
              onChange={handleEmailChange}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="New Password"
              variant="outlined"
              fullWidth
              name="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            {errorshow && (
              <Typography variant="body2" color="error">
                {errorshow}
              </Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setConfirmationEditOpen(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={handleEdit} color="primary">
          Change Password
        </Button>
      </DialogActions>
    </Dialog>
  );
}

UserNewPasswordDialog.propTypes = {
  setConfirmationEditOpen: PropTypes.func.isRequired,
  isConfirmationEditOpen: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  fetchUsers: PropTypes.func.isRequired,
};

export default UserNewPasswordDialog;
