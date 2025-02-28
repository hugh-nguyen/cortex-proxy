from flask import Flask, request
import requests

app = Flask(__name__)

ENVOY_URL = "http://envoy:8080"

@app.route('/getresult/')
def get_result():
    x = request.args.get('x', type=int)
    y = request.args.get('y', type=int)
    version = request.headers.get("X-API-Version")  # Extract version from headers

    if x is None or y is None:
        return {"error": "Missing x or y"}, 400

    if version not in ["1.0.38", "1.0.45"]:
        return {"error": "Invalid version"}, 400

    # Forward request to Envoy with the correct header
    response = requests.get(f"{ENVOY_URL}/getresult/?x={x}&y={y}", headers={"X-API-Version": version})

    return response.json(), response.status_code

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
