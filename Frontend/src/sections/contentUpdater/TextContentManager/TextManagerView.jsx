import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Snackbar,
  Box,
  IconButton,
} from "@mui/material";
// import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import PageSelect from "./PageSelect";
import Dialogs from "./Dialogs";
import { diffChars } from "diff";
import delete_icon from "/public/icons/delete.png";

function TextManagerView() {
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [content, setContent] = useState({});
  const [originalContent, setOriginalContent] = useState({});
  const [selectedPageId, setSelectedPageId] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showJsonDialog, setShowJsonDialog] = useState(false);
  const [showComparisonDialog, setShowComparisonDialog] = useState(false);
  const [pages, setPages] = useState([]);
  const [newFieldName, setNewFieldName] = useState("");

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/web_gcp/folders`);
      setPages(response.data);
      setSelectedPageId(response.data[0] || "");
    } catch (error) {
      console.error("Error fetching pages:", error);
      setError("Failed to fetch pages. Please try again.");
    }
  };

  const fetchContent = async (pageId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/web_gcp/content/${pageId}`
      );
      const contentData = response.data;
      setContent(contentData);
      setOriginalContent(contentData);

      const firstField = Object.keys(contentData)[0];
      const availableLanguages = Object.keys(contentData[firstField]);
      setLanguages(availableLanguages);
      setSelectedLanguage(availableLanguages[0]);
    } catch (error) {
      console.error("Error fetching content:", error);
      setError("Failed to fetch content. Please try again.");
    }
  };

  const handleLanguageChange = (event) => {
    const lang = event.target.value;
    setSelectedLanguage(lang);
  };

  const handleFieldChange = (fieldName, value) => {
    setContent({
      ...content,
      [fieldName]: {
        ...content[fieldName],
        [selectedLanguage]: value,
      },
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `http://localhost:3001/web_gcp/content/${selectedPageId}`,
        content
      );
      setSuccessMessage("Content updated successfully!");
      setOriginalContent(content);
    } catch (error) {
      console.error("Error updating content:", error);
      setError("Failed to update content. Please try again.");
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccessMessage("");
  };

  const handleShowJson = () => {
    setShowJsonDialog(true);
  };

  const handleCloseJsonDialog = () => {
    setShowJsonDialog(false);
  };

  const handleShowComparison = () => {
    setShowComparisonDialog(true);
  };

  const handleCloseComparisonDialog = () => {
    setShowComparisonDialog(false);
  };

  const handlePageChange = (event) => {
    const pageId = event.target.value;
    setSelectedPageId(pageId);
    setContent({});
    setOriginalContent({});
    setLanguages([]);
    setSelectedLanguage("");
  };

  const handleNewFieldChange = (event) => {
    setNewFieldName(event.target.value);
  };

  const handleAddNewField = () => {
    if (newFieldName.trim() === "") return;

    const updatedContent = {
      ...content,
      [newFieldName]: languages.reduce((acc, lang) => {
        acc[lang] = "insert_value";
        return acc;
      }, {}),
    };

    setContent(updatedContent);
    setNewFieldName("");
  };

  const handleDeleteField = (fieldName) => {
    const updatedContent = { ...content };
    delete updatedContent[fieldName];
    setContent(updatedContent);
  };

  const getDifferences = (original, updated) => {
    const differences = {};
    for (const key in updated) {
      if (JSON.stringify(updated[key]) !== JSON.stringify(original[key])) {
        differences[key] = updated[key];
      }
    }
    return differences;
  };

  const differences = getDifferences(originalContent, content);

  const getHighlightedText = (original, updated) => {
    const diff = diffChars(original, updated);
    return diff.map((part, index) => {
      const style = part.added
        ? { backgroundColor: "lightgreen" }
        : part.removed
        ? { backgroundColor: "lightcoral" }
        : {};
      return (
        <span key={index} style={style}>
          {part.value}
        </span>
      );
    });
  };

  return (
    <div>
      <Snackbar
        open={!!error || !!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error || successMessage}
      />
      <Paper>
        <Box p={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <PageSelect
                pages={pages}
                selectedPageId={selectedPageId}
                handlePageChange={handlePageChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => fetchContent(selectedPageId)}
                disabled={!selectedPageId}
              >
                Fetch Content
              </Button>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="language-select-label">
                  Select Language
                </InputLabel>
                <Select
                  labelId="language-select-label"
                  id="language-select"
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                >
                  {languages.map((lang) => (
                    <MenuItem key={lang} value={lang}>
                      {lang}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {Object.keys(content).map((field) => (
              <Grid item xs={12} key={field}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <Typography variant="h6" align="center">
                      {field}
                    </Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <TextField
                      label={`Enter ${field} in ${selectedLanguage}`}
                      value={content[field][selectedLanguage] || ""}
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton
                      onClick={() => handleDeleteField(field)}
                      color="secondary"
                    >
                      {/* <DeleteIcon /> */}
                      <img width={25} src={delete_icon} />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleShowJson}
                >
                  Show JSON
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleShowComparison}
                >
                  Show Changes
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="New Field Name"
                value={newFieldName}
                onChange={handleNewFieldChange}
                variant="outlined"
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddNewField}
                disabled={!newFieldName.trim()}
                sx={{ mt: 2 }}
              >
                Add New Field
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Dialogs
        showJsonDialog={showJsonDialog}
        handleCloseJsonDialog={handleCloseJsonDialog}
        content={content}
        showComparisonDialog={showComparisonDialog}
        handleCloseComparisonDialog={handleCloseComparisonDialog}
        originalContent={originalContent}
        differences={differences}
        getHighlightedText={getHighlightedText}
      />
    </div>
  );
}

export default TextManagerView;
