#!/bin/bash

export $(grep -v '^#' apps/quick-learn-backend/.env.dev | xargs)
node ./dist/apps/quick-learn-backend/main.js
