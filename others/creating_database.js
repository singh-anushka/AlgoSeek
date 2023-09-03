const fs= require('fs');
const { removeStopwords } = require('stopword');
const dbURI = 'mongodb+srv://jatin12:jatin123@problemset.09kx7.mongodb.net/Problem-set?retryWrites=true&w=majority'
const mongoose = require('mongoose');
const Problem = require('./models/problem');

mongoose.connect(dbURI).then((result) => {console.log('connected to database')}).catch((err) => {console.log(err)});
const prob_titles = fs.readFileSync('./data/problems_titles.txt', 'utf8').split('\n');
const prob_links = fs.readFileSync('./data/problems_links.txt', 'utf8').split('\n');
const tf_idf = fs.readFileSync('./data/tf_idf_data.txt', 'utf8').split('\n');
for(var i=1;  i<=1520; i++){
    var prob_title = prob_titles[i-1];
    var prob_link = prob_links[i-1];
    var prob_id = i;
    var prob_tf_idf = tf_idf[i-1];
    const prob = new Problem({
        prob_id: prob_id,
        prob_title: prob_title,
        prob_url: prob_link,
        prob_keywords: prob_tf_idf
    });
    prob.save().then((result) => {console.log('saved' + i)}).catch((err) => {console.log(err)});
}
