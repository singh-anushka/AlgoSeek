const fs = require('fs');

const tfidf = fs.readFileSync('./data/tf_idf_data.txt', 'utf8').split('\n');
const magnitude = fs.createWriteStream('./data/magnitude.txt');
var prev = 0;
var i = 1;
tfidf.forEach((line) => {
    const arr = line.split(' ');
    if(i==parseInt(arr[0])){
        prev += parseFloat(arr[2]) * parseFloat(arr[2]);
    }
    else{
        magnitude.write((Math.sqrt(prev)).toFixed(6) + '\n');
        for(var j=i+1;j<parseInt(arr[0]);j++) magnitude.write('0\n');
        prev = parseFloat(arr[2]) * parseFloat(arr[2]);
        i = parseInt(arr[0]);
    }
});
magnitude.write((Math.sqrt(prev)).toFixed(6) + '\n');
console.log('done');