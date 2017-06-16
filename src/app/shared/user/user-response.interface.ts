import { ApiResponse } from '../resource/api-response.interface';

export interface UserResponse extends ApiResponse {
  micro_name: string;
  image: Image;
  location: Location;
  stats: UserStats;
  validations: UserValidations;
  verification_level: number;
  scoring_stars: number;
  scoring_starts: number;
  response_rate: string;
  online: boolean;
  received_reports: number;
  type: string;
  web_slug: string;
}

export interface Image {
  id: string;
  legacy_id: number;
  original_width: number;
  original_height: number;
  average_hex_color: string;
  urls_by_size: {
    original: string;
    small: string;
    large: string;
    medium: string;
    xlarge: string;
  }
}

export interface Location {
  id: number;
  approximated_latitude: number;
  approximated_longitude: number;
  city: string;
  zip: string;
  approxRadius: number;
  title?: string;
}

export interface UserStats {
  published: number;
  sold: number;
  favorites: number;
  send_reviews: number;
  received_reviews: number;
  notification_read_pending: number;
  purchased: number;
}

export interface UserValidations {
  email: boolean;
  mobile: boolean;
  facebook: boolean;
  google_plus: boolean;
  gender: boolean;
  location: boolean;
  picture: boolean;
  scoring_stars: number;
  level: number;
  birthday: boolean;
}
