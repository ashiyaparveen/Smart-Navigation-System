const express = require("express");
const router = express.Router();
const {
  getLocations,
  addLocation,
  deleteLocation
} = require("../controllers/locationController");

router.get("/", getLocations);

module.exports = router;