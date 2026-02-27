const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../src/data/raw_sentences.txt');
const outputPath = path.join(__dirname, '../src/data/sentences500.json');

const text = fs.readFileSync(inputPath, 'utf8');
const lines = text.split('\n').filter(line => line.trim() !== '');

const patterns = [];
let currentPattern = null;

const patternRegex = /^### 🟢 Pattern \d+: (.+)$/;
const sentenceRegex = /^\d+\.\s+(.+?)\s+\((.+)\)$/;

lines.forEach(line => {
    line = line.trim();
    if (line.startsWith('###')) {
        const match = line.match(patternRegex);
        if (match) {
            currentPattern = {
                title: match[1].trim(),
                sentences: []
            };
            patterns.push(currentPattern);
        }
    } else {
        const match = line.match(sentenceRegex);
        if (match && currentPattern) {
            currentPattern.sentences.push({
                en: match[1].trim(),
                ko: match[2].trim()
            });
        }
    }
});

fs.writeFileSync(outputPath, JSON.stringify(patterns, null, 2));
console.log('Successfully wrote to', outputPath);
