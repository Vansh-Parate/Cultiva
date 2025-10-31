import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card component using centralized theme
 * Usage: <Card><CardHeader>...</CardHeader><CardContent>...</CardContent></Card>
 */
export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div
    className={`rounded-lg border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] shadow-sm ${className}`}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
}) => (
  <div className={`border-b border-[hsl(var(--card-border))] px-6 py-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className = '',
  as: Component = 'h3',
}) => (
  <Component
    className={`text-lg font-semibold text-[hsl(var(--card-foreground))] ${className}`}
  >
    {children}
  </Component>
);

export const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  className = '',
}) => (
  <p className={`text-sm text-[hsl(var(--muted-foreground))] ${className}`}>
    {children}
  </p>
);

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = '',
}) => <div className={`px-6 py-4 ${className}`}>{children}</div>;
