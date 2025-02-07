const fs = require('fs');
const path = require('path');

// Функція для читання вмісту файлу та створення Set
function readFileAndCreateSet(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const words = content.split('\n').map(line => line.split(';')[0].trim());
  return new Set(words);
}


// Функція для обробки файлів в каталозі
function processDirectory(directoryPath, wordSet) {
  fs.readdir(directoryPath, (err, items) => {
    if (err) {
      console.error('Помилка читання каталогу:', err);
      return;
    }

    // Сортуємо каталоги, які починаються з '-'
    const sortedDirectories = items
          .filter(item => item.startsWith('-'))
          .sort();

    // Функція для обробки одного каталогу
    function processSingleDirectory(directory) {
      const dirPath = path.join(directoryPath, directory);
      fs.stat(dirPath, (err, stats) => {
        if (err) {
          console.error('Помилка отримання інформації про файл:', err);
          return;
        }

        if (stats.isDirectory()) {
          console.log(`Обробляється каталог: ${directory}`);

          fs.readdir(dirPath, (err, files) => {
            if (err) {
              console.error('Помилка читання внутрішнього каталогу:', err);
              return;
            }

            // Сортуємо файли в алфавітному порядку
            const sortedFiles = files.filter(file => path.extname(file) === '.txt').sort();

            sortedFiles.forEach(file => {
              const fileNameWithoutExt = path.basename(file, '.txt');
              if (!wordSet.has(fileNameWithoutExt)) {
                console.log(fileNameWithoutExt);
              }
            });

            // Після обробки файлів в одному каталозі, переходимо до наступного
            const nextDirectory = sortedDirectories[sortedDirectories.indexOf(directory) + 1];
            if (nextDirectory) {
              processSingleDirectory(nextDirectory);
            }
          });
        }
      });
    }

    // Запускаємо обробку з першого каталогу
    if (sortedDirectories.length > 0) {
      processSingleDirectory(sortedDirectories[0]);
    }
  });
}

// Основна функція
function main() {
  const txtFilePath = '../../data/vocabulary-x.txt'; // Заміни на шлях до твого файлу
  const directoryPath = '../../generated'; // Заміни на шлях до твого каталогу

  // Читаємо файл та створюємо Set
  const wordSet = readFileAndCreateSet(txtFilePath);

  // Читаємо каталог та обробляємо його вміст
  processDirectory(directoryPath, wordSet);
}

main();
