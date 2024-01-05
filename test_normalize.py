from normalize import MosesPunctNormalizer
import sys

#Enter the file name to test
def test(fileName):
    a = MosesPunctNormalizer(pearl_parity = True)
    file_path = fileName

    with open(file_path, "r") as file:
        text = file.read()
    print(a.normalize(text))

test(sys.argv[1])