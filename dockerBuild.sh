#!/bin/bash

if [ "$OS" = "Darwin" ]; then
  echo docker build -t lightflow .
  docker build -t lightflow .
else
  echo sudo docker build -t lightflow .
  sudo docker build -t lightflow .
fi