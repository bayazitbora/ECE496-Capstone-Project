#!/bin/bash

# Create persistent directory if it doesn't exist
echo "Creating persistent database directory..."
mkdir -p persistentdb
chmod 777 persistentdb

# Wait for server to be ready
echo "Waiting for server to start..."
sleep 30

# Run migrations
echo "Running migrations..."
python manage.py makemigrations api
python manage.py migrate

# Create superuser if doesn't exist
echo "Setting up superuser..."
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@example.com', 'admin_password123') if not User.objects.filter(username='admin').exists() else print('Superuser already exists')" | python manage.py shell

echo "Database setup complete!" 
