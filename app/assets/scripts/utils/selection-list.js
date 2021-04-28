/**
 * Constructs a list for selection interactions.
 * Allows for single item selection, multiple item selection and shift key
 * item selection.
 *
 * SelectionList has a 1-to-1 mapping of list items to selected items. This
 * means that each item of the returned selected array will match the items
 * in the list.
 * It is also possible to control the mapping between list items and selected
 * items with selectedTransform(mappingFn).
 * To keep track of each item, and internal key is created from the item
 * properties. By default it looks for an id. This is customizable with:
 * listKeyAccessor(mappingFn) - key for each of the list items
 * selectedKeyAccessor(mappingFn) - key for each of the initially selected items
 * itemKeyAccessor(mappingFn) - key for the new item being selected.
 *
 * Note that the same items should have the same keys.
 *
 * @param {array} list List of items that can be selected.
 * @param {array} selected List of items that are selected.
 *
 * @example
 *   const data = [
 *     { id: 1, name: 'first' },
 *     { id: 2, name: 'second' },
 *     { id: 3, name: 'third' },
 *     { id: 4, name: 'fourth' }
 *   ];
 *   // New list with an empty selection.
 *   const list = new SelectionList(data, []);
 *   // Select the item with id 1. The key for this item is calculated using the
 *   // itemKeyAccessor.
 *   list.toggle({ id: 1 }); // { id: 1, name: 'first' }
 *   // Selecting another item, deselects the previously selected.
 *   list.toggle({ id: 2 }); // { id: 2, name: 'second' }
 *   // Unless the meta key (cmd OR ctrl - OS dependent) was pressed.
 *   list.toggle({ id: 4 }, { meta: true }); // { id: 2, name: 'second' }, { id: 4, name: 'fourth' }
 *   // With the shift key pressed, all items from the last selected to the
 *   // current become selected.
 *   list.toggle({ id: 1 }, { shift: true }); // { id: 2, name: 'second' }, { id: 4, name: 'fourth' }, { id: 3, name: 'third' }, { id: 1, name: 'first' }
 *   // However if all the items were already selected, they are all unselected.
 *   list.toggle({ id: 4 }, { shift: true }); // []
 *
 * @example
 *  const data = [
 *     { id: 1, name: 'first' },
 *     { id: 2, name: 'second' },
 *     { id: 3, name: 'third' },
 *     { id: 4, name: 'fourth' }
 *   ];
 *   const list = new SelectionList(data, ['first']);
 *   // The key for the will be constructed from the name. There cannot be repeated keys.
 *   list.listKeyAccessor(item => item.name);
 *   // The selected array is going to be flat, so the key is the item.
 *   list.selectedKeyAccessor(item => item);
 *   // The new item to select is also flat.
 *   list.itemKeyAccessor(item => item);
 *   // The selected items will have only the name instead of the whole object.
 *   list.selectedTransform(item => item.name);
 *   list.toggle('first'); // []
 *   list.toggle('second'); // 'second'
 *   list.toggle('fourth', { meta: true }); // 'second', 'fourth'
 *   list.toggle('first', { shift: true }); // 'second', 'fourth', 'third', 'first'
 *   list.toggle('fourth', { shift: true }); // []
 *
 * @returns SelectionList
 */
export default class SelectionList {
  constructor(list = [], selected = []) {
    // Internal Set of list keys. Keys are computed with the listKeyAccessor.
    this.list = null;
    // Internal Set of selected keys. Keys are computed with the itemKeyAccessor.
    this.selected = null;
    // Original list array.
    this.__list = null;
    // Original selected array.
    this.__selected = null;

    // Default accessors.
    this._listKeyAccessor = (item) => item.id;
    this._selectedKeyAccessor = (item) => item.id;
    this._itemKeyAccessor = (item) => item.id;
    this._selectedTransform = (item) => item;

    this.setList(list);
    this.setSelected(selected);
  }

  /**
   * Sets the function to define the key for each item of the list.
   * Calling this function with a non function argument, returns the
   * current accessor.
   *
   * @param {function} fn The accessor function. Default to (item) => item.id
   */
  listKeyAccessor(fn) {
    if (typeof fn === 'function') {
      this._listKeyAccessor = fn;
      this.setList(this.__list);
      return this;
    }
    return this._listKeyAccessor;
  }

  /**
   * Sets the function to define the key for each item of the selected array.
   * Calling this function with a non function argument, returns the
   * current accessor.
   *
   * @param {function} fn The accessor function. Default to (item) => item.id
   */
  selectedKeyAccessor(fn) {
    if (typeof fn === 'function') {
      this.__selectedKeyAccessor = fn;
      this.setSelected(this.__selected);
      return this;
    }
    return this.__selectedKeyAccessor;
  }

  /**
   * Sets the function to define the key for the new item to be selected.
   * Calling this function with a non function argument, returns the
   * current accessor.
   *
   * @param {function} fn The accessor function. Default to (item) => item.id
   */
  itemKeyAccessor(fn) {
    if (typeof fn === 'function') {
      this._itemKeyAccessor = fn;
      this.setSelected(this.__selected);
      return this;
    }
    return this._itemKeyAccessor;
  }

  /**
   * Sets the mapping function to transform list items into selected items
   * Calling this function with a non function argument, returns the
   * current accessor.
   *
   * @param {function} fn The accessor function. Default to (item) => item
   */
  selectedTransform(fn) {
    if (typeof fn === 'function') {
      this._selectedTransform = fn;
      return this;
    }
    return this._selectedTransform;
  }

  /**
   * Sets the items and computes the key for each item.
   *
   * @throws Error If the list items keys are not unique.
   *
   * @param {array} data List of items.
   */
  setList(data) {
    const keys = data.map(this._listKeyAccessor);
    const list = new Set(keys);
    if (list.size !== data.length) {
      throw new Error(
        'List is not unique. This may happen because the listKeyAccessor is not returning unique keys for the list items.'
      );
    }
    this.__list = data;
    this.list = list;
    return this;
  }

  /**
   * Sets the selected items and computes the key for each item.
   *
   * @throws Error If the selected items keys are not unique.
   *
   * @param {array} data List of items.
   */
  setSelected(data) {
    const keys = data.map(this._itemKeyAccessor);
    const selected = new Set(keys);
    if (selected.size !== data.length) {
      throw new Error(
        'Selected is not unique. This may happen because the itemKeyAccessor is not returning unique keys for the selected items.'
      );
    }
    this.__selected = data;
    this.selected = selected;
    return this;
  }

  /**
   * Returns the selected items formatted according to the mapping functions
   * defined through selectedTransform(mappingFn).
   *
   * @returns array
   */
  getSelectedItems() {
    const selection = [...this.selected].map((key) => {
      // Find the selected item in the list.
      const selectedFromList = this.__list.find(
        (lItem) => this._listKeyAccessor(lItem) === key
      );
      if (!selectedFromList) {
        const err = new Error('Selected item not found in list');
        err.itemKey = key;
        err.itemList = this.__list;
        throw err;
      }
      // Convert it according to the mapping function.
      return this._selectedTransform(selectedFromList);
    });
    return selection;
  }

  /**
   * Returns the keys of the elements between the last selected element and
   * the current one.
   * Used when the shift key is pressed.
   *
   * @param {string} itemKey Key of the items being selected.
   */
  preselectRange(itemKey) {
    // Convert Sets to array to use indexes.
    const listArr = [...this.list];
    const selectedArr = [...this.selected];
    const itemIdxOnList = listArr.findIndex(
      (listItemkey) => listItemkey === itemKey
    );
    if (itemIdxOnList === -1)
      throw new Error('New selected item is not in list');

    // If this is the first item being selected assume the beginning is the
    // start of the list.
    let lastSelectedIdxOnList = 0;
    if (selectedArr.length) {
      const lastSelected = selectedArr[selectedArr.length - 1];
      lastSelectedIdxOnList = listArr.findIndex(
        (listItemkey) => listItemkey === lastSelected
      );
      if (lastSelectedIdxOnList === -1)
        throw new Error('Last selected item is not in list');
    }

    // Handle the case when the selection id being done backwards.
    const reversedSelection = lastSelectedIdxOnList > itemIdxOnList;
    const [minIdx, maxIdx] = reversedSelection
      ? [itemIdxOnList, lastSelectedIdxOnList]
      : [lastSelectedIdxOnList, itemIdxOnList];

    const selectionRange = listArr.slice(minIdx, maxIdx + 1);
    // Reverse to always keep selection order.
    if (reversedSelection) {
      selectionRange.reverse();
    }

    return selectionRange;
  }

  /**
   * Checks whether the given item is selected.
   * Uses the itemKeyAccessor to construct the item key.
   *
   * @param {mixed} item Item to check
   */
  isSelected(item) {
    if (!this.list.size) {
      return false;
    }

    const itemKey = this._itemKeyAccessor(item);
    return this.selected.has(itemKey);
  }

  /**
   * Toggles the selection of an item.
   * By default selecting one item deselect all the others.
   * If the meta key is pressed the item is added or removed from the selection.
   * If the shift key is pressed all the items from the last selected one to the
   * current get selected. If all these items are already selected they are
   * all unselected. When there's no previously selected item, the beginning
   * of the list is used.
   *
   * @param {mixed} item Item being selected
   * @param {object} modifiers Modifier keys being pressed.
   * @param {boolean} modifiers.meta cmd OR ctrl - OS dependent
   * @param {boolean} modifiers.shift Shift key
   */
  toggle(item, modifiers = {}) {
    const { meta, shift } = modifiers;
    if (!this.list.size) {
      /* eslint-disable-next-line no-console */
      console.warn('List is empty');
      return [];
    }

    const itemKey = this._itemKeyAccessor(item);
    const itemIsSelected = this.selected.has(itemKey);

    if (!meta && !shift) {
      // Simple select. Unselect all items and select current.
      this.selected.clear();
      if (!itemIsSelected) this.selected.add(itemKey);

      // Shift selection.
      // Select all items since last one, or unselect if they were already
      // all selected.
    } else if (shift) {
      const selectedArr = [...this.selected];
      const selectionRange = this.preselectRange(itemKey);
      const isEveryItemSelected = selectionRange.every((selItem) =>
        selectedArr.includes(selItem)
      );
      selectionRange.forEach((selItem) => {
        if (isEveryItemSelected) {
          this.selected.delete(selItem);
        } else {
          this.selected.add(selItem);
        }
      });

      // Add to/remove from the selection.
    } else if (meta) {
      if (itemIsSelected) {
        this.selected.delete(itemKey);
      } else {
        this.selected.add(itemKey);
      }
    }
    return this.getSelectedItems();
  }

  /**
   * Selects an item.
   * If the shift key is pressed all the items from the last selected one to the
   * current get selected. When there's no previously selected item, the
   * beginning of the list is used.
   *
   * @param {mixed} item Item being selected
   * @param {object} modifiers Modifier keys being pressed.
   * @param {boolean} modifiers.shift Shift key
   */
  select(item, modifiers = {}) {
    const { shift } = modifiers;
    if (!this.list.size) {
      /* eslint-disable-next-line no-console */
      console.warn('List is empty');
      return [];
    }
    const itemKey = this._itemKeyAccessor(item);

    // Shift selection.
    // Select all items since last one.
    if (shift) {
      const selectionRange = this.preselectRange(itemKey);
      selectionRange.forEach((selItem) => {
        this.selected.add(selItem);
      });

      // Add to the selection.
    } else {
      this.selected.add(itemKey);
    }
    return this.getSelectedItems();
  }

  /**
   * Deselects an item.
   * If the shift key is pressed all the items from the last selected one to the
   * current get deselected. When there's no previously selected item, the
   * beginning of the list is used.
   *
   * @param {mixed} item Item being selected
   * @param {object} modifiers Modifier keys being pressed.
   * @param {boolean} modifiers.shift Shift key
   */
  deselect(item, modifiers = {}) {
    const { shift } = modifiers;
    if (!this.list.size) {
      /* eslint-disable-next-line no-console */
      console.warn('List is empty');
      return [];
    }
    const itemKey = this._itemKeyAccessor(item);

    // Shift selection.
    // Unselect all items since last one.
    if (shift) {
      const selectionRange = this.preselectRange(itemKey);
      selectionRange.forEach((selItem) => {
        this.selected.delete(selItem);
      });

      // Remove from the selection.
    } else {
      this.selected.delete(itemKey);
    }
    return this.getSelectedItems();
  }
}
