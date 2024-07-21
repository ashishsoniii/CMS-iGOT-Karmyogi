import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
} from "@mui/material";
import JSONPretty from "react-json-prettify";

function Dialogs({
  showJsonDialog,
  handleCloseJsonDialog,
  content,
  showComparisonDialog,
  handleCloseComparisonDialog,
  originalContent,
  differences,
  getHighlightedText,
}) {
  return (
    <>
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
                    <pre>
                      {getHighlightedText(
                        JSON.stringify(originalContent[key] || '', null, 2),
                        JSON.stringify(content[key] || '', null, 2)
                      )}
                    </pre>
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
    </>
  );
}

export default Dialogs;
