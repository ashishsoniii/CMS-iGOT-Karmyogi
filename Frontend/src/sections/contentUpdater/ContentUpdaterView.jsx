import React, { useState, useEffect } from "react";
import axios from "axios";
import WebsiteSelector from "./WebsiteSelector";
import { Container, Box, Typography, Paper } from "@mui/material";

function ContentUpdaterView() {
  const [websites, setWebsites] = useState([]);
  const [selectedWebsite, setSelectedWebsite] = useState("");

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/website`
        );
        setWebsites(response.data);
        if (response.data.length > 0) {
          setSelectedWebsite(response.data[0].url);
        }
      } catch (error) {
        console.error("Error fetching websites:", error);
      }
    };

    fetchWebsites();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Content Updater
        </Typography>
        <WebsiteSelector
          websites={websites}
          selectedWebsite={selectedWebsite}
          setSelectedWebsite={setSelectedWebsite}
        />
        <Box mt={1} textAlign="center">
          <Typography variant="h6" gutterBottom>
            Selected Website
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {selectedWebsite}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default ContentUpdaterView;
