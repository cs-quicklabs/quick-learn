#!/bin/bash

# Start both backend and frontend services
# This script runs both services in the background

echo "Starting Quick Learn Backend and Frontend..."

# Start backend in the background
echo "Starting backend on port 3001..."
cd /app && node backend/main.js &
BACKEND_PID=$!

# Start frontend in the background
echo "Starting frontend on port 3000..."
cd /app/frontend/apps/quick-learn-frontend && PORT=3000 HOSTNAME=0.0.0.0 node server.js &
FRONTEND_PID=$!

# Function to cleanup processes on exit
cleanup() {
    echo "Stopping services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap signals for graceful shutdown
trap cleanup SIGTERM SIGINT

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Both services are running!"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
