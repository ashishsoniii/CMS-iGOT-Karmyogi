const express = require("express");
const { Storage } = require("@google-cloud/storage");
const Page = require("../models/Page");
const router = express.Router();

const storage = new Storage({ keyFilename: "./key.json" });
const bucketName = "igot_karmayogi"; // Replace with your GCS bucket name
const folderName = "website_text_content"; // Replace with your folder name in GCS

const bucket = storage.bucket(bucketName);

// Route to fetch folder names and subfolders/files for a specific folder
router.get("/folders", async (req, res) => {
  try {
    const options = {
      prefix: `website_text_content/`,
      delimiter: "./"
    };

    // List files and subdirectories in the specified folder
    const [files] = await bucket.getFiles(options);

    const pages = {};

    files.forEach(file => {
      // Extract page names from file paths
      const pathComponents = file.name.split("/");
      if (pathComponents.length > 2) {
        const pageId = pathComponents[1]; // Assuming page ID is the third component
        pages[pageId] = true; // Use object to ensure unique page IDs
      }
    });

    res.status(200).json(Object.keys(pages));
  } catch (err) {
    console.error("Error fetching pages:", err);
    res.status(500).send("Internal server error");
  }
});

router.post("/content/:pageId", async (req, res) => {
  const { pageId } = req.params;
  const newContent = req.body;

  try {
    // Find page metadata in MongoDB
    let pageMetadata = await Page.findOne({ page_id: pageId });

    // If page metadata doesn't exist, create new metadata entry
    if (!pageMetadata) {
      const file_path = `${folderName}/${pageId}/${pageId}.json`; // GCS file path
      pageMetadata = new Page({ page_id: pageId, file_path: file_path });
      await pageMetadata.save();
    }

    // Get file reference in GCS
    const file = bucket.file(pageMetadata.file_path);

    // Prepare content to upload (replace existing content)
    const content = JSON.stringify(newContent);

    // Upload content to GCS
    await file.save(content);

    // Update last_updated timestamp in MongoDB
    pageMetadata.last_updated = Date.now();
    await pageMetadata.save();

    res.status(200).send("Content updated successfully");
  } catch (err) {
    console.error("Error updating content:", err);
    res.status(500).send("Internal server error");
  }
});

router.get("/content/:pageId", async (req, res) => {
  const { pageId } = req.params;

  try {
    // Find page metadata in MongoDB
    const pageMetadata = await Page.findOne({ page_id: pageId });

    if (!pageMetadata) {
      return res.status(404).send("Page metadata not found");
    }

    // Get file reference in GCS
    const file = bucket.file(pageMetadata.file_path);

    // Download content from GCS
    const [content] = await file.download();

    res.status(200).json(JSON.parse(content.toString()));
  } catch (err) {
    console.error("Error fetching content:", err);
    res.status(500).send("Internal server error");
  }
});

router.post("/folders", async (req, res) => {
  const { pageId, initialContent } = req.body;

  try {
    const file_path = `${folderName}/${pageId}/${pageId}.json`;
    const pageMetadata = new Page({ page_id: pageId, file_path: file_path });
    await pageMetadata.save();

    const file = bucket.file(file_path);
    const content = JSON.stringify(initialContent);
    await file.save(content);

    res.status(200).send("Folder and page created successfully");
  } catch (err) {
    console.error("Error creating folder/page:", err);
    res.status(500).send("Internal server error");
  }
});


module.exports = router;
