from flask import Flask
from .middleware import capture_inbound_headers
from .session import patch_requests

def setup_auto_header_forwarding(app: Flask, patch: bool = True):
    """
    1) Registers a before_request hook to capture inbound headers.
    2) Optionally monkey-patches requests if desired.
    """
    app.before_request(capture_inbound_headers)
    if patch:
        patch_requests()
