from axon.session import capture_inbound_headers, patch_requests

try:
    from starlette.middleware.base import BaseHTTPMiddleware
    from starlette.requests import Request
except ImportError as e:
    raise ImportError(
        "FastAPI integration requires 'starlette'. Install it with: pip install cortex-axon-py[fastapi]"
    ) from e

from axon.session import capture_inbound_headers, patch_requests
from starlette.requests import Request
from starlette.responses import Response

async def instrument_with_axon(request: Request, call_next) -> Response:
    capture_inbound_headers(dict(request.headers))
    response = await call_next(request)
    return response

