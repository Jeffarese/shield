/* tslint:disable:no-unused-variable */

import { User, USER_BASE_PATH } from './user';
import {
  USER_ID, MICRO_NAME, IMAGE, USER_LOCATION, STATS, VALIDATIONS,
  VERIFICATION_LEVEL, SCORING_STARS, SCORING_STARTS, RESPONSE_RATE, ONLINE, USER_TYPE, RECEIVED_REPORTS, USER_WEB_SLUG
} from '../../../test/fixtures/user.fixtures';
import { MOCK_ITEM } from '../../../test/fixtures/item.fixtures';

describe('User', () => {

  it('should create an instance', () => {
    expect(new User('testId')).toBeTruthy();
  });

  it('should set the user data through the constructor', () => {
    let user: User = new User(
      USER_ID,
      MICRO_NAME,
      IMAGE,
      USER_LOCATION,
      STATS,
      VALIDATIONS,
      VERIFICATION_LEVEL,
      SCORING_STARS,
      SCORING_STARTS,
      RESPONSE_RATE,
      ONLINE,
      USER_TYPE,
      RECEIVED_REPORTS,
      USER_WEB_SLUG
    );
    expect(user.id).toBe(USER_ID);
    expect(user.microName).toBe(MICRO_NAME);
    expect(user.image).toBe(IMAGE);
    expect(user.location).toBe(USER_LOCATION);
    expect(user.stats).toBe(STATS);
    expect(user.validations).toBe(VALIDATIONS);
    expect(user.verificationLevel).toBe(VERIFICATION_LEVEL);
    expect(user.scoringStars).toBe(SCORING_STARS);
    expect(user.scoringStarts).toBe(SCORING_STARTS);
    expect(user.responseRate).toBe(RESPONSE_RATE);
    expect(user.online).toBe(ONLINE);
    expect(user.type).toBe(USER_TYPE);
    expect(user.receivedReports).toBe(RECEIVED_REPORTS);
    expect(user.webLink).toBe(USER_BASE_PATH + USER_WEB_SLUG);
  });
  it('should set item distance', (() => {
    let user: User = new User(USER_ID);
    user.itemDistance = 1;
    expect(user.itemDistance).toBe(1);
  }));
  it('should set selling item', (() => {
    let user: User = new User(USER_ID);
    user.sellingItem = MOCK_ITEM;
    expect(user.sellingItem).toBe(MOCK_ITEM);
  }));
  it('should set items count', (() => {
    let user: User = new User(USER_ID);
    user.itemsCount = 3;
    expect(user.itemsCount).toBe(3);
  }));

});
