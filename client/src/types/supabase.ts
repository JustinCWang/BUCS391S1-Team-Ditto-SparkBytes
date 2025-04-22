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

export type FoodProps = {
  food_id?: string;
  food_category?: string;
  food_name?: string;
  allergens?: string;
  quantity?: number;
}

export type LikeProps = {
  like_count?: number;
  isLiked?: boolean;
}


export type EventCardProps = EventBasicProps & FoodProps & LikeProps;