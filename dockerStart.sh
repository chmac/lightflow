#!/bin/bash

./build.sh

if [ "$OS" = "Darwin" ]; then
  docker-compose up --detach
else
  sudo docker-compose up --detach
fi
