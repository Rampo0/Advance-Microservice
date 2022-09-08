#!/bin/bash

# docker for mac note: always update this url
# kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.41.0/deploy/static/provider/cloud/deploy.yaml

kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=sk_test_In8WodA92bfRdCb4iyLAzy0N00DnC8iL6f
