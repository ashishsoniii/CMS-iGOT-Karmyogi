import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

function AddNewPage({ handleCreateNewPage, open, onClose }) {
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
        "as": "নতুন শিৰোনाम"
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
    setNewPageId(""); // Clear the input after creation
    setInitialContent(`{
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
        "as": "নতুন শিৰोनામ"
      }
    }`); // Reset initial content
    onClose(); // Close the dialog after creation
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Page</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item m={4} xs={12}>
            <TextField
              label="New Page ID"
              value={newPageId}
              onChange={handleNewPageChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          {/* <Grid item xs={12}>
            <TextField
              label="Initial Content"
              value={initialContent}
              onChange={handleInitialContentChange}
              fullWidth
              variant="outlined"
              multiline
              rows={4}
            />
          </Grid> */}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleCreatePage} color="primary">
          Create Page
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddNewPage;
