/*
   Copyright (c) 2023, Jelle Van Goethem
   All rights reserved.
 
   This source code is licensed under the BSD-style license found in the
   LICENSE file in the root directory of this source tree.
*/

/* 
   ATTENTION:
   Ingredient.all.itemIds does NOT return all registered items and blocks,
   rather only the ones that are used in recipes.

   To get all registered blocks, use Block.getTypeList()
   To get all registered items, use Item.getTypeList()
*/

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
    if (Platform.isLoaded('buildersaddition')) {
        removeAllBlockLoot(/^buildersaddition:.*vertical_slab$/);
    }
    /* Remove all vertical slabs from Vertical Slabs Compat - Create: Deco mod
       from the current loot pool so they don't drop their block when breaking */
    if (Platform.isLoaded('v_slab_compat') && Platform.isLoaded('createdeco')) {
        removeAllBlockLoot(/^v_slab_compat:createdeco.*vertical_slab$/);
    }

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

    /* We've reset the overworld + I made a datapack to disable
       ruby ores from MoreCraft, but leave this code in just in case */
    if (Platform.isLoaded('morecraft') && Platform.isLoaded('epicsamurai')) {
        replaceBlockLoot('morecraft:ruby_ore', 'morecraft:ruby', 'epicsamurai:ruby');
        replaceBlockLoot('morecraft:ruby_ore', 'morecraft:ruby_ore', 'epicsamurai:ruby_ore');
        replaceBlockLoot('morecraft:deepslate_ruby_ore', 'morecraft:ruby', 'epicsamurai:ruby');
        replaceBlockLoot(
            'morecraft:deepslate_ruby_ore',
            'morecraft:deepslate_ruby_ore',
            'epicsamurai:deepslate_ruby_ore'
        );
    }

    /* INFO: START RARE ICE LOOT */
    if (Platform.isLoaded('rare-ice')) {
        /* There will be many more items that need to be added! */
        const rareIceLootCannotStartWith = ['ftbquests', 'randomium', 'doubleslabs', 'minecraft:structure'];

        const blacklistedRareIceLootItemIds = global.allItemIds.filter((itemId) => {
            itemId == 'minecraft:air' ||
                rareIceLootCannotStartWith.some((itemIdStart) => {
                    itemId.startsWith(itemIdStart);
                }) ||
                RegExp(/^.*(spawn_egg|command_block|jigsaw|barrier|debug).*$/).test(itemId) ||
                RegExp(/^(buildersaddition:|v_slab_compat:createdeco).*vertical_slab$/).test(itemId);
        });

        const isRareIceLootItemIdNotBlacklisted = (itemId) => {
            return !blacklistedRareIceLootItemIds.contains(itemId);
        };

        const rareIceLootItemIds = global.allItemIds.filter((itemId) => {
            isRareIceLootItemIdNotBlacklisted(itemId);
        });

        if (global.isBlacklistedRareIceLootLogEnabled) {
            console.log(
                `\n\n${
                    global.allItemIds.length - rareIceLootItemIds.length
                } blacklisted items will not be added to rare_ice 'chest' loot:\n\n${blacklistedRareIceLootItemIds}\n`
            );
        }

        event.addLootTableModifier('rare-ice:chests/rare_ice').apply((ctx) => {
            ctx.findLoot(Ingredient.all).forEach((item) => {
                let count = item.count;

                ctx.removeLoot(item);
                ctx.addLoot(
                    LootEntry.of(rareIceLootItemIds[Math.floor(Math.random() * rareIceLootItemIds.length)]).limitCount(
                        count
                    )
                );
            });
        });
    }
});
