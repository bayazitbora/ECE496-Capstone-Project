echo off
echo Starting python Virtual Environment
call ./venv/scripts/activate && pip install -r requirements.txt
echo Starting Server...
python ./TeamBuilder/manage.py runserver