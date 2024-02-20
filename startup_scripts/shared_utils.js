/**
 * @license BSD-3-Clause
 *
 * Copyright (c) 2023, Jelle Van Goethem
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

// priority: 999

/* Listen to post-init event, after all mods have loaded */
StartupEvents.postInit(() => {
    /**
     * The item ids of all items.
     *
     * @type {List<string>}
     * @const
     */
    const itemIds = Item.getTypeList();

    /**
     * The block ids of all blocks.
     *
     * @type {List<string>}
     * @const
     */
    const blockIds = Block.getTypeList();

    global['itemIds'] = itemIds;
    global['blockIds'] = blockIds;

    if (global.isBlockAndItemCountLogEnabled)
        console.log(`There are ${global.itemIds.length} items and ${global.blockIds.length} blocks registered`);
});

/**
 * Checks if the provided value is an Array.
 *
 * @param {*} value - The value to check.
 *
 * @returns {boolean} True if the value is an Array, false otherwise.
 */
const isArray = Array.isArray;

/**
 * Checks if the provided value is of type 'boolean'.
 *
 * @param {*} value - The value to check.
 *
 * @returns {boolean} True if the value is of type 'boolean', false otherwise.
 */
const isBoolean = (value) => typeof value === 'boolean';

/**
 * Checks if the provided value is defined.
 *
 * @param {*} value - The value to check.
 *
 * @returns {boolean} True if the value is defined, false otherwise.
 */
const isDefined = (value) => typeof value !== 'undefined';

/**
 * Checks if the provided 'value' is a non-empty array.
 *
 * @param {*} value - The value to check.
 *
 * @returns {boolean} True if 'value' is a non-empty array, false otherwise.
 */
const isNonEmptyArray = (value) => {
    if (!isArray(value)) {
        console.warn(`[WARN] Expected 'value' to be an array, got ${typeof value}`);
        return false;
    }

    return value.length > 0;
};

/**
 * Checks if the provided 'value' is a non-empty string.
 *
 * @param {*} value - The value to check.
 *
 * @returns {boolean} True if 'value' is a non-empty string, false otherwise.
 */
const isNonEmptyString = (value) => {
    if (!isString(value)) {
        console.warn(`[WARN] Expected 'value' to be a string, got ${typeof value}`);
        return false;
    }

    return value.trim().length > 0;
};

/**
 * Checks if the provided value is of instance RegExp.
 *
 * @param {*} value - The value to check.
 *
 * @returns {boolean} True if the value is of instance RegExp, false otherwise.
 */
const isRegExp = (value) => value instanceof RegExp;

/**
 * Checks if the provided value is of type 'string'.
 *
 * @param {*} value - The value to check.
 *
 * @returns {boolean} True if the value is of type 'string', false otherwise.
 */
const isString = (value) => typeof value === 'string';

/**
 * Checks if the provided value is of type 'undefined'.
 *
 * @param {*} value - The value to check.
 *
 * @returns {boolean} True if the value is of type 'undefined', false otherwise.
 */
const isUndefined = (value) => !isDefined(value);

/**
 * Checks if item(s) exist(s) in the registry.
 *
 * @param {string|string[]} itemIds - The item id or item ids to check.
 *
 * @returns {boolean} True if the item(s) exist(s), false otherwise.
 */
const itemsExist = (itemIds) => {
    if (!itemIds?.length) return false;

    if (!isArray(itemIds)) itemIds = [itemIds];

    return itemIds.every((itemId) => Item.exists(itemId));
};

/**
 * Logs a warning if an item is not found.
 *
 * @param {string} itemId - The item id.
 * @param {string} activityType - The skipped activity.
 * @param {string} [itemType] - The item type.
 *
 * @returns {void}
 */
const logItemNotFound = (itemId, activityType, itemType) => {
    let prefix = itemType ? `${itemType} item` : 'Item';

    console.warn(`[WARN] ${prefix} with id ${itemId} is not found! Skipping ${activityType}`);
};

/**
 * Logs a warning if a mod is not loaded.
 *
 * @param {string} modName - The mod name.
 * @param {string} activityType - The skipped activity.
 *
 * @returns {void}
 */
const logModNotLoaded = (modName, activityType) =>
    console.log(`[WARN] ${modName} mod is not loaded! Skipping ${activityType}`);

/**
 * Logs a warning if a tag is not found.
 *
 * @param {string} tagId - The tag id.
 * @param {string} activityType - The activity type.
 * @param {string} [tagType] - The tag type.
 *
 * @returns {void}
 */
const logTagNotFound = (tagId, activityType, tagType) => {
    let prefix = tagType ? `${tagType} tag` : 'Tag';

    console.warn(`[WARN] ${prefix} #${tagId} is not found! Skipping ${activityType}`);
};

/**
 * Removes duplicate values from an Array.
 *
 * @param {*[]} values - The Array from which to remove duplicates.
 *
 * @returns {*[]|undefined} A new Array with unique elements, or undefined if argument is invalid.
 */
const removeDuplicates = (values) => {
    if (!isArrayAndNotEmpty(values)) {
        console.warn(
            `[WARN] Invalid 'values'. Expected an Array, but received ${typeof values}. Skipping removing duplicates...`
        );
        return;
    }

    return values.filter((value, index) => values.indexOf(value) === index);
};

global['logModNotLoaded'] = logModNotLoaded;
global['logItemIdNotFound'] = logItemNotFound;
global['logTagNotFound'] = logTagNotFound;
