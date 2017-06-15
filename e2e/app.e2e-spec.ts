import { ShieldPage } from './app.po';

describe('shield App', () => {
  let page: ShieldPage;

  beforeEach(() => {
    page = new ShieldPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
