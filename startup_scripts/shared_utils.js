/*
   Copyright (c) 2023, Jelle Van Goethem
   All rights reserved.
 
   This source code is licensed under the BSD-style license found in the
   LICENSE file in the root directory of this source tree.
*/

// priority: 999

/* Listen to post-init event, after all mods have loaded */
StartupEvents.postInit(() => {
    global['itemIds'] = Item.getTypeList();
    global['blockIds'] = Block.getTypeList();

    global['logModNotLoaded'] = (modName, activityType) => {
        console.log(`[WARN] ${modName} mod is not loaded! Skipping ${activityType}`);
    };

    global['logItemIdNotFound'] = (itemId, activityType, itemType) => {
        console.log(
            `[WARN] ${itemType ? `${itemType} i` : 'I'}tem id ${itemId} is not found! Skipping ${activityType}`
        );
    };

    global['logTagNotFound'] = (tagId, activityType, tagType) => {
        console.log(`[WARN] ${tagType ? `${tagType} t` : 'T'}ag #${tagId} is not found! Skipping ${activityType}`);
    };

    if (global.isBlockAndItemCountLogEnabled) {
        console.log(`There are ${global.itemIds.length} items and ${global.blockIds.length} blocks registered`);
    }
});
