import { Message } from './message';
import DocumentId = PouchDB.Core.DocumentId;
import DocumentKey = PouchDB.Core.DocumentKey;
import RevisionId = PouchDB.Core.RevisionId;

export interface MetaInfo {
  first: string;
  last: string;
  end: boolean;
}

export interface MessagesData {
  data: Message[];
  meta: MetaInfo;
}

export interface MessagesDataRecursive extends MessagesData {
  messages: Message[];
}

export interface StoredMetaInfo {
  start: string;
  last: string;
}

export interface StoredMetaInfoData {
  data: StoredMetaInfo;
}

export interface StoredMessage {
  _id: string;
  date: Date;
  message: string;
  read: boolean;
  from: string;
  conversationId: string;
}

export interface StoredMessageRow {
  doc?: StoredMessage;
  id: DocumentId;
  key: DocumentKey;
  value: {
    rev: RevisionId;
  }
}

export interface StoredConversation {
  unreadMessages: number;
}
