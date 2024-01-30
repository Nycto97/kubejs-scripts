/*
   Copyright (c) 2023, Jelle Van Goethem
   All rights reserved.
 
   This source code is licensed under the BSD-style license found in the
   LICENSE file in the root directory of this source tree.
*/

/* Listen to post-init event, after all mods have loaded */
StartupEvents.postInit(() => {
    global.allItemIds = Item.getTypeList();
    global.allBlockIds = Block.getTypeList();

    if (global.isBlockAndItemCountLogEnabled)
        console.log(
            `There are ${global.allItemIds.length} items and ${global.allBlockIds.length} blocks registered in your world.`
        );
});
