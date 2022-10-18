# Nodejs project build automation
a project that helps you build jenkins jobs automatically using NodeJS
&nbsp;
## Description
Show all your available jobs, choose which one to build, show build logs and will save them into ```Logs``` folder
&nbsp;
## Getting Started
### Dependencies :
* Node v12 and higher 
* Tested on Jenkins v2
* Tested on Windows and Linux ( Ubuntu ), i assume it works on all OS that have Node installed
&nbsp;
&nbsp;
### Installing process :
#### Linux
```
sudo apt install git npm
git clone https://github.com/MrMo7Official/Nodejs-Jenkins-Build-Automation.git
cd Nodejs-Jenkins-Build-Automation
npm install
```
#### Windows
* first you have to download & setup [Node](https://nodejs.org/en/download/) and [Git](https://git-scm.com/downloads) from their official website then follow these steps :
```
git clone https://github.com/MrMo7Official/Nodejs-Jenkins-Build-Automation.git
cd Nodejs-Jenkins-Build-Automation
npm install
```
### Configuration :
* make sure to change ```jenkinsConfig.json``` configuration for example :
```
{
  "jenkinsUrl": "http://127.0.0.1:8080",
  "userName": "admin",
  "jenkinsToken": " Your api or access token " 
}
```
### get your Jenkins acess token :
* 1- go to jenkins page and login
* 2- click at your profile picture
* 3- configure
* 4- Api Token
### How to run :
```
node build.js
```
and have fun
## Author and contact info 
* Mohamed Waheed Shalabi
* email : mohamedshalabi.official@gmail.com
## Version History
* 0.1
    * first launch
