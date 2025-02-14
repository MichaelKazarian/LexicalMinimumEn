// process_lexicon.js
// This script processes word categories and matches words from text files 
// with entries from a dictionary file. It takes two command-line arguments:
// 1. Path to the dictionary file (CSV format)
// 2. Path to the directory containing category folders

const fs = require('fs').promises;
const path = require('path');

// Check if required command-line arguments are provided
if (process.argv.length !== 4) {
    console.error('Usage: node process_lexicon.js <dictionary_path> <categories_directory>');
    process.exit(1);
}

// Get command-line arguments
const dictionaryPath = process.argv[2];
const categoriesDir = process.argv[3];

// Function to load dictionary
async function loadDictionary() {
    try {
        const content = await fs.readFile(dictionaryPath, 'utf-8');
        return content.split('\n')
            .filter(line => line.trim())
            .reduce((map, line) => {
                const [word] = line.split('|');
                map.set(word.toLowerCase(), line);
                return map;
            }, new Map());
    } catch (error) {
        console.error('Error reading dictionary:', error.message);
        process.exit(1);
    }
}

// Function to process categories and files
async function processCategories() {
    try {
        // Load dictionary
        const dictionaryMap = await loadDictionary();

        // Get list of categories
        const categories = (await fs.readdir(categoriesDir))
            .filter(dir => dir.startsWith('-'))
            .map(dir => dir.slice(1)); // Remove leading -

        // Process each category
        for (const category of categories) {
            console.log(`\nCategory: ${category}`);
            
            const categoryPath = path.join(categoriesDir, `-${category}`);
            const files = await fs.readdir(categoryPath);
            
            // Process each file in category
            for (const file of files) {
                if (file.endsWith('.txt')) {
                    const word = file.replace('.txt', '');
                    const foundLine = dictionaryMap.get(word.toLowerCase());
                    
                    if (foundLine) {
                        console.log(foundLine);
                    } else {
                        console.log(`Word: ${word} - not found in dictionary`);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Processing error:', error.message);
        process.exit(1);
    }
}

// Start processing
processCategories();
