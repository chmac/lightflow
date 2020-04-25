#!/bin/bash

./build.sh

if [ "$OS" = "Darwin" ]; then
  docker build -t lightflow .
else
  sudo docker build -t lightflow .
fi