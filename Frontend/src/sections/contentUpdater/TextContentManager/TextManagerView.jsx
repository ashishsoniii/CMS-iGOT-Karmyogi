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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import JSONPretty from "react-json-prettify";

function MultilingualEditor() {
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [content, setContent] = useState({});
  const [selectedPageId, setSelectedPageId] = useState("page1"); // Updated to empty string initially
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showJsonDialog, setShowJsonDialog] = useState(false);
  const [pages, setPages] = useState([]);

  useEffect(() => {
    fetchPages();
    fetchLanguages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/web_gcp/folders`
      );
      setPages(response.data);
      setSelectedPageId(response.data[0] || ""); // Set default selected page
    } catch (error) {
      console.error("Error fetching pages:", error);
      setError("Failed to fetch pages. Please try again.");
    }
  };

  const fetchLanguages = async () => {
    try {
      // Simulated data until backend integration
      setLanguages(["en", "hi"]);
      setSelectedLanguage("en");
      // Initial fetch of content with default language
      fetchContent(selectedPageId, "en");
    } catch (error) {
      console.error("Error fetching languages:", error);
      setError("Failed to fetch languages. Please try again.");
    }
  };

  const fetchContent = async (pageId, lang) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/web_gcp/content/${pageId}`
      );
      setContent(response.data); // Assuming response.data structure matches content state expectation
    } catch (error) {
      console.error(`Error fetching content for ${lang}:`, error);
      setError(`Failed to fetch content for ${lang}. Please try again.`);
    }
  };

  const handleLanguageChange = (event) => {
    const lang = event.target.value;
    setSelectedLanguage(lang);
    fetchContent(selectedPageId, lang);
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

  const handlePageChange = (event) => {
    const pageId = event.target.value;
    setSelectedPageId(pageId);
    fetchContent(pageId, selectedLanguage);
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
        <Grid container spacing={3} p={5}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="page-select-label">Select Page</InputLabel>
              <Select
                labelId="page-select-label"
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
            <Grid p={2} item xs={12} key={field}>
              <Grid container spacing={2} alignItems="center">
                <Grid p={1} item xs={4}>
                  <Typography variant="h5" align="center">
                    {field}
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    label={`Enter ${field} in ${selectedLanguage}`}
                    value={content[field][selectedLanguage] || ""}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Grid container justifyContent="space-between" alignItems="center">
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
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={showJsonDialog} onClose={handleCloseJsonDialog} fullWidth>
        <DialogTitle>Current JSON Content</DialogTitle>
        <DialogContent>
          <JSONPretty json={content} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseJsonDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MultilingualEditor;
