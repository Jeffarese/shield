import * as PouchDB from 'pouchdb';
import Database = PouchDB.Database;
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as _ from 'lodash';
import { Message } from '../message/message';
import {
  StoredConversation,
  StoredMessage,
  StoredMessageRow,
  StoredMetaInfo,
  StoredMetaInfoData
} from '../message/messages.interface';
import AllDocsResponse = PouchDB.Core.AllDocsResponse;
import Document = PouchDB.Core.Document;
import 'rxjs/add/observable/fromPromise';

@Injectable()
export class PersistencyService {
  private _messagesDb: Database<StoredMessage>;
  private _conversationsDb: Database<StoredConversation>;
  private storedMessages: AllDocsResponse<StoredMessage>;
  constructor() {
    this._messagesDb = new PouchDB('messages');
    this._conversationsDb = new PouchDB('conversations');
  }

  set messagesDb(value: PouchDB.Database<any>) {
    this._messagesDb = value;
  }

  set conversationsDb(value: PouchDB.Database<any>) {
    this._conversationsDb = value;
  }

  get messagesDb(): PouchDB.Database<any> {
    return this._messagesDb;
  }

  get conversationsDb(): PouchDB.Database<any> {
    return this._conversationsDb;
  }

  public getMessages(conversationId: string): Observable<StoredMessageRow[]> {
    return Observable.create((observer: Observer<StoredMessageRow[]>) => {
      this.getMessageFromLocal().then((data: AllDocsResponse<StoredMessage>) => {
        let rows: StoredMessageRow[] = _.sortBy(_.filter(data.rows, (row: StoredMessageRow) => {
          return row.doc.conversationId === conversationId;
        }), (row: StoredMessageRow) => {
          return row.doc.date;
        });
        observer.next(rows);
      }, () => {
        observer.next([]);
      });
    });
  }

  public resetCache() {
    this.storedMessages = null;
  }

  private getMessageFromLocal(): Promise<AllDocsResponse<StoredMessage>> {
    if (this.storedMessages && this.storedMessages.total_rows > 0) {
      return Promise.resolve(this.storedMessages);
    }
    return this.messagesDb.allDocs({include_docs: true}).then((data: AllDocsResponse<StoredMessage>) => {
      this.storedMessages = data;
      return data;
    });
  }

  private buildResponse(message: Message): StoredMessage {
    return {
      _id: message.id,
      date: message.date,
      message: message.message,
      read: message.read,
      from: message.from,
      conversationId: message.conversationId
    };
  }

  public saveMessages(messages: Array<Message> | Message): Observable<any> {
    if (Array.isArray(messages)) {
      let messagesToSave: StoredMessage[] = messages.map((message: Message) => {
          return this.buildResponse(message);
        }
      );
      return Observable.fromPromise(this.messagesDb.bulkDocs(
        messagesToSave
      ));
    } else {
      return Observable.fromPromise(
        this.upsert(this.messagesDb, messages.id, () => {
          return this.buildResponse(messages);
        })
      );
    }
  }

  public saveMetaInformation(data: StoredMetaInfo): Observable<any> {
    return Observable.fromPromise(
      this.upsert(this.messagesDb, 'meta', (doc: Document<any>) => {
        doc.data = data;
        return doc;
      })
    );
  }

  public updateMessageDate(message: Message) {
    return Observable.fromPromise(this.upsert(this.messagesDb, message.id, (doc: Document<any>) => {
        doc.date = message.date.toISOString();
        return doc;
      })
    );
  }

  public getMetaInformation(): Observable<StoredMetaInfoData> {
    return Observable.fromPromise(this.messagesDb.get('meta'));
  }

  public saveUnreadMessages(conversationId: string, unreadMessages: number): Observable<any> {
    return Observable.fromPromise(
      this.upsert(this.conversationsDb, conversationId, (doc: StoredConversation) => {
        doc.unreadMessages = unreadMessages;
        return doc;
      })
    );
  }

  public getUnreadMessages(conversationId: string): Observable<StoredConversation> {
    return Observable.create((observer: Observer<StoredConversation>) => {
      this.conversationsDb.get(conversationId).then((data: StoredConversation) => {
        if (!data.unreadMessages) {
          data.unreadMessages = 0;
        }
        observer.next(data);
        observer.complete();
      }, (data) => {
        observer.next({
          unreadMessages: 0
        });
        observer.complete();
      });
    });
  }

  /* istanbul ignore next */

  private upsert(db, docId, diffFun) {
    if (typeof docId !== 'string') {
      return Promise.reject(new Error('doc id is required'));
    }

    return db.get(docId)["catch"]((err) => {
      if (err.status !== 404) {
        throw err;
      }
      return {};
    }).then((doc) => {
      let docRev = doc._rev;
      let newDoc = diffFun(doc);
      if (!newDoc) {
        return {updated: false, rev: docRev};
      }

      newDoc._id = docId;
      newDoc._rev = docRev;
      return this.tryAndPut(db, newDoc, diffFun);
    });
  }

  /* istanbul ignore next */


  private tryAndPut(db, doc, diffFun) {
    return db.put(doc).then((res) => {
      return {
        updated: true,
        rev: res.rev
      };
    }, (err) => {
      if (err.status !== 409) {
        throw err;
      }
      return this.upsert(db, doc._id, diffFun);
    });
  }
}
