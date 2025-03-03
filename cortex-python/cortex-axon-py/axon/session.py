import requests
from requests import Session
import contextvars

inbound_headers_var = contextvars.ContextVar("inbound_headers", default={})

def capture_inbound_headers(headers):
    inbound_headers_var.set(dict(headers))

_original_request = requests.Session.request

def _forwarding_request(self, method, url, **kwargs):
    headers_to_forward = inbound_headers_var.get()
    if headers_to_forward and "X-Stack-Version" in headers_to_forward:
        x_stack_version = headers_to_forward["X-Stack-Version"]
        if "headers" not in kwargs:
            kwargs["headers"] = {}
        if "X-Stack-Version" not in kwargs["headers"]:
            kwargs["headers"]["X-Stack-Version"] = x_stack_version

    return _original_request(self, method, url, **kwargs)

def patch_requests():
    Session.request = _forwarding_request
