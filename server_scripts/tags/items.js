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
    let ingotsTagIds = [],
        ingotsRegex = /^.*ingot$/;

    itemTagIds
        .filter((tagId) => tagId.startsWith('forge:ingots/'))
        .forEach((tagId) => ingotsTagIds.push('#'.concat(tagId)));

    event.add('forge:ingots', [ingotsTagIds, ingotsRegex]);

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
