import csv
from collections import defaultdict

# Читання CSV файлу з категоріями
def read_csv(file_path):
    data = {}
    current_category = None
    
    with open(file_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f, delimiter='|')
        for row in reader:
            # Перевірка, чи це заголовок категорії
            if len(row) == 1 and row[0].startswith('Category:'):
                current_category = row[0]
                data[current_category] = {'words': [], 'description': []}
            # Якщо це опис категорії (рядок без роздільників)
            elif len(row) == 1 and current_category:
                data[current_category]['description'].append(row[0])
            # Якщо це слово з даними
            elif current_category and len(row) >= 5:
                word, pos, phon, freq, trans = row[:5]
                examples = row[5].split('/') if len(row) > 5 else []
                ex_trans = row[6].split('/') if len(row) > 6 else []
                data[current_category]['words'].append((word, pos, phon, trans, examples, ex_trans))
    
    return data

# Генерація спискового формату
def generate_list_format(data, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("#+TITLE: Lexical Minimum by Categories\n")
        f.write("#+AUTHOR: Michael Kazarian\n")
        f.write("#+LANGUAGE: en\n")
        f.write("#+OPTIONS: toc:nil num:nil\n\n")
        
        for category in sorted(data.keys()):
            f.write(f"* {category.replace('Category: ', '')}\n")
            # Додаємо опис категорії, якщо є
            if data[category]['description']:
                for line in data[category]['description']:
                    f.write(f"  {line}\n")
            # Додаємо слова
            for word, pos, phon, trans, examples, ex_trans in data[category]['words']:
                phon = f" [{phon}]" if phon != "NULL" else ""
                f.write(f"    *{word}*{phon} ({pos}) {trans}\n")
                for ex, ex_t in zip(examples, ex_trans):
                    if ex:
                        f.write(f"    - {ex} ({ex_t})\n")

# Генерація табличного формату
def generate_table_format(data, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("#+TITLE: Lexical Minimum by Categories\n")
        f.write("#+AUTHOR: Michael Kazarian\n")
        f.write("#+LANGUAGE: en\n")
        f.write("#+OPTIONS: toc:nil num:nil\n\n")
        
        for category in sorted(data.keys()):
            f.write(f"* {category.replace('Category: ', '')}\n")
            # Додаємо опис категорії, якщо є
            if data[category]['description']:
                for line in data[category]['description']:
                    f.write(f"  {line}\n")
            # Додаємо таблицю
            f.write("| <l4>| <l6>|\n")
            for word, pos, phon, trans, examples, ex_trans in data[category]['words']:
                phon = f" [{phon}]" if phon != "NULL" else ""
                left_col = f"*{word}*{phon} ({pos}) {trans}"
                examples_full = " ".join(f"{ex} ({ex_t})" for ex, ex_t in zip(examples, ex_trans) if ex)
                f.write(f"| {left_col:<50} | {examples_full:<85} |\n")

# Основна функція
def main():
    file_path = "../../generated/categories-translations.csv"
    data = read_csv(file_path)
    generate_list_format(data, "../../out/LexicalMinimum_categories_list.org")
    generate_table_format(data, "../../out/LexicalMinimum_categories_table.org")
    print("Готово! Створено LexicalMinimum_categories_list.org та LexicalMinimum_categories_table.org")

if __name__ == "__main__":
    main()
