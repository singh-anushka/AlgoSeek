const { removeStopwords } = require('stopword');
const fs = require('fs');
const { finished } = require('stream');

var all_keywords_set = new Set();
var inde = 1;
var average_length = 0;
for(var i=1; i<=1520;i++){
    const document = fs.readFileSync('./data/problem_statements1/prob_' + i + '.txt', 'utf8');
    const words = document.toLowerCase().split(' ').join(',').split('\n').join(',').split('.').join(',').split('?').join(',').split('(').join(',').split(')').join(',').split('[').join(',').split(']').join(',').split(',');
    
    const keywords = removeStopwords(words, ['','\n','\t','.','?','!','(','[',']','{','}','<','>','=','+','-','*','/','%','&','|','^','~','@','#','$','`','\'','\"','\\','\'','\"','\'','hindi','bengali','mandarin','chinese','russian','vietnamese']);
    
    keywords.forEach((word) => {
        average_length++;
        if(!all_keywords_set.has(word)){
       
            all_keywords_set.add(word);
        }
    });
}
average_length = average_length/1520;
var sort_all_keywords = new Set([...all_keywords_set].sort());
const new_file = fs.createWriteStream('./data/keywords.txt');
const all_keywords = new Map();
var pp = 1;
sort_all_keywords.forEach((key) => {
    new_file.write(key + '\n');
    all_keywords.set(key,inde);
    inde++;
});

const ss = all_keywords.size;
console.log(ss);
const tf_data = fs.createWriteStream('./data/tf_data.txt');
let arr_idf = new Array(ss+1);
for(var i=0; i<=ss;i++) arr_idf[i] = 0;
for(var i= 1; i<=1520;i++){
    const document1 = fs.readFileSync('./data/problem_statements1/prob_' + i + '.txt', 'utf8');

    const words1 = document1.toLowerCase().split(' ').join(',').split('\n').join(',').split('.').join(',').split('?').join(',').split('(').join(',').split(')').join(',').split('[').join(',').split(']').join(',').split(',');
    const keywords1 = removeStopwords(words1, ['', '\n', '.', '?', '!', '(', '[', ']', '{', '}', '<', '>', '=', '+', '-', '*', '/', '%', '&', '|', '^', '~', '@', '#', '$', '`', '\'', '\"', '\\', '\'', '\"', '\'', 'hindi', 'bengali', 'mandarin', 'chinese', 'russian', 'vietnamese']);


    let arr = new Array(ss+1);
    var tot_key = 0;
    for(var j=0; j<ss+1;j++) arr[j] = 0;
    keywords1.forEach((word) => {
        tot_key++;
        arr[all_keywords.get(word)]++;
    });
    for(var j=0;j<ss+1;j++){
        if(arr[j]>0) arr_idf[j]++; 
    }
    if(tot_key != 0){
        for(var j=0; j<ss+1;j++){
            arr[j] = ((arr[j]*(3))/(arr[j] + 3*(0.25 + 0.75*(tot_key/average_length)))).toFixed(4);
        }
    }
    for(var j = 9;j<ss+1;j++){
        if(arr[j]>0) tf_data.write(i + ' ' + j + ' ' + arr[j] + '\n');
    }
}

for(var i=1; i<ss+1;i++) arr_idf[i] = (Math.log((1520-arr_idf[i]+0.5)/(arr_idf[i] + 0.5))).toFixed(4);
const idf_data = fs.createWriteStream('./data/idf_data.txt');
idf_data.write(arr_idf.join('\n'));



