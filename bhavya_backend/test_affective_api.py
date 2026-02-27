import requests
import json

url = "http://localhost:8000/api/affective/analyze/questions"
data = {"answers": [1, 2, 0, 1, 3, 2, 1, 0, 1, 2]}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
