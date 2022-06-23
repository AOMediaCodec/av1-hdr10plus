"""
Module to generate conformance report
"""
import os
import sys


def main():
    """Entry point"""
    temp = os.path.basename("foo/bar")
    print(temp)
    sys.exit(1)
