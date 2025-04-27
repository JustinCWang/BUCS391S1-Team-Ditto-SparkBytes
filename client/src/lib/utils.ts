export function isEventCurrentlyHappening(date: string, startTime: string, endTime: string): boolean {
  // Create a date object that accounts for local time zone
  const now = new Date();
  
  // Format current date in local time zone as YYYY-MM-DD
  const currentDate = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'America/New_York' // Explicitly use Boston/Eastern time
  }).split('/').reverse().join('-').replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$1-$3-$2');
  
  // First check if the event is today
  if (date !== currentDate) {
    return false;
  }
  
  const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
  
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const eventStartInMinutes = startHour * 60 + startMinute;
  const eventEndInMinutes = endHour * 60 + endMinute;
  
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