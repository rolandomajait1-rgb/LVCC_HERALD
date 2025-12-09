# Edit/Delete Button Position Fix

## Problem
Edit at Delete buttons sa related article cards ay nasa baba ng card at magkakaibang position sa iba't ibang components.

## Solution
I-move ang buttons sa top-right corner ng image para consistent sa lahat ng related article cards.

## Files Modified

### 1. ArticleDetail.jsx (✅ FIXED)
**File**: `frontend/src/pages/ArticleDetail.jsx`

**Changes**:
- Moved edit/delete buttons from bottom of card to top-right of image
- Changed from full-width buttons to icon-only buttons
- Added `z-10` for proper layering
- Increased icon size from 12 to 14 for better visibility
- Buttons now always visible (removed opacity transition)

**Before**:
```jsx
{(isAdmin() || isModerator()) && (
  <div className="flex gap-2 mt-3">
    <button>Edit</button>
    <button>Delete</button>
  </div>
)}
```

**After**:
```jsx
<div className="absolute top-2 right-2 flex gap-1 z-10">
  <button><Pencil size={14}/></button>
  <button><Trash2 size={14}/></button>
</div>
```

### 2. ExpandedArticleCard.jsx (✅ FIXED)
**File**: `frontend/src/components/ExpandedArticleCard.jsx`

**Changes**:
- Removed `opacity-0 group-hover:opacity-100` transition
- Added `z-10` for proper layering
- Increased icon size from 12 to 14
- Buttons now always visible

**Before**:
```jsx
<div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
  <button><Pencil size={12}/></button>
</div>
```

**After**:
```jsx
<div className="absolute top-2 right-2 flex gap-1 z-10">
  <button><Pencil size={14}/></button>
</div>
```

## Benefits

1. **Consistent Position** - Lahat ng edit/delete buttons nasa same position (top-right ng image)
2. **Better UX** - Buttons always visible, hindi na kailangan mag-hover
3. **Space Efficient** - Icon-only buttons save space
4. **Professional Look** - Cleaner card design
5. **Unified Design** - Same pattern across all components

## Testing

- [x] Edit button appears on top-right of related article images
- [x] Delete button appears beside edit button (admin only)
- [x] Buttons don't interfere with image hover effects
- [x] Buttons are clickable and functional
- [x] Consistent across ArticleDetail and ExpandedArticleCard
- [x] Icons are properly sized (14px)
- [x] Buttons have proper z-index layering
