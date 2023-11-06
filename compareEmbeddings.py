import numpy as np
import os
import tempfile
import pytest

from laser_encoders.download_models import LaserModelDownloader
from laser_encoders.language_list import LASER2_LANGUAGE, LASER3_LANGUAGE
from laser_encoders.laser_tokenizer import initialize_tokenizer
from laser_encoders.models import initialize_encoder

# def test_validate_language_models_and_tokenize_laser3(lang):
#     with tempfile.TemporaryDirectory() as tmp_dir:
#         print(f"Created temporary directory for {lang}", tmp_dir)

#         downloader = LaserModelDownloader(model_dir=tmp_dir)
#         downloader.download_laser3(lang)

#         encoder = initialize_encoder(lang, model_dir=tmp_dir)
#         tokenizer = initialize_tokenizer(lang, model_dir=tmp_dir)

#         # Test tokenization with a sample sentence
#         tokenized = tokenizer.tokenize("This is a sample sentence.")

#     print(f"{lang} language model validated and deleted successfully.")

def test_validate_language_models_and_tokenize_laser2(lang):
    tmp_dir = "/home/siddharth/Desktop/programs/embeddings_check/new_LASER/models"
    print(f"Created temporary directory for {lang}", tmp_dir)

    downloader = LaserModelDownloader(model_dir=tmp_dir)
    downloader.download_laser2()

    encoder = initialize_encoder(lang, model_dir=tmp_dir, laser="laser2")
    tokenizer = initialize_tokenizer(lang, model_dir=tmp_dir)

    file_loc = "/home/siddharth/Desktop/programs/flores/flores200_dataset/dev/test.dev"

    with open(file_loc, 'r') as file:
    # Read the entire file content into a string
        file_contents = file.readlines()

    # lines = file_contents.splitlines()

    # # Get the number of lines
    # num_lines = len(lines)

    # print(f"Number of lines in the file: {num_lines}")

    # Test tokenization with a sample sentence
    # b = []
    # for sent in tokenized_sentence:
    #     h = encoder.encode_sentences(sent)
    #     b.append(h)
    tokenized_sentence = []
    for sent in file_contents:
        tokenized_sentence.append(tokenizer.tokenize(sent))

    # tokenized_sentence = tokenizer.tokenize(file_contents)
    # print(tokenized_sentence.shape)
    # print(tokenized_sentence)
    # print(type(tokenized_sentence))
    # print(len(tokenized_sentence))
    # print(tokenized_sentence[:10])
    # exit()
    b = encoder.encode_sentences(tokenized_sentence)
    # print(f"{lang} language model validated and deleted successfully.")
    print("yyyy")
    dim = 1024
    file_loc = "/home/siddharth/Desktop/programs/embeddings_check/old_LASER/output/old_embeddings55"
    a = np.fromfile(file_loc, dtype=np.float32, count=-1)                                                                          
    a.resize(a.shape[0] // dim, dim)    
    print(a)
    print("------------------------------------------------------------------------------")
    print(b)
    # b.resize(997, dim)

    print(a.shape)
    print(b.shape)

    print(np.allclose(a, b, atol=1e-3))
