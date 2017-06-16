import { LeadResponse } from './lead-response.interface';

export interface CallResponse extends LeadResponse {
  call_duration: number;
  call_status: string;
}
