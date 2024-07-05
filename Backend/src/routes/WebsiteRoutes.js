const express = require('express');
const mongoose = require('mongoose');
const Website = require('../models/Website');

const router = express.Router();

// Create a new website
router.post('/', async (req, res) => {
    const { name, url } = req.body;
    try {
      const website = new Website({ name, url });
      await website.save();
      res.status(201).json(website);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Get all websites
  router.get('/', async (req, res) => {
    try {
      const websites = await Website.find();
      res.status(200).json(websites);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Get a single website by ID
  router.get('/:id', async (req, res) => {
    try {
      const website = await Website.findById(req.params.id);
      if (!website) return res.status(404).json({ message: 'Website not found' });
      res.status(200).json(website);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Update a website by ID
  router.put('/:id', async (req, res) => {
    try {
      const website = await Website.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!website) return res.status(404).json({ message: 'Website not found' });
      res.status(200).json(website);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Delete a website by ID
  router.delete('/:id', async (req, res) => {
    try {
      const website = await Website.findByIdAndDelete(req.params.id);
      if (!website) return res.status(404).json({ message: 'Website not found' });
      res.status(200).json({ message: 'Website deleted' });
    } catch (error) {
      res.status (500).json({ message: 'Server error' });
    }
  });
  
  module.exports = router;
  