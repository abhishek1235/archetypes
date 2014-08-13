#!/bin/sh
mvn clean package -Dfull-build -P install-less,embed-statics,with-mosaic-tools,create-database