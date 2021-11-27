const mongoose = require('mongoose');

const langSchema = new mongoose.Schema({});

const Lang = mongoose.model('languages', langSchema);

module.exports = Lang;