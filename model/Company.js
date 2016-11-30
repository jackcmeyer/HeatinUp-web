/**
 * Created by jack on 11/30/16.
 */

var mongoose = require('mongoose');

var CompanySchema = new mongoose.Schema({
    owner: String,
    name: String,
    members: []
});

mongoose.model('Company', CompanySchema);