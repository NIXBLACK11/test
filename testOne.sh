#!/bin/bash

perl /home/siddharth/Desktop/programs/mosesdecoder/scripts/tokenizer/normalize-punctuation.perl < /home/siddharth/Desktop/programs/test/test.devtest > pearl_output.txt

python3 /home/siddharth/Desktop/programs/sacremoses/sacremoses/test_normalize.py  /home/siddharth/Desktop/programs/test/test.devtest > python_output.txt