const vocabularyFile = '../../data/vocabulary.org';
const lineType = {
  WORD: "WORD",
  SAMPLE: "SAMPLE",
  GRP: "GRP",
  OTHER: "OTHER"
};
const events = require('events');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

var grps = {
  UNGRP: []
};

/**
 * Returns word type: lineType.WORD, lineType.SAMPLE or lineType.GRP.
 */
function getStrType(line) {
  let t = lineType.OTHER;
  let a = line.match('(?<word>^[a-zA-Z])|(?<example>•)|(?<grp>^\\*\\* [a-zA-Z]|\\*\\*\\* )');
  if (a != null && a.groups.word != undefined) return lineType.WORD;
  if (a != null && a.groups.example != undefined) return lineType.SAMPLE;
  if (a != null && a.groups.grp != undefined) return lineType.GRP;
  return lineType.OTHER;
}

/**
 * Reads the dictionary file and adds words to the appropriate categories.
 * @returns {"group": [words]} object
 */
async function getWordsGroups() {
  try {
    const file = readline.createInterface({
      input: fs.createReadStream(vocabularyFile),
      crlfDelay: Infinity
    });

    let grp = "UNGRP";
    let lastWord;
    file.on('line', (line) => {
      let l = line.trim();
      let t = getStrType(l);
      if (t === lineType.GRP) {
        grp = l;
        if (!(grp in grps)) {
          grps[grp] = [];
        }
      }
      if (t === lineType.WORD) {
        lastWord = l;
        grps[grp].push(lastWord);
      }
      if (t === lineType.SAMPLE) {
        lastWord += l;
        let length = grps[grp].length;
        grps[grp][length-1]=lastWord;
      }
      // console.log(`Line is: ${l} is ${t}`);
    });

    await events.once(file, 'close');

    // console.log(grps);
    // console.log('Reading file line by line with readline done.');
    // const used = process.memoryUsage().heapUsed / 1024 / 1024;
    // console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
    return grps;
  } catch (err) {
    console.error(err);
  }
  return {};
};

/**
 * Removes empty groups and word samples.
 * param {"group": [words]} groupedwords
 * @returns {"group": [words]} object object contains grouped words.
 */
function getWordsOnly(groupedWords) {
  let g = Object.entries(groupedWords)
      .reduce((acc, [key, val]) => {
        if (val.length > 0) {
          acc[key]=val;
        }
        return acc;
      }, {});
  return g;
}

function cleanGrpName(grpName) {
  return grpName.replace(/^\*+\s+([a-zA-Z ]+)/, '$1');
}


let wordGroups = getWordsGroups()
    .then(result => getWordsOnly(result))
    .then(cleanedGroups => {
        // Clean the group names
        let cleaned = Object.fromEntries(
            Object.entries(cleanedGroups).map(([key, value]) => [cleanGrpName(key), value])
        );

        // Convert to JSON string
        let jsonString = JSON.stringify(cleaned, null, 2);

        return new Promise((resolve, reject) => {
            // Write the JSON string to the file in ../../generated
            fs.writeFile('../../generated/vocabulary.json', jsonString, 'utf8', function(err) {
                if (err) {
                    console.log("An error occurred while writing JSON Object to File: ", err);
                    reject(err);
                } else {
                    console.log("JSON file has been saved to ../../generated/vocabulary.json");
                    resolve(cleaned); // Resolve with the cleaned data for further use
                }
            });
        });
    })
    .then(cleaned => {
        // Now we can read the JSON file since it's guaranteed to be written
        const jsonData = require('../../generated/vocabulary.json');

        // Process each group in the JSON data
        for (const [groupName, words] of Object.entries(jsonData)) {
            processGroup(groupName, words);
        }

        console.log("Files have been created in their respective group directories.");
    })
    .catch(err => console.error("An error occurred:", err));

function cleanWord(word) {
  // Remove any explanation in parentheses
  const wordWithoutExplanation = word.split('(')[0].trim();
  // Split words if they have alternatives separated by '/'
  return wordWithoutExplanation.split('/').map(w => w.trim());
}

function sanitizeDirName(dirName) {
  if (dirName.length > 1) {
    return '-' + dirName.replace(/\s+/g, '-');
  }
  return dirName; // If only one character, return as is
}

function processGroup(groupName, wordsArray) {
  // Sanitize the directory name
  const sanitizedGroupName = sanitizeDirName(groupName);
  // Create directory for group if it doesn't exist
  const groupDir = path.join(__dirname, '../../generated', sanitizedGroupName);
  if (!fs.existsSync(groupDir)) {
    fs.mkdirSync(groupDir, { recursive: true });
  }

  wordsArray.forEach(word => {
    const cleanedWords = cleanWord(word);
    
    cleanedWords.forEach(cleanWord => {
      // Use the cleaned word for the filename, but write the original word to the file
      const filePath = path.join(groupDir, `${cleanWord}.txt`);
      fs.writeFileSync(filePath, word, 'utf8');
    });
  });
}

function cleanGrpName(grpName) {
  // Using regex to match one or more asterisks followed by spaces and then capturing the text
  return grpName.replace(/^\*+\s+([a-zA-Z ]+)/, '$1');
}
