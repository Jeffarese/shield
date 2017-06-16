// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment: any = {
  production: false,
  name: 'local',
  baseUrl: 'http://dock7.corp.wallapop.com:8080/',
  xmppDomain: 'dock7.wallapop.com',
  wsUrl: 'ws://dock7.corp.wallapop.com:5281/ws-xmpp',
  segmentKey: '6wbMLSer6dolvfwH9OSW2xfzQGteS2aG',
  bypass: 'p3-9p0dJk2cHp3-4RsW0',
  sentry: 'https://6b5cbbe86fb14c599bc943358975700b@sentry.io/152208',
  appboy: '34fa426c-a141-4bb7-bb38-63c1fc5ab868'
};
