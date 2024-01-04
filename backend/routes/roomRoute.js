const express = require('express');
const cors = require('cors');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const Room = require("../models/room");


// AWS SDK configuration
AWS.config.update({
  accessKeyId: 'AKIAROXXMSVZPDUXZRM5',
  secretAccessKey: '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',
  region: 'us-east-1',
});


router.get("/getallrooms", async (req, res) => {
  try {
    // Retrieve data from MongoDB
 
    const dbRooms = await Room.find();

    // Retrieve data from local JSON file
    const localFilePath = path.join(__dirname, '..', '..', 'mongodb_collections', 'rooms.json');

    const localJsonData = await fs.readFile(localFilePath, 'utf8');
    const localRooms = JSON.parse(localJsonData);

    // Combine and send data
    const allRooms = [...(dbRooms || []), ...localRooms];
    res.json(allRooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// router.get("/getallrooms", async (req, res) => {
//   console.log("hamza")

//   try {
//     const rooms = await Room.find({});
//     res.send(rooms);
//   } catch (error) {
//     return res.status(400).json({ message: error });
//   }
// });

router.post("/getroombyid", async (req, res) => {
  try {
    const roomid = req.body.roomid;
    const room = await Room.findOne({ _id: roomid });
    res.send(room);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/getallrooms", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.send(rooms);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});
const s3 = new AWS.S3();

// Multer configuration for image uploads to S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'webappp', 
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname);
    },
  }),
});

// Route for adding a room with image upload
router.post("/addroom", upload.array('images', 1), async (req, res) => {
  
  console.log("here111")

  try {
    const newRoom = req.body;
    const room = new Room();

    room.name = newRoom.name;
    room.maxcount = newRoom.maxcount;
    room.phonenumber = newRoom.phonenumber;
    room.rentperday = newRoom.rentperday;
    room.type = newRoom.type;
    room.description = newRoom.description;
    room.currentbookings = [];

    // Update to use the uploaded file URLs
    if (req.files && req.files.length > 0) {
      room.imageurls = req.files.map(file => file.location);
    }

    const result = await room.save();
    res.send(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;

