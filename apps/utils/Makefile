4-merge-dict-weights:
	./merge-dict-weight.sh ../../data/vocabulary-all-1.txt ../../data/5000-words-rank.csv

3-process_vocabulary:
	cat ../../data/vocabulary-all.txt | ./prep_vocab.sh > ../../data/vocabulary-all-1.txt

2-vocabcheck:
	node vocabcheck.js

1-format:
	node vocabfmt.js
