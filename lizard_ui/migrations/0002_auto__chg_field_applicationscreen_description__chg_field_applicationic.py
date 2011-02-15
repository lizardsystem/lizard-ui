# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Changing field 'ApplicationScreen.description'
        db.alter_column('lizard_ui_applicationscreen', 'description', self.gf('django.db.models.fields.TextField')(null=True))

        # Changing field 'ApplicationIcon.url'
        db.alter_column('lizard_ui_applicationicon', 'url', self.gf('django.db.models.fields.CharField')(max_length=200, null=True))

        # Changing field 'ApplicationIcon.icon'
        db.alter_column('lizard_ui_applicationicon', 'icon', self.gf('django.db.models.fields.CharField')(max_length=200))


    def backwards(self, orm):
        
        # Changing field 'ApplicationScreen.description'
        db.alter_column('lizard_ui_applicationscreen', 'description', self.gf('django.db.models.fields.TextField')(default='/'))

        # Changing field 'ApplicationIcon.url'
        db.alter_column('lizard_ui_applicationicon', 'url', self.gf('django.db.models.fields.URLField')(default='/', max_length=200))

        # Changing field 'ApplicationIcon.icon'
        db.alter_column('lizard_ui_applicationicon', 'icon', self.gf('django.db.models.fields.URLField')(max_length=200))


    models = {
        'lizard_ui.applicationicon': {
            'Meta': {'ordering': "('index',)", 'object_name': 'ApplicationIcon'},
            'application_screen': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['lizard_ui.ApplicationScreen']"}),
            'icon': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'index': ('django.db.models.fields.IntegerField', [], {'default': '1000'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '40'}),
            'url': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'})
        },
        'lizard_ui.applicationscreen': {
            'Meta': {'object_name': 'ApplicationScreen'},
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '40'}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '40', 'db_index': 'True'})
        }
    }

    complete_apps = ['lizard_ui']
