import { useTheme } from '../context/ThemeContext';

export const useDesignSystem = () => {
  const { theme } = useTheme();

  const isApple = theme === 'apple';
  const isCursor = theme === 'cursor';

  const colors = {
    // Primary
    primary: isApple ? 'bg-apple-primary text-apple-on-primary' : 'bg-cursor-primary text-cursor-on-primary',
    primaryText: isApple ? 'text-apple-primary' : 'text-cursor-primary',
    // Surface
    canvas: isApple ? 'bg-apple-canvas' : 'bg-cursor-canvas',
    surface: isApple ? 'bg-apple-canvas' : 'bg-cursor-surface-card',
    surface2: isApple ? 'bg-apple-canvas-parchment' : 'bg-cursor-canvas-soft',
    // Text
    text: isApple ? 'text-apple-ink' : 'text-cursor-ink',
    textSecondary: isApple ? 'text-apple-ink-muted-48' : 'text-cursor-muted',
    // Border
    border: isApple ? 'border-apple-hairline' : 'border-cursor-hairline',
    // Timeline colors (Cursor specific)
    timelineThinking: 'bg-cursor-timeline-thinking text-cursor-ink',
    timelineGrep: 'bg-cursor-timeline-grep text-cursor-ink',
    timelineRead: 'bg-cursor-timeline-read text-cursor-ink',
    timelineEdit: 'bg-cursor-timeline-edit text-cursor-ink',
    timelineDone: 'bg-cursor-timeline-done text-cursor-on-primary',
  };

  const typography = {
    // Headings
    heroDisplay: isApple ? 'font-apple-display text-apple-hero-display' : 'font-cursor-display text-cursor-display-mega',
    displayLg: isApple ? 'font-apple-display text-apple-display-lg' : 'font-cursor-display text-cursor-display-lg',
    displayMd: isApple ? 'font-apple-display text-apple-display-md' : 'font-cursor-display text-cursor-display-md',
    displaySm: isApple ? 'font-apple-display text-apple-lead' : 'font-cursor-display text-cursor-display-sm',
    // Body
    body: isApple ? 'font-apple-body text-apple-body' : 'font-cursor-body text-cursor-body-md',
    bodyStrong: isApple ? 'font-apple-body text-apple-body-strong' : 'font-cursor-body text-cursor-body-strong',
    caption: isApple ? 'font-apple-body text-apple-caption' : 'font-cursor-body text-cursor-caption',
    // Buttons
    button: isApple ? 'font-apple-body text-apple-body' : 'font-cursor-body text-cursor-button',
    buttonUtility: isApple ? 'font-apple-body text-apple-button-utility' : 'font-cursor-body text-cursor-button',
  };

  const radius = {
    pill: isApple ? 'rounded-apple-pill' : 'rounded-cursor-pill',
    button: isApple ? 'rounded-apple-pill' : 'rounded-cursor-md',
    card: isApple ? 'rounded-apple-lg' : 'rounded-cursor-lg',
    none: isApple ? 'rounded-apple-none' : 'rounded-none',
  };

  const spacing = {
    section: isApple ? 'py-apple-section' : 'py-cursor-section',
    lg: isApple ? 'p-apple-lg' : 'p-cursor-lg',
  };

  return {
    isApple,
    isCursor,
    colors,
    typography,
    radius,
    spacing,
  };
};
