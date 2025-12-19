#!/bin/bash
cd /workspaces/Route
git add .env.example client/src/pages/calendar.tsx server/db.ts server/storage.ts
git commit -m "feat: add local storage support for development and remove calendar header text

- Configure MemStorage for development mode when DATABASE_URL is not set
- Update storage.ts to conditionally use MemStorage vs DatabaseStorage
- Update .env.example to document development mode with NODE_ENV=development
- Remove 'Delivery Calendar' heading and subtitle from calendar page
- Allow development without database connection using in-memory storage"
git push
echo "Commit and push completed!"
