from flask import Flask, request, jsonify
import requests
from axon.integrations.flask import instrument_with_axon

app = Flask(__name__)

instrument_with_axon(app)

TARGET_URL = "http://localhost/b/getresult/"

PROXIES = {
    "http": "http://envoy:8080",
    "https": "http://envoy:8080"
}

@app.route('/a/getresult/')
def get_result():
    x = request.args.get('x', type=int)
    y = request.args.get('y', type=int)
    version = request.headers.get("X-Stack-Version")

    if x is None or y is None:
        return jsonify({"error": "Missing x or y"}), 400

    url = f"{TARGET_URL}?x={x}&y={y}"
    
    headers = {}
    if version:
        headers["X-Stack-Version"] = version

    try:
        response = requests.get(url, headers=headers, proxies=PROXIES)
        return response.json(), response.status_code
    except Exception as err:
        print("Error calling proxied URL:", err)
        return jsonify({"error": "Something went wrong"}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
