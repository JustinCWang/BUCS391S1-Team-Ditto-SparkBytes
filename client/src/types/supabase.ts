// Update your Database interface to include auth if needed
// Then, add these types for auth functions

export type SignUpCredentials = {
  email: string;
  password: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
};

export type SignInCredentials = {
  email: string;
  password: string;
};

export type EventProps = {
  event_id?: string;
  name: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  description: string;
  organizer_id?: string;
  food_type?: string;
  food_id?: string;
}