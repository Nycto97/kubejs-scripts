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
   Ingredient.all.itemIds does NOT return all registered items and blocks,
   rather only the ones that are used in recipes.

   To get all registered blocks, use Block.getTypeList()
   To get all registered items, use Item.getTypeList()
*/

let allBlocks = Block.getTypeList();
let allItems = Item.getTypeList();
let allBlocksAndItems = allBlocks.concat(allItems);

console.log(
    `There are ${allItems.length} items and ${allBlocks.length} blocks registered in your world, totalling ${allBlocksAndItems.length}.`
);

LootJS.modifiers((event) => {
    /* Enable the log output */
    event.enableLogging();

    const removeBlockLoot = (block, lootToRemove) => {
        event.addBlockLootModifier(block).removeLoot(lootToRemove);
    };

    const removeAllBlockLoot = (block) => {
        event.addBlockLootModifier(block).removeLoot(Ingredient.all);
    };

    const replaceBlockLoot = (block, lootToReplace, replacement) => {
        event.addBlockLootModifier(block).replaceLoot(lootToReplace, replacement);
    };

    const removeAndAddBlockLootWithChance = (block, lootToRemove, lootToAdd, amount, chance) => {
        event
            .addBlockLootModifier(block)
            /* Using removeLoot and addLoot instead of replaceLoot since the
           vanilla drop chance seems unchanged when using replaceLoot */
            .removeLoot(lootToRemove)
            .addLoot(LootEntry.of(lootToAdd, amount).when((c) => c.randomChance(chance)));
    };

    /* Return a list of all registered global loot modifiers from other mods */
    // const modifiers = event.getGlobalModifiers();
    // modifiers.forEach((modifier) => {
    //     console.log(modifier);
    // });

    /* Remove all vertical slabs from Builders Crafts and Additions mod
       from the current loot pool so they don't drop their block when breaking */
    removeAllBlockLoot(/^buildersaddition:.*vertical_slab$/);

    /* Remove all vertical slabs from Vertical Slabs Compat - Create: Deco mod
       from the current loot pool so they don't drop their block when breaking */
    removeAllBlockLoot(/^v_slab_compat:createdeco.*vertical_slab$/);

    /* Shulker Drops Two mod replacement

       Replace vanilla shulker shell drop chance (count: 1, chance: 0.5) and
       make shulkers always drop 2 shulker shells (count: 2, chance: 1.0) 
       + add diamond to shulker loot pool with 0.1 drop chance */
    event
        .addEntityLootModifier('minecraft:shulker')
        /* Using removeLoot and addLoot instead of replaceLoot since the
           vanilla drop chance seems unchanged when using replaceLoot */
        .removeLoot('minecraft:shulker_shell')
        .addLoot(LootEntry.of('minecraft:shulker_shell', 2).when((c) => c.randomChance(1.0)))
        .addLoot(LootEntry.of('minecraft:diamond').when((c) => c.randomChance(0.1)));

    /* Needed for already existing ruby ores from MoreCraft, changed
       frequency to 0 but some chunks got generated already */
    replaceBlockLoot('morecraft:ruby_ore', 'morecraft:ruby', 'epicsamurai:ruby');
    replaceBlockLoot('morecraft:ruby_ore', 'morecraft:ruby_ore', 'epicsamurai:ruby_ore');
    replaceBlockLoot('morecraft:deepslate_ruby_ore', 'morecraft:ruby', 'epicsamurai:ruby');
    replaceBlockLoot('morecraft:deepslate_ruby_ore', 'morecraft:deepslate_ruby_ore', 'epicsamurai:deepslate_ruby_ore');

    /* INFO: START RARE ICE LOOT */

    /* There will be many more items that need to be added! */
    const cannotStartWith = ['ftbquests', 'randomium', 'doubleslabs', 'minecraft:structure'];

    const blacklistedItems = allItems.filter(
        (item) =>
            item == 'minecraft:air' ||
            cannotStartWith.some((itemNameStart) => item.startsWith(itemNameStart)) ||
            RegExp(/^.*(spawn_egg|command_block|jigsaw|barrier|debug).*$/).test(item) ||
            RegExp(/^(buildersaddition:|v_slab_compat:createdeco).*vertical_slab$/).test(item)
    );

    const isNotBlacklisted = (item) => {
        return !blacklistedItems.contains(item);
    };

    /* TODO find out how it comes that this works, while the commented
       out code below is the full, 'correct' way to do this */
    const filteredItems = allItems.filter(isNotBlacklisted);
    // const filteredItems = allItems.filter((item) => isNotBlacklisted(item));

    console.log(
        `\n\n${
            allItems.length - filteredItems.length
        } blacklisted items will not be added to rare_ice 'chest' loot:\n\n${blacklistedItems}\n`
    );

    event.addLootTableModifier('rare-ice:chests/rare_ice').apply((ctx) => {
        ctx.findLoot(Ingredient.all).forEach((item) => {
            let count = item.count;
            ctx.removeLoot(item);
            ctx.addLoot(
                LootEntry.of(filteredItems[Math.floor(Math.random() * filteredItems.length)]).limitCount(count)
            );
        });
    });
});
