# ECE496 Capstone - Django Backend
To connect to the backend on your browser you can either:
1. Run the server locally, and connect via [http://localhost:8000](http://localhost:8000)
    - Do the [Set up](#set-up)
    - See [The Starting the development server section](#starting-the-development-server)
2. Connect to ... (Work in progress)

## Set up
1. install python
2. install python virtual environments using
    - C:\\...\\Capstone> `pip install virtualenv`
3. Create the virtual environment using:
    - C:\\...\\Capstone> `python -m venv C:\\path\\To\\Project\\...\\Capstone>`
    - Ensure the `venv` folder was created in the `Capstone` project folder
4. if you are developing on the backend you will also need to install the package requirements from requirements.txt
    - C:\\...\\Capstone> `pip install -r requirements.txt`
    - You can also run `./runserver.bat` which installs packages as well.

## Starting the development Server
1. install python and python virtual environments if not already installed.
2. To start the development Server, run the runserver.bat script. 
    -   This will launch the virtual environment, install packages, and then run the Django server on port 8000

Type:\
C:\\...\\Capstone> `.\runserver.bat`

## Virtual Environments
[!WARNING]\
It is important when working in the backend to always install python packages in the virtual environment.

To activate the virtual environment, type:\
C:\\...\\Capstone> `./venv/scripts/activate`

To update the included packages in the git repo run the following **in the virtual environment**:\
(venv) PS C:\\...\\Capstone> `pip freeze > requirements.txt`

To deactivate the virtual environment type:\
(venv) PS C:\\...\\Capstone> `deactivate`
