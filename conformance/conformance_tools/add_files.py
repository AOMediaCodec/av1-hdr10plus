"""
Module to add new files to conformance suite
"""
import os
import sys


def main():
    """Entry point"""
    temp = os.path.basename("foo/conformance")
    print(temp)
    sys.exit(1)
