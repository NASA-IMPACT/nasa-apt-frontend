export default class LocalAtbdStorage {
  constructor() {
    this.expiry = 15 * 60000; // 15 minutes
  }

  getStorageKey(atbd, step) {
    const { id, version } = atbd;
    return `atbd/${id}/${version}/${step}`;
  }

  getAtbd(atbd, step) {
    const key = this.getStorageKey(atbd, step);
    const values = JSON.parse(localStorage.getItem(key));

    if (values && values.created + this.expiry > Date.now()) {
      // Return values if the store is not expired
      return values;
    }

    // The store either doesn't exist or is expired,
    // trying to remove the store
    this.removeAtbd(atbd, step);
    return undefined;
  }

  setAtbd(atbd, step, values) {
    const key = this.getStorageKey(atbd, step);
    localStorage.setItem(
      key,
      JSON.stringify({
        ...values,
        created: Date.now()
      })
    );
  }

  removeAtbd(atbd, step) {
    const key = this.getStorageKey(atbd, step);
    localStorage.removeItem(key);
  }
}
