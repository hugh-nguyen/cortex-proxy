import requests
from requests import Session
from flask import g
import copy

_original_request = requests.Session.request

def _forwarding_request(self, method, url, **kwargs):
    if hasattr(g, "inbound_headers"):
        inbound = dict(g.inbound_headers)
        inbound.pop("Host", None)
        
        # Merge inbound headers into kwargs['headers']
        if "headers" not in kwargs:
            kwargs["headers"] = {}
        for k, v in inbound.items():
            # Don’t overwrite if dev explicitly set something
            if k not in kwargs["headers"]:
                kwargs["headers"][k] = v

    return _original_request(self, method, url, **kwargs)

def patch_requests():
    """
    Monkey patch requests.Session.request to auto-inject inbound headers.
    """
    Session.request = _forwarding_request
