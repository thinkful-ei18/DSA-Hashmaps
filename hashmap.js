'use strict';

class HashMap {
  constructor(initialCapacity = 8) {
    this.length = 0;
    this._slots = [];
    this._capacity = initialCapacity;
    this._deleted = 0;
  }

  get(key) {
    const index = this._findSlot(key);
    if (this._slots[index] === undefined) {
      // throw new Error('Key error');
      return false;
    }
    return this._slots[index].value;
  }

  set(key, value) {
    const loadRatio = (this.length + this._deleted + 1) / this._capacity;
    if (loadRatio > HashMap.MAX_LOAD_RATIO) {
      this._resize(this._capacity * HashMap.SIZE_RATIO);
    }

    const index = this._findSlot(key);
    this._slots[index] = {
      key,
      value,
      deleted: false
    };
    this.length++;
  }

  remove(key) {
    const index = this._findSlot(key);
    const slot = this._slots[index];
    if (slot === undefined) {
      throw new Error('Key error');
    }
    slot.deleted = true;
    this.length--;
    this._deleted++;
  }

  _findSlot(key) {
    const hash = HashMap._hashString(key);
    const start = hash % this._capacity;

    for (let i = start; i < start + this._capacity; i++) {
      const index = i % this._capacity;
      const slot = this._slots[index];
      if (slot === undefined || (slot.key == key && !slot.deleted)) {
        return index;
      }
    }
  }

  _resize(size) {
    const oldSlots = this._slots;
    this._capacity = size;
    // Reset the length - it will get rebuilt as you add the items back
    this.length = 0;
    this._deleted = 0;
    this._slots = [];

    for (const slot of oldSlots) {
      if (slot !== undefined && !slot.deleted) {
        this.set(slot.key, slot.value);
      }
    }
  }

  static _hashString(string) {
    let hash = 5381;
    for (let i = 0; i < string.length; i++) {
      hash = (hash << 5) + hash + string.charCodeAt(i);
      hash = hash & hash;
    }
    return hash >>> 0;
  }
}
HashMap.MAX_LOAD_RATIO = 0.9;
HashMap.SIZE_RATIO = 3;

function main() {
  let lor = new HashMap();

  lor.set('Hobbit', 'Bilbo');
  lor.set('Hobbit', 'Frodo');
  lor.set('Wizard', 'Gandolf');
  lor.set('Maiar', 'The Necromancer');
  lor.set('Maiar', 'Sauron');
  console.log(lor.get('Maiar'));
}

function palindrome(string) {
  let oddChar = '';
  let oddArray = [];
  let mapChar = new HashMap();
  for (let i = 0; i < string.length; i++) {
    console.log(string[i]);
    if (mapChar.get(string[i])) {
      //if it does exsist
      let count = mapChar.get(string[i]); //sets count
      mapChar.set(string[i], count + 1); // set the key string[i], value : count + 1
    } else {
      mapChar.set(string[i], 1); //set the key to string[i], value: 1
    }
  }
  for (let i = 0; i < string.length; i++) {
    let value = mapChar.get(string[i]);
    if (value % 2 !== 0 && value) {
      console.log(value);
    }
  }
}

console.log(palindrome('hello'));
