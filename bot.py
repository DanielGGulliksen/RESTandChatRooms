import sys
import requests

urlBase = "http://localhost:5000/"

print("Result from Get:")
response = requests.get(urlBase + '/api/users')
print(response.status_code)
print(response)
sys.stdout.flush()