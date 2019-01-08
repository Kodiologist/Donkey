#!/bin/env python3

import re, subprocess

def read(x):
    with open(x, 'rt') as o:
        return o.read()

task_version = subprocess.check_output(
    ('git', 'log', '-1', '--format=%H'), encoding = "ASCII").strip()

html = re.sub(
    '<script.+?</script>',
    ("<script src='https://s3.amazonaws.com/mturk-public/externalHIT_v1.js'></script>" +
        '\n<script>' +
        read('task.js').replace('TASK_VERSION', task_version) +
        '</script>').replace('\\', '\\\\'),
    read('task.html').replace('CONSENT', read('consent')),
    count = 1)

xml = ('<HTMLQuestion xmlns="http://mechanicalturk.amazonaws.com/AWSMechanicalTurkDataSchemas/2011-11-11/HTMLQuestion.xsd">\n' +
    '<HTMLContent><![CDATA[\n' +
    html +
    ']]></HTMLContent>' +
    '<FrameHeight>0</FrameHeight>' +
    '</HTMLQuestion>\n')

with open('/tmp/mturk_layout.xml', 'wt') as o:
    o.write(xml)
