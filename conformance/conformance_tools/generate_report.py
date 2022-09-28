"""
Module to generate conformance report
requires bikeshed to be installed
"""
import os
import re
import sys

from .utils import dump_to_json, execute_cmd, read_json

ASSERT_PATTERN = r"assert-.{8}"


def collect_file_asserts(assert_ids, spec):
    """Given an array of assert IDs return all asserts from conformance files"""
    all_asserts = {}
    for assert_id in assert_ids:
        all_asserts[assert_id] = {'ok': [], 'warn': [], 'err': []}

    # conformance file asserts
    for root, _subdirs, files in os.walk('conformance_files'):
        for conformance_file in files:
            _input_filename, input_extension = os.path.splitext(conformance_file)
            if input_extension not in ['.json']:
                continue
            input_path = os.path.join(root, conformance_file)

            json = read_json(input_path)

            cw_report = json['compliance_warden']
            if not cw_report:
                continue

            print('FIXME: ComplianceWarden needs to support bikeshed asserts. Continue after the feature is added.')
            sys.exit(-1)

            for spec_validation in cw_report['validation']:
                if spec_validation['specification'] != spec:
                    continue
                # ok
                for check in spec_validation['successful_checks']:
                    if check['rule_id'] not in all_asserts:
                        print(
                            f"Error: unknown assert {check['rule_id']} in {input_path}")
                        sys.exit(1)
                    all_asserts[check['rule_id']
                                ]['ok'].append(input_path)
                # warn
                for check in spec_validation['warnings']:
                    if check['rule_id'] not in all_asserts:
                        print(
                            f"Error: unknown assert {check['rule_id']} in {input_path}")
                        sys.exit(1)
                    all_asserts[check['rule_id']
                                ]['warn'].append(input_path)
                # err
                for check in spec_validation['errors']:
                    if check['rule_id'] not in all_asserts:
                        print(
                            f"Error: unknown assert {check['rule_id']} in {input_path}")
                        sys.exit(1)
                    all_asserts[check['rule_id']
                                ]['err'].append(input_path)
    return all_asserts


def print_coverage_stats(all_asserts):
    """show how many assets are covered by conformance files"""
    cnt = len(all_asserts)
    coverage = []
    print('Coverage statistics')
    print('='*36)
    print(f'{"":15}{"":>7}{"invalid  ":>14}')
    print(f'{"assert_id":15}{"OK":>7}{"warn":>7}{"err":>7}')
    print('-'*36)
    for assert_id in all_asserts:
        cnt_ok = len(all_asserts[assert_id]['ok'])
        cnt_warn = len(all_asserts[assert_id]['warn'])
        cnt_err = len(all_asserts[assert_id]['err'])
        print(f'{assert_id}{cnt_ok:7}{cnt_warn:7}{cnt_err:7}')
        coverage.append([assert_id, cnt_ok,  cnt_warn, cnt_err])
    print('='*36)

    valid = [x for x in coverage if x[1] > 0]
    invalid = [x for x in coverage if x[2] > 0 or x[3] > 0]

    cov_valid = 100.0 * len(valid) / cnt
    cov_invalid = 100.0 * len(invalid) / cnt

    print(f'Valid coverage:   {cov_valid:6.2f}% ({len(valid)} from {cnt})')
    print(f'Invalid coverage: {cov_invalid:6.2f}% ({len(invalid)} from {cnt})')


def main():
    """Entry point"""
    ret = execute_cmd('bikeshed spec ../index.bs temp.html')

    if ret.returncode != 0:
        print('Could not execute bikeshed')
        sys.exit(-1)
    with open('temp.html', 'r', encoding='utf-8') as file:
        html = file.read()
    assert_ids = re.findall(ASSERT_PATTERN, html)

    all_asserts = collect_file_asserts(assert_ids, 'av1hdr10plus')
    dump_to_json('assert-map.json', all_asserts)
    print_coverage_stats(all_asserts)
