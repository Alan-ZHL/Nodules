# NodUleS: Course Forum and Notifications Platform
### Authors: ZHL, ZYP

## Instructions to run the project

### Step 0: Preparations
First of all, please make sure MongoDB has been installed with mongod process running. 
We choose to use the Ubuntu (20.04.3 LTS) image with MongoDB (version 5.0.3) provided on Docker Hub, and it works fine with this project. To get the image from Docker Hub, please use this command on your **host machine with Docker**:
```
docker pull mongo
```
For the system that runs the project, please ensure that the following packages have been installed:
```
apt update
apt upgrade
apt install git
apt install python3    # 3.8.10
apt install pip
apt install curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
# restart the container to enable nvm
nvm --version    # 0.39.0
nvm install --lts    # should be v16.13.0 at that time
npm --version    # 8.1.0
```

### Step 1: Restoring the Dependencies
Python Backend Supports:
(under root directory)
```
apt install python3.8-venv
python3 -m venv venv
source venv/bin/activate    # enter Python virtual env in the project
pip install flask flask-cors
```
React framework and dependencies:
(under root directory)
```
npm install
```

### Step 2: Running the Project
backend API server:
(under root directory) please conduct under Python virtual env:
```
python3 server.py
```
frontend server:
(under root directory) please conduct under a new shell cli:
```
npm run compile
npm start
```
Finally, please visit the main page via the [Project Entry Port](http://localhost:3000)!