# syntax=docker/dockerfile:1
FROM python:3.9-alpine
WORKDIR /app
COPY requirements.txt requirements.txt

# Note that following commands are required to install all dependencies listed in requirements.txt
# (it can take a few minutes to build the image)

RUN \
 apk add --no-cache postgresql-libs && \
 apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev && \
 apk add --update --no-cache g++ gcc libxslt-dev && \
 apk --update add libxml2-dev libxslt-dev libffi-dev gcc musl-dev libgcc openssl-dev curl && \
 apk add jpeg-dev zlib-dev freetype-dev lcms2-dev openjpeg-dev tiff-dev tk-dev tcl-dev && \
 python3 -m pip install -r requirements.txt --no-cache-dir && \
 apk --purge del .build-deps
COPY . .
ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH /app
CMD /bin/sh run.sh
