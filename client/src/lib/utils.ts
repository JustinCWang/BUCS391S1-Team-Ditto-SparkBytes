export function isEventCurrentlyHappening(date: string, startTime: string, endTime: string): boolean {
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  
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