/**
 * @license BSD-3-Clause
 *
 * Copyright (c) 2023, Jelle Van Goethem
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Checks if (a) tag(s) exist(s).
 *
 * Note: Tag ids do not start with a '#', but the 'formatResourceLocationStr'
 *     function handles this by removing invalid characters.
 *
 * @param {string|string[]} tagIdsToCheck - The tag id(s) to check.
 * @param {string[]} tagIds - The tag ids of all tags of a certain tag type.
 *
 * @throws {RangeError} If number of arguments is not 2, or if 'tagIdsToCheck' is an empty string or an empty Array, or if 'tagIds' is an empty Array.
 * @throws {TypeError} If 'tagIdsToCheck' is not a string or an Array of strings, or if 'tagIds' is not an Array of strings.
 *
 * @returns {boolean} True is the tag(s) exist(s).
 */
function tagsExist(tagIdsToCheck, tagIds) {
    checkArguments('tagsExist', arguments, 2, [['string', 'string[]'], 'string[]']);

    /* Wraps 'tagIdsToCheck' in an array for further processing, if it isn't an array already. */
    if (!isArray(tagIdsToCheck)) tagIdsToCheck = [tagIdsToCheck];

    return tagIdsToCheck
        .map((tagId) => formatResourceLocationStr(tagId, true))
        .every((tagId) => tagIds.includes(tagId));
}

