/*
   Copyright (c) 2023, Jelle Van Goethem
   All rights reserved.
 
   This source code is licensed under the BSD-style license found in the
   LICENSE file in the root directory of this source tree.
*/

JEIEvents.hideItems((event) => {
    /* Hide all vertical slabs from Builders Crafts and
       Additions from JEI GUI since Quark already adds all of these */
    event.hide(/buildersaddition:.*vertical_slab/);

    /* Hide all vertical slabs from Vertical Slabs Compat - Create: Deco
       from JEI GUI since Create: Deco already adds all of these */
    event.hide(/v_slab_compat:createdeco.*vertical_slab/);

    /* Hide vertical slab from Double Slabs
       from JEI GUI since Quark already adds this
       and this currently is uncraftable anyway and just acts
       as air when mining double slabbed vertical slabs when this
       is enabled in Double Slabs config (currently disabled) */
    event.hide('doubleslabs:vertical_slab');

    /* Hide all emerald armor from MoreCraft from JEI
       GUI since Useless Swords already adds all of these */
    event.hide([
        'morecraft:emerald_helmet',
        'morecraft:emerald_chestplate',
        'morecraft:emerald_leggings',
        'morecraft:emerald_boots'
    ]);

    /* Hide ruby gems, blocks and ores from MoreCraft
       from JEI GUI since we use Epic Samurai's ruby */
    event.hide(['morecraft:ruby', 'morecraft:ruby_block', 'morecraft:ruby_ore', 'morecraft:deepslate_ruby_ore']);

    /* Hide disabled items from Paraglider from JEI GUI */
    event.hide([
        'paraglider:heart_container',
        'paraglider:stamina_vessel',
        'paraglider:spirit_orb',
        'paraglider:anti_vessel',
        'paraglider:essence'
    ]);
});
