4-merge-dict-weights:
	./merge-dict-weight.sh "../../generated/vocabulary-all.csv" "../../data/5000-words-rank.csv"

3-process_vocabulary:
	cat ../../data/vocabulary-all.txt | ./prep_vocab.sh > "../../generated/vocabulary-all.csv"

2-vocabcheck:
	node vocabcheck.js

1-format:
	node vocabfmt.js
