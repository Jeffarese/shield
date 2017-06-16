import { Injectable } from '@angular/core';

@Injectable()
export class NavigatorService {
  get OSName(): string {
    return this._OSName;
  }
  private nVer = navigator.appVersion;

  private nAgt = navigator.userAgent;
  private _browserName = navigator.appName;
  private _fullVersion = `${parseFloat(this.nVer)}`;
  private majorVersion = parseInt(this.nVer, 10);
  private nameOffset;
  private verOffset;
  private ix;
  private _OSName: string = 'Unknown';

  constructor() {
    this.parseVersionInfo();
    this.setOperativeSystem();
  }
  /* Copied code just to parse navigator info */
  /* istanbul ignore next */
  private parseVersionInfo() {
    if ((this.verOffset = this.nAgt.indexOf("Opera")) != -1) {
      this._browserName = "Opera";
      this._fullVersion = this.nAgt.substring(this.verOffset + 6);
      if ((this.verOffset = this.nAgt.indexOf("Version")) != -1)
        this._fullVersion = this.nAgt.substring(this.verOffset + 8);
    }
    else if ((this.verOffset = this.nAgt.indexOf("MSIE")) != -1) {
      this._browserName = "Microsoft Internet Explorer";
      this._fullVersion = this.nAgt.substring(this.verOffset + 5);
    }
    else if ((this.verOffset = this.nAgt.indexOf("Chrome")) != -1) {
      this._browserName = "Chrome";
      this._fullVersion = this.nAgt.substring(this.verOffset + 7);
    }
    else if ((this.verOffset = this.nAgt.indexOf("Safari")) != -1) {
      this._browserName = "Safari";
      this._fullVersion = this.nAgt.substring(this.verOffset + 7);
      if ((this.verOffset = this.nAgt.indexOf("Version")) != -1)
        this._fullVersion = this.nAgt.substring(this.verOffset + 8);
    }
    else if ((this.verOffset = this.nAgt.indexOf("Firefox")) != -1) {
      this._browserName = "Firefox";
      this._fullVersion = this.nAgt.substring(this.verOffset + 8);
    }
    else if ((this.nameOffset = this.nAgt.lastIndexOf(' ') + 1) <
      (this.verOffset = this.nAgt.lastIndexOf('/'))) {
      this._browserName = this.nAgt.substring(this.nameOffset, this.verOffset);
      this._fullVersion = this.nAgt.substring(this.verOffset + 1);
      if (this._browserName.toLowerCase() == this._browserName.toUpperCase()) {
        this._browserName = navigator.appName;
      }
    }
    if ((this.ix = this._fullVersion.indexOf(";")) != -1)
      this._fullVersion = this._fullVersion.substring(0, this.ix);
    if ((this.ix = this._fullVersion.indexOf(" ")) != -1)
      this._fullVersion = this._fullVersion.substring(0, this.ix);

    this.majorVersion = parseInt('' + this._fullVersion, 10);
    if (isNaN(this.majorVersion)) {
      this._fullVersion = '' + parseFloat(this.nVer);
      this.majorVersion = parseInt(this.nVer, 10);
    }
  }

  /* Copied code just to parse OS name */
  /* istanbul ignore next */
  private setOperativeSystem() {
    if (this.nVer.indexOf("Win") != -1) this._OSName = "Windows";
    if (this.nVer.indexOf("Mac") != -1) this._OSName = "MacOS";
    if (this.nVer.indexOf("X11") != -1) this._OSName = "UNIX";
    if (this.nVer.indexOf("Linux") != -1) this._OSName = "Linux";
  }

  get browserName(): string {
    return this._browserName;
  }

  get fullVersion(): string {
    return this._fullVersion;
  }

  get operativeSystem(): string {
    return this._OSName;
  }
}
