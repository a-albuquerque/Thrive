#!/bin/sh
echo 'here is some text :c'
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
