/*
   Copyright (c) 2023, Jelle Van Goethem
   All rights reserved.
 
   This source code is licensed under the BSD-style license found in the
   LICENSE file in the root directory of this source tree.
*/

/* 
   ATTENTION:
   input = ANY input !!!
   output = THE only output !!!

   Removing recipes with input can and will cause recipes being falsely deleted !!!
   Only use input when it's certain that the blocks/items are only used in recipes from that mod !!! 
*/

ServerEvents.recipes((event) => {
    /*     const removeRecipesById = (recipeIds) => {
        if (typeof recipeIds === 'string') {
            event.remove({ id: recipeIds })
        } else if (typeof recipeIds === 'object') {
            recipeIds.forEach((recipeId) => event.remove({ id: recipeId }))
    }; */

    // TODO make id generate function

    const addSmeltingRecipe = (input, output, xp, time) => {
        // const id = ...(input, output)
        event
            .smelting(output, input)
            .id(
                `nycto:smelting/${output.substring(output.indexOf(':') + 1)}_from_${input.substring(
                    input.indexOf(':') + 1
                )}`
            )
            .xp(xp)
            .cookingTime(time);
    };

    const replaceInputUsingIdFilter = (id, inputToReplace, newInput) => {
        event.replaceInput({ id: id }, inputToReplace, newInput /* can be a tag */);
    };

    const addScarecrowRecipe = (color) => {
        event
            .shaped(
                Item.of(`scarecrowsterritory:${color != 'purple' ? color : 'primitive'}_scarecrow`, 1),
                ['DP ', 'SHS', ' S '],
                {
                    D: `minecraft:${color}_dye`,
                    P: 'minecraft:carved_pumpkin',
                    S: '#forge:rods/wooden',
                    H: 'minecraft:hay_block'
                }
            )
            .id(`nycto:${color != 'purple' ? color : 'primitive'}_scarecrow`);
    };

    const generateFormattedArray = (items) => {
        const output = [];

        items.forEach((item) =>
            output.push(
                Item.of(`${item.amount ? item.amount : 1}x ${item.item}`).withChance(item.chance ? item.chance : 1)
            )
        );

        return output;
    };

    const addCrushingRecipe = (input, time, items) => {
        const output = generateFormattedArray(items);

        event.recipes.create
            .crushing(output, input)
            .id(
                `nycto:crushing/${items[0].item.substring(items[0].item.indexOf(':') + 1)}_from_${input.substring(
                    input.indexOf(':') + 1
                )}`
            )
            .processingTime(time);
    };

    const addOreCrushingRecipe = (input, type, mainBlock) => {
        if (
            type != 'coal' &&
            type != 'iron' &&
            type != 'copper' &&
            type != 'gold' &&
            type != 'redstone' &&
            type != 'emerald' &&
            type != 'lapis' &&
            type != 'diamond' &&
            type != 'ruby' &&
            type != 'jade' &&
            type != 'aquamarine' &&
            type != 'onyx' &&
            type != 'cloggrum' &&
            type != 'froststeel' &&
            type != 'utherium' &&
            type != 'regalium'
        ) {
            console.log(
                `ERROR: addOreCrushingRecipe: type ${type} not found! Add logic to addOreCrushingRecipe to handle this type!`
            );
            return;
        }

        let hasFirstItemBonus = false,
            firstItemAmount,
            secondItemChance,
            time,
            item = type,
            items;

        if (type == 'coal') {
            time = 150;
        } else if (type == 'froststeel' || type == 'regalium') {
            time = 300;
        } else if (type == 'emerald' || type == 'diamond' || type == 'ruby' || type == 'jade') {
            time = 350;
        } else if (type == 'utherium') {
            time = 420;
        } else {
            time = 250;
        }

        if (
            mainBlock == 'cobbled_deepslate' ||
            mainBlock == 'undergarden:shiverstone' ||
            mainBlock == 'undergarden:tremblecrust'
        ) {
            mainBlock == 'undergarden:tremblecrust' ? (time += 200) : (time += 100);
            hasFirstItemBonus = true;
        }

        if (type == 'iron' || type == 'copper' || type == 'gold') {
            item = `create:crushed_raw_${type}`;
        } else if (type == 'ruby' || type == 'jade' || type == 'aquamarine' || type == 'onyx') {
            item = `epicsamurai:${type}`;
        } else if (type == 'lapis') {
            item = 'lapis_lazuli';
        } else if (type == 'cloggrum' || type == 'froststeel' || type == 'utherium' || type == 'regalium') {
            item = `undergarden:crushed_raw_${type}`;
        }

        if (type == 'copper') {
            firstItemAmount = hasFirstItemBonus ? 7 : 5;
            secondItemChance = 0.25;
        } else if (type == 'redstone' || type == 'lapis') {
            type == 'redstone'
                ? (firstItemAmount = hasFirstItemBonus ? 7 : 6)
                : (firstItemAmount = hasFirstItemBonus ? 12 : 10);
            secondItemChance = 0.5;
        } else {
            firstItemAmount = hasFirstItemBonus ? 2 : 1;
            secondItemChance = hasFirstItemBonus && mainBlock != 'undergarden:tremblecrust' ? 0.25 : 0.75;
        }

        items = [
            {
                item: item,
                amount: firstItemAmount
            },
            {
                item: item,
                chance: secondItemChance
            },
            {
                item: 'create:experience_nugget',
                amount: type == 'gold' ? 2 : 1,
                chance: 0.75
            },
            {
                item: mainBlock,
                chance: 0.125
            }
        ];

        addCrushingRecipe(input, time, items);
    };

    /* The Undergarden */

    addOreCrushingRecipe('undergarden:depthrock_coal_ore', 'coal', 'undergarden:depthrock');
    addOreCrushingRecipe('undergarden:shiverstone_coal_ore', 'coal', 'undergarden:shiverstone');

    addOreCrushingRecipe('undergarden:depthrock_iron_ore', 'iron', 'undergarden:depthrock');
    addOreCrushingRecipe('undergarden:shiverstone_iron_ore', 'iron', 'undergarden:shiverstone');

    addOreCrushingRecipe('undergarden:depthrock_gold_ore', 'gold', 'undergarden:depthrock');

    addOreCrushingRecipe('undergarden:depthrock_diamond_ore', 'diamond', 'undergarden:depthrock');
    addOreCrushingRecipe('undergarden:shiverstone_diamond_ore', 'diamond', 'undergarden:shiverstone');

    addOreCrushingRecipe('undergarden:depthrock_cloggrum_ore', 'cloggrum', 'undergarden:depthrock');
    addOreCrushingRecipe('undergarden:shiverstone_cloggrum_ore', 'cloggrum', 'undergarden:shiverstone');

    addSmeltingRecipe('undergarden:crushed_raw_cloggrum', 'undergarden:cloggrum_ingot', 0.7, 200);
    event
        .blasting('undergarden:cloggrum_ingot', 'undergarden:crushed_raw_cloggrum')
        .id('nycto:blasting/cloggrum_ingot_from_crushed_raw_cloggrum')
        .xp(0.7)
        .cookingTime(100);

    event.recipes.create
        .splashing(
            ['9x undergarden:cloggrum_nugget', Item.of('createcafe:oreo_crushed').withChance(0.75)],
            'undergarden:crushed_raw_cloggrum'
        )
        .id('nycto:splashing/cloggrum_nugget_from_crushed_raw_cloggrum');

    addOreCrushingRecipe('undergarden:shiverstone_froststeel_ore', 'froststeel', 'undergarden:shiverstone');

    addSmeltingRecipe('undergarden:crushed_raw_froststeel', 'undergarden:froststeel_ingot', 0.7, 200);
    event
        .blasting('undergarden:froststeel_ingot', 'undergarden:crushed_raw_froststeel')
        .id('nycto:blasting/froststeel_ingot_from_crushed_raw_froststeel')
        .xp(0.7)
        .cookingTime(100);

    event.recipes.create
        .splashing(
            ['9x undergarden:froststeel_nugget', Item.of('endermanoverhaul:icy_pearl').withChance(0.08)],
            'undergarden:crushed_raw_froststeel'
        )
        .id('nycto:splashing/froststeel_nugget_from_crushed_raw_froststeel');

    addOreCrushingRecipe('undergarden:depthrock_utherium_ore', 'utherium', 'undergarden:depthrock');
    addOreCrushingRecipe('undergarden:shiverstone_utherium_ore', 'utherium', 'undergarden:shiverstone');
    addOreCrushingRecipe('undergarden:tremblecrust_utherium_ore', 'utherium', 'undergarden:tremblecrust');

    addSmeltingRecipe('undergarden:crushed_raw_utherium', 'undergarden:utherium_crystal', 1, 200);
    event
        .blasting('undergarden:utherium_crystal', 'undergarden:crushed_raw_utherium')
        .id('nycto:blasting/utherium_crystal_from_crushed_raw_utherium')
        .xp(1)
        .cookingTime(100);

    event.recipes.create
        .splashing(
            ['9x undergarden:utheric_shard', Item.of('projecte:red_matter').withChance(0.05)],
            'undergarden:crushed_raw_utherium'
        )
        .id('nycto:splashing/utheric_shard_from_crushed_raw_utherium');

    event
        .shaped('1x undergarden:regalium_crystal', ['SSS', 'SSS', 'SSS'], {
            S: 'undergarden:regalic_shard'
        })
        .id('nycto:regalium_crystal_from_regalic_shard');
    event
        .shapeless('9x undergarden:regalic_shard', ['undergarden:regalium_crystal'])
        .id('nycto:regalic_shard_from_regalium_crystal');

    addOreCrushingRecipe('undergarden:depthrock_regalium_ore', 'regalium', 'undergarden:depthrock');
    addOreCrushingRecipe('undergarden:shiverstone_regalium_ore', 'regalium', 'undergarden:shiverstone');

    event.recipes.create
        .splashing(
            ['9x undergarden:regalic_shard', Item.of('enchanted_golden_apple').withChance(0.05)],
            'undergarden:crushed_raw_regalium'
        )
        .id('nycto:splashing/regalic_shard_from_crushed_raw_regalium');

    /* Remove all recipes having vertical slabs from Builders Crafts and
       Additions as input or output since Quark already adds all of these
       (all BC&A recipes still work with vertical slabs from Quark) */
    // TODO: Check if mod != undefined check is needed, here and everywhere else!
    // TODO: change output and input to id only and remove tags if needed to remove uncrafting recipes
    // CURRENTLY THIS DELETES TOO MANY RECIPES I THINK !!!
    event.remove([{ input: /^buildersaddition:.*vertical_slab$/ }, { output: /^buildersaddition:.*vertical_slab$/ }]);

    /* Remove all recipes having vertical slabs from Vertical Slabs Compat - Create: Deco
       vertical slabs as input or output since Create: Deco already adds all of these */
    event.remove([
        { input: /^v_slab_compat:createdeco.*vertical_slab$/ },
        { output: /^v_slab_compat:createdeco.*vertical_slab$/ }
    ]);

    /* Remove all recipes having connected glass (borderless glass) from Connected Glass mod
       as output since vanilla glass is already connected with Connectedness (Continuity fork) */
    // event.remove([{ output: /^connectedglass:borderless.*$/ }]);

    /* Replace input for clean glass recipes from Connected Glass mod
       Use Minecraft glass instead of removed connected glass (borderless glass) from Connected Glass mod */
    const coG = 'connectedglass:',
        boG = 'borderless_glass',
        clG = 'clear_glass',
        mc = 'minecraft:',
        stG = 'stained_glass';
    replaceInputUsingIdFilter(`${coG}${clG}1`, `${coG}${boG}`, `${mc}glass`);
    replaceInputUsingIdFilter(`${coG}${clG}_white1`, `${coG}${boG}_white`, `${mc}white_${stG}`);
    replaceInputUsingIdFilter(`${coG}${clG}_orange1`, `${coG}${boG}_orange`, `${mc}orange_${stG}`);
    replaceInputUsingIdFilter(`${coG}${clG}_magenta1`, `${coG}${boG}_magenta`, `${mc}magenta_${stG}`);
    replaceInputUsingIdFilter(`${coG}${clG}_light_blue1`, `${coG}${boG}_light_blue`, `${mc}light_blue_${stG}`);
    replaceInputUsingIdFilter(`${coG}${clG}_yellow1`, `${coG}${boG}_yellow`, `${mc}yellow_${stG}`);
    replaceInputUsingIdFilter(`${coG}${clG}_lime1`, `${coG}${boG}_lime`, `${mc}lime_${stG}`);
    replaceInputUsingIdFilter(`${coG}${clG}_pink1`, `${coG}${boG}_pink`, `${mc}pink_${stG}`);
    replaceInputUsingIdFilter(`${coG}${clG}_gray1`, `${coG}${boG}_gray`, `${mc}gray_${stG}`);
    replaceInputUsingIdFilter(`${coG}${clG}_light_gray1`, `${coG}${boG}_light_gray`, `${mc}light_gray_${stG}`);
    replaceInputUsingIdFilter(`${coG}${clG}_cyan1`, `${coG}${boG}_cyan`, `${mc}cyan_${stG}`);
    replaceInputUsingIdFilter(`${coG}${clG}_purple1`, `${coG}${boG}_purple`, `${mc}purple_${stG}`);
    replaceInputUsingIdFilter(`${coG}${clG}_blue1`, `${coG}${boG}_blue`, `${mc}blue_${stG}`);
    replaceInputUsingIdFilter(`${coG}${clG}_brown1`, `${coG}${boG}_brown`, `${mc}brown_${stG}`);
    replaceInputUsingIdFilter(`${coG}${clG}_green1`, `${coG}${boG}_green`, `${mc}green_${stG}`);
    replaceInputUsingIdFilter(`${coG}${clG}_red1`, `${coG}${boG}_red`, `${mc}red_${stG}`);
    replaceInputUsingIdFilter(`${coG}${clG}_black1`, `${coG}${boG}_black`, `${mc}black_${stG}`);

    replaceInputUsingIdFilter(`${coG}${clG}_pane1`, `${coG}${boG}_pane`, `${mc}glass_pane`);
    replaceInputUsingIdFilter(`${coG}${clG}_white_pane1`, `${coG}${boG}_white_pane`, `${mc}white_${stG}_pane`);
    replaceInputUsingIdFilter(`${coG}${clG}_orange_pane1`, `${coG}${boG}_orange_pane`, `${mc}orange_${stG}_pane`);
    replaceInputUsingIdFilter(`${coG}${clG}_magenta_pane1`, `${coG}${boG}_magenta_pane`, `${mc}magenta_${stG}_pane`);
    replaceInputUsingIdFilter(
        `${coG}${clG}_light_blue_pane1`,
        `${coG}${boG}_light_blue_pane`,
        `${mc}light_blue_${stG}_pane`
    );
    replaceInputUsingIdFilter(`${coG}${clG}_yellow_pane1`, `${coG}${boG}_yellow_pane`, `${mc}yellow_${stG}_pane`);
    replaceInputUsingIdFilter(`${coG}${clG}_lime_pane1`, `${coG}${boG}_lime_pane`, `${mc}lime_${stG}_pane`);
    replaceInputUsingIdFilter(`${coG}${clG}_pink_pane1`, `${coG}${boG}_pink_pane`, `${mc}pink_${stG}_pane`);
    replaceInputUsingIdFilter(`${coG}${clG}_gray_pane1`, `${coG}${boG}_gray_pane`, `${mc}gray_${stG}_pane`);
    replaceInputUsingIdFilter(
        `${coG}${clG}_light_gray_pane1`,
        `${coG}${boG}_light_gray_pane`,
        `${mc}light_gray_${stG}_pane`
    );
    replaceInputUsingIdFilter(`${coG}${clG}_cyan_pane1`, `${coG}${boG}_cyan_pane`, `${mc}cyan_${stG}_pane`);
    replaceInputUsingIdFilter(`${coG}${clG}_purple_pane1`, `${coG}${boG}_purple_pane`, `${mc}purple_${stG}_pane`);
    replaceInputUsingIdFilter(`${coG}${clG}_blue_pane1`, `${coG}${boG}_blue_pane`, `${mc}blue_${stG}_pane`);
    replaceInputUsingIdFilter(`${coG}${clG}_brown_pane1`, `${coG}${boG}_brown_pane`, `${mc}brown_${stG}_pane`);
    replaceInputUsingIdFilter(`${coG}${clG}_green_pane1`, `${coG}${boG}_green_pane`, `${mc}green_${stG}_pane`);
    replaceInputUsingIdFilter(`${coG}${clG}_red_pane1`, `${coG}${boG}_red_pane`, `${mc}red_${stG}_pane`);
    replaceInputUsingIdFilter(`${coG}${clG}_black_pane1`, `${coG}${boG}_black_pane`, `${mc}black_${stG}_pane`);

    /* Remove crafting recipe for minecraft:chest with any #byg:planks
       since I'm adding a recipe with any #minecraft:planks */
    event.remove([{ id: 'byg:byg_chest' }]);
    /* Add crafting recipe for minecraft:chest with any
       #minecraft:planks since other mods 'steal' this recipe */
    event
        .shaped(Item.of('minecraft:chest', 1), ['PPP', 'P P', 'PPP'], {
            P: '#minecraft:planks'
        })
        .id('nycto:chest_from_planks');

    /* Just Another Rotten Flesh to Leather Mod mod replacement
    
       Add smelting and smoking recipes for minecraft:leather with
       minecraft:rotten_flesh and rottencreatures:magma_rotten_flesh */
    addSmeltingRecipe('minecraft:rotten_flesh', 'minecraft:leather', 0.25, 200);
    event
        .smoking('minecraft:leather', 'minecraft:rotten_flesh')
        .id('nycto:smoking/leather_from_rotten_flesh')
        .xp(0.25)
        .cookingTime(100);
    addSmeltingRecipe('rottencreatures:magma_rotten_flesh', 'minecraft:leather', 0.25, 200);
    event
        .smoking('minecraft:leather', 'rottencreatures:magma_rotten_flesh')
        .id('nycto:smoking/leather_from_magma_rotten_flesh')
        .xp(0.25)
        .cookingTime(100);

    /* Add crafting recipe for minecraft:end_portal_frame */
    event
        .shaped(Item.of('minecraft:end_portal_frame', 12), ['EEE', 'EDE', 'SSS'], {
            E: 'minecraft:ender_eye',
            D: 'minecraft:dragon_egg',
            S: 'minecraft:end_stone'
        })
        .id('nycto:end_portal_frame');

    /* Remove crafting recipe for scarecrowsterritory:primitive_scarecrow
       added by Scarecrows' Territory since I'm adding custom
       recipes that all require dye */
    event.remove({ id: 'scarecrowsterritory:scarecrow' });
    /* Add crafting recipes for Scarecrows' Territory's scarecrows */
    const scarecrowColors = [
        'white',
        'orange',
        'magenta',
        'light_blue',
        'yellow',
        'lime',
        'pink',
        'gray',
        'light_gray',
        'cyan',
        'purple',
        'blue',
        'brown',
        'green',
        'red',
        'black'
    ];
    scarecrowColors.forEach((color) => addScarecrowRecipe(color));

    /* Remove crafting recipe for minecraft:end_portal_frame
       added by End Portal Recipe (just because I want my own) */
    event.remove([{ id: 'endportalrecipe:craftable_end_portal' }]);

    /* Remove crafting recipes for emerald armor from MoreCraft
       since Useless Swords already adds all of these */
    event.remove([
        { id: 'morecraft:emerald_helmet' },
        { id: 'morecraft:emerald_chestplate' },
        { id: 'morecraft:emerald_leggings' },
        { id: 'morecraft:emerald_boots' }
    ]);

    /* Allow Nether Chest to be crafted with any forge:chests/wooden */
    replaceInputUsingIdFilter('netherchested:nether_chest', 'minecraft:chest', '#forge:chests/wooden');

    /* Remove crafting recipes for Crystal Chests from Iron Chests
       since it causes a lot of lag and FPS drop when inside chest or when looking at it */
    event.remove([
        { id: 'ironchest:chests/diamond_crystal_chest' },
        { id: 'ironchest:chests/trapped_crystal_chest' },
        { id: 'ironchest:upgrades/diamond_to_crystal_chest_upgrade' }
    ]);

    // TODO ADD OTHER SMELTING AND BLASTING RECIPES FOR OTHER ORES OF EPIC SAMURAI

    /* Add smelting and blasting recipes for epicsamurai:ruby with
       epicsamurai:ruby_ore and epicsamurai:deepslate_ruby_ore */
    addSmeltingRecipe('epicsamurai:ruby_ore', 'epicsamurai:ruby', 0.75, 200);
    event
        .blasting('epicsamurai:ruby', 'epicsamurai:ruby_ore')
        .id('nycto:blasting/ruby_from_ruby_ore')
        .xp(0.75)
        .cookingTime(100);
    addSmeltingRecipe('epicsamurai:deepslate_ruby_ore', 'epicsamurai:ruby', 0.75, 200);
    event
        .blasting('epicsamurai:ruby', 'epicsamurai:deepslate_ruby_ore')
        .id('nycto:blasting/ruby_from_deepslate_ruby_ore')
        .xp(0.75)
        .cookingTime(100);

    /* Remove recipes for ruby gems and blocks from
       MoreCraft since we use Epic Samurai's ruby */
    event.remove([
        { id: 'morecraft:ruby' },
        { id: 'morecraft:ruby_block' },
        { id: 'morecraft:ruby_from_furnace' },
        { id: 'morecraft:ruby_from_blasting' }
    ]);

    /* Minecraft */

    addCrushingRecipe('ancient_debris', 600, [
        {
            item: 'netherite_scrap'
        },
        {
            item: 'netherite_scrap',
            chance: 0.25
        },
        {
            item: 'create:experience_nugget',
            amount: 2
        },
        {
            item: 'dripstone_block',
            chance: 0.125
        }
    ]);

    /* Ad Astra */

    event.remove([{ id: 'create:crushing/venus_gold_ore' }]);
    addOreCrushingRecipe('ad_astra:venus_gold_ore', 'gold', 'ad_astra:venus_cobblestone');

    addOreCrushingRecipe('ad_astra:venus_diamond_ore', 'diamond', 'ad_astra:venus_cobblestone');

    event.remove([{ id: 'create:crushing/moon_iron_ore' }]);
    addOreCrushingRecipe('ad_astra:moon_iron_ore', 'iron', 'ad_astra:moon_cobblestone');

    event.remove([{ id: 'create:crushing/mars_iron_ore' }]);
    addOreCrushingRecipe('ad_astra:mars_iron_ore', 'iron', 'ad_astra:mars_cobblestone');

    event.remove([{ id: 'create:crushing/mercury_iron_ore' }]);
    addOreCrushingRecipe('ad_astra:mercury_iron_ore', 'iron', 'ad_astra:mercury_cobblestone');

    event.remove([{ id: 'create:crushing/glacio_copper_ore' }]);
    addOreCrushingRecipe('ad_astra:glacio_copper_ore', 'copper', 'ad_astra:glacio_cobblestone');

    event.remove([{ id: 'create:crushing/glacio_iron_ore' }]);
    addOreCrushingRecipe('ad_astra:glacio_iron_ore', 'iron', 'ad_astra:glacio_cobblestone');

    /* Blue Skies */

    addCrushingRecipe('blue_skies:everbright_pyrope_ore', 300, [
        {
            item: 'blue_skies:pyrope_gem'
        },
        {
            item: 'blue_skies:pyrope_gem',
            chance: 0.75
        },
        {
            item: 'create:experience_nugget',
            chance: 0.75
        },
        {
            item: 'blue_skies:turquoise_cobblestone',
            chance: 0.125
        }
    ]);

    addCrushingRecipe('blue_skies:everdawn_pyrope_ore', 300, [
        {
            item: 'blue_skies:pyrope_gem'
        },
        {
            item: 'blue_skies:pyrope_gem',
            chance: 0.75
        },
        {
            item: 'create:experience_nugget',
            chance: 0.75
        },
        {
            item: 'blue_skies:lunar_cobblestone',
            chance: 0.125
        }
    ]);

    /* Darker Depths */

    addOreCrushingRecipe('darkerdepths:aridrock_gold_ore', 'gold', 'darkerdepths:aridrock');
    addOreCrushingRecipe('darkerdepths:aridrock_iron_ore', 'iron', 'darkerdepths:aridrock');
    addOreCrushingRecipe('darkerdepths:aridrock_coal_ore', 'coal', 'darkerdepths:aridrock');
    addOreCrushingRecipe('darkerdepths:aridrock_lapis_ore', 'lapis', 'darkerdepths:aridrock');
    addOreCrushingRecipe('darkerdepths:aridrock_diamond_ore', 'diamond', 'darkerdepths:aridrock');
    addOreCrushingRecipe('darkerdepths:aridrock_redstone_ore', 'redstone', 'darkerdepths:aridrock');

    addOreCrushingRecipe('darkerdepths:limestone_gold_ore', 'gold', 'darkerdepths:limestone');
    addOreCrushingRecipe('darkerdepths:limestone_iron_ore', 'iron', 'darkerdepths:limestone');
    addOreCrushingRecipe('darkerdepths:limestone_coal_ore', 'coal', 'darkerdepths:limestone');
    addOreCrushingRecipe('darkerdepths:limestone_lapis_ore', 'lapis', 'darkerdepths:limestone');
    addOreCrushingRecipe('darkerdepths:limestone_diamond_ore', 'diamond', 'darkerdepths:limestone');
    addOreCrushingRecipe('darkerdepths:limestone_redstone_ore', 'redstone', 'darkerdepths:limestone');

    /* Deeper and Darker */

    addOreCrushingRecipe('deeperdarker:sculk_stone_coal_ore', 'coal', 'deeperdarker:sculk_stone');
    addOreCrushingRecipe('deeperdarker:sculk_stone_iron_ore', 'iron', 'deeperdarker:sculk_stone');
    addOreCrushingRecipe('deeperdarker:sculk_stone_copper_ore', 'copper', 'deeperdarker:sculk_stone');
    addOreCrushingRecipe('deeperdarker:sculk_stone_gold_ore', 'gold', 'deeperdarker:sculk_stone');
    addOreCrushingRecipe('deeperdarker:sculk_stone_redstone_ore', 'redstone', 'deeperdarker:sculk_stone');
    addOreCrushingRecipe('deeperdarker:sculk_stone_emerald_ore', 'emerald', 'deeperdarker:sculk_stone');
    addOreCrushingRecipe('deeperdarker:sculk_stone_lapis_ore', 'lapis', 'deeperdarker:sculk_stone');
    addOreCrushingRecipe('deeperdarker:sculk_stone_diamond_ore', 'diamond', 'deeperdarker:sculk_stone');

    addOreCrushingRecipe('deeperdarker:gloomslate_coal_ore', 'coal', 'deeperdarker:gloomslate');
    addOreCrushingRecipe('deeperdarker:gloomslate_iron_ore', 'iron', 'deeperdarker:gloomslate');
    addOreCrushingRecipe('deeperdarker:gloomslate_copper_ore', 'copper', 'deeperdarker:gloomslate');
    addOreCrushingRecipe('deeperdarker:gloomslate_gold_ore', 'gold', 'deeperdarker:gloomslate');
    addOreCrushingRecipe('deeperdarker:gloomslate_redstone_ore', 'redstone', 'deeperdarker:gloomslate');
    addOreCrushingRecipe('deeperdarker:gloomslate_emerald_ore', 'emerald', 'deeperdarker:gloomslate');
    addOreCrushingRecipe('deeperdarker:gloomslate_lapis_ore', 'lapis', 'deeperdarker:gloomslate');
    addOreCrushingRecipe('deeperdarker:gloomslate_diamond_ore', 'diamond', 'deeperdarker:gloomslate');

    /* Epic Samurai */

    addOreCrushingRecipe('epicsamurai:ruby_ore', 'ruby', 'cobblestone');
    addOreCrushingRecipe('epicsamurai:jade_ore', 'jade', 'cobblestone');
    addOreCrushingRecipe('epicsamurai:aquamarine_ore', 'aquamarine', 'cobblestone');
    addOreCrushingRecipe('epicsamurai:onyx_ore', 'onyx', 'cobblestone');

    addOreCrushingRecipe('epicsamurai:deepslate_ruby_ore', 'ruby', 'cobbled_deepslate');
    addOreCrushingRecipe('epicsamurai:deepslate_jade_ore', 'jade', 'cobbled_deepslate');
    addOreCrushingRecipe('epicsamurai:deepslate_aquamarine_ore', 'aquamarine', 'cobbled_deepslate');
    addOreCrushingRecipe('epicsamurai:deepslate_onyx_ore', 'onyx', 'cobbled_deepslate');

    /* Randomium */

    addCrushingRecipe('randomium:randomium_ore', 350, [
        {
            item: 'randomium:randomium',
            chance: 0.5
        },
        {
            item: 'create:experience_nugget',
            chance: 0.25
        },
        {
            item: 'cobblestone',
            chance: 0.125
        },
        {
            item: 'epicsamurai:ruby',
            chance: 0.09375
        },
        {
            item: 'netherite_ingot',
            chance: 0.0625
        }
    ]);

    addCrushingRecipe('randomium:randomium_ore_deepslate', 450, [
        {
            item: 'randomium:randomium',
            chance: 0.75
        },
        {
            item: 'randomium:randomium',
            chance: 0.375
        },
        {
            item: 'create:experience_nugget',
            chance: 0.25
        },
        {
            item: 'cobbled_deepslate',
            chance: 0.125
        },
        {
            item: 'epicsamurai:ruby',
            chance: 0.09375
        },
        {
            item: 'netherite_ingot',
            chance: 0.0625
        }
    ]);

    addCrushingRecipe('randomium:randomium_ore_end', 400, [
        {
            item: 'randomium:randomium',
            chance: 0.5
        },
        {
            item: 'create:experience_nugget',
            chance: 0.25
        },
        {
            item: 'end_stone',
            chance: 0.125
        },
        {
            item: 'epicsamurai:ruby',
            chance: 0.09375
        },
        {
            item: 'netherite_ingot',
            chance: 0.0625
        }
    ]);
});
