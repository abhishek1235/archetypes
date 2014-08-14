#!/bin/sh
mvn clean package -Dfull-build -P install-less,with-mosaic-tools,create-database