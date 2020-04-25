#!/bin/bash

if [ "$OS" = "Darwin" ]; then
  docker-compose up --detach --build
else
  sudo docker-compose up --detach --build
fi
