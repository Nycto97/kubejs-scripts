/*
   Copyright (c) 2023, Jelle Van Goethem
   All rights reserved.
 
   This source code is licensed under the BSD-style license found in the
   LICENSE file in the root directory of this source tree.
*/

/*
   INFO:
   Using RegEx with \/^(.)*$\/
    / -> Start and end of RegEx
    ^ -> Start of line
    ( -> Start of group
    . -> Match any character
    ) -> End of group
    * -> Match group 0 or more times
    $ -> End of line

   Example: /^some_mod:.*vertical_slab$/
   some_mod:vertical_slab matches

   Use this RegEx to match lines not containing a certain word:
   /^whatever:textyouwant((?!word).)*$/
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

    const replaceInputUsingIdFilter = (id, inputToReplace, newInput) => {
        event.replaceInput(
            { id: id }, // Arg 1: the filter
            inputToReplace, // Arg 2: the item to replace
            newInput // Arg 3: the item to replace it with (can be a tag)
        );
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
            type != 'onyx'
        ) {
            console.log(
                `ERROR: addOreCrushingRecipe: type ${type} not found! Add logic to addOreCrushingRecipe to handle this type!`
            );
            return;
        }

        let hasFirstItemBonus = false;
        let firstItemAmount;
        let secondItemChance;
        let time;
        let item = type;
        let items;

        if (type == 'coal') {
            time = 150;
        } else if (
            type == 'emerald' ||
            type == 'diamond' ||
            type == 'ruby' ||
            type == 'jade' ||
            type == 'aquamarine' ||
            type == 'onyx'
        ) {
            time = 350;
        } else {
            time = 250;
        }

        if (mainBlock == 'cobbled_deepslate') {
            hasFirstItemBonus = true;
            time += 100;
        }

        if (type == 'iron' || type == 'copper' || type == 'gold') {
            item = `create:crushed_raw_${type}`;
        } else if (type == 'ruby' || type == 'jade' || type == 'aquamarine' || type == 'onyx') {
            item = `epicsamurai:${type}`;
        }

        if (type == 'copper') {
            firstItemAmount = hasFirstItemBonus ? 7 : 5;
            secondItemChance = 0.25;
        } else if (type == 'redstone' || type == 'lapis') {
            if (type == 'redstone') {
                firstItemAmount = hasFirstItemBonus ? 7 : 6;
            } else {
                item = 'lapis_lazuli';
                firstItemAmount = hasFirstItemBonus ? 12 : 10;
            }
            secondItemChance = 0.5;
        } else {
            firstItemAmount = hasFirstItemBonus ? 2 : 1;
            secondItemChance = hasFirstItemBonus ? 0.25 : 0.75;
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
    event
        .smelting('minecraft:leather', 'minecraft:rotten_flesh')
        .id('nycto:smelting/leather_from_rotten_flesh')
        .xp(0.25)
        .cookingTime(200);
    event
        .smoking('minecraft:leather', 'minecraft:rotten_flesh')
        .id('nycto:smoking/leather_from_rotten_flesh')
        .xp(0.25)
        .cookingTime(100);
    event
        .smelting('minecraft:leather', 'rottencreatures:magma_rotten_flesh')
        .id('nycto:smelting/leather_from_magma_rotten_flesh')
        .xp(0.25)
        .cookingTime(200);
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

    /* Allow Nether Chest to be crafted with #forge:chests/wooden */
    replaceInputUsingIdFilter('netherchested:nether_chest', 'minecraft:chest', '#forge:chests/wooden');

    // TODO ADD OTHER SMELTING AND BLASTING RECIPES FOR OTHER ORES OF EPIC SAMURAI

    /* Add smelting and blasting recipes for epicsamurai:ruby with
       epicsamurai:ruby_ore and epicsamurai:deepslate_ruby_ore */
    event
        .smelting('epicsamurai:ruby', 'epicsamurai:ruby_ore')
        .id('nycto:smelting/ruby_from_ruby_ore')
        .xp(0.75)
        .cookingTime(200);
    event
        .blasting('epicsamurai:ruby', 'epicsamurai:ruby_ore')
        .id('nycto:blasting/ruby_from_ruby_ore')
        .xp(0.75)
        .cookingTime(100);
    event
        .smelting('epicsamurai:ruby', 'epicsamurai:deepslate_ruby_ore')
        .id('nycto:smelting/ruby_from_deepslate_ruby_ore')
        .xp(0.75)
        .cookingTime(200);
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

    /* Croptopia */

    addCrushingRecipe('croptopia:salt_ore', 300, [
        {
            item: 'croptopia:salt',
            chance: 0.75
        },
        {
            item: 'croptopia:salt',
            chance: 0.25
        },
        {
            item: 'create:experience_nugget',
            chance: 0.75
        },
        {
            item: 'calcite',
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
    addOreCrushingRecipe('epicsamurai:deepslate_ruby_ore', 'ruby', 'cobbled_deepslate');

    addOreCrushingRecipe('epicsamurai:jade_ore', 'jade', 'cobblestone');
    addOreCrushingRecipe('epicsamurai:deepslate_jade_ore', 'jade', 'cobbled_deepslate');

    addOreCrushingRecipe('epicsamurai:aquamarine_ore', 'aquamarine', 'cobblestone');
    addOreCrushingRecipe('epicsamurai:deepslate_aquamarine_ore', 'aquamarine', 'cobbled_deepslate');

    addOreCrushingRecipe('epicsamurai:onyx_ore', 'onyx', 'cobblestone');
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

// TODO MOVE TO OTHER GENERAL CODE FILE !!!
/* 
   ATTENTION
   The following code can only be used to manually copy/paste the output
   from console.log to the In Control! config file, as it is not possible
   to write [] to json files with JsonIO.write() (provided by KubeJS).
*/

/* 
   ATTENTION 
   NEW, BETTER, EASIER APPROACH !
   RULE 1: ALLOW MINECRAFT MOBS
   RULE 2: DENY ALL MODS
   FIRST RULE THAT MATCHES, STOPS THAT MOB FROM BEING AFFECTED BY
   FOLLOWING RULES, UNLESS continue: true IS SPECIFIED IN THE RULE

[
    {
        "result": "allow",
        "mod": "minecraft",
        "dimension": "nycto:usw_vanilla",
        "onjoin": true
    },
    {
        "result": "deny",
        "dimension": "nycto:usw_vanilla",
        "onjoin": true
    }
]
   
   INFO
   @ChiefArug:
   "When a rule matches and has a result then InControl! stops processing
   further rules for that mob unless the rule also specified continue: true.
   So if you have a result: allow, it will stop InControl! processing any further rules,
   including deny ones"
*/

// WARNING DO NOT REMOVE THIS COMMENTED OUT CODE !!!
/* const allServerModIds = Platform.getList();
const arrayWithAllModIdsForInControlBlacklist = [];
const arrayWithAllModIdsForInControlBlacklistStringified = [];
const constructBlacklistObject = (modId) => {
    return {
        result: 'deny',
        mod: modId,
        dimension: 'nycto:usw_vanilla',
        onjoin: true
    };
};

allServerModIds.forEach((modId) => {
    modId != 'minecraft' && arrayWithAllModIdsForInControlBlacklist.push(constructBlacklistObject(modId));
});

arrayWithAllModIdsForInControlBlacklist.map((object) => {
    arrayWithAllModIdsForInControlBlacklistStringified.push(JSON.stringify(object));
});

console.log(
    `There are ${arrayWithAllModIdsForInControlBlacklistStringified.length} mods loaded on the server (including minecraft, forge and jar in jar mods).`
);

for (let i = 0; i < 5; i++) {
    console.log('-'.repeat(89));
}
console.log(`${'-'.repeat(21)} START MANUALLY GENERATED InControl! BLACKLIST ${'-'.repeat(21)}`);
//console.log('--- This is only for visual reference, actual json gets written to InControl! config! ---');
for (let i = 0; i < 5; i++) {
    console.log('-'.repeat(89));
}
console.log(`[${arrayWithAllModIdsForInControlBlacklistStringified.toString()}]`);
for (let i = 0; i < 5; i++) {
    console.log('-'.repeat(89));
}
console.log(`${'-'.repeat(22)} END MANUALLY GENERATED InControl! BLACKLIST ${'-'.repeat(22)}`);
for (let i = 0; i < 5; i++) {
    console.log('-'.repeat(89));
}

const filePath = 'config/incontrol/spawn.json'; */

// JsonIO.write(filePath, arrayWithAllModIdsForInControlBlacklistStringified.toString());
//JsonIO.write(filePath, JSON.stringify({ 1: '1' }));
// JsonIO.read(filePath) != null
//     ? console.log(`File has been successfully saved to "Server Nycto/${filePath}"`)
//     : console.log(
//           `Something went wrong! Failed to save to "Server Nycto/${filePath}" Config file not found, meaning the script successfully located and deleted the file, but failed to write to it! Please check and fix your JsonIO.write() call!`
//       );
