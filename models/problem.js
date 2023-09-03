const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const prob_schema = new Schema({
    prob_id: Number,
    prob_title: String,
    prob_url: String,
    prob_keywords: Array,
});

const Problem = mongoose.model('Problem', prob_schema);

module.exports = Problem;