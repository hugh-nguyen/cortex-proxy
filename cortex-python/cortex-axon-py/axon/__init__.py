from .session import capture_inbound_headers, patch_requests

def setup_auto_header_forwarding(patch: bool = True):
    if patch:
        patch_requests()
