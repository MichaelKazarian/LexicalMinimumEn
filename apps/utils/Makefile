10-org-gen:
	python3 LexicalMinimumOrgGen.py --input ../../data/translations-min.csv --list-output ../../out/LexicalMinimum_list.org --table-output ../../out/LexicalMinimum_table.org

9-filter-min:
	python3 filter_lex_min.py

8-org-cat:
	python3 categories_to-org.py

7-org-gen:
	python3 LexicalMinimumOrgGen.py --input ../../data/translations.csv --list-output ../../out/LexicalMinimumAll_list.org --table-output ../../out/LexicalMinimumAll_table.org

6-categories-combine:
	node categories_combine.js > ../../generated/categories-translations.csv
5-dict-caregories:
	node process_categories.js "../../generated/output_lex_min.csv" "../../generated" > "../../generated/categories.csv" && cat "../../generated/categories.csv"

4-merge-dict-weights:
	./merge-dict-weight.sh "../../generated/vocabulary-all.csv" "../../data/5000-words-rank.csv"

3-process_vocabulary:
	cat ../../data/vocabulary-all.txt | ./prep_vocab.sh > "../../generated/vocabulary-all.csv"

2-vocabcheck:
	node vocabcheck.js

1-format:
	node vocabfmt.js
