from setuptools import setup

version = '5.1.1'

long_description = '\n\n'.join([
    open('README.rst').read(),
    open('TODO.rst').read(),
    open('CREDITS.rst').read(),
    open('CHANGES.rst').read(),
    ])

install_requires = [
    'BeautifulSoup',
    'Django >= 1.4, < 1.7',
    'django-nose',
    'django-extensions',
    'django_compressor >= 1.1',  # Yes, underscore.
    'docutils',  # For the admin docs.
    'lizard-security',
    'lizard-map',
    'raven',
    'south',
    'werkzeug',
    'translations',
    ],

tests_require = [
    'nose',
    'coverage',
    ]

setup(name='lizard-ui',
      version=version,
      description="Basic user interface for lizard websites",
      long_description=long_description,
      classifiers=['Programming Language :: Python',
                   'Framework :: Django',
                   ],
      keywords=[],
      author='Reinout van Rees',
      author_email='reinout.vanrees@nelen-schuurmans.nl',
      url='http://www.nelen-schuurmans.nl/lizard/',
      license='LGPL',
      packages=['lizard_ui'],
      include_package_data=True,
      zip_safe=False,
      install_requires=install_requires,
      tests_require=tests_require,
      extras_require={'test': tests_require},
      entry_points={
          'console_scripts': [
          ]},
      )
