export class List {
  constructor(public name: string, public sounds: []) {}

  public toJSON(): any {
    const list = {
      name: this.name,
      sounds: this.sounds,
    };

    return list;
  }
}
