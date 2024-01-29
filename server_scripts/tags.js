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

/*
   INFO:
   Supports adding tags to tags as well -> prefix the second tag with #
*/

/*
   ATTENTION:
   Some mods don't tag their stuff correctly.
   
   What to do: Add elements from wrongly used tags to the correct tag(s).
               Remove elements from wrongly used tags after checking if
               tag is used somewhere. If it is, don't forget to change/add
               the wrong tag where it's used before removing.

   What NOT to do: Add elements to wrongly used tags.

   Example: Regions Unexplored ... TODO finish this example, change to BYG

*/

const itemReg = Java.loadClass('net.minecraft.core.Registry').ITEM;

const itemTagIds = itemReg
    .getTagNames()
    .map((tagKey) => tagKey.location().toString())
    .toArray()
    .sort();

let nonTaggedItemIds = new Set();

/* Get items that are not tagged with minecraft:item tags */
Ingredient.of(Ingredient.all).stacks.forEach((stack) => {
    let stackId = stack.getId();

    if (!nonTaggedItemIds.has(stackId) && stack.getTags().toList().isEmpty()) {
        nonTaggedItemIds.add(stackId);
    }
});

nonTaggedItemIds = Array.from(nonTaggedItemIds).sort();

console.log(`${itemTagIds.length} registered minecraft:item tags found!`);
console.log(itemTagIds);

console.log(`${nonTaggedItemIds.length} items are currently NOT TAGGED with minecraft:item tags!`);
console.log(nonTaggedItemIds);

ServerEvents.tags('block', (event) => {
    if (Platform.isLoaded('buildersaddition')) event.removeAllTagsFrom(/^buildersaddition:.*vertical_slab$/);

    if (Platform.isLoaded('v_slab_compat') && Platform.isLoaded('createdeco'))
        event.removeAllTagsFrom(/^v_slab_compat:createdeco.*vertical_slab$/);

    /* Passive Endermen mod replacement

       Remove all blocks from #minecraft:enderman_holdable to
       prevent Endermen from picking up and placing down blocks */
    event.removeAll('minecraft:enderman_holdable');
    // TODO
    // event.removeAll('minecraft:mutant_enderman_holdable');

    /* Re-add items & blocks that should stay
       tagged as #minecraft:enderman_holdable */
    if (Platform.isLoaded('aether'))
        event.add('minecraft:enderman_holdable', ['aether:purple_flower', 'aether:white_flower']);
    if (Platform.isLoaded('biomesoplenty'))
        event.add('minecraft:enderman_holdable', ['biomesoplenty:glowshroom', 'biomesoplenty:toadstool']);
    if (Platform.isLoaded('enderzoology'))
        event.add('minecraft:enderman_holdable', [
            'enderzoology:concussion_charge',
            'enderzoology:confusing_charge',
            'enderzoology:ender_charge'
        ]);
    if (Platform.isLoaded('gardens_of_the_dead'))
        event.add('minecraft:enderman_holdable', [
            'gardens_of_the_dead:blistercrown',
            'gardens_of_the_dead:soulblight_fungus',
            'gardens_of_the_dead:soulblight_sprouts'
        ]);
    if (Platform.isLoaded('regions_unexplored'))
        event.add('minecraft:enderman_holdable', [
            'regions_unexplored:brimsprout',
            'regions_unexplored:cobalt_roots',
            'regions_unexplored:glistering_bloom',
            'regions_unexplored:glistering_fern',
            'regions_unexplored:glistering_sprout',
            'regions_unexplored:mycotoxic_grass'
        ]);
    if (Platform.isLoaded('savage_and_ravage'))
        event.add('minecraft:enderman_holdable', 'savage_and_ravage:spore_bomb');
    if (Platform.isLoaded('undergarden')) event.add('minecraft:enderman_holdable', '#undergarden:mushrooms');

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
    if (Platform.isLoaded('aether')) {
        event.add('nycto:aether_torches_to_extinguish', 'minecraft:torch');
        if (Platform.isLoaded('architects_palette'))
            event.add('nycto:aether_torches_to_extinguish', 'architects_palette:nether_brass_torch');
        if (Platform.isLoaded('endergetic')) event.add('nycto:aether_torches_to_extinguish', 'endergetic:ender_torch');
        if (Platform.isLoaded('infernalexp')) event.add('nycto:aether_torches_to_extinguish', 'infernalexp:glow_torch');
        if (Platform.isLoaded('nethersdelight'))
            event.add('nycto:aether_torches_to_extinguish', 'nethersdelight:propelplant_torch');
        if (Platform.isLoaded('additional_lights'))
            event.add('nycto:aether_torches_to_extinguish', /^additional_lights:al_torch((?!soul)(?!wall).)*$/);
        if (Platform.isLoaded('mcwlights'))
            event.add('nycto:aether_torches_to_extinguish', /^mcwlights:((?!soul)(?!wall).)*tiki_torch$/);
        if (Platform.isLoaded('morecraft'))
            event.add('nycto:aether_torches_to_extinguish', /^morecraft:((?!soul)(?!wall).)*torch$/);
        if (Platform.isLoaded('upgrade_aquatic'))
            event.add('nycto:aether_torches_to_extinguish', /^upgrade_aquatic:((?!soul)(?!wall).)*torch$/);
        if (Platform.isLoaded('torchslabmod'))
            event.add('nycto:aether_torches_to_extinguish', /^torchslabmod:((?!soul)(?!wall).)*torch$/);
        if (Platform.isLoaded('ceilingtorch'))
            event.add(
                'nycto:aether_torches_to_extinguish',
                /^ceilingtorch:((?!soul)(?!wall)(?!projecte)(?!redstone).)*torch.*$/
            );

        event.add('nycto:aether_wall_torches_to_extinguish', 'minecraft:wall_torch');
        if (Platform.isLoaded('architects_palette'))
            event.add('nycto:aether_wall_torches_to_extinguish', 'architects_palette:nether_brass_wall_torch');
        if (Platform.isLoaded('endergetic'))
            event.add('nycto:aether_wall_torches_to_extinguish', 'endergetic:ender_wall_torch');
        if (Platform.isLoaded('infernalexp'))
            event.add('nycto:aether_wall_torches_to_extinguish', 'infernalexp:glow_torch_wall');
        if (Platform.isLoaded('nethersdelight'))
            event.add('nycto:aether_wall_torches_to_extinguish', 'nethersdelight:propelplant_wall_torch');
        if (Platform.isLoaded('additional_lights'))
            event.add('nycto:aether_wall_torches_to_extinguish', /^additional_lights:al_wall_torch((?!soul).)*$/);
        if (Platform.isLoaded('morecraft'))
            event.add('nycto:aether_wall_torches_to_extinguish', /^morecraft:((?!soul).)*wall.*torch$/);
        if (Platform.isLoaded('upgrade_aquatic'))
            event.add('nycto:aether_wall_torches_to_extinguish', /^upgrade_aquatic:((?!soul).)*wall_torch$/);
        if (Platform.isLoaded('torchslabmod'))
            event.add('nycto:aether_wall_torches_to_extinguish', /^torchslabmod:wall_((?!soul).)*torch.*$/);
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
        event.add('blockrunner:quick_blocks', /^.*:.*path$/);
        if (Platform.isLoaded('mcwpaths'))
            event.add('blockrunner:quick_blocks', /^mcwpaths:.*(bond|flagstone|floor|paving|slab|weave)$/);
    }

    // TODO change with other approach, adding all shulker boxes to correct tags
    /* Add shulker boxes from Iron Shulker Boxes to #minecraft:shulker_boxes */
    event.add('minecraft:shulker_boxes', [/^tieredshulkers:.*shulker_box((?!upgrade).)*$/]);

    /* Add chests from Iron Chests to #forge:chests */
    event.add('forge:chests', [/^ironchest:.*chest$/]);
    /* Add trapped chests from Iron Chests to #forge:chests/trapped */
    event.add('forge:chests/trapped', [/^ironchest:trapped.*chest$/]);

    /* Add blocks that aren't tagged correctly that should be mined with a pickaxe */
    if (Platform.isLoaded('disenchanting')) event.add('minecraft:mineable/pickaxe', 'disenchanting:disenchanter');
    if (Platform.isLoaded('elevatorid')) event.add('minecraft:mineable/pickaxe', /^elevatorid:elevator.*$/);
    if (Platform.isLoaded('goldenhopper')) event.add('minecraft:mineable/pickaxe', 'goldenhopper:golden_hopper');
    if (Platform.isLoaded('mcwroofs')) event.add('minecraft:mineable/pickaxe', 'mcwroofs:gutter_middle');
    if (Platform.isLoaded('metalbarrels')) event.add('minecraft:mineable/pickaxe', /^metalbarrels:.*barrel$/);
    if (Platform.isLoaded('torchslabmod')) event.add('minecraft:mineable/pickaxe', /^torchslabmod:.*lantern$/);

    /* Remove blocks from needs_stone_tool tag that aren't tagged correctly */
    if (Platform.isLoaded('metalbarrels')) event.remove('minecraft:needs_stone_tool', 'metalbarrels:gold_barrel');

    /* Add blocks that aren't tagged correctly that need an iron tool */
    if (Platform.isLoaded('goldenhopper')) event.add('minecraft:needs_iron_tool', 'goldenhopper:golden_hopper');
    if (Platform.isLoaded('metalbarrels')) event.add('minecraft:needs_iron_tool', 'metalbarrels:gold_barrel');

    /* Add blocks that aren't tagged correctly that should be mined with an axe */
    if (Platform.isLoaded('elevatorid')) event.add('minecraft:mineable/axe', /^elevatorid:elevator.*$/);

    /* Add bookshelves that function as vanilla bookshelves to #forge:bookshelves */
    event.add('forge:bookshelves', [/^((?!buildersaddition)(?!fantasyfurniture)(?!empty).)*bookshelf.*$/]);

    // TODO add other vanilla like blocks from other mods that can normally be used as beacon base blocks
    /* Add modded blocks whom vanilla counterpart can be used as
       beacon base block to #minecraft:beacon_base_blocks */
    if (Platform.isLoaded('rechiseled'))
        event.add('minecraft:beacon_base_blocks', /^rechiseled:(diamond|emerald|gold|iron|netherite)_block.*$/);
    if (Platform.isLoaded('epicsamurai')) event.add('minecraft:beacon_base_blocks', 'epicsamurai:ruby_block');

    if (Platform.isLoaded('morecraft')) event.removeAllTagsFrom('morecraft:ruby_block');

    /* Add CONCRETE to concrete tag */
    event.add('forge:concrete', /^.*concrete$/);

    /* Add STAIRS to stairs tags */
    let stairsTaggedByMods = [
        event
            .get('minecraft:stairs')
            .getObjectIds()
            .concat(event.get('forge:stairs').getObjectIds())
            .concat(event.get('minecraft:wooden_stairs').getObjectIds())
            .concat(event.get('forge:stairs/wooden').getObjectIds())
    ];
    let stairsRegex = /^.*stairs$/;

    event.add('minecraft:stairs', [stairsTaggedByMods, stairsRegex]);
    event.add('forge:stairs', [stairsTaggedByMods, stairsRegex]);
});

ServerEvents.tags('item', (event) => {
    /* 2 examples of adding (all) items to a tag */
    // event.add('your_namespace:your_tag_name', /^.*$/);
    // Item.getTypeList().forEach((item) => event.add('your_namespace:your_tag_name', item));

    if (Platform.isLoaded('buildersaddition')) event.removeAllTagsFrom(/^buildersaddition:.*vertical_slab$/);

    if (Platform.isLoaded('v_slab_compat') && Platform.isLoaded('createdeco'))
        event.removeAllTagsFrom(/^v_slab_compat:createdeco.*vertical_slab$/);

    /* Add shulker boxes from Iron Shulker Boxes to #minecraft:shulker_boxes */
    event.add('minecraft:shulker_boxes', [/^tieredshulkers:.*shulker_box((?!upgrade).)*$/]);
    /* Add shulker boxes from Iron Shulker Boxes to #curios:back
       to make them equippable in Curios back slot */
    // event.add('curios:back', [/^tieredshulkers:.*shulker_box((?!upgrade).)*$/]);

    /* Add chests from Iron Chests to #forge:chests */
    event.add('forge:chests', [/^ironchest:.*chest$/]);
    /* Add trapped chests from Iron Chests to #forge:chests/trapped */
    event.add('forge:chests/trapped', [/^ironchest:trapped.*chest$/]);

    /* Add bookshelves that function as vanilla bookshelves to #forge:bookshelves */
    event.add('forge:bookshelves', [/^((?!buildersaddition)(?!fantasyfurniture)(?!empty).)*bookshelf.*$/]);

    if (Platform.isLoaded('morecraft')) {
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
    }

    // TODO add more gems
    /* Add modded items to #minecraft:beacon_payment_items */
    if (Platform.isLoaded('epicsamurai')) event.add('minecraft:beacon_payment_items', 'epicsamurai:ruby');

    /* The Undergarden check is redundant since I
       created and registered these items myself */
    if (Platform.isLoaded('create') && Platform.isLoaded('undergarden'))
        event.add('create:crushed_raw_materials', [
            'undergarden:crushed_raw_cloggrum',
            'undergarden:crushed_raw_froststeel',
            'undergarden:crushed_raw_utherium',
            'undergarden:crushed_raw_regalium'
        ]);

    // TODO untag refined storage's wrench as it seems like this has another functionality and if it's tagged it won't be able to use that function on let's say Create blocks because it will act as a Create wrench
    /* Add wrenches that aren't tagged as wrenches to wrench tag */
    if (Platform.isLoaded('refinedstorage')) event.add('forge:tools/wrench', 'refinedstorage:wrench');
    if (Platform.isLoaded('simpleplanes')) event.add('forge:tools/wrench', 'simpleplanes:wrench');

    /* Add SWORDS to swords tags */
    let swordsTaggedByMods = [
        event
            .get('minecraft:swords')
            .getObjectIds()
            .concat(event.get('forge:swords').getObjectIds())
            .concat(event.get('forge:tools/sword').getObjectIds())
            .concat(event.get('forge:tools/swords').getObjectIds())
    ];
    let swordsRegex = /^.*(battleaxe|blade|lance|sword)$/;

    event.add('minecraft:swords', [swordsTaggedByMods, swordsRegex]);
    event.add('forge:swords', [swordsTaggedByMods, swordsRegex]);
    event.add('forge:tools/sword', [swordsTaggedByMods, swordsRegex]);
    event.add('forge:tools/swords', [swordsTaggedByMods, swordsRegex]);

    /* ARMORS */
    let armorsTagIds = [];

    itemTagIds
        .filter((tagId) => tagId.startsWith('forge:armors/'))
        .forEach((tagId) => armorsTagIds.push('#'.concat(tagId)));

    event.add('forge:armors', armorsTagIds);

    /* Add AXES to axes tags */
    let axesTaggedByMods = [
        event
            .get('minecraft:axes')
            .getObjectIds()
            .concat(event.get('forge:axes').getObjectIds())
            .concat(event.get('forge:tools/axe').getObjectIds())
            .concat(event.get('forge:tools/axes').getObjectIds())
    ];
    let axesRegex = /^.*(_axe|battleaxe|hatchet)$/;

    event.add('minecraft:axes', [axesTaggedByMods, axesRegex]);
    event.add('forge:axes', [axesTaggedByMods, axesRegex]);
    event.add('forge:tools/axe', [axesTaggedByMods, axesRegex]);
    event.add('forge:tools/axes', [axesTaggedByMods, axesRegex]);

    /* BARRELS */
    let barrelsTagIds = [],
        barrelsRegex = /^.*:(?!(cannon|tnt).)*_barrel$/;

    if (Platform.isLoaded('chipped')) barrelsTagIds.push('#chipped:barrel');

    itemTagIds
        .filter((tagId) => tagId.startsWith('forge:barrels/'))
        .forEach((tagId) => barrelsTagIds.push('#'.concat(tagId)));

    event.add('forge:barrels', [barrelsTagIds, barrelsRegex]);

    /* INGOTS */
    let ingotTagIds = [],
        ingotsRegex = /^.*ingot$/;

    itemTagIds
        .filter((tagId) => tagId.startsWith('forge:ingots/'))
        .forEach((tagId) => ingotTagIds.push('#'.concat(tagId)));

    event.add('forge:ingots', [ingotTagIds, ingotsRegex]);

    /* MUSIC DISCS */
    event.remove('forge:music_discs', /^.*$/);

    event.add('minecraft:music_discs', /^.*:.*music_disc.*$/);

    if (Platform.isLoaded('create_confectionery'))
        event.add('minecraft:music_discs', 'create_confectionery:the_bright_side');

    if (Platform.isLoaded('wandering_bags')) event.add('minecraft:music_discs', 'wandering_bags:out_of_them_disc');

    /* Add PICKAXES to pickaxes tags */
    let pickaxesTaggedByMods = [
        event
            .get('minecraft:pickaxes')
            .getObjectIds()
            .concat(event.get('forge:pickaxes').getObjectIds())
            .concat(event.get('forge:tools/pickaxe').getObjectIds())
            .concat(event.get('forge:tools/pickaxes').getObjectIds())
    ];
    let pickaxesRegex = /^.*(pick|pickaxe)$/;

    event.add('minecraft:pickaxes', [pickaxesTaggedByMods, pickaxesRegex]);
    event.add('forge:pickaxes', [pickaxesTaggedByMods, pickaxesRegex]);
    event.add('forge:tools/pickaxe', [pickaxesTaggedByMods, pickaxesRegex]);
    event.add('forge:tools/pickaxes', [pickaxesTaggedByMods, pickaxesRegex]);

    /* Add SHOVELS to shovels tags */
    let shovelsTaggedByMods = [
        event
            .get('minecraft:shovels')
            .getObjectIds()
            .concat(event.get('forge:shovels').getObjectIds())
            .concat(event.get('forge:tools/shovel').getObjectIds())
            .concat(event.get('forge:tools/shovels').getObjectIds())
    ];
    let shovelsRegex = /^.*shovel$/;

    event.add('minecraft:shovels', [shovelsTaggedByMods, shovelsRegex]);
    event.add('forge:shovels', [shovelsTaggedByMods, shovelsRegex]);
    event.add('forge:tools/shovel', [shovelsTaggedByMods, shovelsRegex]);
    event.add('forge:tools/shovels', [shovelsTaggedByMods, shovelsRegex]);

    /* Add HOES to hoes tags */
    let hoesTaggedByMods = [
        event
            .get('minecraft:hoes')
            .getObjectIds()
            .concat(event.get('forge:hoes').getObjectIds())
            .concat(event.get('forge:tools/hoe').getObjectIds())
            .concat(event.get('forge:tools/hoes').getObjectIds())
    ];
    let hoesRegex = /^.*hoe$/;

    event.add('minecraft:hoes', [hoesTaggedByMods, hoesRegex]);
    event.add('forge:hoes', [hoesTaggedByMods, hoesRegex]);
    event.add('forge:tools/hoe', [hoesTaggedByMods, hoesRegex]);
    event.add('forge:tools/hoes', [hoesTaggedByMods, hoesRegex]);

    // TODO check block
    /* Add DOORS to doors tags */
    let doorsTaggedByMods = [
        event.get('minecraft:doors').getObjectIds().concat(event.get('forge:doors').getObjectIds())
    ];
    let doorsRegex = /^((?!smokebox).)*_door$/;

    event.add('minecraft:doors', [doorsTaggedByMods, doorsRegex]);
    event.add('forge:doors', [doorsTaggedByMods, doorsRegex]);

    /* Add BOWS to bows tags */
    let bowsTaggedByMods = [
        event.get('forge:bows').getObjectIds().concat(event.get('forge:tools/bows').getObjectIds())
    ];
    let bowsRegex = /^.*_bow$/;

    event.add('forge:bows', [bowsTaggedByMods, bowsRegex]);
    event.add('forge:tools/bows', [bowsTaggedByMods, bowsRegex]);

    /* Add BONES to bones tags */
    let bonesTaggedByMods = [
        event.get('forge:bones').getObjectIds().concat(event.get('forge:bones/wither').getObjectIds())
    ];
    let bonesRegex = /^.*bone$/;

    event.add('forge:bones', [bonesTaggedByMods, bonesRegex]);

    /* Add WITHER BONES to wither bones tags */
    event.add('forge:bones/wither', /^.*wither.*_bone$/);

    // TODO check block
    /* Add BUTTONS to buttons tags */
    let buttonsTaggedByMods = [
        event.get('minecraft:buttons').getObjectIds().concat(event.get('minecraft:wooden_buttons').getObjectIds())
    ];
    let buttonsRegex = /^.*button$/;

    event.add('minecraft:buttons', [buttonsTaggedByMods, buttonsRegex]);

    // TODO check mods and add their id if they add raw materials that should be tagged
    // INFO look in ATM6's kjs scripts for examples
    /* RAW MATERIALS */
    let rawMaterialsTagIds = [];
    // let rawMaterialsTagIds = [],
    //     rawMaterialsRegex = /^(mod1|mod2|mod3):raw.*(include|words|here|if|needed)$/;

    itemTagIds
        .filter((tagId) => tagId.startsWith('forge:raw_materials/'))
        .forEach((tagId) => rawMaterialsTagIds.push('#'.concat(tagId)));

    event.add('forge:raw_materials', rawMaterialsTagIds);
    // event.add('forge:raw_materials', [rawMaterialsTagIds, rawMaterialsRegex]);

    /* Add STAIRS to stairs tags */
    let stairsTaggedByMods = [
        event
            .get('minecraft:stairs')
            .getObjectIds()
            .concat(event.get('forge:stairs').getObjectIds())
            .concat(event.get('minecraft:wooden_stairs').getObjectIds())
            .concat(event.get('forge:stairs/wooden').getObjectIds())
    ];
    let stairsRegex = /^.*stairs$/;

    event.add('minecraft:stairs', [stairsTaggedByMods, stairsRegex]);
    event.add('forge:stairs', [stairsTaggedByMods, stairsRegex]);

    /* Add SHIELDS to shields tags */
    let shieldsTaggedByMods = [
        event.get('forge:shields').getObjectIds().concat(event.get('forge:tools/shields').getObjectIds())
    ];
    let shieldsRegex = /^((?!domestication)(?!glyph)(?!stronghold).)*(_shield|shield_)((?!upgrade).)*$/;

    event.add('forge:shields', [shieldsTaggedByMods, shieldsRegex]);
    event.add('forge:tools/shields', [shieldsTaggedByMods, shieldsRegex]);

    // TODO check block
    /* Add BOATS to boats tag */
    event.add('minecraft:boats', /^.*boat$/);

    /* Add CONCRETE to concrete tag */
    event.add('forge:concrete', /^.*concrete$/);

    // TODO check block
    /* Add CHEST BOATS to chest boats tag */
    event.add('minecraft:chest_boats', /^.*chest_boat$/);

    /* All Bark, All Bite */
    if (Platform.isLoaded('all_bark_all_bite')) {
        event.add('all_bark_all_bite:dog_buries', '#forge:bones');
        event.add('all_bark_all_bite:dog_fetches', '#forge:rods/wooden');
        event.add('all_bark_all_bite:wolf_loved', '#forge:bones');
    }

    /* Farmer's Delight */
    if (Platform.isLoaded('farmersdelight')) {
        event.add('farmersdelight:flat_on_cutting_board', '#forge:tools/tridents');
        event.add('farmersdelight:offhand_equipment', '#forge:tools/shields');
    }
});

ServerEvents.tags('worldgen/biome', (event) => {
    /* Rotten Creatures */
    if (Platform.isLoaded('rottencreatures')) {
        event.add('rottencreatures:burned_whitelist', '#forge:is_hot/nether');
        if (Platform.isLoaded('byg'))
            event.add('rottencreatures:burned_whitelist', ['byg:crimson_gardens', 'byg:magma_wastes']);

        /* Remove biomes included in #forge:is_hot/nether that don't fit the mob */
        // TODO find out why this doesn't work
        // TODO when found out, also remove these from nycto:lava_squid_spawns
        event.remove('rottencreatures:burned_whitelist', 'minecraft:soul_sand_valley');
        if (Platform.isLoaded('biomesoplenty'))
            event.remove('rottencreatures:burned_whitelist', [
                'biomesoplenty:crystalline_chasm',
                'biomesoplenty:undergrowth',
                'biomesoplenty:withered_abyss'
            ]);
        if (Platform.isLoaded('gardens_of_the_dead'))
            event.remove('rottencreatures:burned_whitelist', 'gardens_of_the_dead:soulblight_forest');

        event.add('rottencreatures:frostbitten_whitelist', '#forge:is_snowy');

        event.add('rottencreatures:glacial_hunter_whitelist', '#forge:is_snowy');

        event.add('rottencreatures:mummy_whitelist', '#forge:is_desert');

        event.add('rottencreatures:swampy_whitelist', '#forge:is_swamp');
    }

    /* Monster Plus */
    if (Platform.isLoaded('monsterplus')) {
        event.add('nycto:crystal_zombie_spawns', '#minecraft:is_overworld');
        if (Platform.isLoaded('biomesoplenty'))
            event.add('nycto:crystal_zombie_spawns', 'biomesoplenty:crystalline_chasm');

        event.add('nycto:lava_squid_spawns', '#forge:is_hot/nether');
        if (Platform.isLoaded('byg')) event.add('nycto:lava_squid_spawns', ['byg:crimson_gardens', 'byg:magma_wastes']);
    }

    /* Creatures and Beasts */
    if (Platform.isLoaded('cnb')) {
        event.add('nycto:cactem_spawns', ['#minecraft:is_badlands', '#forge:is_desert']);

        // TODO check where Naturalist Lizards spawn
        event.add('nycto:cnb_lizard_spawns', '#nycto:cactem_spawns');
    }

    // TODO update this to just combine all tags and add elements to both tags don't hardcode the elements like now!
    /* Add BYG beaches to minecraft:is_beach tag
       since they're wrongly tagged as forge:is_beach */
    event.add('minecraft:is_beach', ['byg:basalt_barrera', 'byg:dacite_shore', 'byg:rainbow_beach']);
});

ServerEvents.tags('entity_type', (event) => {
    event.add('minecraft:skeletons', /^((?!summon).)*skeleton.*$/);
});
