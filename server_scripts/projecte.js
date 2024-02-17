/**
 * @license BSD-3-Clause
 *
 * Copyright (c) 2023, Jelle Van Goethem
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

ProjectEEvents.setEMC((event) => {
    /* Sets the absolute EMC value of an item. */
    // event.setEMC('minecraft:cobblestone', 0); // alias. setEMCAfter

    /* Sets the EMC of an item before anything else happens.
       This can sometimes result in this EMC value not
       being set, but also it allows for EMC values
       to be generated from this one; i.e crafting recipes */
    if (Platform.isLoaded('architects_palette')) {
        event.setEMCBefore('architects_palette:withered_bone', 160);
    }

    if (Platform.isLoaded('blue_skies')) {
        event.setEMCBefore('blue_skies:lunar_cobblestone', 1);
    }

    /* Prevent XP exploit */
    event.setEMCBefore('minecraft:experience_bottle', 0);
});
