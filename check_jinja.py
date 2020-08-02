#!/usr/bin/env python
# filename: check_my_jinja.py
import sys
from jinja2 import Environment, FileSystemLoader
from jinja2.exceptions import TemplateSyntaxError

env = Environment(loader=FileSystemLoader('./app'))
templates = [x for x in env.list_templates() if x.endswith('.html')]
for template in templates:
    print(template)
    try:
        t = env.get_template(template)
        env.parse(t)
    except TemplateSyntaxError as err:
        print(f'FAILED:{err.message}')