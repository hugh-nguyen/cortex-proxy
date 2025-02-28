from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

ENVOY_URL = "http://envoy:8080"

@app.route('/a/getresult/')
def get_result():
    x = request.args.get('x', type=int)
    y = request.args.get('y', type=int)
    version = request.headers.get("X-API-Version")

    if x is None or y is None:
        return jsonify({"error": "Missing x or y"}), 400

    if version:
        response = requests.get(f"{ENVOY_URL}/b/getresult/?x={x}&y={y}", headers={"X-API-Version": version})
    else:
        response = requests.get(f"{ENVOY_URL}/b/getresult/?x={x}&y={y}")


    return response.json(), response.status_code

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
