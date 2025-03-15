# ECE496 Capstone

## Docker Setup

This is the easiest way to start working on our project.

Make sure you are in the root directory of our project (where the `docker-compose.yml` file is located).

### Verify Docker Installation

To verify Docker is installed, run:

```sh
docker --version
```

### Starting Docker Containers

To start the Docker containers, use:

```sh
docker compose up
```

If you need to rebuild the images, use:

```sh
docker compose up --build
```

After running these commands, you should be able to access the frontend and the backend in the browser using the links displayed.

### Stopping Docker Containers

To stop the Docker containers, use:

```sh
docker compose down
```

### Running Commands in Docker Containers

When running a Docker container, you can use these commands:

#### Make Migrations for the Database

```sh
docker compose exec backend python /app/backend/manage.py makemigrations
```

#### Run Migrate Command

```sh
docker compose exec backend python /app/backend/manage.py migrate
```

#### Create Superuser

```sh
docker compose exec backend python /app/backend/manage.py createsuperuser
```

## Django Backend

To connect to the backend on your browser you can either:

1. Run the server locally, and connect via [http://localhost:8000/api/](http://localhost:8000/api/) or [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/)
   - Do the [Set up](#set-up)
   - See [The Starting the development server section](#starting-the-development-server)
2. to view examples of requests that can be made see the TeamBuilder\api\test.rest file.

## Set up

1. install python
2. install python virtual environments using
   - C:\\...\\Backend> `pip install virtualenv`
3. Create the virtual environment using:
   - C:\\...\\Backend> `python -m venv venv`
   - Ensure the `venv` folder was created in the project folder
4. Start the virtual environment:
   Run:\
   C:\\...\\Backend> `./venv/scripts/activate`\
5. Install Django: https://docs.djangoproject.com/en/5.1/howto/windows/

6. if you are developing on the backend you will also need to install the package requirements from requirements.txt
   - C:\\...\\Backend> `pip install -r requirements.txt`
   - You can also run (Windows only) `./runserver.bat` which installs packages as well.
7. You will need to set up secret keys in /TeamBuilder/Settings.py (Do not push these keys to github) .\
   Change: `"SIGNING_KEY": os.environ["SECRET_KEY"]` to `"SIGNING_KEY": "ARandomSecretKey"`\
   Change: `SECRET_KEY = os.environ["SECRET_KEY"]` to `SECRET_KEY = "ARandomSecretKey"`

8. To make the database you need to run:\
   Run:\
   C:\\...\\Backend> `python /TeamBuilder/manage.py makemigrations`\
   Then:\
   C:\\...\\Backend> `python /TeamBuilder/manage.py migrate`
9. Create a super user (admin user) so you can login to the admin site and view the database.\
   Type and fill in the prompts:\
   C:\\...\\Backend> `python /TeamBuilder/manage.py createsuperuser`

## Starting the development Server

1. install python and python virtual environments if not already installed.
2. To start the development Server, run the (Windows only) runserver.bat script or run the below commands.
   - This will launch the virtual environment, install packages, and then run the Django server on port 8000

Type:\
C:\\...\\Backend> `.\runserver.bat`\
or\
Run:\
C:\\...\\Backend> `./venv/scripts/activate` \
 Then:\
C:\\...\\Backend> `pip install -r requirements.txt`\
 Then the start command:\
C:\\...\\Backend> `python /TeamBuilder/manage.py runserver`

## Virtual Environments

[!WARNING]\
It is important when working in the backend to always install python packages in the virtual environment.

To activate the virtual environment, type:\
C:\\...\\Backend> `./venv/scripts/activate`

To update the included packages in the git repo run the following **in the virtual environment**:\
(venv) PS C:\\...\\Backend> `pip freeze > requirements.txt`

To deactivate the virtual environment type:\
(venv) PS C:\\...\\Backend> `deactivate`

## Accessing the admin site

In the admin site you can view all models in the database, as well as any objects created.
To access the site you need to have created a super user (See the [Set up](#set-up))
Then go to: http://127.0.0.1:8000/admin/ and login.

## React Frontend

To connect to the frontend on your browser you can

1. Run the server locally, and connect via localhost
   - Do the [Set Up](#frontend-set-up)
   - See [Starting the frontend section](#running-the-frontend-in-browser)
2. Connect to ... (Work in progress)

### Frontend set Up

1. Install Node.js and clone this repository
2. go into the "frontend" folder using
   `cd frontend`
3. download the latest packages for the frontend automatically using
   `npm install`

### Running the frontend in browser

1. Use the command
   `npm run dev`
2. Click on the localhost link that appears in your terminal to see the frontend in browser

### Frontend Prototype

[Figma File](https://www.figma.com/design/9oaN7h15Nrf5LuskqgqAzx/Teammate-Finder?node-id=0-1&t=JQP5XCBwL9L3vNPV-1)
