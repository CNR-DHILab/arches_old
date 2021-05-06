# Generated by Django 2.2.13 on 2021-03-11 17:21

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('models', '7262_report_template_data_fetch_bool'),
    ]

    sql = """
        UPDATE public.cards 
            SET name=CONCAT('{"%s":"',name,'"}');
    """ % settings.LANGUAGE_CODE

    reverse_sql = """
        UPDATE public.cards
	        SET name=name->>'%s';
    """ % settings.LANGUAGE_CODE

    operations = [
        migrations.RunSQL(sql, reverse_sql),
        migrations.AlterField(
            model_name='cardmodel',
            name='name',
            field=django.contrib.postgres.fields.jsonb.JSONField(blank=True, null=True),
        )
    ]