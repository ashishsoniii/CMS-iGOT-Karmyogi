import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

function PageSelect({ pages, selectedPageId, handlePageChange }) {
  return (
    <FormControl fullWidth>
      <InputLabel id="page-select-label">Select Page</InputLabel>
      <Select
        label="Select Page"
        id="page-select"
        value={selectedPageId}
        onChange={handlePageChange}
      >
        {pages.map((page) => (
          <MenuItem key={page} value={page}>
            {page}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default PageSelect;
