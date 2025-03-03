## Flask

```
from axon.flask.integrations import setup_flask_auto_header_forwarding

app = Flask(__name__)
setup_flask_auto_header_forwarding(app)
```

## Django
In your Django project’s settings.py, add the provided middleware:

In your Django project’s **settings.py**
```
MIDDLEWARE = [
    # ... other middleware ...
    'your_project_path.django_middleware.instrument_with_axon',
]
```

And ensure you call patch_requests() somewhere at startup (for example, in your app’s apps.py ready method)
```
from axon.session import patch_requests
patch_requests()
```

## FastAPI

The integration with FastAPI requires starlette. You will need to install cortex-axon-py using the following command
```
pip install cortex-axon-py[fastapi]
```

```
from fastapi import FastAPI
from fast_middleware import instrument_with_axon

app = FastAPI()
app.middleware("http")(instrument_with_axon)
```
