/*
   Copyright (c) 2023, Jelle Van Goethem
   All rights reserved.
 
   This source code is licensed under the BSD-style license found in the
   LICENSE file in the root directory of this source tree.
*/

// priority: 1000

/* Listen to post-init event, after all mods have loaded */
StartupEvents.postInit(() => {
    global.allItems = Item.getTypeList();
    global.allBlocks = Block.getTypeList();
});
