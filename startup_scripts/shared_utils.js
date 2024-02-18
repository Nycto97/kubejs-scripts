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

    /**
     * Logs a message regarding a mod that is not loaded.
     *
     * @param {string} modName - The mod name.
     * @param {string} activityType - The activity type.
     */
    const logModNotLoaded = (modName, activityType) =>
        console.log(`[WARN] ${modName} mod is not loaded! Skipping ${activityType}`);

    /**
     * Logs a message regarding an item id that is not found.
     *
     * @param {string} itemId - The item id.
     * @param {string} activityType - The activity type.
     * @param {string} [itemType] - The item type.
     */
    const logItemIdNotFound = (itemId, activityType, itemType) =>
        console.log(
            `[WARN] ${itemType ? `${itemType} i` : 'I'}tem id ${itemId} is not found! Skipping ${activityType}`
        );

    /**
     * Logs a message regarding a tag that is not found.
     *
     * @param {string} tagId - The tag id.
     * @param {string} activityType - The activity type.
     * @param {string} [tagType] - The tag type.
     */
    const logTagNotFound = (tagId, activityType, tagType) =>
        console.log(`[WARN] ${tagType ? `${tagType} t` : 'T'}ag #${tagId} is not found! Skipping ${activityType}`);

    global['itemIds'] = itemIds;
    global['blockIds'] = blockIds;
    global['logModNotLoaded'] = logModNotLoaded;
    global['logItemIdNotFound'] = logItemIdNotFound;
    global['logTagNotFound'] = logTagNotFound;

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
 * Checks if the provided value is of type 'undefined'.
 *
 * @param {*} value - The value to check.
 *
 * @returns {boolean} True if the value is of type 'undefined', false otherwise.
 */
const isUndefined = (value) => !isDefined(value);

