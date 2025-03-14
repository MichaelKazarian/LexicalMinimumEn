import csv

# Читання слів із vocabulary-g.txt (тільки перша колонка)
def read_vocabulary(file_path):
    vocab_words = set()
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            # Розділяємо рядок по ";"
            parts = line.split(';')
            if parts:  # Перевіряємо, чи рядок не порожній
                word = parts[0].strip()  # Беремо першу колонку і видаляємо пробіли
                vocab_words.add(word)
    return vocab_words

# Фільтрація translations.csv за словами з vocabulary-g.txt
def filter_translations(vocab_words, translations_file, output_file):
    with open(translations_file, 'r', encoding='utf-8') as f_in, \
         open(output_file, 'w', encoding='utf-8') as f_out:
        reader = csv.reader(f_in, delimiter='|')
        writer = csv.writer(f_out, delimiter='|', lineterminator='\n')
        
        for row in reader:
            if len(row) >= 1:  # Перевіряємо, чи рядок не порожній
                word = row[0].strip()  # Перша колонка — слово
                if word in vocab_words:  # Якщо слово є в vocabulary-g.txt
                    writer.writerow(row)  # Записуємо весь рядок

def main():
    vocab_file = "../../data/vocabulary-g.txt"
    translations_file = "../../data/translations.csv"
    output_file = "../../data/translations-min.csv"
    
    # Читаємо слова з vocabulary-g.txt
    vocab_words = read_vocabulary(vocab_file)
    print(f"Знайдено {len(vocab_words)} унікальних слів у vocabulary-g.txt")
    
    # Фільтруємо translations.csv
    filter_translations(vocab_words, translations_file, output_file)
    print(f"Готово! Результат збережено в {output_file}")

if __name__ == "__main__":
    main()
