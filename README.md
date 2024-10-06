# ECE496 Capstone - Django Backend
To connect to the backend on your browser you can either:
1. Run the server locally, and connect via [http://localhost:8000/api/](http://localhost:8000/api/) or [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/)
    - Do the [Set up](#set-up)
    - See [The Starting the development server section](#starting-the-development-server)
2. to view examples of requests that can be made see the TeamBuilder\api\test.rest file.

## Set up
1. install python
2. install python virtual environments using
    - C:\\...\\Capstone> `pip install virtualenv`
3. Create the virtual environment using:
    - C:\\...\\Capstone> `python -m venv venv`
    - Ensure the `venv` folder was created in the `Capstone` project folder
4. Install Django: https://docs.djangoproject.com/en/5.1/howto/windows/

5. if you are developing on the backend you will also need to install the package requirements from requirements.txt
    - C:\\...\\Capstone> `pip install -r requirements.txt`
    - You can also run (Windows only) `./runserver.bat` which installs packages as well.
6. You will need to set up secret keys in /TeamBuilder/Settings.py (Do not push these keys to github) .\
    Change: `"SIGNING_KEY": os.environ["SECRET_KEY"]` to `"SIGNING_KEY": "ARandomSecretKey"`\
    Change: `SECRET_KEY = os.environ["SECRET_KEY"]` to `SECRET_KEY = "ARandomSecretKey"`

7. To make the database you need to run:\
    Run:\
    C:\\...\\Capstone> `./venv/scripts/activate`\
    Then:\
    C:\\...\\Capstone> `python /TeamBuilder/manage.py makemigrations`\
    Then:\
    C:\\...\\Capstone> `python /TeamBuilder/manage.py migrate`
8. Create a super user (admin user) so you can login to the admin site and view the database.\
    Type and fill in the prompts:\
    C:\\...\\Capstone> `python /TeamBuilder/manage.py createsuperuser`

## Starting the development Server
1. install python and python virtual environments if not already installed.
2. To start the development Server, run the (Windows only) runserver.bat script or run the below commands. 
    -   This will launch the virtual environment, install packages, and then run the Django server on port 8000

Type:\
C:\\...\\Capstone> `.\runserver.bat`\
or\
Run:\
C:\\...\\Capstone> `./venv/scripts/activate` \
    Then:\
C:\\...\\Capstone> `pip install -r requirements.txt`\
    Then the start command:\
C:\\...\\Capstone> `python /TeamBuilder/manage.py runserver`

## Virtual Environments
[!WARNING]\
It is important when working in the backend to always install python packages in the virtual environment.

To activate the virtual environment, type:\
C:\\...\\Capstone> `./venv/scripts/activate`

To update the included packages in the git repo run the following **in the virtual environment**:\
(venv) PS C:\\...\\Capstone> `pip freeze > requirements.txt`

To deactivate the virtual environment type:\
(venv) PS C:\\...\\Capstone> `deactivate`

## Accessing the admin site
In the admin site you can view all models in the database, as well as any objects created.
To access the site you need to have created a super user (See the [Set up](#set-up))
Then go to: http://127.0.0.1:8000/admin/ and login.