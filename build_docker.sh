#!/bin/bash
#gcloud auth configure-docker
#gcr.io/apesounds/
docker build -t gcr.io/apesounds/sms:bonobo sms/
docker build -t gcr.io/apesounds/server:bonobo server/

docker push gcr.io/apesounds/sms
docker push gcr.io/apesounds/server