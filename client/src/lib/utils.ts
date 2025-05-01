/**
 * Checks if an event is currently happening (with a 5-minute buffer before it ends).
 * All times are interpreted in the America/New_York timezone.
 * 
 * @param date - The event date in 'YYYY-MM-DD' format
 * @param startTime - The event start time in 'HH:MM' 24-hour format
 * @param endTime - The event end time in 'HH:MM' 24-hour format
 * @returns true if the event is currently happening; otherwise false
 */
export function isEventCurrentlyHappening(date: string, startTime: string, endTime: string): boolean {
  // Create a date object that accounts for local time zone
  const now = new Date();
  
  // Get the current date in Boston timezone formatted as 'YYYY-MM-DD'
  const currentDate = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'America/New_York' // Explicitly use Boston/Eastern time
  }).split('/').reverse().join('-').replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$1-$3-$2');
  
  // If the event is not today, return false early
  if (date !== currentDate) {
    return false;
  }
  
  // Get current time in total minutes (e.g., 14:30 => 870)
  const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
  
  // Parse event start and end times
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const eventStartInMinutes = startHour * 60 + startMinute;
  const eventEndInMinutes = endHour * 60 + endMinute;
  
  // Return true if current time is within the event window (excluding last 5 mins)
  return currentTimeInMinutes >= eventStartInMinutes && currentTimeInMinutes <= (eventEndInMinutes - 5);
}

// New helper function to get current date in YYYY-MM-DD format in Boston time zone
export function getCurrentDateInBostonTZ() {
  const now = new Date();
  const options = { 
    year: "numeric" as const, 
    month: "2-digit" as const, 
    day: "2-digit" as const,
    timeZone: 'America/New_York' // Eastern Time Zone (Boston)
  };
  
  // Format: MM/DD/YYYY -> YYYY-MM-DD
  const dateString = now.toLocaleDateString('en-US', options)
    .split('/')
    .reverse()
    .join('-')
    .replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$1-$3-$2');
  
  return dateString;
}