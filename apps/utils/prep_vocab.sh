#!/bin/sh
#
# File: prep_vocab.sh
#
# Created: четвер, лютого  6 2025 by Michael Kazarian
#

#!/bin/sh
#
# File: prepare.sh
#
# Created: четвер, лютого  6 2025 by Michael Kazarian
#

# Перетворюємо формат вхідних даних, об'єднуючи значення з четвертого поля
awk -F';' '{ 
  printf "%s|%s|%s|", $1, $2, $3; 
  translations=""; 
  for(i=4; i<=NF; i++){ 
    translations = (i>4 ? translations ";" : translations) $i;
  } 
  printf "%s\n", translations; 
}' | 

# Видаляємо пробіли навколо символу вертикальної риски
awk -F';' '{
  gsub(/[[:space:]]*\|+[[:space:]]*/, "|");
  print
}' | 

# Замінюємо коми на крапку з комою в четвертому полі
awk -F '|' '
{
    for (i=1; i<=NF; i++) {
        fields[i] = $i
    }
    gsub(",", ";", fields[4])
    printf "%s", fields[1]
    for (i=2; i<=NF; i++) {
        printf "|%s", fields[i]
    }
    print ""
}' | 

# Форматуємо четверте поле, забезпечуючи розділення "; "
awk -F'|' '{
    # Розділяємо рядок на поля
    for (i=1; i<=NF; i++) {
        fields[i] = $i
    }

    # Обробляємо четверте поле
    gsub(/[[:space:]]*;[[:space:]]*/, "; ", fields[4])

    # Виводимо поля назад, зєднуючи їх символом долара
    printf "%s", fields[1]
    for (i=2; i<=NF; i++) {
        printf "|%s", fields[i]
    }
    print ""
}'
