export function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const getGridColumnStyles = (
  isPanelExpanded: boolean,
  _isOtherPanelShrunk: boolean,
  _isThisPanelShrunk: boolean
) => {
  if (isPanelExpanded) {
    return '1 / -1';
  }
  return 'auto';
};

export const getGridTemplateColumns = (size1: number, size2: number) => {
  const halfSize = Math.floor(size1 / 2);
  const floredSizeTwp = Math.floor(size2);
  return `calc(${halfSize}% - 6px) 12px calc(${floredSizeTwp}% - 6px)`;
};

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}
