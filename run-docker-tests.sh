#!/bin/bash

# ======  DOCKER TEST RUNNER ======
# Usage:
# ./run-docker-tests.sh [api|ui|all] [browser]
#
# Examples:
# ./run-docker-tests.sh api
# ./run-docker-tests.sh ui chromium
# ./run-docker-tests.sh ui firefox
# ./run-docker-tests.sh all

COMMAND=$1
BROWSER=$2

CONTAINER_NAME=gamdom-tests
IMAGE_NAME=gamdom-test-image

echo "Building Docker image: $IMAGE_NAME..."
docker build -t $IMAGE_NAME .

if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
  echo "Removing old container..."
  docker rm -f $CONTAINER_NAME
fi

RUN_COMMAND=""

if [ -z "$COMMAND" ]; then
  echo "No command specified, running ALL tests (API + UI) inside Docker..."
  RUN_COMMAND="./run-tests.sh all"

elif [ "$COMMAND" == "api" ]; then
  echo "running API tests inside Docker..."
  RUN_COMMAND="./run-tests.sh api"

elif [ "$COMMAND" == "ui" ]; then
  if [ -z "$BROWSER" ]; then
    echo "specify browser for UI: chromium / firefox / webkit"
    exit 1
  fi
  echo "Running UI tests inside Docker on browser: $BROWSER..."
  RUN_COMMAND="./run-tests.sh ui $BROWSER"

elif [ "$COMMAND" == "all" ]; then
  echo "Running ALL tests (API + UI) inside Docker..."
  RUN_COMMAND="./run-tests.sh all"

else
  echo "Unknown command: $COMMAND"
  echo "Usage: ./run-docker-tests.sh [api|ui|all] [browser]"
  exit 1
fi

docker run --name $CONTAINER_NAME --rm \
  --env-file .env \
  -e TEST_TYPE=$COMMAND \
  -e BROWSER=$BROWSER \
  $IMAGE_NAME bash -c "$RUN_COMMAND"
