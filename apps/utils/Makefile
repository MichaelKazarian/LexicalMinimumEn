6-categories-combine:
	node categories_combine.js
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
