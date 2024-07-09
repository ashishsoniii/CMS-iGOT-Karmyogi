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
  MenuItem,
} from "@mui/material";

function UserEditDialog({
  isConfirmationEditOpen,
  setConfirmationEditOpen,
  name: initialName,
  id,
  url: initialurl,
  fetchwebsites,
}) {
  const [userData, setUserData] = useState({
    name: initialName,
    url: initialurl,
  });

  const [errorshow, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleEdit = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/user/users/${id}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();
      console.log("User edited successfully:", response.data);
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
              label="Name"
              variant="outlined"
              fullWidth
              name="name"
              value={userData.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="url"
              variant="outlined"
              fullWidth
              name="url"
              value={userData.url}
              onChange={handleChange}
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
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

UserEditDialog.propTypes = {
  setConfirmationEditOpen: PropTypes.func.isRequired,
  isConfirmationEditOpen: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  fetchUsers: PropTypes.func.isRequired,
};

export default UserEditDialog;
