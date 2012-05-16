# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    depends_on = (
        ("lizard_security", "0002_auto__add_usergroup__add_permissionmapper__add_dataset"),
        )

    def forwards(self, orm):
        
        # Adding field 'ApplicationIcon.data_set'
        db.add_column('lizard_ui_applicationicon', 'data_set', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['lizard_security.DataSet'], null=True, blank=True), keep_default=False)


    def backwards(self, orm):
        
        # Deleting field 'ApplicationIcon.data_set'
        db.delete_column('lizard_ui_applicationicon', 'data_set_id')


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
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '40', 'db_index': 'True'})
        }
    }

    complete_apps = ['lizard_ui']
