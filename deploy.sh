#!/bin/bash

REPOSITORY=/home/ubuntu/app/payhere

cd $REPOSITORY

docker stop payhere-wanted-d
docker rm payhere-wanted-d
docker rmi payhere-wanted-d

docker build -t payhere-wanted-d .
docker run -d -p 443:3000 --name payhere-wanted-d payhere-wanted-d 