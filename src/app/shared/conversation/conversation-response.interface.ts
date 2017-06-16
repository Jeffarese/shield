import { LeadResponse } from './lead-response.interface';

export interface ConversationResponse extends LeadResponse {
  expected_visit: boolean;
}
