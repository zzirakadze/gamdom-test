FROM mcr.microsoft.com/playwright:v1.52.0-jammy

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN apt-get update && \
    apt-get install -y default-jre default-jdk && \
    apt-get clean

RUN npm install -g allure-commandline


COPY . .

RUN chmod +x ./run-tests.sh

CMD ["./run-tests.sh"]
