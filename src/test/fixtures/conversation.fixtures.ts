import { MESSAGE_MAIN } from './message.fixtures';
import { Conversation } from '../../app/shared/conversation/conversation';
import { MOCK_USER, USER_ID } from './user.fixtures';
import { User } from '../../app/shared/user/user';
import { ITEM_ID, ITEM_LEGACY_ID } from './item.fixtures';
import { Item } from '../../app/shared/item/item';
import { ConversationResponse } from '../../app/shared/conversation/conversation-response.interface';
import { SurveyResponse } from '../../app/shared/conversation/lead-response.interface';

export const CONVERSATION_ID: string = MESSAGE_MAIN.thread;
export const CONVERSATION_PHONE: string = '123.456.789';
export const SURVEY_RESPONSES: SurveyResponse[] = [
  {
    'question_id': 1,
    'question': '¿Por qué razón quieres comprar un coche?',
    'answer': {
      'answer_id': 1,
      'answer': 'Acabo de sacarme el carné'
    }
  },
  {
    'question_id': 2,
    'question': '¿Darás tu coche actual a cambio?',
    'answer': {
      'answer_id': 2,
      'answer': 'Quizás'
    }
  },
  {
    'question_id': 3,
    'question': '¿Cuándo lo querrías comprar?',
    'answer': {
      'answer_id': 1,
      'answer': 'En las próximas semanas'
    }
  },
  {
    'question_id': 4,
    'question': '¿Quieres venir a ver el coche al concesionario?',
    'answer': {
      'answer_id': 2,
      'answer': 'Sí, podría este mes'
    }
  }
];

export const CONVERSATIONS_DATA: ConversationResponse[] = [{
  'legacy_id': 500000002,
  'id': 'pzp9m08vx563',
  'modified_date': 1474988119,
  'user_id': 'l1kmzn82zn3p',
  'item_id': '9jd7ryx5odjk',
  'buyer_phone_number': CONVERSATION_PHONE,
  'survey_responses': SURVEY_RESPONSES,
  'expected_visit': false
}, {
  'legacy_id': 500000002,
  'id': 'pzp9m08vx563',
  'modified_date': 1474988119,
  'user_id': 'l1kmzn82zn3p',
  'item_id': '9jd7ryx5odjk',
  'buyer_phone_number': CONVERSATION_PHONE,
  'survey_responses': SURVEY_RESPONSES,
  'expected_visit': false
}];

export const CONVERSATION_DATE: number = new Date().getTime();
export const CONVERSATION_DATE_ISO: string = new Date().toISOString();

export const MOCK_CONVERSATION: Function = (id: string = CONVERSATION_ID, userId: string = USER_ID, phone?: string, date: number = CONVERSATION_DATE): Conversation => {
  return new Conversation(id, 1, date, false, new User(userId), new Item(ITEM_ID, ITEM_LEGACY_ID, USER_ID), [], phone, SURVEY_RESPONSES);
};
export const SECOND_MOCK_CONVERSATION: Conversation = new Conversation('secondId', 2, CONVERSATION_DATE, false, MOCK_USER);
export const MOCKED_CONVERSATIONS: Conversation[] = [MOCK_CONVERSATION(), SECOND_MOCK_CONVERSATION];
export const NOT_FOUND_CONVERSATION_ID: string = 'notFound';
export const MOCK_NOT_FOUND_CONVERSATION: Conversation = new Conversation(
  NOT_FOUND_CONVERSATION_ID,
  99,
  CONVERSATION_DATE,
  false,
  MOCK_USER);

export function createConversationsArray(total: number, phone?: boolean) {
  let conversations: Conversation[] = [];
  for (let i: number = 1; i <= total; i++) {
    conversations.push(MOCK_CONVERSATION(i + '', undefined, phone ? CONVERSATION_PHONE : undefined, CONVERSATION_DATE - i));
  }
  return conversations;
}
