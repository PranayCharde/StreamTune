const musicModel = require("../models/music.model");
const jwt = require("jsonwebtoken");
const { uploadfile } = require("../service/storage.service");
const { data } = require("react-router-dom");

async function createMusic(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check role
    if (decoded.role !== "artist") {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    // Get uploaded file
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    // Upload file
    const result = await uploadfile(
      file.buffer.toString("base64")
    );

    // Get title
    const { title } = req.body;

    // Save music
    const music = await musicModel.create({
      uri: result.url,
      title,
      artist: decoded.id,
    });

    return res.status(201).json({
      message: "Music created successfully",
      music: {
        id: music._id,
        uri: music.uri,
        title: music.title,
        artist: music.artist,
      },
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: err.message,
    });
  }
}

async function getAllMusic(req , res){
  try {
    const music = await musicModel.find().populate('artist', 'name');
    return res.status(200).json({
      message: "Music retrieved successfully",
      data: music
      // .map(m => ({
      //   id: m._id,
      //   uri: m.uri,
      //   title: m.title,
      //   artist: m.artist.name,
      // })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = { createMusic, getAllMusic };