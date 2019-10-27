#!/bin/bash
./build_docker.bash

kubectl get pod | grep 'server' | cut -d " " -f1 - | xargs -n1 -P 10 kubectl delete pod
kubectl get pod | grep 'sms' | cut -d " " -f1 - | xargs -n1 -P 10 kubectl delete pod

kubectl set image deployment/server server=gcr.io/apesounds/server:bonobo --record
kubectl set image deployment/sms sms=gcr.io/apesounds/sms:bonobo --record

echo "APE"