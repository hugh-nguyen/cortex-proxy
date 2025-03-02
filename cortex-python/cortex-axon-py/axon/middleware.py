from flask import g, request

def capture_inbound_headers():
    """
    Store inbound request headers on flask.g
    or thread-local. This runs at the start of each request.
    """
    # Convert headers to a dict (they're case-insensitive in HTTP, but let's store them as-is)
    g.inbound_headers = dict(request.headers)
