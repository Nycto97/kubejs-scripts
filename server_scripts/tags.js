/*
   Copyright (c) 2023, Jelle Van Goethem
   All rights reserved.
 
   This source code is licensed under the BSD-style license found in the
   LICENSE file in the root directory of this source tree.
*/

/*
   ATTENTION:
   Block tags are used for controlling behavior with blocks in block form
   Item tags are used for controlling behavior in item form, like recipe inputs
*/

ServerEvents.tags('block', (event) => {
    event.removeAllTagsFrom(/^buildersaddition:.*vertical_slab$/);

    event.removeAllTagsFrom(/^v_slab_compat:createdeco.*vertical_slab$/);

    /* Passive Endermen mod replacement

       Remove all blocks from #minecraft:enderman_holdable to
       prevent Endermen from picking up and placing down blocks */
    event.removeAll('minecraft:enderman_holdable');
    // TODO
    // event.removeAll('minecraft:mutant_enderman_holdable');

    /* Re-add items & blocks that should stay
       tagged as #minecraft:enderman_holdable */
    event.add('minecraft:enderman_holdable', [
        'aether:purple_flower',
        'aether:white_flower',
        'biomesoplenty:glowshroom',
        'biomesoplenty:toadstool',
        'enderzoology:concussion_charge',
        'enderzoology:confusing_charge',
        'enderzoology:ender_charge',
        'gardens_of_the_dead:blistercrown',
        'gardens_of_the_dead:soulblight_fungus',
        'gardens_of_the_dead:soulblight_sprouts',
        'regions_unexplored:brimsprout',
        'regions_unexplored:cobalt_roots',
        'regions_unexplored:glistering_bloom',
        'regions_unexplored:glistering_fern',
        'regions_unexplored:glistering_sprout',
        'regions_unexplored:mycotoxic_grass',
        'savage_and_ravage:spore_bomb',
        '#undergarden:mushrooms'
    ]);

    /* The Aether: Enhanced Extinguishing
       Extinguish more torches in The Aether instead of only minecraft:torch
       RECIPE CHANGE WORKED WITH DATAPACK, changed input from "block": "minecraft:torch"
       to "tag": "nycto:aether_torches_to_extinguish"
       SOMEHOW DIDN'T WORK WITH KUBEJS' replaceInput in recipe script */

    /* Macaw's Lights does not have separate wall torches,
       so we're not adding them, except Tiki torches, because
       Tiki torches can't be placed on walls, so we can add this tag.
       The other Macaw's torches can be placed on walls, but will have
       offset and floating positioning, hence why we leave those out!. */
    event.add('nycto:aether_torches_to_extinguish', [
        'minecraft:torch',
        'architects_palette:nether_brass_torch',
        'endergetic:ender_torch',
        'infernalexp:glow_torch',
        'nethersdelight:propelplant_torch',
        /^additional_lights:al_torch((?!soul)(?!wall).)*$/,
        /^mcwlights:((?!soul)(?!wall).)*tiki_torch$/,
        /^morecraft:((?!soul)(?!wall).)*torch$/,
        /^upgrade_aquatic:((?!soul)(?!wall).)*torch$/,
        /^torchslabmod:((?!soul)(?!wall).)*torch$/,
        /^ceilingtorch:((?!soul)(?!wall)(?!projecte)(?!redstone).)*torch.*$/
    ]);

    event.add('nycto:aether_wall_torches_to_extinguish', [
        'minecraft:wall_torch',
        'architects_palette:nether_brass_wall_torch',
        'endergetic:ender_wall_torch',
        'infernalexp:glow_torch_wall',
        'nethersdelight:propelplant_wall_torch',
        /^additional_lights:al_wall_torch((?!soul).)*$/,
        /^morecraft:((?!soul).)*wall.*torch$/,
        /^upgrade_aquatic:((?!soul).)*wall_torch$/,
        /^torchslabmod:wall_((?!soul).)*torch.*$/
    ]);

    const blockRunnerTagsToClear = [
        'blockrunner:very_slow_blocks',
        'blockrunner:slow_blocks',
        'blockrunner:slightly_slow_blocks',
        'blockrunner:slightly_quick_blocks',
        'blockrunner:quick_blocks',
        'blockrunner:very_quick_blocks'
    ];
    blockRunnerTagsToClear.forEach((tag) => {
        event.removeAll(tag);
    });
    event.add('blockrunner:slightly_quick_blocks', [/^((?!mcwpaths).)*path$/]);
    event.add('blockrunner:quick_blocks', [/^mcwpaths:((?!running).)*path$/, /^mcwpaths:.*paving$/]);
    event.add('blockrunner:very_quick_blocks', [/^mcwpaths:.*running.*$/]);

    /* Add shulker boxes from Iron Shulker Boxes to #minecraft:shulker_boxes */
    event.add('minecraft:shulker_boxes', [/^tieredshulkers:.*shulker_box((?!upgrade).)*$/]);

    /* Add chests from Iron Chests to #forge:chests */
    event.add('forge:chests', [/^ironchest:.*chest$/]);
    /* Add trapped chests from Iron Chests to #forge:chests/trapped */
    event.add('forge:chests/trapped', [/^ironchest:trapped.*chest$/]);

    /* Add blocks that aren't tagged correctly that should be mined with a pickaxe */
    event.add('minecraft:mineable/pickaxe', [
        /^torchslabmod:.*lantern$/,
        'disenchanting:disenchanter',
        /^elevatorid:elevator.*$/,
        'mcwroofs:gutter_middle'
    ]);

    /* Add blocks that aren't tagged correctly that should be mined with an axe */
    event.add('minecraft:mineable/axe', [/^elevatorid:elevator.*$/]);

    /* Add bookshelves that function as vanilla bookshelves to #forge:bookshelves */
    event.add('forge:bookshelves', [/^((?!buildersaddition)(?!fantasyfurniture)(?!empty).)*bookshelf.*$/]);

    // TODO add other vanilla like blocks from other mods that can normally be used as beacon base blocks
    /* Add modded blocks whom vanilla counterpart can be used as
       beacon base block to #minecraft:beacon_base_blocks */
    event.add('minecraft:beacon_base_blocks', [
        /^rechiseled:(diamond|emerald|gold|iron|netherite)_block.*$/,
        'epicsamurai:ruby_block'
    ]);

    event.removeAllTagsFrom('morecraft:ruby_block');
});

ServerEvents.tags('item', (event) => {
    event.removeAllTagsFrom(/^buildersaddition:.*vertical_slab$/);

    event.removeAllTagsFrom(/^v_slab_compat:createdeco.*vertical_slab$/);

    /* Add shulker boxes from Iron Shulker Boxes to #minecraft:shulker_boxes */
    event.add('minecraft:shulker_boxes', [/^tieredshulkers:.*shulker_box((?!upgrade).)*$/]);
    /* Add shulker boxes from Iron Shulker Boxes to #curios:back
       to make them equippable in Curios back slot */
    event.add('curios:back', [/^tieredshulkers:.*shulker_box((?!upgrade).)*$/]);

    /* Add chests from Iron Chests to #forge:chests */
    event.add('forge:chests', [/^ironchest:.*chest$/]);
    /* Add trapped chests from Iron Chests to #forge:chests/trapped */
    event.add('forge:chests/trapped', [/^ironchest:trapped.*chest$/]);

    /* Add bookshelves that function as vanilla bookshelves to #forge:bookshelves */
    event.add('forge:bookshelves', [/^((?!buildersaddition)(?!fantasyfurniture)(?!empty).)*bookshelf.*$/]);

    event.removeAllTagsFrom([
        'morecraft:emerald_helmet',
        'morecraft:emerald_chestplate',
        'morecraft:emerald_leggings',
        'morecraft:emerald_boots'
    ]);

    event.removeAllTagsFrom([
        'morecraft:ruby',
        'morecraft:ruby_block',
        'morecraft:ruby_ore',
        'morecraft:deepslate_ruby_ore'
    ]);

    /* Add modded items to #minecraft:beacon_payment_items */
    event.add('minecraft:beacon_payment_items', ['epicsamurai:ruby']);

    event.add('create:crushed_raw_materials', [
        'undergarden:crushed_raw_cloggrum',
        'undergarden:crushed_raw_froststeel',
        'undergarden:crushed_raw_utherium',
        'undergarden:crushed_raw_regalium'
    ]);
});
