const Location = require("../models/Location");

// GET all locations
exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE new location
exports.createLocation = async (req, res) => {
  const { name, category, description, lat, lng } = req.body;
  
  try {
    const newLocation = new Location({
      name,
      category,
      description,
      location: { type: "Point", coordinates: [lng, lat] },
    });
    
    await newLocation.save();
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateLocation = async (req, res) => {
  const { name, category, description, lat, lng } = req.body;
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ message: "Location not found" });

    location.name = name || location.name;
    location.category = category || location.category;
    location.description = description || location.description;
    if (lat && lng) location.location.coordinates = [lng, lat];

    await location.save();
    res.json(location);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) return res.status(404).json({ message: "Location not found" });
    res.json({ message: "Location deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
