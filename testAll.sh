# perl /home/siddharth/Desktop/programs/mosesdecoder/scripts/tokenizer/normalize-punctuation.perl < /home/siddharth/Desktop/programs/flores/flores200_dataset/dev/test.dev > ~/Desktop/programs/test/sacremoses_pearl_all.txt
# python3 /home/siddharth/Desktop/programs/sacremoses/sacremoses/test_normalize.py eng_Latn.dev > /home/siddharth/Desktop/programs/test/sacremoses_python_all.txt

#!/bin/bash

input_dir="/home/siddharth/Desktop/programs/flores/flores200_dataset/dev"
output_dir="/home/siddharth/Desktop/programs/test/outputs/FinalTest/dev"

i=0

mkdir -p "$output_dir"  # Create the output directory if it doesn't exist

for input_file in "$input_dir"/*; do
    filename=$(basename "$input_file")
    
    # Normalize punctuation using Perl script
    perl /home/siddharth/Desktop/programs/mosesdecoder/scripts/tokenizer/normalize-punctuation.perl < "$input_file" > "$output_dir/sacremoses_perl_$filename.txt"

    # Normalize punctuation using Python script
    python3 /home/siddharth/Desktop/programs/sacremoses-fork/sacremoses/test_normalize.py "$input_file" > "$output_dir/sacremoses_python_$filename.txt"
done


for input_file in "$input_dir"/*; do
    filename=$(basename "$input_file")
    
    perl_output="$output_dir/sacremoses_perl_$filename.txt"
    python_output="$output_dir/sacremoses_python_$filename.txt"

    # Check if both Perl and Python output files exist
    if [ -f "$perl_output" ] && [ -f "$python_output" ]; then
        # Use the `diff` command to compare the two files
        if ! diff -q "$perl_output" "$python_output" > /dev/null; then
            diff_count=$(diff "$perl_output" "$python_output" | wc -l)
            echo "Files for $input_file have differences $diff_count."
            ((i++))
        else
            # Add the code to delete the Perl and Python files
            rm "$perl_output" "$python_output"
        fi
    else
        echo "One of the output files is missing for input file $filename."
    fi
done

echo "Number of different files in dev: $i"
i=0

input_dir="/home/siddharth/Desktop/programs/flores/flores200_dataset/devtest"
output_dir="/home/siddharth/Desktop/programs/test/outputs/withdiffFinal/devtest"

mkdir -p "$output_dir"  # Create the output directory if it doesn't exist

for input_file in "$input_dir"/*; do
    filename=$(basename "$input_file")
    
    # Normalize punctuation using Perl script
    perl /home/siddharth/Desktop/programs/mosesdecoder/scripts/tokenizer/normalize-punctuation.perl < "$input_file" > "$output_dir/sacremoses_perl_$filename.txt"

    # Normalize punctuation using Python script
    python3 /home/siddharth/Desktop/programs/sacremoses-fork/sacremoses/test_normalize.py "$input_file" > "$output_dir/sacremoses_python_$filename.txt"
done


for input_file in "$input_dir"/*; do
    filename=$(basename "$input_file")
    
    perl_output="$output_dir/sacremoses_perl_$filename.txt"
    python_output="$output_dir/sacremoses_python_$filename.txt"

    # Check if both Perl and Python output files exist
    if [ -f "$perl_output" ] && [ -f "$python_output" ]; then
        # Use the `diff` command to compare the two files
        if ! diff -q "$perl_output" "$python_output" > /dev/null; then
            diff_count=$(diff "$perl_output" "$python_output" | wc -l)
            echo "Files for $input_file have differences $diff_count."
            ((i++))
        else
            # Add the code to delete the Perl and Python files
            rm "$perl_output" "$python_output"
        fi
    else
        echo "One of the output files is missing for input file $filename."
    fi
done

echo "Number of different files in devtest: $i"