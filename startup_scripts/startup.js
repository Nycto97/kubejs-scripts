/*
   Copyright (c) 2023, Jelle Van Goethem
   All rights reserved.
 
   This source code is licensed under the BSD-style license found in the
   LICENSE file in the root directory of this source tree.
*/

/* Make end_portal_frame breakable */

// BlockEvents.modification((event) => event.modify('minecraft:end_portal_frame', (block) => (block.destroySpeed = 0.3)));

/* BlockEvents.modification((event) => {
    const sharedHardness = 1.5; // 1.5 is the default hardness
    event.modify('modId:block1RegistryName', (block) => (block.hardness = sharedHardness));
    event.modify('modId:block2RegistryName', (block) => (block.hardness = sharedHardness));
    event.modify('modId:block3RegistryName', (block) => (block.hardness = sharedHardness));
}); */
