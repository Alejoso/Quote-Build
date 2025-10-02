# Quote-Build
It is a software for the administrative staff of the company OCIRAGA23 SAS who has to prepare material quotes for a construction project manually, and in consequence,  ineffectively. It is called Quote&Build and is a web application that will increase productivity at an administrative level, focusing on the civil works field. Unlike manually quoting each of the elements needed at the time of construction, our product will save time and make project management much simpler and easier.


# SetUp guide
There are going to be two main folders, `BackEnd` and `FrontEnd`. Below you will find the prerequisites required for both components, followed by specific installation instructions for Linux and Windows operating systems.



## Prerequisites

Before starting the installation, make sure you have the following installed on your system:

| Component | Version | Purpose |
|-----------|---------|---------|
| Python | 3.8+ | Django REST Framework backend |
| Node.js | 16.0+ | React frontend build system |
| npm | 8.0+ | JavaScript package management |
| Git | 2.20+ | Version control and repository cloning |

### Verify installations:

```bash
python3 --version
node --version
npm --version
git --version
```

### Installing Prerequisites

If you don't have these tools installed, follow the instructions below:

#### LINUX (Ubuntu/Debian)

##### Install Python 3.8+
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv
python3 --version
```

##### Install Node.js and npm
```bash
sudo apt install nodejs npm
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
npm --version
```

##### Install Git
```bash
sudo apt install git
git --version
```

#### WINDOWS

##### Install Python 3.8+
1. Go to [python.org](https://www.python.org/downloads/windows/)
2. Download the latest Python 3.8+ installer
3. Run the installer and **make sure to check "Add Python to PATH"**
4. Verify installation by opening Command Prompt and typing:
```cmd
python --version
pip --version
```

##### Install Node.js and npm
1. Go to [nodejs.org](https://nodejs.org/)
2. Download the LTS version for Windows
3. Run the installer (npm is included)
4. Verify installation by opening Command Prompt and typing:
```cmd
node --version
npm --version
```

##### Install Git
1. Go to [git-scm.com](https://git-scm.com/download/win)
2. Download Git for Windows
3. Run the installer with default settings
4. Verify installation by opening Command Prompt and typing:
```cmd
git --version
```



## LINUX (Ubuntu/Debian)
For Linux:

Backend
```bash
python3 -m venv venv
source ./venv/bin/activate
pip install -r requirements.txt
cd BackEnd/quoteAndBuild
python manage.py migrate
python3 manage.py runserver
```

Frontend
```bash
cd FrontEnd/quoteAndBuild
npm install
npm run dev
```

## WINDOWS
For Windows:

Backend
```bash
python -m venv venv
.\venv\scripts\activate
pip install -r requirements.txt
cd BackEnd/quoteAndBuild
python manage.py migrate
python manage.py runserver
```

Frontend
```bash
cd FrontEnd/quoteAndBuild
npm install
npm run dev
```



