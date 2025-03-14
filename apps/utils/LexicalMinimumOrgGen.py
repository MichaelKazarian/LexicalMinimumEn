import csv
from collections import defaultdict

# Читання CSV файлу
def read_csv(file_path):
    data = defaultdict(list)
    with open(file_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f, delimiter='|')
        for row in reader:
            # print(row)
            word, pos, phon, freq, trans, examples, ex_trans = row
            letter = word[0].upper()
            examples = examples.split('/')
            ex_trans = ex_trans.split('/')
            data[letter].append((word, pos, phon, trans, examples, ex_trans))
    return data

# Генерація спискового формату
def generate_list_format(data, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("#+TITLE: Lexical Minimum\n")
        f.write("#+AUTHOR: Michael Kazarian\n")
        f.write("#+LANGUAGE: en\n")
        f.write("#+OPTIONS: toc:nil num:nil\n\n")
        
        for letter in sorted(data.keys()):
            f.write(f"* {letter}\n")
            for word, pos, phon, trans, examples, ex_trans in data[letter]:
                phon = f" [{phon}]" if phon != "NULL" else ""
                f.write(f"    *{word}*{phon} ({pos}) {trans}\n")
                for ex, ex_t in zip(examples, ex_trans):
                    f.write(f"    - {ex} ({ex_t})\n")

# Генерація табличного формату
def generate_table_format(data, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("#+TITLE: Lexical Minimum\n")
        f.write("#+AUTHOR: Michael Kazarian\n")
        f.write("#+LANGUAGE: en\n")
        f.write("#+OPTIONS: toc:nil num:nil\n\n")
        
        for letter in sorted(data.keys()):
            f.write(f"* {letter}\n")
            f.write("| <l4>| <l6>|\n")
            for word, pos, phon, trans, examples, ex_trans in data[letter]:
                phon = f" [{phon}]" if phon != "NULL" else ""
                left_col = f"*{word}*{phon} ({pos}) {trans}"
                examples_full = " ".join(f"{ex} ({ex_t})" for ex, ex_t in zip(examples, ex_trans))
                f.write(f"| {left_col:<50} | {examples_full:<85} |\n")

# Основна функція
def main():
    file_path = "../../data/translations.csv"
    data = read_csv(file_path)
    generate_list_format(data, "../../out/LexicalMinimum_list.org")
    generate_table_format(data, "../../out/LexicalMinimum_table.org")
    print("Готово! Створено LexicalMinimum_list.org та LexicalMinimum_table.org")

if __name__ == "__main__":
    main()
