/*
   Copyright (c) 2023, Jelle Van Goethem
   All rights reserved.
 
   This source code is licensed under the BSD-style license found in the
   LICENSE file in the root directory of this source tree.
*/

/*
   ATTENTION:
   Item tags are used for controlling behavior in item form, like recipe inputs
   Block tags are used for controlling behavior with blocks in block form
*/

const itemReg = Java.loadClass('net.minecraft.core.Registry').ITEM;

const itemTagIds = itemReg
    .getTagNames()
    .map((tagKey) => tagKey.location().toString())
    .toArray();

ServerEvents.tags('item', (event) => {
    let itemIdsTaggedByMods;

    let itemTagIdsToAdd;

    let regexToAdd;

    if (Platform.isLoaded('buildersaddition')) {
        event.removeAllTagsFrom(/^buildersaddition:.*vertical_slab$/);
    }

    if (Platform.isLoaded('v_slab_compat') && Platform.isLoaded('createdeco')) {
        event.removeAllTagsFrom(/^v_slab_compat:createdeco.*vertical_slab$/);
    }

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
    if (Platform.isLoaded('epicsamurai')) {
        event.add('minecraft:beacon_payment_items', 'epicsamurai:ruby');
    }

    /* The Undergarden check is redundant since I
       created and registered these items myself */
    if (Platform.isLoaded('create') && Platform.isLoaded('undergarden')) {
        event.add('create:crushed_raw_materials', [
            'undergarden:crushed_raw_cloggrum',
            'undergarden:crushed_raw_froststeel',
            'undergarden:crushed_raw_utherium',
            'undergarden:crushed_raw_regalium'
        ]);
    }

    // TODO untag refined storage's wrench as it seems like this has another functionality and if it's tagged it won't be able to use that function on let's say Create blocks because it will act as a Create wrench
    /* Add wrenches that aren't tagged as wrenches to wrench tag */
    if (Platform.isLoaded('refinedstorage')) {
        event.add('forge:tools/wrench', 'refinedstorage:wrench');
    }
    if (Platform.isLoaded('simpleplanes')) {
        event.add('forge:tools/wrench', 'simpleplanes:wrench');
    }

    /* 
       TODO:
       Check if items have block forms and if so,
       add them to the correct block tags in blocks.js
    */

    /* ARMORS */
    itemTagIdsToAdd = [];

    itemTagIds
        .filter((tagId) => tagId.startsWith('forge:armors/'))
        .forEach((tagId) => itemTagIdsToAdd.push(`#${tagId}`));

    event.add('forge:armors', itemTagIdsToAdd);

    /* AXES */
    itemIdsTaggedByMods = [
        event
            .get('minecraft:axes')
            .getObjectIds()
            .concat(event.get('forge:axes').getObjectIds())
            .concat(event.get('forge:tools/axe').getObjectIds())
            .concat(event.get('forge:tools/axes').getObjectIds())
    ];
    regexToAdd = /^.*(_axe|battleaxe|hatchet)$/;

    event.add('minecraft:axes', [itemIdsTaggedByMods, regexToAdd]);
    event.add('forge:axes', [itemIdsTaggedByMods, regexToAdd]);
    event.add('forge:tools/axe', [itemIdsTaggedByMods, regexToAdd]);
    event.add('forge:tools/axes', [itemIdsTaggedByMods, regexToAdd]);

    /* BARRELS */
    itemTagIdsToAdd = [];

    if (Platform.isLoaded('chipped')) {
        itemTagIdsToAdd.push('#chipped:barrel');
    }

    itemTagIds
        .filter((tagId) => tagId.startsWith('forge:barrels/'))
        .forEach((tagId) => itemTagIdsToAdd.push(`#${tagId}`));

    event.add('forge:barrels', [itemTagIdsToAdd, /^.*:(?!(cannon|tnt).)*_barrel$/]);

    /* BOATS */
    event.add('minecraft:boats', /^.*boat$/);

    /* BONES/WITHER */
    event.add('forge:bones/wither', /^.*wither.*_bone$/);

    /* BONES */
    itemIdsTaggedByMods = [
        event.get('forge:bones').getObjectIds().concat(event.get('forge:bones/wither').getObjectIds())
    ];

    event.add('forge:bones', [itemIdsTaggedByMods, /^.*bone$/]);

    /* BOWS */
    itemIdsTaggedByMods = [event.get('forge:bows').getObjectIds().concat(event.get('forge:tools/bows').getObjectIds())];
    regexToAdd = /^.*_bow$/;

    event.add('forge:bows', [itemIdsTaggedByMods, regexToAdd]);
    event.add('forge:tools/bows', [itemIdsTaggedByMods, regexToAdd]);

    /* BUTTONS */
    itemIdsTaggedByMods = [
        event.get('minecraft:buttons').getObjectIds().concat(event.get('minecraft:wooden_buttons').getObjectIds())
    ];

    event.add('minecraft:buttons', [itemIdsTaggedByMods, /^.*button$/]);

    /* CONCRETE */
    event.add('forge:concrete', /^.*concrete$/);

    /* CHEST BOATS */
    event.add('minecraft:chest_boats', /^.*chest_boat$/);

    /* DOORS */
    itemIdsTaggedByMods = [event.get('minecraft:doors').getObjectIds().concat(event.get('forge:doors').getObjectIds())];
    regexToAdd = /^((?!smokebox).)*_door$/;

    event.add('minecraft:doors', [itemIdsTaggedByMods, regexToAdd]);
    event.add('forge:doors', [itemIdsTaggedByMods, regexToAdd]);

    /* HOES */
    itemIdsTaggedByMods = [
        event
            .get('minecraft:hoes')
            .getObjectIds()
            .concat(event.get('forge:hoes').getObjectIds())
            .concat(event.get('forge:tools/hoe').getObjectIds())
            .concat(event.get('forge:tools/hoes').getObjectIds())
    ];
    regexToAdd = /^.*hoe$/;

    event.add('minecraft:hoes', [itemIdsTaggedByMods, regexToAdd]);
    event.add('forge:hoes', [itemIdsTaggedByMods, regexToAdd]);
    event.add('forge:tools/hoe', [itemIdsTaggedByMods, regexToAdd]);
    event.add('forge:tools/hoes', [itemIdsTaggedByMods, regexToAdd]);

    /* INGOTS */
    itemTagIdsToAdd = [];

    itemTagIds
        .filter((tagId) => tagId.startsWith('forge:ingots/'))
        .forEach((tagId) => itemTagIdsToAdd.push(`#${tagId}`));

    event.add('forge:ingots', [itemTagIdsToAdd, /^.*ingot$/]);

    /* MUSIC DISCS */
    event.remove('forge:music_discs', /^.*$/);

    event.add('minecraft:music_discs', /^.*:.*music_disc.*$/);

    if (Platform.isLoaded('create_confectionery')) {
        event.add('minecraft:music_discs', 'create_confectionery:the_bright_side');
    }

    if (Platform.isLoaded('wandering_bags')) {
        event.add('minecraft:music_discs', 'wandering_bags:out_of_them_disc');
    }

    /* PICKAXES */
    itemIdsTaggedByMods = [
        event
            .get('minecraft:pickaxes')
            .getObjectIds()
            .concat(event.get('forge:pickaxes').getObjectIds())
            .concat(event.get('forge:tools/pickaxe').getObjectIds())
            .concat(event.get('forge:tools/pickaxes').getObjectIds())
    ];
    regexToAdd = /^.*(pick|pickaxe)$/;

    event.add('minecraft:pickaxes', [itemIdsTaggedByMods, regexToAdd]);
    event.add('forge:pickaxes', [itemIdsTaggedByMods, regexToAdd]);
    event.add('forge:tools/pickaxe', [itemIdsTaggedByMods, regexToAdd]);
    event.add('forge:tools/pickaxes', [itemIdsTaggedByMods, regexToAdd]);

    // TODO check mods and add their id if they add raw materials that should be tagged
    // INFO look in ATM6's kjs scripts for examples
    /* RAW MATERIALS */
    itemTagIdsToAdd = [];
    // itemTagIdsToAdd = [];
    //     regexToAdd = /^(mod1|mod2|mod3):raw.*(include|words|here|if|needed)$/;

    itemTagIds
        .filter((tagId) => tagId.startsWith('forge:raw_materials/'))
        .forEach((tagId) => itemTagIdsToAdd.push(`#${tagId}`));

    event.add('forge:raw_materials', itemTagIdsToAdd);
    // event.add('forge:raw_materials', [itemTagIdsToAdd, regexToAdd]);

    /* SHIELDS */
    itemIdsTaggedByMods = [
        event.get('forge:shields').getObjectIds().concat(event.get('forge:tools/shields').getObjectIds())
    ];
    regexToAdd = /^((?!domestication)(?!glyph)(?!stronghold).)*(_shield|shield_)((?!upgrade).)*$/;

    event.add('forge:shields', [itemIdsTaggedByMods, regexToAdd]);
    event.add('forge:tools/shields', [itemIdsTaggedByMods, regexToAdd]);

    /* SHOVELS */
    itemIdsTaggedByMods = [
        event
            .get('minecraft:shovels')
            .getObjectIds()
            .concat(event.get('forge:shovels').getObjectIds())
            .concat(event.get('forge:tools/shovel').getObjectIds())
            .concat(event.get('forge:tools/shovels').getObjectIds())
    ];
    regexToAdd = /^.*shovel$/;

    event.add('minecraft:shovels', [itemIdsTaggedByMods, regexToAdd]);
    event.add('forge:shovels', [itemIdsTaggedByMods, regexToAdd]);
    event.add('forge:tools/shovel', [itemIdsTaggedByMods, regexToAdd]);
    event.add('forge:tools/shovels', [itemIdsTaggedByMods, regexToAdd]);

    /* STAIRS */
    itemIdsTaggedByMods = [
        event
            .get('minecraft:stairs')
            .getObjectIds()
            .concat(event.get('forge:stairs').getObjectIds())
            .concat(event.get('minecraft:wooden_stairs').getObjectIds())
            .concat(event.get('forge:stairs/wooden').getObjectIds())
    ];
    regexToAdd = /^.*stairs$/;

    event.add('minecraft:stairs', [itemIdsTaggedByMods, regexToAdd]);
    event.add('forge:stairs', [itemIdsTaggedByMods, regexToAdd]);

    /* SWORDS */
    itemIdsTaggedByMods = [
        event
            .get('minecraft:swords')
            .getObjectIds()
            .concat(event.get('forge:swords').getObjectIds())
            .concat(event.get('forge:tools/sword').getObjectIds())
            .concat(event.get('forge:tools/swords').getObjectIds())
    ];
    regexToAdd = /^.*(battleaxe|blade|lance|sword)$/;

    event.add('minecraft:swords', [itemIdsTaggedByMods, regexToAdd]);
    event.add('forge:swords', [itemIdsTaggedByMods, regexToAdd]);
    event.add('forge:tools/sword', [itemIdsTaggedByMods, regexToAdd]);
    event.add('forge:tools/swords', [itemIdsTaggedByMods, regexToAdd]);

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

/* Listen to loaded event, after all server events have fired */
ServerEvents.loaded(() => {
    if (global.isItemTagIdsLogEnabled) {
        let itemTagIdsFromLoadedEvent = itemReg
            .getTagNames()
            .map((tagKey) => tagKey.location().toString())
            .toArray();

        console.log(`\n\n${itemTagIdsFromLoadedEvent.length} registered minecraft:item tags found!\n`);
        console.log(itemTagIdsFromLoadedEvent.sort());
    }

    if (global.isNonTaggedItemIdsLogEnabled) {
        let nonTaggedItemIds = new HashSet();

        /* Get ids from items that aren't tagged with minecraft:item tags */
        Item.getList().forEach((itemStack) => {
            if (itemStack.getTags().toList().isEmpty()) {
                nonTaggedItemIds.add(itemStack.getId());
            }
        });

        console.log(`\n\n${nonTaggedItemIds.size} items are currently NOT TAGGED with minecraft:item tags!\n`);
        console.log(Array.from(nonTaggedItemIds).sort());
    }
});
