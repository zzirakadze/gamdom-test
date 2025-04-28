#!/bin/bash

# ====== TEST RUNNER ======
# Usage:
# ./run-tests.sh                      -> Run all tests (API + UI) and generate Allure report
# ./run-tests.sh api                  -> Run API tests only
# ./run-tests.sh ui chromium          -> Run UI tests only on Chromium
# ./run-tests.sh ui firefox           -> Run UI tests only on Firefox
# ./run-tests.sh ui webkit            -> Run UI tests only on Webkit
# ./run-tests.sh all                  -> Run both API + UI tests and generate report

COMMAND=$1
BROWSER=$2


if [ -z "$IS_DOCKER" ]; then
  if grep -qE '/docker/' /proc/1/cgroup 2>/dev/null; then
    export IS_DOCKER=true
  else
    export IS_DOCKER=false
  fi
fi


if [ -z "$COMMAND" ]; then
  echo "No command specified, running ALL tests by default."
  npm run test:api
  npm run test:ui
  npm run allure:generate
  npm run allure:open

elif [ "$COMMAND" == "api" ]; then
  echo "Running API tests only..."
  npm run test:api
  npm run allure:generate
  npm run allure:open

elif [ "$COMMAND" == "ui" ]; then
  if [ -z "$BROWSER" ]; then
    echo "No browser specified for UI tests. Please provide: chromium / firefox / webkit."
    exit 1
  fi
  echo "Running UI tests on $BROWSER..."
  npm run test:$BROWSER
  npm run allure:generate
  npm run allure:open

elif [ "$COMMAND" == "all" ]; then
  echo "Running ALL tests (API + UI)..."
  npm run test:api
  npm run test:ui
  npm run allure:generate
  npm run allure:open

else
  echo "Unknown command: $COMMAND"
  echo "Usage:"
  echo "  ./run-tests.sh                  -> Run all tests by default (API + UI)"
  echo "  ./run-tests.sh api              -> Run API tests only"
  echo "  ./run-tests.sh ui [browser]     -> Run UI tests only (chromium/firefox/webkit)"
  echo "  ./run-tests.sh all              -> Run API + UI + generate Allure report"
  exit 1
fi
