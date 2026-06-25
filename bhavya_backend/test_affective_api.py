import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_affective():
    # 1. Login to get token (using the user created in test_checkin.py)
    login_data = {
        "username": "newuser",
        "password": "password123"
    }

    try:
        print(f"Attempting login to {BASE_URL}/auth/token")
        response = requests.post(f"{BASE_URL}/auth/token", data=login_data)
        if response.status_code != 200:
            print(f"Login failed: {response.status_code}")
            return

        token = response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        url = f"{BASE_URL}/affective/analyze/questions"
        data = {"answers": [1, 2, 0, 1, 3, 2, 1, 0, 1, 2]}

        response = requests.post(url, json=data, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json() if response.status_code == 200 else response.text}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_affective()
