from setuptools import setup

version = "4.53"

long_description = "\n\n".join(
    [
        open("README.rst").read(),
        open("TODO.rst").read(),
        open("CREDITS.rst").read(),
        open("CHANGES.rst").read(),
    ]
)

install_requires = (
    [
        "beautifulsoup4",
        "Django >= 1.9, < 3",
        "django_compressor >= 1.1",  # Yes, underscore.
    ],
)

tests_require = [
    "nose",
    "coverage",
]

setup(
    name="lizard-ui",
    version=version,
    description="Basic user interface for lizard websites",
    long_description=long_description,
    classifiers=["Programming Language :: Python", "Framework :: Django",],
    keywords=[],
    author="Reinout van Rees",
    author_email="reinout.vanrees@nelen-schuurmans.nl",
    url="http://www.nelen-schuurmans.nl/lizard/",
    license="LGPL",
    packages=["lizard_ui"],
    include_package_data=True,
    zip_safe=True,
    install_requires=install_requires,
    tests_require=tests_require,
    extras_require={"test": tests_require},
    entry_points={"console_scripts": []},
)
