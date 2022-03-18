#!/bin/bash

if [ "$OS" = "Darwin" ]; then
  echo docker tag lightflow:latest chmac/lightflow
  docker tag lightflow:latest chmac/lightflow
  echo docker push chmac/lightflow:latest
  docker push chmac/lightflow:latest
else
  echo sudo docker tag lightflow:latest chmac/lightflow
  sudo docker tag lightflow:latest chmac/lightflow
  echo sudo docker push chmac/lightflow:latest
  sudo docker push chmac/lightflow:latest
fi