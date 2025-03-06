from axon.session import capture_inbound_headers, patch_requests

def instrument_with_axon(app):
    @app.before_request
    def _capture_headers():
        from flask import request
        capture_inbound_headers(request.headers)
    
    patch_requests()
