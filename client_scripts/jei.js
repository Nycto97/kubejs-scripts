/*
   Copyright (c) 2023, Jelle Van Goethem
   All rights reserved.
 
   This source code is licensed under the BSD-style license found in the
   LICENSE file in the root directory of this source tree.
*/

let isInstalled = (modId) => Platform.mods[modId] != undefined;

if (isInstalled('jei')) {
    /* Hide items in JEI interface */
    JEIEvents.hideItems((event) => {
        /* All vertical slabs from Builders Crafts and
           Additions since Quark already adds these */
        if (isInstalled('buildersaddition')) event.hide(/buildersaddition:.*vertical_slab/);

        /* All vertical slabs from Vertical Slabs Compat - Create: Deco
           since Create: Deco already adds these */
        if (isInstalled('v_slab_compat') && isInstalled('createdeco'))
            event.hide(/v_slab_compat:createdeco.*vertical_slab/);

        /* Vertical slab from Double Slabs since Quark already adds this
           and this currently is uncraftable anyway and just acts
           as air when mining double slab vertical slabs when this
           is enabled in Double Slabs config (currently disabled) */
        if (isInstalled('doubleslabs')) event.hide('doubleslabs:vertical_slab');

        if (isInstalled('morecraft')) {
            /* All emerald armor from MoreCraft since
               Useless Swords already adds these */
            event.hide([
                'morecraft:emerald_helmet',
                'morecraft:emerald_chestplate',
                'morecraft:emerald_leggings',
                'morecraft:emerald_boots'
            ]);

            /* Ruby gems, blocks and ores from MoreCraft
               since we use Epic Samurai's ruby */
            event.hide([
                'morecraft:ruby',
                'morecraft:ruby_block',
                'morecraft:ruby_ore',
                'morecraft:deepslate_ruby_ore'
            ]);
        }

        /* Disabled items from Paraglider */
        if (isInstalled('paraglider'))
            event.hide([
                'paraglider:heart_container',
                'paraglider:stamina_vessel',
                'paraglider:spirit_orb',
                'paraglider:anti_vessel',
                'paraglider:essence'
            ]);
    });
}
