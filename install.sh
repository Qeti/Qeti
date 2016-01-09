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

# Install Strongloop (sudo npm install strongloop -g)?
strongloop="default"
until [ $strongloop == "y" ] || [ $strongloop == "n" ]
do
  echo "$(tput setaf 2)Install Strongloop?$(tput sgr0) (y/n) [y] >"|tr -d '\n'
  read strongloop
  if [ -z $strongloop ]
  then
    strongloop="y"
  fi
done



####### Installation

# 1. Install Bower
echo "----------"
tput setaf 2
echo "1/6 Bower installation (sudo npm install bower -g)"
tput sgr0
echo "----------"
sudo npm install bower -g

# 2. Install Strongloop
echo "----------"
tput setaf 2
echo "2/6 Strongloop installation (sudo npm install strongloop -g)"
tput sgr0
echo "----------"
if [ $strongloop == "y" ]
then
  sudo npm install strongloop -g
else
  tput setaf 3
  echo "Skip"
  tput sgr0
fi

# 3. Install required Node modules
echo "----------"
tput setaf 2
echo "3/6 Installation of required Node modules (npm install)"
tput sgr0
echo "----------"
npm install

# 4. Install required Bower modules
echo "----------"
tput setaf 2
echo "4/6 Installation of required Bower modules (bower install)"
tput sgr0
echo "----------"
bower install

# 5. Build client files
echo "----------"
tput setaf 2
if [ $mode == "1" ]
then
  echo "5/6 Build client files (gulp build)"
  gulp build
else
  echo "5/6 Build client files (gulp build-dev)"
  gulp build-dev
fi
tput sgr0
echo "----------"

# 6. Create database scheme from models
echo "----------"
tput setaf 2
echo "6/6 Create database scheme from models (node server/bin/automigrate.js)"
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
