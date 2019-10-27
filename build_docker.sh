#!/bin/bash
#gcloud auth configure-docker
#gcr.io/apesounds/
docker build -t gcr.io/apesounds/sms sms/
docker build -t gcr.io/apesounds/server server/

docker push gcr.io/apesounds/sms
docker push gcr.io/apesounds/server