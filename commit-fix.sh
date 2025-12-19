#!/bin/bash
cd /workspaces/Route
git add client/src/hooks/use-table-data.ts client/src/components/data-table.tsx client/src/lib/queryClient.ts
git commit -m "fix: resolve double-save issue by removing optimistic updates

- Remove problematic optimistic updates from mutations (updateRow, deleteRow, reorderRows)
- Change all onUpdateRow.mutate() to await onUpdateRow.mutateAsync() for server confirmation
- Update handleDragEnd to async/await pattern for proper drag & drop save
- Disable query auto-refetch (refetchOnWindowFocus, refetchOnMount) to prevent race conditions  
- Set mutation retry to 0 to avoid double-save on error
- All edits, drags, and updates now save on first attempt"
git push
echo "Commit and push completed!"
