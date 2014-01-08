# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'CustomerLogo'
        db.create_table('lizard_ui_customerlogo', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100, null=True, blank=True)),
            ('logo', self.gf('django.db.models.fields.files.ImageField')(max_length=100, null=True, blank=True)),
            ('used', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal('lizard_ui', ['CustomerLogo'])


    def backwards(self, orm):
        # Deleting model 'CustomerLogo'
        db.delete_table('lizard_ui_customerlogo')


    models = {
        'lizard_security.dataset': {
            'Meta': {'ordering': "['name']", 'object_name': 'DataSet'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '80', 'blank': 'True'})
        },
        'lizard_ui.applicationicon': {
            'Meta': {'ordering': "('index',)", 'object_name': 'ApplicationIcon'},
            'application_screen': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'icons'", 'to': "orm['lizard_ui.ApplicationScreen']"}),
            'data_set': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['lizard_security.DataSet']", 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'icon': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'index': ('django.db.models.fields.IntegerField', [], {'default': '1000'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '40'}),
            'sub_screen': ('django.db.models.fields.related.OneToOneField', [], {'blank': 'True', 'related_name': "'parent_icon'", 'unique': 'True', 'null': 'True', 'to': "orm['lizard_ui.ApplicationScreen']"}),
            'url': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'})
        },
        'lizard_ui.applicationscreen': {
            'Meta': {'object_name': 'ApplicationScreen'},
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '40'}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '40'})
        },
        'lizard_ui.customerlogo': {
            'Meta': {'object_name': 'CustomerLogo'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'logo': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'used': ('django.db.models.fields.BooleanField', [], {'default': 'True'})
        }
    }

    complete_apps = ['lizard_ui']