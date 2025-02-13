#!/bin/bash

# Перевірка, чи передано достатньо аргументів
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <dictionary_file> <weights_file>"
    exit 1
fi

# Зчитування аргументів
dictionary_file="$1"
weights_file="$2"
output_lex_min="../../generated/output_lex_min.csv"
#output_lex_min_grp="../../generated/output_lex_min_grp.csv"
output_all="../../generated/output_all.csv"

# Перевірка, чи файли існують
if [ ! -f "$dictionary_file" ] || [ ! -f "$weights_file" ]; then
    echo "Error: One or both files do not exist."
    exit 1
fi

# echo "Duplicate keys in $dictionary_file:"
# sort -t'|' -k1,1 "$dictionary_file" | \
# awk -F'|' '{print $1}' | \
# uniq -d | \
# while read key; do
#     count=$(grep -c "^$key|" "$dictionary_file")
#     echo "$key (repeated $count times)"
# done

# Сортування словника за першим полем
sort -t'|' -k1,1 "$dictionary_file" > dict_sorted.txt
# Обробка weights_file: вибір максимальної ваги для кожного ключа
# Спочатку сортуємо за ключем (поле 1) і вагою (поле 2) за спаданням
sort -t'|' -k1,1 -k2,2nr "$weights_file" | \
# Вибираємо перший запис для кожного ключа (з максимальною вагою)
awk -F'|' '!seen[$1]++' > weights_sorted.txt

# Виконання об'єднання (weights_sorted.txt як основний), заміна порожніх значень і сортування; use with $output_all
#join -t'|' -1 1 -2 1 -a 1 -o '1.1,2.2,2.3,1.2,2.4' weights_sorted.txt dict_sorted.txt | \
# Виконання об'єднання (dict_sorted.txt як основний). Use with $output_lex_min
join -t'|' -1 1 -2 1 -a 1 -o '1.1,1.2,1.3,2.2,1.4' dict_sorted.txt weights_sorted.txt | \
sed 's/||/|NULL|/g' | \
sort -t'|' -k1,1 > $output_lex_min
#sort -t'|' -k4,4n -k1,1 # Сортування за рейтингом

# Видалення тимчасових файлів
rm dict_sorted.txt weights_sorted.txt

