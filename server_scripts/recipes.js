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
    const supportedOreTypes = [
        'coal',
        'iron',
        'copper',
        'gold',
        'redstone',
        'emerald',
        'lapis',
        'diamond',
        'ruby',
        'jade',
        'aquamarine',
        'onyx',
        'cloggrum',
        'froststeel',
        'utherium',
        'regalium'
    ];

    // TODO make id generate function

    const addSmeltingRecipe = (inputItemId, outputItemId, xp, timeInTicks) => {
        // const id = ...(input, output)
        event
            .smelting(outputItemId, inputItemId)
            .id(
                `nycto:smelting/${outputItemId.substring(outputItemId.indexOf(':') + 1)}_from_${inputItemId.substring(
                    inputItemId.indexOf(':') + 1
                )}`
            )
            .xp(xp)
            .cookingTime(timeInTicks);
    };

    const replaceInputUsingIdFilter = (recipeId, inputItemIdToReplace, newInputItemOrTag) => {
        event.replaceInput({ id: recipeId }, inputItemIdToReplace, newInputItemOrTag);
    };

    const addScarecrowRecipe = (color) => {
        if (color == 'purple') color = 'primitive';

        const scarecrowItemId = `scarecrowsterritory:${color}_scarecrow`;

        event
            .shaped(Item.of(scarecrowItemId, 1), ['DP ', 'SHS', ' S '], {
                D: `minecraft:${color != 'primitive' ? color : 'purple'}_dye`,
                P: 'minecraft:carved_pumpkin',
                S: '#forge:rods/wooden',
                H: 'minecraft:hay_block'
            })
            .id(`nycto:${color}_scarecrow`);
    };

    const composeOutputItems = (itemInfos) => {
        const outputItems = [];

        itemInfos.forEach((itemInfo) => {
            outputItems.push(
                Item.of(`${itemInfo.amount ? itemInfo.amount : 1}x ${itemInfo.itemId}`).withChance(
                    itemInfo.chance ? itemInfo.chance : 1
                )
            );
        });

        return outputItems;
    };

    const addCrushingRecipe = (inputItemId, timeInTicks, outputItemInfos) => {
        event.recipes.create
            .crushing(composeOutputItems(outputItemInfos), inputItemId)
            .id(
                `nycto:crushing/${outputItemInfos[0].itemId.substring(
                    outputItemInfos[0].itemId.indexOf(':') + 1
                )}_from_${inputItemId.substring(inputItemId.indexOf(':') + 1)}`
            )
            .processingTime(timeInTicks);
    };

    const addOreCrushingRecipe = (inputItemId, oreType, mainBlockItemId) => {
        if (!Platform.isLoaded('create')) {
            global.logModNotLoaded('Create', 'ore crushing recipe');
            return;
        }

        if (!supportedOreTypes.includes(oreType)) {
            console.log(
                `[WARN] Ore type ${oreType} not supported! Add logic to addOreCrushingRecipe() in recipes.js to handle this ore type. Skipping ore crushing recipe`
            );
            return;
        }

        let hasFirstItemBonus = false;
        let firstItemAmount;
        let secondItemChance;
        let timeInTicks = 250;
        let itemId = oreType;

        switch (oreType) {
            case 'coal':
                timeInTicks = 150;
                break;
            case 'froststeel':
            case 'regalium':
                timeInTicks = 300;
                break;
            case 'emerald':
            case 'diamond':
            case 'ruby':
            case 'jade':
                timeInTicks = 350;
                break;
            case 'utherium':
                timeInTicks = 420;
        }

        if (
            mainBlockItemId == 'cobbled_deepslate' ||
            mainBlockItemId == 'undergarden:shiverstone' ||
            mainBlockItemId == 'undergarden:tremblecrust'
        ) {
            mainBlockItemId == 'undergarden:tremblecrust' ? (timeInTicks += 200) : (timeInTicks += 100);
            hasFirstItemBonus = true;
        }

        switch (oreType) {
            case 'iron':
            case 'copper':
            case 'gold':
                itemId = `create:crushed_raw_${oreType}`;
                break;
            case 'ruby':
            case 'jade':
            case 'aquamarine':
            case 'onyx':
                itemId = `epicsamurai:${oreType}`;
                break;
            case 'lapis':
                itemId = 'lapis_lazuli';
                break;
            case 'cloggrum':
            case 'froststeel':
            case 'utherium':
            case 'regalium':
                itemId = `undergarden:crushed_raw_${oreType}`;
        }

        if (oreType == 'copper') {
            firstItemAmount = hasFirstItemBonus ? 7 : 5;
            secondItemChance = 0.25;
        } else if (oreType == 'redstone' || oreType == 'lapis') {
            oreType == 'redstone'
                ? (firstItemAmount = hasFirstItemBonus ? 7 : 6)
                : (firstItemAmount = hasFirstItemBonus ? 12 : 10);
            secondItemChance = 0.5;
        } else {
            firstItemAmount = hasFirstItemBonus ? 2 : 1;
            secondItemChance = hasFirstItemBonus && mainBlockItemId != 'undergarden:tremblecrust' ? 0.25 : 0.75;
        }

        addCrushingRecipe(inputItemId, timeInTicks, [
            {
                itemId: itemId,
                amount: firstItemAmount
            },
            {
                itemId: itemId,
                chance: secondItemChance
            },
            {
                itemId: 'create:experience_nugget',
                amount: oreType == 'gold' ? 2 : 1,
                chance: 0.75
            },
            {
                itemId: mainBlockItemId,
                chance: 0.125
            }
        ]);
    };

    // TODO add crushing recipes for all ores from all mods

    /* Remove all recipes having vertical slabs from Builders Crafts and
       Additions as input or output since Quark already adds all of these
       (all BC&A recipes still work with vertical slabs from Quark) */
    // TODO: change output and input to id only and remove tags if needed to remove uncrafting recipes
    // CURRENTLY THIS DELETES TOO MANY RECIPES I THINK !!!
    if (Platform.isLoaded('buildersaddition')) {
        event.remove([
            { input: /^buildersaddition:.*vertical_slab$/ },
            { output: /^buildersaddition:.*vertical_slab$/ }
        ]);
    }

    /* Remove all recipes having vertical slabs from Vertical Slabs Compat - Create: Deco
       vertical slabs as input or output since Create: Deco already adds all of these */
    if (Platform.isLoaded('v_slab_compat') && Platform.isLoaded('createdeco')) {
        event.remove([
            { input: /^v_slab_compat:createdeco.*vertical_slab$/ },
            { output: /^v_slab_compat:createdeco.*vertical_slab$/ }
        ]);
    }

    /* Remove crafting recipe for minecraft:chest with any #byg:planks
       since I'm adding a recipe with any #minecraft:planks */
    if (Platform.isLoaded('byg')) {
        event.remove([{ id: 'byg:byg_chest' }]);
    }
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

    if (Platform.isLoaded('rottencreatures')) {
        addSmeltingRecipe('rottencreatures:magma_rotten_flesh', 'minecraft:leather', 0.25, 200);
        event
            .smoking('minecraft:leather', 'rottencreatures:magma_rotten_flesh')
            .id('nycto:smoking/leather_from_magma_rotten_flesh')
            .xp(0.25)
            .cookingTime(100);
    }

    /* Add crafting recipe for minecraft:end_portal_frame */
    event
        .shaped(Item.of('minecraft:end_portal_frame', 12), ['EEE', 'EDE', 'SSS'], {
            E: 'minecraft:ender_eye',
            D: 'minecraft:dragon_egg',
            S: 'minecraft:end_stone'
        })
        .id('nycto:end_portal_frame');

    if (Platform.isLoaded('scarecrowsterritory')) {
        /* Remove crafting recipe for scarecrowsterritory:primitive_scarecrow
           added by Scarecrows' Territory since I'm adding custom
           recipes that all require dye */
        event.remove({ id: 'scarecrowsterritory:scarecrow' });

        /* Add crafting recipes for Scarecrows' Territory's scarecrows */
        let scarecrowColors = [
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

        scarecrowColors.forEach((color) => {
            addScarecrowRecipe(color);
        });
    }

    /* Remove crafting recipe for minecraft:end_portal_frame
       added by End Portal Recipe (just because I want my own) */
    if (Platform.isLoaded('endportalrecipe')) {
        event.remove([{ id: 'endportalrecipe:craftable_end_portal' }]);
    }

    if (Platform.isLoaded('morecraft')) {
        /* Remove crafting recipes for emerald armor from
           MoreCraft since Useless Swords already adds these */
        event.remove([
            { id: 'morecraft:emerald_helmet' },
            { id: 'morecraft:emerald_chestplate' },
            { id: 'morecraft:emerald_leggings' },
            { id: 'morecraft:emerald_boots' }
        ]);

        /* Remove recipes for ruby gems and blocks from
           MoreCraft since we use Epic Samurai's ruby */
        event.remove([
            { id: 'morecraft:ruby' },
            { id: 'morecraft:ruby_block' },
            { id: 'morecraft:ruby_from_furnace' },
            { id: 'morecraft:ruby_from_blasting' }
        ]);
    }

    /* Allow Nether Chest to be crafted with #forge:chests/wooden */
    if (Platform.isLoaded('netherchested')) {
        replaceInputUsingIdFilter('netherchested:nether_chest', 'minecraft:chest', '#forge:chests/wooden');
    }

    // TODO ADD OTHER SMELTING AND BLASTING RECIPES FOR OTHER ORES OF EPIC SAMURAI

    /* Add smelting and blasting recipes for epicsamurai:ruby with
       epicsamurai:ruby_ore and epicsamurai:deepslate_ruby_ore */
    if (Platform.isLoaded('epicsamurai')) {
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
    }

    if (Platform.isLoaded('create')) {
        /* Minecraft */
        addCrushingRecipe('ancient_debris', 600, [
            {
                itemId: 'netherite_scrap'
            },
            {
                itemId: 'netherite_scrap',
                chance: 0.25
            },
            {
                itemId: 'create:experience_nugget',
                amount: 2
            },
            {
                itemId: 'dripstone_block',
                chance: 0.125
            }
        ]);

        /* Ad Astra */
        if (Platform.isLoaded('ad_astra')) {
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
        }

        /* Blue Skies */
        if (Platform.isLoaded('blue_skies')) {
            addCrushingRecipe('blue_skies:everbright_pyrope_ore', 300, [
                {
                    itemId: 'blue_skies:pyrope_gem'
                },
                {
                    itemId: 'blue_skies:pyrope_gem',
                    chance: 0.75
                },
                {
                    itemId: 'create:experience_nugget',
                    chance: 0.75
                },
                {
                    itemId: 'blue_skies:turquoise_cobblestone',
                    chance: 0.125
                }
            ]);
            addCrushingRecipe('blue_skies:everdawn_pyrope_ore', 300, [
                {
                    itemId: 'blue_skies:pyrope_gem'
                },
                {
                    itemId: 'blue_skies:pyrope_gem',
                    chance: 0.75
                },
                {
                    itemId: 'create:experience_nugget',
                    chance: 0.75
                },
                {
                    itemId: 'blue_skies:lunar_cobblestone',
                    chance: 0.125
                }
            ]);
        }

        /* Croptopia */
        if (Platform.isLoaded('croptopia')) {
            addCrushingRecipe('croptopia:salt_ore', 300, [
                {
                    itemId: 'croptopia:salt',
                    chance: 0.75
                },
                {
                    itemId: 'croptopia:salt',
                    chance: 0.25
                },
                {
                    itemId: 'create:experience_nugget',
                    chance: 0.75
                },
                {
                    itemId: 'calcite',
                    chance: 0.125
                }
            ]);
        }

        /* Darker Depths */
        if (Platform.isLoaded('darkerdepths')) {
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
        }

        /* Deeper and Darker */
        if (Platform.isLoaded('deeperdarker')) {
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
        }

        /* Epic Samurai */
        if (Platform.isLoaded('epicsamurai')) {
            addOreCrushingRecipe('epicsamurai:ruby_ore', 'ruby', 'cobblestone');
            addOreCrushingRecipe('epicsamurai:jade_ore', 'jade', 'cobblestone');
            addOreCrushingRecipe('epicsamurai:aquamarine_ore', 'aquamarine', 'cobblestone');
            addOreCrushingRecipe('epicsamurai:onyx_ore', 'onyx', 'cobblestone');

            addOreCrushingRecipe('epicsamurai:deepslate_ruby_ore', 'ruby', 'cobbled_deepslate');
            addOreCrushingRecipe('epicsamurai:deepslate_jade_ore', 'jade', 'cobbled_deepslate');
            addOreCrushingRecipe('epicsamurai:deepslate_aquamarine_ore', 'aquamarine', 'cobbled_deepslate');
            addOreCrushingRecipe('epicsamurai:deepslate_onyx_ore', 'onyx', 'cobbled_deepslate');
        }

        /* Randomium */
        if (Platform.isLoaded('randomium') && Platform.isLoaded('epicsamurai')) {
            addCrushingRecipe('randomium:randomium_ore', 350, [
                {
                    itemId: 'randomium:randomium',
                    chance: 0.5
                },
                {
                    itemId: 'create:experience_nugget',
                    chance: 0.25
                },
                {
                    itemId: 'cobblestone',
                    chance: 0.125
                },
                {
                    itemId: 'epicsamurai:ruby',
                    chance: 0.09375
                },
                {
                    itemId: 'netherite_ingot',
                    chance: 0.0625
                }
            ]);

            addCrushingRecipe('randomium:randomium_ore_deepslate', 450, [
                {
                    itemId: 'randomium:randomium',
                    chance: 0.75
                },
                {
                    itemId: 'randomium:randomium',
                    chance: 0.375
                },
                {
                    itemId: 'create:experience_nugget',
                    chance: 0.25
                },
                {
                    itemId: 'cobbled_deepslate',
                    chance: 0.125
                },
                {
                    itemId: 'epicsamurai:ruby',
                    chance: 0.09375
                },
                {
                    itemId: 'netherite_ingot',
                    chance: 0.0625
                }
            ]);

            addCrushingRecipe('randomium:randomium_ore_end', 400, [
                {
                    itemId: 'randomium:randomium',
                    chance: 0.5
                },
                {
                    itemId: 'create:experience_nugget',
                    chance: 0.25
                },
                {
                    itemId: 'end_stone',
                    chance: 0.125
                },
                {
                    itemId: 'epicsamurai:ruby',
                    chance: 0.09375
                },
                {
                    itemId: 'netherite_ingot',
                    chance: 0.0625
                }
            ]);
        }
    }

    /* The Undergarden */
    if (Platform.isLoaded('undergarden')) {
        addSmeltingRecipe('undergarden:crushed_raw_cloggrum', 'undergarden:cloggrum_ingot', 0.7, 200);
        event
            .blasting('undergarden:cloggrum_ingot', 'undergarden:crushed_raw_cloggrum')
            .id('nycto:blasting/cloggrum_ingot_from_crushed_raw_cloggrum')
            .xp(0.7)
            .cookingTime(100);

        addSmeltingRecipe('undergarden:crushed_raw_froststeel', 'undergarden:froststeel_ingot', 0.7, 200);
        event
            .blasting('undergarden:froststeel_ingot', 'undergarden:crushed_raw_froststeel')
            .id('nycto:blasting/froststeel_ingot_from_crushed_raw_froststeel')
            .xp(0.7)
            .cookingTime(100);

        addSmeltingRecipe('undergarden:crushed_raw_utherium', 'undergarden:utherium_crystal', 1, 200);
        event
            .blasting('undergarden:utherium_crystal', 'undergarden:crushed_raw_utherium')
            .id('nycto:blasting/utherium_crystal_from_crushed_raw_utherium')
            .xp(1)
            .cookingTime(100);

        event
            .shaped('1x undergarden:regalium_crystal', ['SSS', 'SSS', 'SSS'], {
                S: 'undergarden:regalic_shard'
            })
            .id('nycto:regalium_crystal_from_regalic_shard');
        event
            .shapeless('9x undergarden:regalic_shard', ['undergarden:regalium_crystal'])
            .id('nycto:regalic_shard_from_regalium_crystal');

        if (Platform.isLoaded('create')) {
            addOreCrushingRecipe('undergarden:depthrock_coal_ore', 'coal', 'undergarden:depthrock');
            addOreCrushingRecipe('undergarden:shiverstone_coal_ore', 'coal', 'undergarden:shiverstone');

            addOreCrushingRecipe('undergarden:depthrock_iron_ore', 'iron', 'undergarden:depthrock');
            addOreCrushingRecipe('undergarden:shiverstone_iron_ore', 'iron', 'undergarden:shiverstone');

            addOreCrushingRecipe('undergarden:depthrock_gold_ore', 'gold', 'undergarden:depthrock');

            addOreCrushingRecipe('undergarden:depthrock_diamond_ore', 'diamond', 'undergarden:depthrock');
            addOreCrushingRecipe('undergarden:shiverstone_diamond_ore', 'diamond', 'undergarden:shiverstone');

            addOreCrushingRecipe('undergarden:depthrock_cloggrum_ore', 'cloggrum', 'undergarden:depthrock');
            addOreCrushingRecipe('undergarden:shiverstone_cloggrum_ore', 'cloggrum', 'undergarden:shiverstone');

            // TODO change crushed oreo to something better and add mod installed check
            // event.recipes.create
            //     .splashing(
            //         ['9x undergarden:cloggrum_nugget', Item.of('createcafe:oreo_crushed').withChance(0.75)],
            //         'undergarden:crushed_raw_cloggrum'
            //     )
            //     .id('nycto:splashing/cloggrum_nugget_from_crushed_raw_cloggrum');

            addOreCrushingRecipe('undergarden:shiverstone_froststeel_ore', 'froststeel', 'undergarden:shiverstone');

            if (Platform.isLoaded('endermanoverhaul')) {
                event.recipes.create
                    .splashing(
                        ['9x undergarden:froststeel_nugget', Item.of('endermanoverhaul:icy_pearl').withChance(0.08)],
                        'undergarden:crushed_raw_froststeel'
                    )
                    .id('nycto:splashing/froststeel_nugget_from_crushed_raw_froststeel');
            }

            addOreCrushingRecipe('undergarden:depthrock_utherium_ore', 'utherium', 'undergarden:depthrock');
            addOreCrushingRecipe('undergarden:shiverstone_utherium_ore', 'utherium', 'undergarden:shiverstone');
            addOreCrushingRecipe('undergarden:tremblecrust_utherium_ore', 'utherium', 'undergarden:tremblecrust');

            if (Platform.isLoaded('projecte')) {
                event.recipes.create
                    .splashing(
                        ['9x undergarden:utheric_shard', Item.of('projecte:red_matter').withChance(0.05)],
                        'undergarden:crushed_raw_utherium'
                    )
                    .id('nycto:splashing/utheric_shard_from_crushed_raw_utherium');
            }

            addOreCrushingRecipe('undergarden:depthrock_regalium_ore', 'regalium', 'undergarden:depthrock');
            addOreCrushingRecipe('undergarden:shiverstone_regalium_ore', 'regalium', 'undergarden:shiverstone');

            event.recipes.create
                .splashing(
                    ['9x undergarden:regalic_shard', Item.of('enchanted_golden_apple').withChance(0.05)],
                    'undergarden:crushed_raw_regalium'
                )
                .id('nycto:splashing/regalic_shard_from_crushed_raw_regalium');
        }
    }
});
