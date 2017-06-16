import { User } from '../user/user';
import { Item } from '../item/item';
import { ApiResponse } from '../resource/api-response.interface';

export interface LeadResponse extends ApiResponse {
  modified_date: number;
  user_id: string;
  item_id: string;
  buyer_phone_number: string;
  user?: User;
  item?: Item;
  survey_responses: SurveyResponse[];
}

export interface SurveyResponse {
  question_id: number;
  question: string;
  answer: {
    answer_id: number;
    answer: string;
  };
}
