export class UserContext {
  private _wallet: string;
  private _preferences: UserContextPreferences;

  public get wallet(): string {
    return this._wallet;
  }

  public get preferences(): UserContextPreferences {
    return this._preferences;
  }

  constructor (wallet?: string, preferences?: UserContextPreferences) {
    this._wallet = wallet;
    this._preferences = preferences;
  }
}

export class UserContextPreferences {
  theme: string;
  deadlineThreshold: number;
  toleranceThreshold: number;
}
