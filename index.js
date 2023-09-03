const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const dbURI = 'mongodb+srv://jatin12:jatin123@problemset.09kx7.mongodb.net/Problem-set?retryWrites=true&w=majority'
const { removeStopwords } = require('stopword');
const Problem = require('./models/problem');
const path = require('path');

const problem_links = fs.readFileSync('./data/problems_links.txt', 'utf8').split('\n');
const idfvalues = fs.readFileSync('./data/idf_data.txt', 'utf8').split('\n');
const magnitude = fs.readFileSync('./data/magnitude.txt', 'utf8').split('\n');
const tfidf = fs.readFileSync('./data/tf_idf_data.txt', 'utf8').split('\n');
const all_keywords = fs.readFileSync('./data/keywords.txt', 'utf8').split('\n');
const map_keywords = new Map();

var ss = 1;

all_keywords.forEach((word) => {
    map_keywords.set(word, ss);
    ss++;
})
ss = map_keywords.size;

problems_arr = [];
const indexofprob = new Map();
const PORT = process.env.PORT || 3000;
const app = express();
mongoose.connect(dbURI)
    .then((result) => {
        
        Problem.find().then(problems => {
            
            problems.forEach((problem) => {
                problems_arr.push(problem);
            });
        }).then(() => {
            
            var index = 0;
            problems_arr.forEach((problem) => {
                indexofprob.set(problem.prob_id, index);
                index++;
            })

        }).then(() => app.listen(PORT)).then(() => console.log('connected')) })
    .catch((err) => console.log(err));

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});



app.get('/search', (req, res) => {
    res.render('search_engine');
});
app.get('/', (req, res) => {
    res.redirect('/search');
});
app.post('/search', (req, res) => {

    const query = req.body;
    const query_statement = query.search;
    const words = query_statement.toLowerCase().split(' ').join(',').split('\n').join(',').split('.').join(',').split('?').join(',').split('(').join(',').split(')').join(',').split('[').join(',').split(']').join(',').split(',');
    const keywords = removeStopwords(words, ['', '\n', '.', '?', '!', '(', '[', ']', '{', '}', '<', '>', '=', '+', '-', '*', '/', '%', '&', '|', '^', '~', '@', '#', '$', '`', '\'', '\"', '\\', '\'', '\"', '\'', 'hindi', 'bengali', 'mandarin', 'chinese', 'russian', 'vietnamese']);
    var arr = new Array(ss + 1);
    var total_keys = 0;
    for (var i = 0; i < ss + 1; i++) arr[i] = 0;
    keywords.forEach((word) => {
        if (map_keywords.has(word)) {
            total_keys++;
            arr[map_keywords.get(word)]++;
        }
    });
    for (var i = 1; i < ss + 1; i++) {
        arr[i] = (arr[i] / total_keys).toFixed(4);
    }
    for (var i = 1; i < ss + 1; i++) arr[i] = (arr[i] * idfvalues[i - 1]).toFixed(6);
    var mag_query = 0;
    for (var i = 1; i < ss + 1; i++) mag_query += arr[i] * arr[i];
    mag_query = Math.sqrt(mag_query).toFixed(6);
    if (total_keys == 0) {
        res.render('noresult', { query_statement: query_statement });
        
    }
    else {
        for (var i = 0; i < ss + 1; i++) arr[i] = (arr[i] / total_keys).toFixed(4);

        for (var i = 1; i < ss + 1; i++) arr[i] = (arr[i] * parseFloat(idfvalues[i])).toFixed(6);
        const similarity = new Map();
        var inde = 1;
        var sum = 0;
        tfidf.forEach((line) => {
            const arr_tfidf = line.split(' ');
            if (inde == parseInt(arr_tfidf[0])) {
                sum += parseFloat(arr_tfidf[2]) * arr[parseInt(arr_tfidf[1])];
            }
            else {
                if (magnitude[inde - 1] != 0) {
                    sum = sum / magnitude[inde - 1];
                }
                else sum = 0;
                if (mag_query != 0) {
                    sum = sum / mag_query;
                }
                else sum = 0;
                similarity.set(inde, sum);
                for (var j = inde + 1; j < parseInt(arr_tfidf[0]); j++) similarity.set(j, 0);
                sum = parseFloat(arr_tfidf[2]) * arr[parseInt(arr_tfidf[1])];
                inde = parseInt(arr_tfidf[0]);
            }
        })
        if (magnitude[inde - 1] != 0) {
            sum = sum / magnitude[inde - 1];
        }
        else sum = 0;
        if (mag_query != 0) {
            sum = sum / mag_query;
        }
        else sum = 0;
        similarity.set(inde, sum);
        const sorted_similarity = new Map([...similarity.entries()].sort((a, b) => b[1] - a[1]));
        const sorted_similarity_array = [];
        sorted_similarity.forEach((value, key) => {
            sorted_similarity_array.push(key);
        });
        const result_arr = [];
        for (var i = 0; i < 10; i++) {
            if(sorted_similarity.get(sorted_similarity_array[i])>0) result_arr.push(problems_arr[indexofprob.get(sorted_similarity_array[i])]);

        }

        res.render('search_result', { result_arr: result_arr, query_statement: query_statement });
    }
});


app.get('/search/:id', (req, res) => {
    const id = req.params.id;
    Problem.findById(id).then(problem => {
        const prob_index = problem.prob_id;
        const data = fs.readFileSync('./data/problem_statements1/prob_' + prob_index + '.txt', 'utf8').split('\n');
        res.render('prob_statement', { problem: problem, data: data });
    }).catch((err) => console.log(err));
});