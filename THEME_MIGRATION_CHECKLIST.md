# Theme Migration Checklist

## Goal
Convert all pages from hardcoded colors to centralized CSS variables for light/dark mode support.

## Strategy
Use `classNameHelpers.ts` patterns to maintain consistency across pages.

## Pages to Update

### ✅ DONE
- [x] Layout.tsx - Foundation (controls all pages)
- [x] Design System (theme.ts, index.css, UI components)

### 📋 TODO (Priority Order)

#### 1. Dashboard.tsx (724 lines)
**Current State**: Dark hardcoded theme (slate-900, teal, etc)
**Changes Needed**:
- [ ] Container: `bg-slate-950` → `bg-[hsl(var(--background))]`
- [ ] Text: `text-slate-100` → `text-[hsl(var(--foreground))]`
- [ ] Cards: `bg-slate-900/70 border-slate-800` → Use `cardClasses.bordered`
- [ ] Buttons: `bg-teal-600` → Use `buttonClasses.primary`
- [ ] Badges: Status colors → Use `badgeClasses`
- [ ] Replace all hardcoded color refs

**Estimated Impact**: High - Main page users see first

#### 2. MyPlants.tsx
**Current State**: Light theme with generic styling
**Changes Needed**:
- [ ] Card styling with theme variables
- [ ] Plant grid layout using theme spacing
- [ ] Status badges using `badgeClasses`
- [ ] Buttons using `buttonClasses`

**Estimated Impact**: Medium - Common page

#### 3. Care.tsx
**Current State**: Task management interface
**Changes Needed**:
- [ ] Task cards using theme
- [ ] Status indicators using badges
- [ ] Form inputs using `inputClasses`
- [ ] Buttons and CTAs themed

**Estimated Impact**: Medium - Core feature

#### 4. Community.tsx
**Current State**: Feed/social interface
**Changes Needed**:
- [ ] Post cards themed
- [ ] Comment styling themed
- [ ] User interaction buttons themed
- [ ] Status indicators themed

**Estimated Impact**: Low-Medium

#### 5. FindPlant.tsx
**Current State**: Plant identification interface
**Changes Needed**:
- [ ] Results cards themed
- [ ] Search input styled with theme
- [ ] Action buttons themed
- [ ] Loading states themed

**Estimated Impact**: Low

## Implementation Steps

### For Each Page:
1. **Identify hardcoded colors** - Search for:
   - `bg-` classes (background colors)
   - `text-` classes (text colors)
   - `border-` classes (border colors)
   - Inline style attributes with colors

2. **Replace with CSS variables**:
   ```jsx
   // ❌ BEFORE
   <div className="bg-white border border-gray-200 text-gray-900">

   // ✅ AFTER
   <div className="bg-[hsl(var(--card))] border border-[hsl(var(--card-border))] text-[hsl(var(--card-foreground))]">
   ```

3. **Use helper functions**:
   ```jsx
   import { cardClasses, buttonClasses, badgeClasses, textClasses } from '@/lib/classNameHelpers';

   <div className={cardClasses.bordered}>
     <button className={buttonClasses.primary}>Click</button>
   </div>
   ```

4. **Test in both modes**:
   - Light mode (default)
   - Dark mode (toggle in browser devtools or system preference)

## Common Patterns to Replace

### Backgrounds
```
❌ bg-white → ✅ bg-[hsl(var(--card))]
❌ bg-gray-50 → ✅ bg-[hsl(var(--background))]
❌ bg-slate-900 → ✅ bg-[hsl(var(--card))]
❌ bg-slate-950 → ✅ bg-[hsl(var(--background))]
```

### Text Colors
```
❌ text-gray-900 → ✅ text-[hsl(var(--foreground))]
❌ text-gray-600 → ✅ text-[hsl(var(--muted-foreground))]
❌ text-slate-100 → ✅ text-[hsl(var(--foreground))]
❌ text-slate-400 → ✅ text-[hsl(var(--muted-foreground))]
```

### Borders
```
❌ border-gray-200 → ✅ border-[hsl(var(--border))]
❌ border-slate-800 → ✅ border-[hsl(var(--border))]
❌ border-teal-500 → ✅ Use status badges or theme primary
```

### Status Indicators
```
❌ Custom colored spans → ✅ badgeClasses.success/warning/error/info
❌ Hardcoded green/red/yellow → ✅ Use semantic badge variants
```

## Testing Checklist

After updating each page:
- [ ] Light mode looks good
- [ ] Dark mode works correctly
- [ ] Text is readable (sufficient contrast)
- [ ] Buttons are clickable
- [ ] Cards have proper spacing
- [ ] No hardcoded colors visible
- [ ] Responsive design still works

## Quick Commands

**Find hardcoded colors in a file**:
```bash
grep -E "bg-(white|gray|slate|blue|teal|green|red)" apps/web/src/pages/PageName.tsx
```

**View CSS variables**:
```bash
cat apps/web/src/index.css | grep "^    --"
```

**Test dark mode** (in browser devtools):
```js
document.documentElement.classList.add('dark')
```

## Final Checklist

- [ ] Dashboard themed
- [ ] MyPlants themed
- [ ] Care themed
- [ ] Community themed
- [ ] FindPlant themed
- [ ] All pages tested in light mode
- [ ] All pages tested in dark mode
- [ ] No hardcoded colors remain
- [ ] Build passes
- [ ] No console errors

## Notes

- CSS variables default to light mode
- Dark mode applied via `@media (prefers-color-scheme: dark)` + manual `.dark` class
- Use `hsl(var(--variable))` syntax for proper color interpolation
- Never use hardcoded hex/rgb colors - always use CSS variables
- Keep spacing consistent (use theme spacing values)
- Test accessibility (color contrast ratios)
