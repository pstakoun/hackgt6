#!/bin/bash
#gcloud auth configure-docker
#gcr.io/apesounds/
docker build -t gcr.io/apesounds/sms:$1 sms/
docker build -t gcr.io/apesounds/server:$1 server/

docker push gcr.io/apesounds/sms
docker push gcr.io/apesounds/server