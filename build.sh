#!/bin/bash

cd frontend
yarn
yarn build

cd ..

cd server
yarn
yarn build