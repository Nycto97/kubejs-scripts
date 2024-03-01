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
 * Note: Tag ids do not start with a #, but this function will handle it anyway.
 *
 * @param {string|string[]} tagIdsToCheck - The tag id(s) to check.
 * @param {string[]} tagIds - The tag ids of all tags of a certain tag type.
 *
 * @returns {boolean} True is the tag(s) exist(s).
 */
const tagsExist = (tagIdsToCheck, tagIds) => {
    if (!tagIdsToCheck?.length) return false;

    if (!isArray(tagIdsToCheck)) tagIdsToCheck = [tagIdsToCheck];

    return tagIdsToCheck
        .map((tagId) => formatResourceLocationStr(tagId, true))
        .every((tagId) => tagIds.includes(tagId));
};

