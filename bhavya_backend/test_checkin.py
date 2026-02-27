import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_checkin():
    # 0. Signup (just in case)
    signup_data = {
        "username": "newuser",
        "email": "newuser@example.com",
        "password": "password123"
    }
    signup_response = requests.post(f"{BASE_URL}/auth/signup", json=signup_data)
    if signup_response.status_code == 200 or signup_response.status_code == 400:
        print(f"Signup: {signup_response.status_code}")
    else:
        print(f"Signup failed: {signup_response.text}")

    # 1. Login to get token
    login_data = {
        "username": "newuser",
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

        # 2. Submit Check-in
        payload = {
            "q_sleep_issue": 1,
            "q_energy": 2,
            "q_interest": 0,
            "q_focus": 3,
            "q_anxiety": 1,
            "q_social": 0,
            "q_routine": 2,
            "q_phone": 3,
            "q_motivation": 1,
            "q_overwhelm": 2
        }
        
        checkin_response = requests.post(f"{BASE_URL}/checkin/", json=payload, headers=headers)
        
        if checkin_response.status_code == 200:
            print("Check-in successful!")
            print(checkin_response.json())
        else:
            print(f"Check-in failed with status {checkin_response.status_code}")
            print(checkin_response.text)

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_checkin()
