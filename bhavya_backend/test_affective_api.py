import requests
import json

BASE_URL = "http://localhost:8000/api/v1"
url = f"{BASE_URL}/affective/analyze/questions"
data = {"answers": [1, 2, 0, 1, 3, 2, 1, 0, 1, 2]}

def test_affective():
    # 1. Login to get token (using testuser from seed.py)
    login_data = {
        "username": "testuser",
        "password": "password123"
    }
    try:
        print(f"Attempting login to {BASE_URL}/auth/token")
        response = requests.post(f"{BASE_URL}/auth/token", data=login_data)
        if response.status_code != 200:
            print(f"Login failed: {response.status_code}")
            print(f"Response: {response.text}")
            return
        token = response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("Login successful.")

        # 2. Analyze Questions
        print(f"Sending request to {url}")
        response = requests.post(url, json=data, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json() if response.status_code == 200 else response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_affective()
