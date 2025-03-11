const fs = require('fs');
const path = require('path');

// Шляхи до файлів
const categoriesFile = '../../categories.csv';
const translationsFile = '../../data/translations.csv';

// Функція для парсингу CSV рядків
function parseCSVLine(line) {
  return line.split('|');
}

// Читання файлів і обробка даних
function combineData() {
  // Зчитуємо обидва файли
  const categoriesData = fs.readFileSync(path.resolve(__dirname, categoriesFile), 'utf8').split('\n');
  const translationsData = fs.readFileSync(path.resolve(__dirname, translationsFile), 'utf8').split('\n');

  // Створюємо мапу для швидкого пошуку по translations.csv
  const translationsMap = new Map();
  translationsData.forEach(line => {
    if (line.trim()) { // Ігноруємо порожні рядки
      const [word, , , , , example, exampleTranslation] = parseCSVLine(line);
      translationsMap.set(word, { example, exampleTranslation });
    }
  });

  // Обробляємо categories.csv і додаємо приклади
  const result = categoriesData.map(line => {
    if (line.trim()) { // Ігноруємо порожні рядки
      if (line.startsWith('Category:')) {
        // Залишаємо заголовки без змін
        return line;
      } else {
        // Обробляємо рядки зі словами
        const [word, pos, phonetic, nullField, translation] = parseCSVLine(line);
        const translationEntry = translationsMap.get(word);
        
        if (translationEntry) {
          // Додаємо приклад і переклад прикладу
          return `${line}|${translationEntry.example}|${translationEntry.exampleTranslation}`;
        }
        // Якщо немає збігу в translations.csv, повертаємо оригінальний рядок
        return line;
      }
    }
    return line; // Повертаємо порожні рядки без змін
  });

  // Виводимо результат
  console.log(result.join('\n'));

  // Якщо потрібно зберегти в файл, розкоментуй наступний рядок
  // fs.writeFileSync('output.csv', result.join('\n'), 'utf8');
}

try {
  combineData();
} catch (error) {
  console.error('Помилка:', error.message);
}
