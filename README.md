# Nodejs project build automation
a project that helps you build jenkins jobs automatically using NodeJS

## Description
Show all your available jobs, choose which one to build, show build logs and will save them into ```Logs``` folder

## Getting Started

### Dependencies

* Node v12 and higher 
* Tested on Jenkins v2
* Tested on Windows and Linux ( Ubuntu ), i assume it works on all OS that have Node installed


### Installing
* installing process
```
sudo apt install npm
git clone https://github.com/MrMo7Official/Nodejs-Jenkins-Build-Automation.git
cd Nodejs-Jenkins-Build-Automation
npm install
```

* make sure to change ```jenkinsConfig.json``` configuration for example :
```
{
  "jenkinsUrl": "http://127.0.0.1:8080",
  "userName": "admin",
  "jenkinsToken": " Your api or access token " 
}
```

### get your Jenkins acess token
* 1- go to jenkins page and login
* 2- click at your profile picture
* 3- configure
* 4- Api Token

### How to run :
```
node build.js
```
and have fun

## Authors

Contributors names and contact info

* Mohamed Waheed Shalabi
* email : mohamedshalabi.official@gmail.com

## Version History

* 0.1
    * first launch
