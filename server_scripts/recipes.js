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
   input = ANY input !!!
   output = THE only output !!!

   Removing recipes with input can and will cause recipes being falsely deleted !!!
   Only use input when it's certain that the blocks/items are only used in recipes from that mod !!! 
*/

ServerEvents.recipes((event) => {
    /**
     * The supported ore types for addOreCrushingRecipe().
     *
     * @type {string[]}
     * @const
     */
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

    /**
     * Composes a recipe id. Only the main output item of the recipe is used.
     *
     * Note: Tag ids do not start with a '#', but the 'formatResourceLocationStr'
     *     function handles this by removing invalid characters.
     *
     * @param {string} outputItemId - The output item id.
     * @param {string|string[]} [input=''] - The input item id(s) and/or tag id(s). Default: empty string.
     * @param {string} [recipeType=''] - The recipe type. Default: empty string.
     *
     * @throws {RangeError}
     * @throws {TypeError}
     *
     * @returns {string} The composed recipe id.
     */
    function composeRecipeId(outputItemId, input, recipeType) {
        checkArguments(
            'composeRecipeId',
            arguments,
            [1, 2, 3],
            ['string', ['string', 'string[]', undefined], ['string', undefined]]
        );

        /* Formats 'outputItemId'. */
        outputItemId = formatResourceLocationStr(outputItemId, true);

        /* 
            Removes all characters in front of the forward slash '/', including
            the forward slash, or all characters in front of the colon ':',
            including the colon, to only keep the last part of the 'itemId'.

            Example: 'v_slab_compat:createdeco/bricks_vertical_slab' becomes 'bricks_vertical_slab'.
        */
        if (outputItemId.includes('/')) {
            outputItemId = outputItemId.split('/')[1];
        } else if (outputItemId.includes(':')) {
            outputItemId = outputItemId.split(':')[1];
        }

        /* Converts 'input' if it is defined. */
        if (input) {
            /* Wraps 'input' in an array for further processing, if it isn't an array already. */
            if (!isArray(input)) {
                input = [input];
            }

            /*
                Converts 'input' to a string, starting with '_from_', followed by all formatted items and/or tags,
                which got all characters in front of the forward slash '/', including the forward slash, or all
                characters in front of the colon ':', including the colon removed, concatenated with '_and_'.
            */
            input = '_from_'.concat(
                input
                    .map((itemOrTagId) => {
                        itemOrTagId = formatResourceLocationStr(itemOrTagId, true);

                        if (itemOrTagId.includes('/')) {
                            itemOrTagId = itemOrTagId.split('/')[1];
                        } else if (itemOrTagId.includes(':')) {
                            itemOrTagId = itemOrTagId.split(':')[1];
                        }

                        return itemOrTagId;
                    })
                    .join('_and_')
            );
        } else {
            /* Defaults 'input' to an empty string if it's undefined. */
            input = '';
        }

        /* Formats 'recipeType' if it's defined, or defaults it to an empty string if it's undefined. */
        recipeType = recipeType ? `${formatResourceLocationStr(recipeType, true)}/` : '';

        /**
         * The recipe id, concatenated with 'recipeType',
         * 'outputItemId', and 'input', with a prefix of 'nycto:'.
         *
         * @type {string}
         */
        const recipeId = `nycto:${recipeType + outputItemId + input}`;

        /* Logs 'recipeId' if the logging is enabled. */
        if (isRecipeIdCompositionLogEnabled) {
            console.info(`Composed recipe id: ${recipeId}`);
        }

        return recipeId;
    }

    /**
     * Adds a smelting recipe.
     *
     * @param {string} inputItemId - The input item id.
     *
     * @param {string} outputItemId - The output item id.
     *
     * @param {number} [timeInTicks=200] - The amount of time, in ticks, that the smelting will take. Default = 200.
     *
     * @param {number} [xp=0] - The amount of XP that the smelting will grant. Default = 0.
     *
     * @returns {void}
     */
    const addSmeltingRecipe = (inputItemId, outputItemId, timeInTicks, xp) => {
        timeInTicks = timeInTicks && timeInTicks > 0 ? timeInTicks : 200;
        xp = xp && xp > 0 ? xp : 0;

        event
            .smelting(outputItemId, inputItemId)
            .id(composeRecipeId(outputItemId, inputItemId, 'smelting'))
            .cookingTime(timeInTicks)
            .xp(xp);
    };

    /**
     * Adds a blasting recipe.
     *
     * @param {string} inputItemId - The input item id.
     *
     * @param {string} outputItemId - The output item id.
     *
     * @param {number} [timeInTicks=100] - The amount of time, in ticks, that the blasting will take. Default = 100.
     *
     * @param {number} [xp=0] - The amount of XP that the blasting will grant. Default = 0.
     *
     * @returns {void}
     */
    const addBlastingRecipe = (inputItemId, outputItemId, timeInTicks, xp) => {
        timeInTicks = timeInTicks && timeInTicks > 0 ? timeInTicks : 100;
        xp = xp && xp > 0 ? xp : 0;

        event
            .blasting(outputItemId, inputItemId)
            .id(composeRecipeId(outputItemId, inputItemId, 'blasting'))
            .cookingTime(timeInTicks)
            .xp(xp);
    };

    /**
     * Adds a smoking recipe.
     *
     * @param {string} inputItemId - The input item id.
     *
     * @param {string} outputItemId - The output item id.
     *
     * @param {number} [timeInTicks=100] - The amount of time, in ticks, that the smoking will take. Default = 100.
     *
     * @param {number} [xp=0] - The amount of XP that the smoking will grant. Default = 0.
     *
     * @returns {void}
     */
    const addSmokingRecipe = (inputItemId, outputItemId, timeInTicks, xp) => {
        timeInTicks = timeInTicks && timeInTicks > 0 ? timeInTicks : 100;
        xp = xp && xp > 0 ? xp : 0;

        event
            .smoking(outputItemId, inputItemId)
            .id(composeRecipeId(outputItemId, inputItemId, 'smoking'))
            .cookingTime(timeInTicks)
            .xp(xp);
    };

    /**
     * Replaces an input item with an item or tag, using recipe id as filter.
     *
     * @param {string} recipeId - The recipe id.
     *
     * @param {string} inputItemId - The input item id to replace.
     *
     * @param {string} newInput - The new input item id or tag.
     *     Note: Tags need to start with a # followed by their id.
     *
     * @returns {void}
     */
    const replaceInputByRecipeId = (recipeId, inputItemId, newInput) =>
        event.replaceInput({ id: recipeId }, inputItemId, newInput);

    /**
     * Adds a Scarecrow's Territory scarecrow crafting recipe.
     *
     * @param {string} color - The scarecrow color.
     *
     * @returns {void}
     */
    const addScarecrowRecipe = (color) => {
        /**
         * The scarecrow item id prefix.
         *
         * @type {string}
         * @const
         */
        const prefix = color == 'purple' ? 'primitive' : color;
        /**
         * The scarecrow item id.
         *
         * @type {string}
         * @const
         */
        const itemId = `scarecrowsterritory:${prefix}_scarecrow`;

        event
            .shaped(itemId, ['DP ', 'SHS', ' S '], {
                D: `minecraft:${color}_dye`,
                P: 'minecraft:carved_pumpkin',
                S: '#forge:rods/wooden',
                H: 'minecraft:hay_block'
            })
            .id(composeRecipeId(itemId));
    };

    /**
     * Composes output items.
     *
     * @param {Object[]} outputItemsInfo - Info about one or more output items.
     *
     * @param {string} outputItemsInfo[].itemId - The output item id.
     *
     * @param {number} [outputItemsInfo[].amount=1] - The output item amount. Default = 1.
     *
     * @param {number} [outputItemsInfo[].chance=1] - The output item chance. Default = 1.
     *
     * @returns {ItemStack[]|undefined} The output items, or undefined if 'outputItemsInfo' is invalid.
     */
    const composeOutputItems = (outputItemsInfo) => {
        /**
         * The output items.
         *
         * @type {ItemStack[]}
         * @const
         */
        const outputItems = [];

        outputItemsInfo.forEach((itemInfo) => {
            /**
             * The output item amount.
             *
             * @type {number}
             */
            let amount = itemInfo.amount ? itemInfo.amount : 1;
            /**
             * The output item chance.
             *
             * @type {number}
             */
            let chance = itemInfo.chance ? itemInfo.chance : 1;

            outputItems.push(Item.of(itemInfo.itemId).withCount(amount).withChance(chance));
        });

        return outputItems;
    };

    /**
     * Adds a Create crushing recipe.
     *
     * @param {string} inputItemId - The input item id.
     *
     * @param {number} [timeInTicks=100] - The amount of time, in ticks, that the crushing will take. Default = 100.
     *
     * @param {Object[]} outputItemsInfo - Info about one or more output items.
     *
     * @param {string} outputItemsInfo[].itemId - The output item id.
     *
     * @param {number} [outputItemsInfo[].amount=1] - The output item amount. Default = 1.
     *
     * @param {number} [outputItemsInfo[].chance=1] - The output item chance. Default = 1.
     *
     * @returns {void}
     */
    const addCrushingRecipe = (inputItemId, timeInTicks, outputItemsInfo) => {
        if (!Platform.isLoaded('create')) {
            logModNotLoaded('Create', 'crushing recipe');
            return;
        }

        timeInTicks = timeInTicks && timeInTicks > 0 ? timeInTicks : 100;

        event.recipes.create
            .crushing(composeOutputItems(outputItemsInfo), inputItemId)
            .id(composeRecipeId(outputItemsInfo[0].itemId, inputItemId, 'crushing'))
            .processingTime(timeInTicks);
    };

    /**
     * Adds a Create ore crushing recipe.
     *
     * @param {string} inputItemId - The input item id.
     *
     * @param {string} oreType - The type of ore.
     *
     * @param {string} mainBlockItemId - The main block item id.
     *
     * @returns {void}
     */
    const addOreCrushingRecipe = (inputItemId, oreType, mainBlockItemId) => {
        if (!Platform.isLoaded('create')) {
            logModNotLoaded('Create', 'ore crushing recipe');
            return;
        }

        if (!supportedOreTypes.includes(oreType)) {
            console.log(
                `[WARN] Ore type ${oreType} not supported! Add logic to addOreCrushingRecipe() in recipes.js to handle this ore type. Skipping ore crushing recipe`
            );
            return;
        }

        /**
         * Whether the first output item has an amount bonus.
         *
         * @type {boolean}
         */
        let hasFirstOutputItemBonus = false;
        /**
         * The first output item amount.
         *
         * @type {number}
         */
        let firstOutputItemAmount;
        /**
         * The second output item chance.
         *
         * @type {number}
         */
        let secondOutputItemChance;
        /**
         * The amount of time, in ticks, that the crushing will take.
         *
         * @type {number}
         */
        let timeInTicks = 250;
        /**
         * The output item id.
         *
         * @type {string}
         */
        let outputItemId = oreType;

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
            hasFirstOutputItemBonus = true;
        }

        switch (oreType) {
            case 'iron':
            case 'copper':
            case 'gold':
                outputItemId = `create:crushed_raw_${oreType}`;
                break;
            case 'ruby':
            case 'jade':
            case 'aquamarine':
            case 'onyx':
                outputItemId = `epicsamurai:${oreType}`;
                break;
            case 'lapis':
                outputItemId = 'lapis_lazuli';
                break;
            case 'cloggrum':
            case 'froststeel':
            case 'utherium':
            case 'regalium':
                outputItemId = `undergarden:crushed_raw_${oreType}`;
        }

        if (oreType == 'copper') {
            firstOutputItemAmount = hasFirstOutputItemBonus ? 7 : 5;
            secondOutputItemChance = 0.25;
        } else if (oreType == 'redstone' || oreType == 'lapis') {
            oreType == 'redstone'
                ? (firstOutputItemAmount = hasFirstOutputItemBonus ? 7 : 6)
                : (firstOutputItemAmount = hasFirstOutputItemBonus ? 12 : 10);
            secondOutputItemChance = 0.5;
        } else {
            firstOutputItemAmount = hasFirstOutputItemBonus ? 2 : 1;
            secondOutputItemChance =
                hasFirstOutputItemBonus && mainBlockItemId != 'undergarden:tremblecrust' ? 0.25 : 0.75;
        }

        addCrushingRecipe(inputItemId, timeInTicks, [
            {
                itemId: outputItemId,
                amount: firstOutputItemAmount
            },
            {
                itemId: outputItemId,
                chance: secondOutputItemChance
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

    /**
     * Adds a Create mixing recipe.
     *
     * @param {string|string[]} input - The input item id,
     *     or input tag, or input item ids, and/or input tags.
     *     Note: Tags need to start with a # followed by their id.
     *
     * @param {Object[]} outputItemsInfo - Info about one or more output items.
     *
     * @param {string} outputItemsInfo[].itemId - The output item id.
     *
     * @param {number} [outputItemsInfo[].amount=1] - The output item amount. Default = 1.
     *
     * @param {number} [outputItemsInfo[].chance=1] - The output item chance. Default = 1.
     *
     * @param {boolean} [requiresHeat=false] - Whether the recipe requires heat. Default = false.
     *
     * @param {boolean} [requiresSuperHeat=false] - Whether the recipe requires super heat. Default = false.
     *
     * @returns {void}
     */
    const addMixingRecipe = (input, outputItemsInfo, requiresHeat, requiresSuperHeat) => {
        if (!Platform.isLoaded('create')) {
            logModNotLoaded('Create', 'mixing recipe');
            return;
        }

        const outputItems = composeOutputItems(outputItemsInfo);
        const recipeId = composeRecipeId(outputItemsInfo[0].itemId, input, 'mixing');

        if (!requiresHeat && !requiresSuperHeat) {
            event.recipes.create.mixing(outputItems, input).id(recipeId);
        } else if (requiresHeat && !requiresSuperHeat) {
            event.recipes.create.mixing(outputItems, input).id(recipeId).heated();
        } else {
            event.recipes.create.mixing(outputItems, input).id(recipeId).superheated();
        }
    };

    // TODO add crushing recipes for all ores from all mods

    /* Remove all recipes having vertical slabs from Builders Crafts and
       Additions as input or output since Quark already adds all of these
       (all BC&A recipes still work with vertical slabs from Quark) */
    // TODO: change output and input to id only and remove tags if needed to remove uncrafting recipes
    // CURRENTLY THIS DELETES TOO MANY RECIPES I THINK !!!
    if (Platform.isLoaded('buildersaddition'))
        event.remove([
            { input: /^buildersaddition:.*vertical_slab$/ },
            { output: /^buildersaddition:.*vertical_slab$/ }
        ]);

    /* Remove all recipes having vertical slabs from Vertical Slabs Compat - Create: Deco
       vertical slabs as input or output since Create: Deco already adds all of these */
    if (Platform.isLoaded('v_slab_compat') && Platform.isLoaded('createdeco'))
        event.remove([
            { input: /^v_slab_compat:createdeco.*vertical_slab$/ },
            { output: /^v_slab_compat:createdeco.*vertical_slab$/ }
        ]);

    /* Remove crafting recipe for minecraft:chest with any #byg:planks
       since I'm adding a recipe with any #minecraft:planks */
    if (Platform.isLoaded('byg')) event.remove([{ id: 'byg:byg_chest' }]);

    /* Add crafting recipe for minecraft:chest with any
       #minecraft:planks since other mods 'steal' this recipe */
    event
        .shaped(Item.of('minecraft:chest', 1), ['PPP', 'P P', 'PPP'], {
            P: '#minecraft:planks'
        })
        .id(composeRecipeId('chest', 'planks'));

    /* Just Another Rotten Flesh to Leather Mod mod replacement
    
       Add smelting and smoking recipes for minecraft:leather with
       minecraft:rotten_flesh and rottencreatures:magma_rotten_flesh */
    addSmeltingRecipe('minecraft:rotten_flesh', 'minecraft:leather', 200, 0.25);
    addSmokingRecipe('minecraft:rotten_flesh', 'minecraft:leather', 100, 0.25);

    if (Platform.isLoaded('rottencreatures')) {
        addSmeltingRecipe('rottencreatures:magma_rotten_flesh', 'minecraft:leather', 200, 0.25);
        addSmokingRecipe('rottencreatures:magma_rotten_flesh', 'minecraft:leather', 100, 0.25);
    }

    /* Add crafting recipe for minecraft:end_portal_frame */
    event
        .shaped(Item.of('minecraft:end_portal_frame', 12), ['EEE', 'EDE', 'SSS'], {
            E: 'minecraft:ender_eye',
            D: 'minecraft:dragon_egg',
            S: 'minecraft:end_stone'
        })
        .id(composeRecipeId('end_portal_frame'));

    /* Add crafting recipe for minecraft:tuff */
    event
        .shaped('8x minecraft:tuff', ['ADA', 'DLD', 'ADA'], {
            A: 'minecraft:andesite',
            D: 'minecraft:diorite',
            L: 'minecraft:lava_bucket'
        })
        .id(composeRecipeId('tuff', ['andesite', 'diorite']));

    /* Add mixing recipe for minecraft:tuff */
    addMixingRecipe(
        ['minecraft:andesite', 'minecraft:diorite'],
        [
            {
                itemId: 'minecraft:tuff',
                amount: 2
            }
        ],
        true
    );

    if (Platform.isLoaded('scarecrowsterritory')) {
        /* Remove crafting recipe for scarecrowsterritory:primitive_scarecrow
           added by Scarecrows' Territory since I'm adding custom
           recipes that all require dye */
        event.remove({ id: 'scarecrowsterritory:scarecrow' });

        /* Add crafting recipes for Scarecrows' Territory's scarecrows */
        [
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
        ].forEach((color) => addScarecrowRecipe(color));
    }

    /* Remove crafting recipe for minecraft:end_portal_frame
       added by End Portal Recipe (just because I want my own) */
    if (Platform.isLoaded('endportalrecipe')) event.remove([{ id: 'endportalrecipe:craftable_end_portal' }]);

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
    if (Platform.isLoaded('netherchested'))
        replaceInputByRecipeId('netherchested:nether_chest', 'minecraft:chest', '#forge:chests/wooden');

    // TODO ADD OTHER SMELTING AND BLASTING RECIPES FOR OTHER ORES OF EPIC SAMURAI

    /* Add smelting and blasting recipes for epicsamurai:ruby with
       epicsamurai:ruby_ore and epicsamurai:deepslate_ruby_ore */
    if (Platform.isLoaded('epicsamurai')) {
        addSmeltingRecipe('epicsamurai:ruby_ore', 'epicsamurai:ruby', 200, 0.75);
        addBlastingRecipe('epicsamurai:ruby_ore', 'epicsamurai:ruby', 100, 0.75);
        addSmeltingRecipe('epicsamurai:deepslate_ruby_ore', 'epicsamurai:ruby', 200, 0.75);
        addBlastingRecipe('epicsamurai:deepslate_ruby_ore', 'epicsamurai:ruby', 100, 0.75);
    }

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
    if (Platform.isLoaded('croptopia'))
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

    /* The Undergarden */
    if (Platform.isLoaded('undergarden')) {
        addSmeltingRecipe('undergarden:crushed_raw_cloggrum', 'undergarden:cloggrum_ingot', 200, 0.7);
        addBlastingRecipe('undergarden:crushed_raw_cloggrum', 'undergarden:cloggrum_ingot', 100, 0.7);

        addSmeltingRecipe('undergarden:crushed_raw_froststeel', 'undergarden:froststeel_ingot', 200, 0.7);
        addBlastingRecipe('undergarden:crushed_raw_froststeel', 'undergarden:froststeel_ingot', 100, 0.7);

        addSmeltingRecipe('undergarden:crushed_raw_utherium', 'undergarden:utherium_crystal', 200, 1);
        addBlastingRecipe('undergarden:crushed_raw_utherium', 'undergarden:utherium_crystal', 100, 1);

        event
            .shaped('1x undergarden:regalium_crystal', ['SSS', 'SSS', 'SSS'], {
                S: 'undergarden:regalic_shard'
            })
            .id(composeRecipeId('regalium_crystal', 'regalic_shard'));
        event
            .shapeless('9x undergarden:regalic_shard', ['undergarden:regalium_crystal'])
            .id(composeRecipeId('regalic_shard', 'regalium_crystal'));

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
        //     id(composeRecipeId('cloggrum_nugget', 'crushed_raw_cloggrum', 'splashing'));

        addOreCrushingRecipe('undergarden:shiverstone_froststeel_ore', 'froststeel', 'undergarden:shiverstone');

        if (Platform.isLoaded('create')) {
            if (Item.exists('endermanoverhaul:icy_pearl'))
                event.recipes.create
                    .splashing(
                        ['9x undergarden:froststeel_nugget', Item.of('endermanoverhaul:icy_pearl').withChance(0.08)],
                        'undergarden:crushed_raw_froststeel'
                    )
                    .id(composeRecipeId('froststeel_nugget', 'crushed_raw_froststeel', 'splashing'));

            addOreCrushingRecipe('undergarden:depthrock_utherium_ore', 'utherium', 'undergarden:depthrock');
            addOreCrushingRecipe('undergarden:shiverstone_utherium_ore', 'utherium', 'undergarden:shiverstone');
            addOreCrushingRecipe('undergarden:tremblecrust_utherium_ore', 'utherium', 'undergarden:tremblecrust');

            if (Item.exists('projecte:red_matter'))
                event.recipes.create
                    .splashing(
                        composeOutputItems([
                            { itemId: 'undergarden:utheric_shard', amount: 9 },
                            { itemId: 'projecte:red_matter', chance: 0.05 }
                        ]),
                        'undergarden:crushed_raw_utherium'
                    )
                    .id(composeRecipeId('utheric_shard', 'crushed_raw_utherium', 'splashing'));

            addOreCrushingRecipe('undergarden:depthrock_regalium_ore', 'regalium', 'undergarden:depthrock');
            addOreCrushingRecipe('undergarden:shiverstone_regalium_ore', 'regalium', 'undergarden:shiverstone');

            event.recipes.create
                .splashing(
                    ['9x undergarden:regalic_shard', Item.of('enchanted_golden_apple').withChance(0.05)],
                    'undergarden:crushed_raw_regalium'
                )
                .id(composeRecipeId('regalic_shard', 'crushed_raw_regalium', 'splashing'));
        }
    }
});
