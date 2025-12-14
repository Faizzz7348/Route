#!/bin/bash
cd /workspaces/Route
git add client/src/components/data-table.tsx client/src/components/info-modal.tsx
git commit -m "feat: optimize draggable performance and add color marker presets menu

- Improve drag-and-drop performance with early exit checks and requestAnimationFrame
- Add 12 themed color presets (Blue, Red, Green, Orange, Violet, Yellow, Indigo, Gray, Pink, Teal, Amber, Black)
- Design follows theme with hover effects, smooth transitions, and dark mode support
- Quick color selection for common route colors
- Keep custom color picker for manual hex input
- Improve UX with visual color previews and labels"
git push
echo "Commit and push completed!"
