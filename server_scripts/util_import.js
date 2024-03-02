/**
 * @license BSD-3-Clause
 *
 * Copyright (c) 2023, Jelle Van Goethem
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

// priority: 500

/* 
    Global imports:
    Allows omitting the 'global.' prefix.
*/

/* From shared-utils.js */

const blockIds = global['blockIds'];
const itemIds = global['itemIds'];

const checkArguments = global['checkArguments'];

const isArray = global['isArray'];
const isArrayAndNotEmpty = global['isArrayAndNotEmpty'];
const isBoolean = global['isBoolean'];
const isDefined = global['isDefined'];
const isRegExp = global['isRegExp'];
const isString = global['isString'];
const isStringAndNotEmpty = global['isStringAndNotEmpty'];
const isTagEventJS = global['isTagEventJS'];
const isUndefined = global['isUndefined'];

const itemsExist = global['itemsExist'];

const logItemNotFound = global['logItemNotFound'];
const logModNotLoaded = global['logModNotLoaded'];
const logTagNotFound = global['logTagNotFound'];

const formatResourceLocationStr = global['formatResourceLocationStr'];

const removeDuplicates = global['removeDuplicates'];

const throwError = global['throwError'];

/* From settings.js */

const isBlockAndItemCountLogEnabled = global['isBlockAndItemCountLogEnabled'];
const isNonTaggedItemIdsLogEnabled = global['isNonTaggedItemIdsLogEnabled'];
const isBlacklistedRareIceLootLogEnabled = global['isBlacklistedRareIceLootLogEnabled'];
const isModRenameLogEnabled = global['isModRenameLogEnabled'];
const isPlayerDimensionChangeLogEnabled = global['isPlayerDimensionChangeLogEnabled'];
const isItemTagsLogEnabled = global['isItemTagsLogEnabled'];
const isBlockIdsForShaderLogEnabled = global['isBlockIdsForShaderLogEnabled'];
