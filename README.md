# Quote-Build
It is a software for the administrative staff of the company OCIRAGA23 SAS who has to prepare material quotes for a construction project manually, and in consequence,  ineffectively. It is called Quote&Build and is a web application that will increase productivity at an administrative level, focusing on the civil works field. Unlike manually quoting each of the elements needed at the time of construction, our product will save time and make project management much simpler and easier.


# SetUp guide

## LINUX
There are going to be two main folders, here are the instructions to set up each section
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



