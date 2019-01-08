#!/bin/env python3

import json, subprocess

quals = dict(
    Worker_PercentAssignmentsApproved = '000000000000000000L0',
    Worker_Locale = ' 00000000000000000071')

import munge_for_mturk  # For the side-effects.

subprocess.check_call([str(x) if type(x) is not str else x for x in (
    'aws', 'mturk',
    #'--endpoint-url=https://mturk-requester-sandbox.us-east-1.amazonaws.com',
    'create-hit',
    '--max-assignments', 1,
    '--lifetime-in-seconds', 1 * 60*60,
    '--assignment-duration-in-seconds', 10 * 60,
    '--auto-approval-delay-in-seconds', 3 * 24*60*60,
    '--reward', 0.75,
    '--qualification-requirements', json.dumps([
        dict(QualificationTypeId = quals['Worker_PercentAssignmentsApproved'],
            Comparator = 'GreaterThanOrEqualTo',
            IntegerValues = [90]),
        dict(QualificationTypeId = quals['Worker_Locale'],
            Comparator = 'EqualTo',
            LocaleValues = [{'Country': 'US'}])]),
    '--title', 'Simple Decision-Making',
    '--description',
        "Make some simple decisions. The task takes about 3 minutes. "
        "You can't have already done one of my HITs named \"Simple "
        "Decision-Making\". JavaScript is required.",
    '--keywords', 'psychology,study,experiment',
    '--question', 'file:///tmp/mturk_layout.xml')])
