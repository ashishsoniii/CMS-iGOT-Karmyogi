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
import { diffChars } from "diff"; // import diffChars from 'diff' package

function TextManagerView() {
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [content, setContent] = useState({});
  const [originalContent, setOriginalContent] = useState({});
  const [selectedPageId, setSelectedPageId] = useState("page1");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showJsonDialog, setShowJsonDialog] = useState(false);
  const [showComparisonDialog, setShowComparisonDialog] = useState(false);
  const [pages, setPages] = useState([]);

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    if (selectedPageId) {
      fetchContent(selectedPageId);
    }
  }, [selectedPageId]);

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

      // Extract available languages from the first field of the JSON content
      const firstField = Object.keys(contentData)[0];
      const availableLanguages = Object.keys(contentData[firstField]);
      setLanguages(availableLanguages);
      setSelectedLanguage(availableLanguages[0]); // Set default selected language

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
      setOriginalContent(content); // Update original content after successful submission
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
      const style = part.added ? { backgroundColor: 'lightgreen' } : part.removed ? { backgroundColor: 'lightcoral' } : {};
      return <span key={index} style={style}>{part.value}</span>;
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

      <Dialog
        open={showComparisonDialog}
        onClose={handleCloseComparisonDialog}
        fullWidth
      >
        <DialogTitle>Changes</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Differences between original and updated content:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h6">Original Content</Typography>
              <div>
                {Object.keys(originalContent).map((key) => (
                  <div key={key}>
                    <Typography variant="subtitle1">{key}:</Typography>
                    <pre>{JSON.stringify(originalContent[key], null, 2)}</pre>
                  </div>
                ))}
              </div>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6">Updated Content</Typography>
              <div>
                {Object.keys(content).map((key) => (
                  <div key={key}>
                    <Typography variant="subtitle1">{key}:</Typography>
                    <pre>{getHighlightedText(JSON.stringify(originalContent[key], null, 2), JSON.stringify(content[key], null, 2))}</pre>
                  </div>
                ))}
              </div>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseComparisonDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TextManagerView;
