class LocalStorageAdapter {
  set(key: string, value: any) {
    if (typeof value === 'string') {
      localStorage.setItem(key, value);
    } else {
      const json = JSON.stringify(value);
      localStorage.setItem(key, json);
    }
  }

  get(key: string): any {
    try {
      const object = JSON.parse(localStorage.getItem(key));

      return object;
    } catch (error) {
      return localStorage.getItem(key);
    }
  }
}

export const localStorageAdapter = new LocalStorageAdapter();
