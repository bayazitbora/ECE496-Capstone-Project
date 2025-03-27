import requests
import random

#README---------------------------------------------------------------------------------------
#This script comes with three functions that can be used to populate the DB
#it creates a file called GeneratedUsernames to keep track of the last users created in the DB by
#the script.
#---------------------------------------------------------------------------------------------
#COMMAND LINE USAGE:
#to create a user: python -c 'import populateDatabase; populateDatabase.register_user(number_of_users)'
#to create a profile: python -c 'import populateDatabase; populateDatabase.create_profiles()'
#to delete a user: python -c 'import populateDatabase; populateDatabase.delete_users()'

user_data_template = {
    "password": "Thisisademo",
    "email": "TestUser@mail.utoronto.ca",
    "teacher": "False",
    "first_name": "Test",
    "last_name": "User",
    "pos": "Testing",
    "gpa": "4.0",
    "grad_year": "2025",
    "minors": ["None"]
}

# List of 50 first and last names
first_names = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "William", "Elizabeth",
               "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen",
               "Christopher", "Nancy", "Daniel", "Lisa", "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra",
               "Donald", "Ashley", "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
               "Kenneth", "Dorothy", "Kevin", "Carol", "Brian", "Amanda", "George", "Melissa", "Edward", "Deborah"]

last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
              "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
              "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
              "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
              "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"]

engineering_disciplines = ["Mineral Engineering", "Chemical Engineering", "Civil Engineering", "Computer Engineering",
                           "Electrical Engineering", "Industrial Engineering", "Mechanical Engineering", "Materials Engineering"]

skills = ["Programming", "Writing", "Leadership"]
interests = ["Software", "Hardware", "Building", "Research"]

def register_user(end):
    for i in range(0, end):
        # Generate unique username and email for each user
        register_url = 'http://127.0.0.1:8000/api/register/'
        user_data = user_data_template.copy()
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        user_data['username'] = first_name + last_name + str(i)
        user_data['first_name'] = first_name
        user_data['last_name'] = last_name
        user_data['pos'] = random.choice(engineering_disciplines)
        user_data['email'] = first_name + last_name + str(i) + "@mail.utoronto.ca"
        #add username so we can delete later
        with open("GeneratedUsernames.txt", "a") as file:
            file.write(user_data['username'] + "\n")
        # Send POST request to register the user
        response = requests.post(register_url, json=user_data)
        print(f"Registered: {user_data['username']} {response.status_code}")

def get_superuser_token():
    login_url = 'http://127.0.0.1:8000/api/token/'
    creds = {"username": "mysuperuser", "password": "dontdeploythisuser"}
    response = requests.post(login_url, json=creds)
    if response.ok:
        return response.json().get("access")
    return None

def login_as_user(username):
    login_url = 'http://127.0.0.1:8000/api/token/'
    creds = {"username": username, "password": "Thisisademo"}
    response = requests.post(login_url, json=creds)
    if response.ok:
        return response.json().get("access")
    return None

def delete_users():
    delete_url = 'http://127.0.0.1:8000/api/deleteUser/'
    with open("GeneratedUsernames.txt", "r") as file:
        usernames = file.readlines()
    
    token = get_superuser_token()
    if not token:
        print("Failed to login as superuser")
        return

    headers = {"Authorization": f"Bearer {token}"}
    for username in usernames:
        username = username.strip()
        d = requests.post(delete_url, json={"toDelete": username}, headers=headers)
        print(f"Deleted {username}: {d.status_code}")

    open("generatedusernames.txt", "w").close()

def create_profiles():
    profile_url = 'http://127.0.0.1:8000/api/updateProfile/'
    with open("GeneratedUsernames.txt", "r") as file:
        usernames = file.readlines()
    
    for username in usernames:
        username = username.strip()
        profile_data = {}
        profile_data['profile'] = {}
        profile_data['profile']['courseCode'] = 'ECE496'
        profile_data['profile']['hoursToCommit'] = random.randint(1, 10)
        profile_data['profile']['interests'] = []
        profile_data['profile']['interests'].append(random.choice(interests))
        profile_data['profile']['skills'] =  []
        profile_data['profile']['skills'].append(random.choice(skills))
        token = login_as_user(username)
        headers = {"Authorization": f"Bearer {token}"}
        print(profile_data)
        p = requests.post(profile_url, json=profile_data, headers=headers)
        print(f"Made profile for {username}: {p.status_code}")
