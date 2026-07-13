import requests
import sys

BASE_URL = "http://localhost:8000/api/v1"

def test_routing():
    # 1. Login to get token
    print("Testing Login...")
    resp = requests.post(f"{BASE_URL}/auth/token", data={"username": "testuser", "password": "password123"})
    if resp.status_code != 200:
        print(f"Login failed: {resp.status_code}")
        print(resp.text)
        return False

    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("Login successful.")

    # 2. Test Insights Standardized Route
    print("Testing Insights...")
    resp = requests.get(f"{BASE_URL}/insights", headers=headers)
    if resp.status_code != 200:
        print(f"Insights failed: {resp.status_code}")
        return False
    print("Insights successful.")

    # 3. Test Journal Standardized Route (No trailing slash)
    print("Testing Journal...")
    resp = requests.get(f"{BASE_URL}/journal", headers=headers)
    if resp.status_code != 200:
        print(f"Journal failed: {resp.status_code}")
        return False
    print("Journal successful.")

    # 4. Test Check-in Standardized Route
    print("Testing Check-in Status...")
    resp = requests.get(f"{BASE_URL}/checkin/today", headers=headers)
    if resp.status_code != 200:
        print(f"Check-in status failed: {resp.status_code}")
        return False
    print("Check-in status successful.")

    # 5. Test Affective Standardized Route
    print("Testing Affective Analysis...")
    resp = requests.post(f"{BASE_URL}/affective/analyze/questions",
                         headers=headers,
                         json={"answers": [1, 2, 0, 1, 3, 2, 1, 0, 2, 1]})
    if resp.status_code != 200:
        print(f"Affective analysis failed: {resp.status_code}")
        print(resp.text)
        return False
    print("Affective analysis successful.")

    return True

if __name__ == "__main__":
    if test_routing():
        print("\nAll routing tests passed!")
        sys.exit(0)
    else:
        print("\nRouting tests failed!")
        sys.exit(1)
