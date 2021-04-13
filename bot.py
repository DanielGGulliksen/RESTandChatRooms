import sys
import requests
import json
import urllib.request

urlBase = "http://localhost:5000/"


print("Result from Get:")
response = requests.get(urlBase + '/api/users')
print(response.status_code)
print(response)

"""
newConditions = {"name": "Winston"}
params = json.dumps(newConditions).encode('utf8')
req = urllib.request.Request(urlBase + '/api/users', data=params, headers={'content-type': 'application/json'})
response = urllib.request.urlopen(req)

print(response.read().decode('utf8'))
"""
sys.stdout.flush()

