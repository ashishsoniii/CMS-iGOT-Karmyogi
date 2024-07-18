import React, { useState } from "react";
import { TextField, Button, Grid, Box, Typography, Paper } from "@mui/material";

function AddNewPage({ handleCreateNewPage }) {
  const [newPageId, setNewPageId] = useState("");
  const [initialContent, setInitialContent] = useState(`
    {
      "default_do_not_delete": {
        "en": "new_title",
        "hi": "नया शीर्षक",
        "bn": "নতুন শিরোনাম",
        "te": "కొత్త శీర్షిక",
        "mr": "नवीन शीर्षक",
        "ta": "புதிய தலைப்பு",
        "ur": "نیا عنوان",
        "gu": "નવું શીર્ષક",
        "kn": "ಹೊಸ ಶೀರ್ಷಿಕೆ",
        "or": "ନୂତନ ଶୀର୍ଷକ",
        "ml": "പുതിയ തലക്കെട്ട്",
        "pa": "ਨਵਾਂ ਸਿਰਲੇਖ",
        "as": "নতুন শিৰোনাম"
      }
    }
  `);

  const handleNewPageChange = (event) => {
    setNewPageId(event.target.value);
  };

  const handleInitialContentChange = (event) => {
    setInitialContent(event.target.value);
  };

  const handleCreatePage = () => {
    handleCreateNewPage(newPageId, initialContent);
  };

  return (
    <Paper sx={{ p: 4, my: 5, borderRadius: 8, width: "100%" }}>
      <Box>
        <Typography variant="h5" gutterBottom>
          Add New Page
        </Typography>
      </Box>
      <Grid item xs={12}>
        <Box display="flex" alignItems="center">
          <TextField
            label="New Page ID"
            value={newPageId}
            onChange={handleNewPageChange}
            fullWidth
            variant="outlined"
          />
          {/* <TextField
            label="Initial Content"
            value={initialContent}
            onChange={handleInitialContentChange}
            fullWidth
            variant="outlined"
            style={{ marginLeft: "10px" }}
          /> */}
          <Button
            onClick={handleCreatePage}
            variant="contained"
            color="primary"
            style={{ marginLeft: "10px" }}
          >
            Create Page
          </Button>
        </Box>
      </Grid>
    </Paper>
  );
}

export default AddNewPage;
