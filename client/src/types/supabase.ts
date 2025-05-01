// Update your Database interface to include auth if needed
// Then, add these types for auth functions

// Credentials required for user registration
export type SignUpCredentials = {
  email: string;
  password: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
};

// Credentials required for user login
export type SignInCredentials = {
  email: string;
  password: string;
};

// Basic properties for representing an event
export type EventBasicProps = {
  event_id?: string;
  name: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  description: string;
  building?: string;
  organizer_id?: string;
}

// Information about food served at events (optional fields for flexibility)
export type FoodProps = {
  food_id?: string;
  food_category?: string;
  food_name?: string;
  allergens?: string;
  quantity?: number;
}

// Like state data for event cards
export type LikeProps = {
  like_count?: number;
  isLiked?: boolean;
}

// User profile record from the database
export type UserRecord = {
  user_id: string;
  first_name: string;
  last_name: string;
  bu_email: string;
  phone_num?: string;
  role: string;
  avatar_path?: string | null;
  notifications?: boolean;
};

// Combined props used to render a full Event Card component
export type EventCardProps = EventBasicProps & FoodProps & LikeProps;