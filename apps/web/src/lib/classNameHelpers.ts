/**
 * Helper functions for applying theme-aware Tailwind classes
 * These ensure consistency across the app
 */

/**
 * Card/Container styling using theme variables
 */
export const cardClasses = {
  base: 'rounded-lg border bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow-sm',
  bordered: 'rounded-lg border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow-sm',
  noBorder: 'rounded-lg bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow-sm',
  hover: 'rounded-lg border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow-sm hover:shadow-md transition-shadow',
};

/**
 * Button styling using theme variables
 */
export const buttonClasses = {
  primary: 'btn-base btn-primary',
  secondary: 'btn-base btn-secondary',
  ghost: 'btn-base btn-ghost',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

/**
 * Text color utilities
 */
export const textClasses = {
  default: 'text-[hsl(var(--foreground))]',
  muted: 'text-[hsl(var(--muted-foreground))]',
  card: 'text-[hsl(var(--card-foreground))]',
  inverted: 'text-[hsl(var(--background))]',
};

/**
 * Background utilities
 */
export const bgClasses = {
  default: 'bg-[hsl(var(--background))]',
  card: 'bg-[hsl(var(--card))]',
  muted: 'bg-[hsl(var(--muted))]',
};

/**
 * Border utilities
 */
export const borderClasses = {
  default: 'border-[hsl(var(--border))]',
  card: 'border-[hsl(var(--card-border))]',
};

/**
 * Status badge styling
 */
export const badgeClasses = {
  success: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  warning: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  error: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  info: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  neutral: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300',
};

/**
 * Input styling
 */
export const inputClasses = {
  base: 'rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] px-3 py-2 text-sm placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]',
};

/**
 * Header/Title styling
 */
export const headingClasses = {
  h1: 'text-4xl font-bold text-[hsl(var(--foreground))]',
  h2: 'text-3xl font-semibold text-[hsl(var(--foreground))]',
  h3: 'text-2xl font-semibold text-[hsl(var(--foreground))]',
  h4: 'text-lg font-semibold text-[hsl(var(--foreground))]',
};
