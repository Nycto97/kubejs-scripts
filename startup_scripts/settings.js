/*
   Copyright (c) 2023, Jelle Van Goethem
   All rights reserved.
 
   This source code is licensed under the BSD-style license found in the
   LICENSE file in the root directory of this source tree.
*/

// priority: 1002

/*
   Gets ignored when both are set to true
*/
const enableAllLogs = true;

const disableAllLogs = false;

/* Blocks and items */
global['isBlockAndItemCountLogEnabled'] = true;

/* Items */
global['isNonTaggedItemIdsLogEnabled'] = true;

/* Loot */
global['isBlacklistedRareIceLootLogEnabled'] = false;

/* Mods */
global['isModRenameLogEnabled'] = true;

/* Players */
global['isPlayerDimensionChangeLogEnabled'] = true;

/* Tags */
global['isItemTagIdsLogEnabled'] = true;

/* Shader */
global['isBlockIdsForShaderLogEnabled'] = false;

if (enableAllLogs && !disableAllLogs) {
    global.isBlockAndItemCountLogEnabled = true;
    global.isNonTaggedItemIdsLogEnabled = true;
    global.isBlacklistedRareIceLootLogEnabled = true;
    global.isModRenameLogEnabled = true;
    global.isPlayerDimensionChangeLogEnabled = true;
    global.isItemTagIdsLogEnabled = true;
    global.isBlockIdsForShaderLogEnabled = true;
}

if (!enableAllLogs && disableAllLogs) {
    global.isBlockAndItemCountLogEnabled = false;
    global.isNonTaggedItemIdsLogEnabled = false;
    global.isBlacklistedRareIceLootLogEnabled = false;
    global.isModRenameLogEnabled = false;
    global.isPlayerDimensionChangeLogEnabled = false;
    global.isItemTagIdsLogEnabled = false;
    global.isBlockIdsForShaderLogEnabled = false;
}
