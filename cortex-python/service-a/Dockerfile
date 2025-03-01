FROM python:3.9
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host=files.pythonhosted.org -r requirements.txt
COPY . .
CMD ["python", "app.py"]
