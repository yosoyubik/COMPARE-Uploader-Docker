# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-01-13 18:24
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('meta', '0002_auto_20160111_1219'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='metadata',
            name='usage_restrictions',
        ),
    ]
