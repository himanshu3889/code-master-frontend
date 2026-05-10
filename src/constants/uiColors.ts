export const UI_COLORS = {
  dark: {
    // Backgrounds
    bgPrimary: 'rgba(30, 41, 59, 0.5)',
    bgSecondary: 'rgba(255,255,255,0.06)',
    bgTertiary: 'rgba(255,255,255,0.04)',
    bgQuaternary: 'rgba(255,255,255,0.02)',
    bgHover: 'rgba(255,255,255,0.1)',
    bgTableHeader: 'rgba(0,0,0,0.2)',
    bgSelectOption: '#1e293b',
    
    // Text
    textPrimary: '#e2e8f0',
    textSecondary: '#94a3b8',
    textTertiary: '#64748b', // sometimes used for icons/placeholders
    textInverse: '#1e293b',
    
    // Borders
    borderPrimary: 'rgba(255,255,255,0.08)',
    borderSecondary: 'rgba(255,255,255,0.06)',
    borderHover: 'rgba(255,255,255,0.15)',
    borderPlainModeHover: '#cbd5e1',
    
    // Primary Color (Purple/Indigo)
    primary: '#6c5ce7',
    primaryHover: 'var(--cm-primary-hover)',
    primaryBgSubtle: 'rgba(108, 92, 231, 0.1)',
    primaryBgActive: 'rgba(108, 92, 231, 0.2)',
    primaryText: '#a29bfe',
    primaryBorder: 'rgba(108, 92, 231, 0.5)',
    
    // Danger/Warning
    danger: '#e17055',
    dangerHover: '#d63031',
  },
  light: {
    // Backgrounds
    bgPrimary: '#fff',
    bgSecondary: 'rgba(0,0,0,0.04)',
    bgTertiary: 'rgba(0,0,0,0.02)',
    bgQuaternary: 'rgba(0,0,0,0.01)',
    bgHover: 'rgba(0,0,0,0.08)',
    bgTableHeader: 'rgba(0,0,0,0.02)',
    bgSelectOption: '#ffffff',
    
    // Text
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    textTertiary: '#94a3b8',
    textInverse: '#e2e8f0',
    
    // Borders
    borderPrimary: 'rgba(0,0,0,0.08)',
    borderSecondary: 'rgba(0,0,0,0.06)',
    borderHover: 'rgba(0,0,0,0.15)',
    borderPlainModeHover: '#475569',
    
    // Primary Color (Purple/Indigo)
    primary: '#6c5ce7',
    primaryHover: 'var(--cm-primary-hover)',
    primaryBgSubtle: 'rgba(108, 92, 231, 0.05)',
    primaryBgActive: '#6c5ce7',
    primaryText: '#fff',
    primaryBorder: 'transparent',
    
    // Danger/Warning
    danger: '#e17055',
    dangerHover: '#d63031',
  }
} as const;

export type ThemeMode = 'dark' | 'light';

export const getThemeColors = (mode: ThemeMode) => UI_COLORS[mode];
