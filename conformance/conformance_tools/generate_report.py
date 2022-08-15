"""
Module to generate conformance report
requires bikeshed to be installed
"""
import os
import re
import sys

from .utils import execute_cmd, read_json

ASSERT_PATTERN = r"assert-.{8}"


def main():
    """Entry point"""

    ret = execute_cmd('bikeshed spec ../index.bs temp.html')

    if ret.returncode != 0:
        print('Could not execute bikeshed')
        sys.exit(-1)
    with open('temp.html', 'r', encoding='utf-8') as file:
        html = file.read()
    asserts = re.findall(ASSERT_PATTERN, html)

    print('index.html asserts:')
    conf_file_asserts = {}
    for asrt in asserts:
        print(asrt)
        conf_file_asserts[asrt] = {'sucess': [], 'warn': [], 'err': []}

    # conformance file asserts
    for root, _subdirs, files in os.walk('conformance_files'):
        for conf_file in files:
            _input_filename, input_extension = os.path.splitext(conf_file)
            if input_extension not in ['.json']:
                continue
            input_path = os.path.join(root, conf_file)
            json = read_json(input_path)
            print(json['validation']['warnings'])
