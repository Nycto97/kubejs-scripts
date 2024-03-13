/**
 * @license BSD-3-Clause
 *
 * Copyright (c) 2023, Jelle Van Goethem
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

// priority: 1000

/**
 * Logs a warning if an item is not found.
 *
 * @param {string} itemId - The item id.
 * @param {string} activityType - The skipped activity.
 * @param {string|undefined} [itemType] - The item type.
 *
 * @throws {RangeError} If number of arguments is not 2 or 3, or if 'itemId' or 'activityType'
 *     is an empty string, or if 'itemType' is defined but an empty string.
 * @throws {TypeError} If 'itemId' or 'activityType' is not a string, or if 'itemType' is defined but not a string.
 *
 * @returns {void}
 */
function logItemNotFound(itemId, activityType, itemType) {
    checkArguments('logItemNotFound', arguments, [2, 3], ['string', 'string', ['string', 'undefined']]);

    const prefix = itemType ? `${itemType.trim()} item` : 'Item';

    console.warn(`${prefix} with id ${itemId.trim()} is not found! Skipping ${activityType.trim()}...`);
}

/**
 * Logs a warning if a mod is not loaded.
 *
 * @param {string} modName - The mod name.
 * @param {string} activityType - The skipped activity.
 *
 * @throws {RangeError} If number of arguments is not 2, or if 'modName' or 'activityType' is an empty string.
 * @throws {TypeError} If 'modName' or 'activityType' is not a string.
 *
 * @returns {void}
 */
function logModNotLoaded(modName, activityType) {
    checkArguments('logModNotLoaded', arguments, 2, ['string', 'string']);

    console.warn(`${modName.trim()} mod is not loaded! Skipping ${activityType.trim()}...`);
}

/**
 * Logs a warning if a tag is not found.
 *
 * @param {string} tagId - The tag id.
 * @param {string} activityType - The activity type.
 * @param {string|undefined} [tagType] - The tag type.
 *
 * @throws {RangeError} If number of arguments is not 2 or 3, or if 'tagId' or 'activityType'
 *     is an empty string, or if 'tagType' is defined but an empty string.
 * @throws {TypeError} If 'tagId' or 'activityType' is not a string, or if 'tagType' is defined but not a string.
 *
 * @returns {void}
 */
function logTagNotFound(tagId, activityType, tagType) {
    checkArguments('logTagNotFound', arguments, [2, 3], ['string', 'string', ['string', 'undefined']]);

    const prefix = tagType ? `${tagType.trim()} tag` : 'Tag';

    console.warn(`${prefix} #${tagId.trim()} is not found! Skipping ${activityType.trim()}...`);
}
