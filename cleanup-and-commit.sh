#!/bin/bash
# Clean up unused files and commit changes

# Remove unused commit scripts
rm -f commit-fix.sh commit-primereact.sh do-commit.sh commit.sh revert-changes.sh commit-inline-edit.sh commit-frozen-row.sh

# Stage all changes
git add -A

# Commit changes
git commit -m "chore: remove unused files and dependencies

- Remove unused commit script files (commit-*.sh, do-commit.sh, revert-changes.sh)
- Remove PrimeReact and PrimeIcons dependencies from package.json
- Remove PrimeReact CSS imports from main.tsx
- Clean up unused code after reverting to original table implementation"

# Push changes
git push

echo "✅ Cleanup completed and changes committed!"
