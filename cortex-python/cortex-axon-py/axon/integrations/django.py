from axon.session import capture_inbound_headers, patch_requests

def instrument_with_axon(get_response):
    def middleware(request):
        headers = {}
        for key, value in request.META.items():
            if key.startswith("HTTP_"):
                header_name = key[5:].replace("_", "-").title()
                headers[header_name] = value
        if "CONTENT_TYPE" in request.META:
            headers["Content-Type"] = request.META["CONTENT_TYPE"]
        if "CONTENT_LENGTH" in request.META:
            headers["Content-Length"] = request.META["CONTENT_LENGTH"]

        capture_inbound_headers(headers)
        response = get_response(request)
        return response

    return middleware
