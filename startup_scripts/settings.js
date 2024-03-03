/**
 * @license BSD-3-Clause
 *
 * Copyright (c) 2023, Jelle Van Goethem
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

// priority: 1002

/*
   Gets ignored when both are set to true
*/
const enableAllLogs = true;

const disableAllLogs = false;

/* Blocks and items */
let isBlockAndItemCountLogEnabled = true;

/* Items */
let isNonTaggedItemIdsLogEnabled = true;

/* Loot */
let isBlacklistedRareIceLootLogEnabled = false;

/* Mods */
let isModRenameLogEnabled = true;

/* Players */
let isPlayerDimensionChangeLogEnabled = true;

/* Recipes */
let isRecipeIdCompositionLogEnabled = true;

/* Tags */
let isItemTagsLogEnabled = true;

/* Shader (client only) */
let isBlockIdsForShaderLogEnabled = false;

if (enableAllLogs && !disableAllLogs) {
    isBlockAndItemCountLogEnabled = true;
    isNonTaggedItemIdsLogEnabled = true;
    isBlacklistedRareIceLootLogEnabled = true;
    isModRenameLogEnabled = true;
    isPlayerDimensionChangeLogEnabled = true;
    isRecipeIdCompositionLogEnabled = true;
    isItemTagsLogEnabled = true;
    isBlockIdsForShaderLogEnabled = true;
}

if (!enableAllLogs && disableAllLogs) {
    isBlockAndItemCountLogEnabled = false;
    isNonTaggedItemIdsLogEnabled = false;
    isBlacklistedRareIceLootLogEnabled = false;
    isModRenameLogEnabled = false;
    isPlayerDimensionChangeLogEnabled = false;
    isRecipeIdCompositionLogEnabled = false;
    isItemTagsLogEnabled = false;
    isBlockIdsForShaderLogEnabled = false;
}

/* Global exports */

global['isBlockAndItemCountLogEnabled'] = isBlockAndItemCountLogEnabled;
global['isNonTaggedItemIdsLogEnabled'] = isNonTaggedItemIdsLogEnabled;
global['isBlacklistedRareIceLootLogEnabled'] = isBlacklistedRareIceLootLogEnabled;
global['isModRenameLogEnabled'] = isModRenameLogEnabled;
global['isPlayerDimensionChangeLogEnabled'] = isPlayerDimensionChangeLogEnabled;
global['isRecipeIdCompositionLogEnabled'] = isRecipeIdCompositionLogEnabled;
global['isItemTagsLogEnabled'] = isItemTagsLogEnabled;
global['isBlockIdsForShaderLogEnabled'] = isBlockIdsForShaderLogEnabled;
