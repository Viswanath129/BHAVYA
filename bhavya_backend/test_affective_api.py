import requests
import json

url = "http://localhost:8000/api/v1/affective/analyze/questions"
data = {"answers": [1, 2, 0, 1, 3, 2, 1, 0, 1, 2]}

# Need auth now
LOGIN_URL = "http://localhost:8000/api/v1/auth/token"

try:
    # Login
    login_res = requests.post(LOGIN_URL, data={"username": "testuser", "password": "password123"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = requests.post(url, json=data, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
