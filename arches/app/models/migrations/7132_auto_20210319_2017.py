# Generated by Django 2.2.13 on 2021-03-19 20:17

import arches.app.models.models
import arches.app.utils.language
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
	        SET name=name::jsonb->>'%s'::text;
    """ % settings.LANGUAGE_CODE

    operations = [
        migrations.RunSQL(sql, reverse_sql),
        migrations.AlterField(
            model_name='cardmodel',
            name='name',
            field=arches.app.models.models.TranlatedJSONField(blank=True, default=arches.app.utils.language.default_lang_node_json, null=True),
        ),
    ]