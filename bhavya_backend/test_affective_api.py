import requests
import json

# UPDATED URL to V1
url = "http://localhost:8000/api/v1/affective/analyze/questions"

# Get a token first
login_url = "http://localhost:8000/api/v1/auth/token"
login_data = {"username": "testuser", "password": "password123"}
token = ""

try:
    login_res = requests.post(login_url, data=login_data)
    token = login_res.json().get("access_token")
    print(f"Token obtained: {token[:10]}...")
except Exception as e:
    print(f"Login failed: {e}")

data = {"answers": [1, 2, 0, 1, 3, 2, 1, 0, 1, 2]}
headers = {"Authorization": f"Bearer {token}"}

try:
    response = requests.post(url, json=data, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
