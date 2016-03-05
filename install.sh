#!/bin/bash

####### Questions

# Production or Develop?
mode="0"
until [ $mode == "1" ] || [ $mode == "2" ]
do
  echo "$(tput setaf 2)What type of installation you need$(tput sgr0)? (1. Production 2. Develop) [1] >"|tr -d '\n'
  read mode
  if [ -z $mode ]
  then
    mode="1"
  fi
done

# Create database schema?
db="default"
until [ $db == "y" ] || [ $db == "n" ]
do
  echo "$(tput setaf 2)Create database scheme?$(tput sgr0) (y/n) [y] >"|tr -d '\n'
  read db
  if [ -z $db ]
  then
    db="y"
  fi
done


####### Installation

stage=1
stages=3

# Install required Node modules
echo "----------"
tput setaf 2
echo "$stage/$stages Installation of required Node modules (npm install)"
tput sgr0
echo "----------"
npm install

# Build client files
stage=$((stage+1))
echo "----------"
tput setaf 2
if [ $mode == "1" ]
then
  echo "$stage/$stages Build client files (gulp build)"
  gulp build
else
  echo "$stage/$stages Build client files (gulp build-dev)"
  gulp build-dev
fi
tput sgr0
echo "----------"

# Create database scheme from models
stage=$((stage+1))
echo "----------"
tput setaf 2
echo "$stage/$stages Create database scheme from models (node server/bin/automigrate.js)"
tput sgr0
echo "----------"
if [ $db == "y" ]
then
  node server/bin/automigrate.js
else
  tput setaf 3
  echo "Skip"
  tput sgr0
fi
