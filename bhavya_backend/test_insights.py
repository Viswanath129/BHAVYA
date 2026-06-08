import requests

BASE_URL = "http://localhost:8000/api/v1"

def test_insights():
    # Login
    login_data = {"username": "newuser", "password": "password123"}
    login_response = requests.post(f"{BASE_URL}/auth/token", data=login_data)
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get insights
    response = requests.get(f"{BASE_URL}/insights/", headers=headers)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
    else:
        print(f"Error: {response.text}")

    # Get dashboard
    response = requests.get(f"{BASE_URL}/insights/dashboard", headers=headers)
    print(f"Dashboard Status Code: {response.status_code}")
    if response.status_code == 200:
        print(f"Dashboard Response: {response.json()}")
    else:
        print(f"Dashboard Error: {response.text}")

if __name__ == "__main__":
    test_insights()
