# GreenCare Design System

## Overview

GreenCare now has a centralized, cohesive design system that ensures consistency across the entire app. All UI components use this unified theme system.

## Core Files

1. **`src/lib/theme.ts`** - TypeScript configuration with all design tokens
2. **`src/index.css`** - CSS variables for light/dark modes + utility classes
3. **`src/components/ui/`** - Reusable UI components (Card, Badge, Button, etc.)

## Color Palette

### Primary Brand Color (Emerald Green)
- Used for CTA buttons, active states, highlights
- CSS Variables: `--primary-50` through `--primary-900`
- Primary action color: `--primary-600`

### Neutral Colors
- Used for backgrounds, text, borders
- CSS Variables: `--neutral-50` through `--neutral-900`
- Page background: `--background`
- Text color: `--foreground`

### Status Colors
- `--success`: #10b981 (Green)
- `--warning`: #f59e0b (Amber)
- `--error`: #ef4444 (Red)
- `--info`: #3b82f6 (Blue)

## Theme Modes

### Light Mode (Default)
- Clean white backgrounds
- Dark text on light backgrounds
- Subtle borders

### Dark Mode
- Dark blue-gray backgrounds
- Light text on dark backgrounds
- Slightly lighter borders

Automatically respects system preference via `prefers-color-scheme` media query.

## Using CSS Variables

All components should use CSS variables instead of hardcoded colors:

```css
/* ❌ WRONG */
.button {
  background-color: #22c55e;
}

/* ✅ RIGHT */
.button {
  background-color: hsl(var(--primary-600));
}
```

## Using Tailwind Classes

Tailwind classes also support the theme:

```jsx
/* Light mode - white card with border */
<div className="bg-card border border-[hsl(var(--card-border))] text-card-foreground">
  Content
</div>
```

## Component Library

### Card

```jsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

<Card>
  <CardHeader>
    <CardTitle>Plant Info</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### Badge

```jsx
import { Badge } from '@/components/ui';

<Badge variant="success">Active</Badge>
<Badge variant="warning">Needs Water</Badge>
<Badge variant="error">Disease</Badge>
<Badge variant="info">Info</Badge>
```

### Button

```jsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md">Click Me</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost" isLoading>Loading...</Button>
```

## Spacing Scale

CSS variables for consistent spacing:
- `--spacing-xs`: 0.25rem (4px)
- `--spacing-sm`: 0.5rem (8px)
- `--spacing-md`: 1rem (16px)
- `--spacing-lg`: 1.5rem (24px)
- `--spacing-xl`: 2rem (32px)

## Typography

- **Font Family**: Museo Sans (fallback to system fonts)
- **Font Weight**: Light (300), Normal (400), Medium (500), Bold (700)
- **Line Height**: Tight (1.2), Normal (1.5), Relaxed (1.75)

## Dark Mode Implementation

### Automatic (Respects System)
```css
@media (prefers-color-scheme: dark) {
  :root {
    /* Dark mode CSS variables */
  }
}
```

### Manual Toggle (with `.dark` class)
```jsx
<div className="dark">
  {/* Content automatically uses dark theme */}
</div>
```

## Transitions

For smooth interactions:
- `--transition-fast`: 150ms
- `--transition-base`: 250ms (default)
- `--transition-slow`: 350ms

Use Tailwind classes: `transition-fast`, `transition-base`, `transition-slow`

## Best Practices

1. **Always use theme colors** - Don't hardcode colors
2. **Use component library** - Card, Badge, Button instead of custom divs
3. **Respect spacing scale** - Use predefined spacing instead of random values
4. **Support dark mode** - Test all pages in dark mode
5. **Use CSS variables** - For dynamic theming and consistency

## Migrating Pages

When updating a page to use the new design system:

1. Replace hardcoded colors with CSS variables
2. Use reusable components from `src/components/ui/`
3. Update card styling to use `<Card>` component
4. Replace status badges with `<Badge>` component
5. Replace buttons with `<Button>` component
6. Test in both light and dark modes

## Example Page Migration

### Before (Generic)
```jsx
<div className="bg-white border border-gray-200 p-6">
  <h2 className="text-lg font-semibold text-gray-900">Title</h2>
  <p className="text-sm text-gray-600">Description</p>
  <button className="bg-green-600 text-white px-4 py-2">Click</button>
</div>
```

### After (Themed)
```jsx
import { Card, CardTitle, CardDescription, Button } from '@/components/ui';

<Card>
  <CardTitle>Title</CardTitle>
  <CardDescription>Description</CardDescription>
  <Button variant="primary">Click</Button>
</Card>
```

## Next Steps

1. Apply theme to Dashboard page
2. Apply theme to MyPlants page
3. Apply theme to Care page
4. Apply theme to Community page
5. Apply theme to FindPlant page
6. Comprehensive dark mode testing
7. Performance optimization

## Questions?

Refer to:
- `src/lib/theme.ts` - All available design tokens
- `src/index.css` - CSS variable definitions
- `src/components/ui/` - Component examples
