import { useTheme } from '../context/ThemeContext';

export const useDesignSystem = () => {
  const { theme } = useTheme();

  const isBeige = theme === 'beige' || theme === 'apple';
  const isBlue = theme === 'blue' || theme === 'cursor';

  const colors = {
    // Primary
    primary: isBeige ? 'bg-apple-primary text-apple-on-primary' : 'bg-cursor-primary text-cursor-on-primary',
    primaryText: isBeige ? 'text-apple-primary' : 'text-cursor-primary',
    // Surface
    canvas: isBeige ? 'bg-apple-canvas' : 'bg-cursor-canvas',
    surface: isBeige ? 'bg-apple-canvas' : 'bg-cursor-surface-card',
    surface2: isBeige ? 'bg-apple-canvas-parchment' : 'bg-cursor-canvas-soft',
    // Text
    text: isBeige ? 'text-apple-ink' : 'text-cursor-ink',
    textSecondary: isBeige ? 'text-apple-ink-muted-48' : 'text-cursor-muted',
    // Border
    border: isBeige ? 'border-apple-hairline' : 'border-cursor-hairline',
    // Timeline colors (Cursor specific)
    timelineThinking: 'bg-cursor-timeline-thinking text-cursor-ink',
    timelineGrep: 'bg-cursor-timeline-grep text-cursor-ink',
    timelineRead: 'bg-cursor-timeline-read text-cursor-ink',
    timelineEdit: 'bg-cursor-timeline-edit text-cursor-ink',
    timelineDone: 'bg-cursor-timeline-done text-cursor-on-primary',
  };

  const typography = {
    // Headings
    heroDisplay: isBeige ? 'font-apple-display text-apple-hero-display' : 'font-cursor-display text-cursor-display-mega',
    displayLg: isBeige ? 'font-apple-display text-apple-display-lg' : 'font-cursor-display text-cursor-display-lg',
    displayMd: isBeige ? 'font-apple-display text-apple-display-md' : 'font-cursor-display text-cursor-display-md',
    displaySm: isBeige ? 'font-apple-display text-apple-lead' : 'font-cursor-display text-cursor-display-sm',
    // Body
    body: isBeige ? 'font-apple-body text-apple-body' : 'font-cursor-body text-cursor-body-md',
    bodyStrong: isBeige ? 'font-apple-body text-apple-body-strong' : 'font-cursor-body text-cursor-body-strong',
    caption: isBeige ? 'font-apple-body text-apple-caption' : 'font-cursor-body text-cursor-caption',
    // Buttons
    button: isBeige ? 'font-apple-body text-apple-body' : 'font-cursor-body text-cursor-button',
    buttonUtility: isBeige ? 'font-apple-body text-apple-button-utility' : 'font-cursor-body text-cursor-button',
  };

  const radius = {
    pill: isBeige ? 'rounded-apple-pill' : 'rounded-cursor-pill',
    button: isBeige ? 'rounded-apple-pill' : 'rounded-cursor-md',
    card: isBeige ? 'rounded-apple-lg' : 'rounded-cursor-lg',
    none: isBeige ? 'rounded-apple-none' : 'rounded-none',
  };

  const spacing = {
    section: isBeige ? 'py-apple-section' : 'py-cursor-section',
    lg: isBeige ? 'p-apple-lg' : 'p-cursor-lg',
  };

  return {
    isApple: isBeige, // Backward compatibility
    isBeige,
    isCursor: isBlue, // Backward compatibility
    isBlue,
    colors,
    typography,
    radius,
    spacing,
  };
};
