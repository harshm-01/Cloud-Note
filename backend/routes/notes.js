const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error Occured");
  }
});

router.post(
  "/addnotes",
  fetchuser,
  [
    body("title", "Title must be at least 3 characters").isLength({ min: 3 }),
    body("description", "Description should be minimum 5 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const { title, description, tag } = req.body;

    //Handling Errors
    const error = validationResult(req);
    if (!error.isEmpty()) {
      // console.log("Bad Request");
      return res.status(400).json({ error: error.array() });
    }

    try {
      const note = new Notes({
        title: title,
        description: description,
        tag: tag,
        user: req.user.id,
      });

      const savedNotes = await note.save();

      res.json(savedNotes);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error Occured");
    }
  }
);

router.put("/updatenotes/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;

  try {
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    let notes = await Notes.findById(req.params.id);
    if (!notes) {
      return res.status(404).send("Not Found");
    }

    if (notes.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    console.log(req.user.id, req.user);

    notes = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ notes });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error Occured");
  }
});

router.delete("/deletenotes/:id", fetchuser, async (req, res) => {
  try {
    let notes = await Notes.findById(req.params.id);
    if (!notes) {
      return res.status(404).send("Not Found");
    }

    if (notes.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    console.log(req.user.id, req.user);

    notes = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "Notes has been deleted", notes: notes });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error Occured");
  }
});

module.exports = router;
