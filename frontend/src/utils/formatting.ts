/**
 * Format a date string or Date object to a readable date format
 */
export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format a date string or Date object to a readable date and time format
 */
export function formatDateTime(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

/**
 * Calculate time elapsed since a given date string
 * Returns a human-readable string like "5m" or "2h 30m"
 */
export function calculateTimeElapsed(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

/**
 * Format a blood pressure value from systolic and diastolic numbers
 */
export function formatBloodPressure(systolic?: number, diastolic?: number): string {
  if (systolic && diastolic) {
    return `${systolic}/${diastolic}`;
  }
  return "--/--";
}
