#!/bin/bash
echo "Monkey type: $1"

bash build_docker.sh $1

kubectl get pod | grep 'server' | cut -d " " -f1 - | xargs -n1 -P 10 kubectl delete pod
kubectl get pod | grep 'sms' | cut -d " " -f1 - | xargs -n1 -P 10 kubectl delete pod

kubectl set image deployment/server server=gcr.io/apesounds/server:$1 --record
kubectl set image deployment/sms sms=gcr.io/apesounds/sms:$1 --record

kubectl apply -f penis.yaml

echo "APE"