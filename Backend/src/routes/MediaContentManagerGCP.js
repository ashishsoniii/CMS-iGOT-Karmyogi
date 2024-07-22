const express = require("express");
const { Storage } = require("@google-cloud/storage");
const multer = require("multer");
const router = express.Router();

const storage = new Storage({ keyFilename: "./key.json" });
const mediaFolderName = "media_content"; // The main folder for media content

const upload = multer({ storage: multer.memoryStorage() });

// Route to create a subfolder within media_content
router.post("/media/folders/:bucketName", async (req, res) => {
  const { bucketName } = req.params;
  const { folderName } = req.body;
  const bucket = storage.bucket(bucketName);
  const folderPath = `${mediaFolderName}/${folderName}/`;

  try {
    // Check if the folder already exists
    const [existingFiles] = await bucket.getFiles({ prefix: folderPath, delimiter: '/' });
    if (existingFiles.length > 0) {
      return res.status(400).send("Folder already exists");
    }

    // Create an empty placeholder
    const file = bucket.file(`${folderPath}`);
    await file.save("", { resumable: false });
    res.status(200).send("Folder created successfully");
  } catch (err) {
    console.error("Error creating subfolder:", err);
    res.status(500).send(`Internal server error: ${err.message}`);
  }
});

// Route to upload media content to a specified subfolder
router.post("/media/upload/:bucketName/:folderName", upload.single("file"), async (req, res) => {
  const { bucketName, folderName } = req.params;
  const bucket = storage.bucket(bucketName);
  const folderPath = `${mediaFolderName}/${folderName}/`;

  const file = req.file; // This is set by multer
  const filePath = `${folderPath}${file.originalname}`;

  try {
    const gcsFile = bucket.file(filePath);
    await gcsFile.save(file.buffer, {
      contentType: file.mimetype,
    });
    res.status(200).send("Media content uploaded successfully");
  } catch (err) {
    console.error("Error uploading media content:", err);
    res.status(500).send(`Internal server error: ${err.message}`);
  }
});

// Route to fetch everything in media_content folder
router.get("/media/:bucketName", async (req, res) => {
  const { bucketName } = req.params;
  const bucket = storage.bucket(bucketName);
  const mediaFolder = `${mediaFolderName}/`;

  try {
    const [files] = await bucket.getFiles({ prefix: mediaFolder });

    const fileDetails = files.map((file) => ({
      name: file.name,
      size: file.metadata.size,
      contentType: file.metadata.contentType,
      updated: file.metadata.updated,
    }));

    res.status(200).json(fileDetails);
  } catch (err) {
    console.error("Error fetching media content:", err);
    res.status(500).send(`Internal server error: ${err.message}`);
  }
});

// Route to fetch all files and folders at a specified location
router.get("/media/list/:bucketName", async (req, res) => {
  const { bucketName } = req.params;
  const { location } = req.query; // Use query parameter to specify location
  const bucket = storage.bucket(bucketName);
  const folderPath = location ? `${location}/` : `${mediaFolderName}/`;

  try {
    const [files] = await bucket.getFiles({ prefix: folderPath, delimiter: '/' });

    const fileDetails = files.map((file) => ({
      name: file.name,
      size: file.metadata.size,
      contentType: file.metadata.contentType,
      updated: file.metadata.updated,
    }));

    res.status(200).json(fileDetails);
  } catch (err) {
    console.error("Error fetching files and folders:", err);
    res.status(500).send(`Internal server error: ${err.message}`);
  }
});

module.exports = router;
