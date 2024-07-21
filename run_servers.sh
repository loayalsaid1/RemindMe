#!/bin/bash

# Function to handle script interruption
cleanup() {
    echo "Stopping servers..."
    kill $API_PID
    kill $APP_PID
    wait $API_PID
    wait $APP_PID
    echo "Servers stopped."
}

# Trap Ctrl+C (SIGINT) signal and call cleanup function
trap cleanup INT

# Start the API server in the background
REMIND_ME_MYSQL_USER=remind_me_dev REMIND_ME_MYSQL_PWD=Remind_me_dev_pwd1 REMIND_ME_MYSQL_HOST=localhost REMIND_ME_MYSQL_DB=remind_me_dev_db REMIND_ME_TYPE_STORAGE=db python3 -m api.v1.app &
API_PID=$!
echo "API server started with PID $API_PID"

# Start the app server in the background
REMIND_ME_MYSQL_USER=remind_me_dev REMIND_ME_MYSQL_PWD=Remind_me_dev_pwd1 REMIND_ME_MYSQL_HOST=localhost REMIND_ME_MYSQL_DB=remind_me_dev_db REMIND_ME_TYPE_STORAGE=db python3 -m app.app &
APP_PID=$!
echo "App server started with PID $APP_PID"

# Wait for both servers to finish
wait $API_PID
wait $APP_PID

