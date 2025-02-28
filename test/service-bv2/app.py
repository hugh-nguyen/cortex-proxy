from flask import Flask, request

app = Flask(__name__)

@app.route('/getresult/')
def get_result_v2():
    x = request.args.get('x', type=int)
    y = request.args.get('y', type=int)
    
    if x is None or y is None:
        return {"error": "Missing x or y"}, 400
    
    return {"result": x * y}

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5002)
