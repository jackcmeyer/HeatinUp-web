/**
 * Created by Jack on 10/28/2016.
 */
var mongoose = require('mongoose');

var LocationSchema = new mongoose.Schema({
    username: String,
    latitude: Number,
    longitude: Number,
    time: String
});

mongoose.model('Location', LocationSchema);