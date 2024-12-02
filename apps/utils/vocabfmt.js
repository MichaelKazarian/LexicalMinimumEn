const vocabularyFile = '../../vocabulary.org';
const lineType = {
  WORD: "WORD",
  SAMPLE: "SAMPLE",
  GRP: "GRP",
  OTHER: "OTHER"
};
const events = require('events');
const fs = require('fs');
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

    console.log(grps);
    console.log('Reading file line by line with readline done.');
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
  } catch (err) {
    console.error(err);
  }
};

getWordsGroups();
