/**
 * @license BSD-3-Clause
 *
 * Copyright (c) 2023, Jelle Van Goethem
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
   ATTENTION:
   Item tags are used for controlling behavior in item form, like recipe inputs
   Block tags are used for controlling behavior with blocks in block form
*/

/*
    TODO: Group code by mod with a mod loaded check, then check if a block, item, ... exists before adding.
          Do this in all files.
*/

ServerEvents.tags(BLOCK_TAG_TYPE, (event) => {
    let blockIdsTaggedByMods;

    let blockTagIdsToAdd;

    let regexToAdd;

    if (Platform.isLoaded('buildersaddition')) {
        event.removeAllTagsFrom(/^buildersaddition:.*vertical_slab$/);
    }

    if (Platform.isLoaded('v_slab_compat') && Platform.isLoaded('createdeco')) {
        event.removeAllTagsFrom(/^v_slab_compat:createdeco.*vertical_slab$/);
    }

    /* Passive Endermen mod replacement

       Remove all blocks from #minecraft:enderman_holdable to
       prevent Endermen from picking up and placing down blocks */
    event.removeAll('minecraft:enderman_holdable');
    // TODO
    // event.removeAll('minecraft:mutant_enderman_holdable');

    /* Re-add items & blocks that should stay
       tagged as #minecraft:enderman_holdable */
    if (Platform.isLoaded('aether')) {
        event.add('minecraft:enderman_holdable', ['aether:purple_flower', 'aether:white_flower']);
    }
    if (Platform.isLoaded('biomesoplenty')) {
        event.add('minecraft:enderman_holdable', ['biomesoplenty:glowshroom', 'biomesoplenty:toadstool']);
    }
    if (Platform.isLoaded('enderzoology')) {
        event.add('minecraft:enderman_holdable', [
            'enderzoology:concussion_charge',
            'enderzoology:confusing_charge',
            'enderzoology:ender_charge'
        ]);
    }
    if (Platform.isLoaded('gardens_of_the_dead')) {
        event.add('minecraft:enderman_holdable', [
            'gardens_of_the_dead:blistercrown',
            'gardens_of_the_dead:soulblight_fungus',
            'gardens_of_the_dead:soulblight_sprouts'
        ]);
    }
    if (Platform.isLoaded('regions_unexplored')) {
        event.add('minecraft:enderman_holdable', [
            'regions_unexplored:brimsprout',
            'regions_unexplored:cobalt_roots',
            'regions_unexplored:glistering_bloom',
            'regions_unexplored:glistering_fern',
            'regions_unexplored:glistering_sprout',
            'regions_unexplored:mycotoxic_grass'
        ]);
    }
    if (Platform.isLoaded('savage_and_ravage')) {
        event.add('minecraft:enderman_holdable', 'savage_and_ravage:spore_bomb');
    }
    if (Platform.isLoaded('undergarden')) {
        event.add('minecraft:enderman_holdable', '#undergarden:mushrooms');
    }

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

    // TODO make function to add to tag, have params with mod name and item name
    if (Platform.isLoaded('aether')) {
        if (Platform.isLoaded('architects_palette')) {
            event.add('nycto:aether_torches_to_extinguish', 'architects_palette:nether_brass_torch');
        }
        if (Platform.isLoaded('endergetic')) {
            event.add('nycto:aether_torches_to_extinguish', 'endergetic:ender_torch');
        }
        if (Platform.isLoaded('infernalexp')) {
            event.add('nycto:aether_torches_to_extinguish', 'infernalexp:glow_torch');
        }
        if (Platform.isLoaded('nethersdelight')) {
            event.add('nycto:aether_torches_to_extinguish', 'nethersdelight:propelplant_torch');
        }
        if (Platform.isLoaded('additional_lights')) {
            event.add('nycto:aether_torches_to_extinguish', /^additional_lights:al_torch((?!soul)(?!wall).)*$/);
        }
        if (Platform.isLoaded('mcwlights')) {
            event.add('nycto:aether_torches_to_extinguish', /^mcwlights:((?!soul)(?!wall).)*tiki_torch$/);
        }
        if (Platform.isLoaded('morecraft')) {
            event.add('nycto:aether_torches_to_extinguish', /^morecraft:((?!soul)(?!wall).)*torch$/);
        }
        if (Platform.isLoaded('upgrade_aquatic')) {
            event.add('nycto:aether_torches_to_extinguish', /^upgrade_aquatic:((?!soul)(?!wall).)*torch$/);
        }
        if (Platform.isLoaded('torchslabmod')) {
            event.add('nycto:aether_torches_to_extinguish', /^torchslabmod:((?!soul)(?!wall).)*torch$/);
        }
        if (Platform.isLoaded('ceilingtorch')) {
            event.add(
                'nycto:aether_torches_to_extinguish',
                /^ceilingtorch:((?!soul)(?!wall)(?!projecte)(?!redstone).)*torch.*$/
            );
        }
        event.add('nycto:aether_torches_to_extinguish', 'minecraft:torch');

        if (Platform.isLoaded('architects_palette')) {
            event.add('nycto:aether_wall_torches_to_extinguish', 'architects_palette:nether_brass_wall_torch');
        }
        if (Platform.isLoaded('endergetic')) {
            event.add('nycto:aether_wall_torches_to_extinguish', 'endergetic:ender_wall_torch');
        }
        if (Platform.isLoaded('infernalexp')) {
            event.add('nycto:aether_wall_torches_to_extinguish', 'infernalexp:glow_torch_wall');
        }
        if (Platform.isLoaded('nethersdelight')) {
            event.add('nycto:aether_wall_torches_to_extinguish', 'nethersdelight:propelplant_wall_torch');
        }
        if (Platform.isLoaded('additional_lights')) {
            event.add('nycto:aether_wall_torches_to_extinguish', /^additional_lights:al_wall_torch((?!soul).)*$/);
        }
        if (Platform.isLoaded('morecraft')) {
            event.add('nycto:aether_wall_torches_to_extinguish', /^morecraft:((?!soul).)*wall.*torch$/);
        }
        if (Platform.isLoaded('upgrade_aquatic')) {
            event.add('nycto:aether_wall_torches_to_extinguish', /^upgrade_aquatic:((?!soul).)*wall_torch$/);
        }
        if (Platform.isLoaded('torchslabmod')) {
            event.add('nycto:aether_wall_torches_to_extinguish', /^torchslabmod:wall_((?!soul).)*torch.*$/);
        }
        event.add('nycto:aether_wall_torches_to_extinguish', 'minecraft:wall_torch');
    }

    if (Platform.isLoaded('blockrunner')) {
        let blockRunnerTagsToClear = [
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
        // event.add('blockrunner:slightly_quick_blocks', [/^((?!mcwpaths).)*path$/]);
        // event.add('blockrunner:quick_blocks', [/^mcwpaths:((?!running).)*path$/, /^mcwpaths:.*paving$/]);
        // event.add('blockrunner:very_quick_blocks', [/^mcwpaths:.*running.*$/]);
        // TODO test if .*path has same amount of elements as .*:.*path
        if (Platform.isLoaded('mcwpaths')) {
            event.add('blockrunner:quick_blocks', /^mcwpaths:.*(bond|flagstone|floor|paving|slab|weave)$/);
        }
        event.add('blockrunner:quick_blocks', /^.*:.*path$/);
    }

    // TODO change with other approach, adding all shulker boxes to correct tags
    /* Add shulker boxes from Iron Shulker Boxes to #minecraft:shulker_boxes */
    event.add('minecraft:shulker_boxes', [/^tieredshulkers:.*shulker_box((?!upgrade).)*$/]);

    /* Add chests from Iron Chests to #forge:chests */
    event.add('forge:chests', [/^ironchest:.*chest$/]);
    /* Add trapped chests from Iron Chests to #forge:chests/trapped */
    event.add('forge:chests/trapped', [/^ironchest:trapped.*chest$/]);

    /* Add blocks that aren't tagged correctly that should be mined with a pickaxe */
    if (Platform.isLoaded('disenchanting')) {
        event.add('minecraft:mineable/pickaxe', 'disenchanting:disenchanter');
    }
    if (Platform.isLoaded('elevatorid')) {
        event.add('minecraft:mineable/pickaxe', /^elevatorid:elevator.*$/);
    }
    if (Platform.isLoaded('goldenhopper')) {
        event.add('minecraft:mineable/pickaxe', 'goldenhopper:golden_hopper');
    }
    if (Platform.isLoaded('metalbarrels')) {
        event.add('minecraft:mineable/pickaxe', /^metalbarrels:.*barrel$/);
    }
    if (Platform.isLoaded('torchslabmod')) {
        event.add('minecraft:mineable/pickaxe', /^torchslabmod:.*lantern$/);
    }

    /* Remove blocks from needs_stone_tool tag that aren't tagged correctly */
    if (Platform.isLoaded('metalbarrels')) {
        event.remove('minecraft:needs_stone_tool', 'metalbarrels:gold_barrel');
    }

    /* Add blocks that aren't tagged correctly that need an iron tool */
    if (Platform.isLoaded('goldenhopper')) {
        event.add('minecraft:needs_iron_tool', 'goldenhopper:golden_hopper');
    }
    if (Platform.isLoaded('metalbarrels')) {
        event.add('minecraft:needs_iron_tool', 'metalbarrels:gold_barrel');
    }

    /* Add blocks that aren't tagged correctly that should be mined with an axe */
    if (Platform.isLoaded('elevatorid')) {
        event.add('minecraft:mineable/axe', /^elevatorid:elevator.*$/);
    }

    /* Add bookshelves that function as vanilla bookshelves to #forge:bookshelves */
    event.add('forge:bookshelves', [/^((?!buildersaddition)(?!fantasyfurniture)(?!empty).)*bookshelf.*$/]);

    // TODO add other vanilla like blocks from other mods that can normally be used as beacon base blocks
    /* Add modded blocks whom vanilla counterpart can be used as
       beacon base block to #minecraft:beacon_base_blocks */
    if (Platform.isLoaded('rechiseled')) {
        event.add('minecraft:beacon_base_blocks', /^rechiseled:(diamond|emerald|gold|iron|netherite)_block.*$/);
    }
    if (Platform.isLoaded('epicsamurai')) {
        event.add('minecraft:beacon_base_blocks', 'epicsamurai:ruby_block');
    }

    if (Platform.isLoaded('morecraft')) {
        event.removeAllTagsFrom('morecraft:ruby_block');
    }

    /* CONCRETE */
    event.add('forge:concrete', /^.*concrete$/);

    /* STAIRS */
    blockIdsTaggedByMods = [
        event
            .get('minecraft:stairs')
            .getObjectIds()
            .concat(event.get('forge:stairs').getObjectIds())
            .concat(event.get('minecraft:wooden_stairs').getObjectIds())
            .concat(event.get('forge:stairs/wooden').getObjectIds())
    ];
    regexToAdd = /^.*stairs$/;

    event.add('minecraft:stairs', [blockIdsTaggedByMods, regexToAdd]);
    event.add('forge:stairs', [blockIdsTaggedByMods, regexToAdd]);
});
