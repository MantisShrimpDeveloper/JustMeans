FROM python:3.9-rc-buster

COPY . /app

RUN apt-get update -y
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install libpq-dev python-dev default-jre nodejs -y

WORKDIR /app/app/react
RUN npm install
RUN npm run build

WORKDIR /app
RUN pip install -r requirements.txt

