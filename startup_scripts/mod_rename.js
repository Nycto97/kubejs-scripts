/*
   Copyright (c) 2023, Jelle Van Goethem
   All rights reserved.
 
   This source code is licensed under the BSD-style license found in the
   LICENSE file in the root directory of this source tree.
*/

/* Listen to post-init event, after all mods have loaded */
StartupEvents.postInit((event) => {
    // TODO move array to separate file and import it here
    const modsToRename = [
        {
            modId: 'ad_astra_giselle_addon',
            preferredModName: 'Ad Astra: Giselle Add-on'
        },
        {
            modId: 'animatica',
            preferredModName: 'Animatica'
        },
        {
            modId: 'ars_creo',
            preferredModName: 'Ars Nouveau: Ars Creo (Create)'
        },
        {
            modId: 'ars_elemental',
            preferredModName: 'Ars Nouveau: Ars Elemental'
        },
        {
            modId: 'ars_instrumentum',
            preferredModName: 'Ars Nouveau: Ars Instrumentum'
        },
        {
            modId: 'ars_scalaes',
            preferredModName: 'Ars Nouveau: Ars Scalaes'
        },
        {
            modId: 'starbunclemania',
            preferredModName: 'Ars Nouveau: Starbuncle Mania'
        },
        {
            modId: 'toomanyglyphs',
            preferredModName: 'Ars Nouveau: Too Many Glyphs'
        },
        {
            modId: 'awesomedungeon',
            preferredModName: 'Awesome Dungeon'
        },
        {
            modId: 'awesomedungeonnether',
            preferredModName: 'Awesome Dungeon Nether Edition'
        },
        {
            modId: 'awesomedungeonocean',
            preferredModName: 'Awesome Dungeon Ocean Edition'
        },
        {
            modId: 'awesomedungeonend',
            preferredModName: 'Awesome Dungeon The End Edition'
        },
        {
            modId: 'bagus_lib',
            preferredModName: 'Bagus Lib'
        },
        {
            modId: 'bintfar',
            preferredModName: 'Bed Is Not Too Far Away'
        },
        {
            modId: 'betterfpsdist',
            preferredModName: 'Better FPS - Render Distance'
        },
        {
            modId: 'treasuredistance',
            preferredModName: 'Better Treasure Map'
        },
        {
            modId: 'biomemusic',
            preferredModName: 'Biome Music'
        },
        {
            modId: 'blockui',
            preferredModName: 'BlockUI Library'
        },
        {
            modId: 'brutalbosses',
            preferredModName: 'Brutal Bosses - Custom Bosses'
        },
        {
            modId: 'buildersaddition',
            preferredModName: 'Builders Crafts & Additions'
        },
        {
            modId: 'cataclysm',
            preferredModName: 'Cataclysm'
        },
        {
            modId: 'chunksending',
            preferredModName: 'Chunk Sending'
        },
        {
            modId: 'clickadv',
            preferredModName: 'Clickable Advancements'
        },
        {
            modId: 'computercraft',
            preferredModName: 'ComputerCraft: Tweaked'
        },
        {
            modId: 'cccbridge',
            preferredModName: 'ComputerCraft: Create Compat'
        },
        {
            modId: 'createbigcannons',
            preferredModName: 'Create: Big Cannons'
        },
        {
            modId: 'createcafe',
            preferredModName: 'Create: Cafe'
        },
        {
            modId: 'nocubescreateexp',
            preferredModName: 'Create: Compact Experience'
        },
        {
            modId: 'createaddition',
            preferredModName: 'Create: Crafts & Additions'
        },
        {
            modId: 'davebuildingmod',
            preferredModName: "Create: Dave's Building Extended"
        },
        {
            modId: 'createdieselgenerators',
            preferredModName: 'Create: Diesel Generators'
        },
        {
            modId: 'createcasing',
            preferredModName: 'Create: Encased'
        },
        {
            modId: 'create_enchantment_industry',
            preferredModName: 'Create: Enchantment Industry'
        },
        {
            modId: 'garnished',
            preferredModName: 'Create: Garnished'
        },
        {
            modId: 'liquidburner',
            preferredModName: 'Create: Liquid Burner'
        },
        {
            modId: 'create_crush_everything',
            preferredModName: 'Create: Recycle Everything'
        },
        {
            modId: 'create_sabers',
            preferredModName: 'Create: Sabers'
        },
        {
            modId: 'createindustry',
            preferredModName: 'Create: The Factory Must Grow'
        },
        {
            modId: 'cupboard',
            preferredModName: 'Cupboard'
        },
        {
            modId: 'darkpaintings',
            preferredModName: 'Dark Paintings'
        },
        {
            modId: 'darkutils',
            preferredModName: 'Dark Utilities'
        },
        {
            modId: 'drawerfps',
            preferredModName: 'DrawerFPS'
        },
        {
            modId: 'dtbop',
            preferredModName: "Dynamic Trees - Biomes O' Plenty"
        },
        {
            modId: 'dtquark',
            preferredModName: 'Dynamic Trees - Quark'
        },
        {
            modId: 'earthmobsmod',
            preferredModName: 'Earth Mobs'
        },
        {
            modId: 'enchantwithmob',
            preferredModName: 'Enchant With Mob'
        },
        {
            modId: 'enchdesc',
            preferredModName: 'Enchantment Descriptions'
        },
        {
            modId: 'endlessbiomes',
            preferredModName: 'Endless Biomes'
        },
        {
            modId: 'entityculling',
            preferredModName: 'Entity Culling'
        },
        {
            modId: 'abnormals_delight',
            preferredModName: "Farmer's Delight: Abnormals Delight"
        },
        {
            modId: 'cataclysm_delight',
            preferredModName: "Farmer's Delight: Cataclysm Delight"
        },
        {
            modId: 'endersdelight',
            preferredModName: "Farmer's Delight: Ender's Delight"
        },
        {
            modId: 'ends_delight',
            preferredModName: "Farmer's Delight: End's Delight"
        },
        {
            modId: 'farmersrespite',
            preferredModName: "Farmer's Delight: Farmer's Respite"
        },
        {
            modId: 'miners_delight',
            preferredModName: "Farmer's Delight: Miner's Delight"
        },
        {
            modId: 'nethersdelight',
            preferredModName: "Farmer's Delight: Nether's Delight"
        },
        {
            modId: 'create_questing',
            preferredModName: 'FTB Quests: Create Questing'
        },
        {
            modId: 'hunterillager',
            preferredModName: "Hunter's Return"
        },
        {
            modId: 'incontrol',
            preferredModName: 'In Control!'
        },
        {
            modId: 'tieredshulkers',
            preferredModName: 'Iron Shulker Boxes'
        },
        {
            modId: 'just_enough_beacons',
            preferredModName: 'Just Enough Beacons'
        },
        {
            modId: 'justenoughprofessions',
            preferredModName: 'Just Enough Professions'
        },
        {
            modId: 'kubejsadditions',
            preferredModName: 'KubeJS: Additions'
        },
        {
            modId: 'kubejs_create',
            preferredModName: 'KubeJS: Create'
        },
        {
            modId: 'lootjs',
            preferredModName: 'KubeJS: LootJS'
        },
        {
            modId: 'morejs',
            preferredModName: 'KubeJS: MoreJS'
        },
        {
            modId: 'kubejsprojecte',
            preferredModName: 'KubeJS: ProjectE'
        },
        {
            modId: 'leaky',
            preferredModName: 'Leaky - Farm Leak Detection'
        },
        {
            modId: 'lootintegrations',
            preferredModName: 'Loot Integrations'
        },
        {
            modId: 'macawsbridgesbop',
            preferredModName: "Macaw's Bridges - Biomes O' Plenty"
        },
        {
            modId: 'macawsbridgesbyg',
            preferredModName: "Macaw's Bridges - Oh The Biomes You'll Go"
        },
        {
            modId: 'mcwfurnituresbop',
            preferredModName: "Macaw's Furniture - Biomes O' Plenty"
        },
        {
            modId: 'mcwfurnituresbyg',
            preferredModName: "Macaw's Furniture - Oh The Biomes You'll Go"
        },
        {
            modId: 'macawsroofsbop',
            preferredModName: "Macaw's Roofs - Biomes O' Plenty"
        },
        {
            modId: 'macawsroofsbyg',
            preferredModName: "Macaw's Roofs - Oh The Biomes You'll Go"
        },
        {
            modId: 'stylecolonies',
            preferredModName: 'MineColonies: StyleColonies'
        },
        {
            modId: 'towntalk',
            preferredModName: 'MineColonies: TownTalk'
        },
        {
            modId: 'cfm',
            preferredModName: "MrCrayfish's Furniture"
        },
        {
            modId: 'cgm',
            preferredModName: "MrCrayfish's Guns"
        },
        {
            modId: 'additionalguns',
            preferredModName: "MrCrayfish's Guns: Additional Guns"
        },
        {
            modId: 'alloyedguns',
            preferredModName: "MrCrayfish's Guns: Alloyed Guns (Create)"
        },
        {
            modId: 'peculiars',
            preferredModName: 'Neapolitan: Peculiars'
        },
        {
            modId: 'respiteful',
            preferredModName: 'Neapolitan: Respiteful'
        },
        {
            modId: 'seasonals',
            preferredModName: 'Neapolitan: Seasonals'
        },
        {
            modId: 'elevatorid',
            preferredModName: 'OpenBlocks Elevator'
        },
        {
            modId: 'equivadds',
            preferredModName: 'ProjectE: Equivalent Additions'
        },
        {
            modId: 'expequiv',
            preferredModName: 'ProjectE: Expanded Equivalence'
        },
        {
            modId: 'revampedwolf',
            preferredModName: 'Revamped Wolf'
        },
        {
            modId: 'dragonfight',
            preferredModName: 'Savage Ender Dragon'
        },
        {
            modId: 'servertick',
            preferredModName: 'Server Tick'
        },
        {
            modId: 'smoothchunk',
            preferredModName: 'Smooth Chunk Save'
        },
        {
            modId: 'spark',
            preferredModName: 'Spark'
        },
        {
            modId: 'framedcompactdrawers',
            preferredModName: 'Storage Drawers: Framed Compacting Drawers'
        },
        {
            modId: 'functionalstorage',
            preferredModName: 'Storage Drawers: Functional Storage'
        },
        {
            modId: 'functional_storage_extra',
            preferredModName: 'Storage Drawers: Functional Storage Extra'
        },
        {
            modId: 'deep_aether',
            preferredModName: 'The Aether: Deep Aether'
        },
        {
            modId: 'aether_enhanced_extinguishing',
            preferredModName: 'The Aether: Enhanced Extinguishing'
        },
        {
            modId: 'tflostblocks',
            preferredModName: 'The Twilight Forest: The Lost Blocks'
        },
        {
            modId: 'upgradednetherite_items',
            preferredModName: 'Upgraded Netherite: Items'
        },
        {
            modId: 'upgradednetherite_ultimate',
            preferredModName: 'Upgraded Netherite: Ultimerite'
        },
        {
            modId: 'useless_sword',
            preferredModName: 'Useless Swords'
        },
        {
            modId: 'w2w2',
            preferredModName: "Xaero's Map - Waystones Compat"
        }
    ];

    const modSkippedNotInstalledMessages = [],
        modSkippedPreferredMessages = [],
        modRenamedMessages = [],
        modAllMessages = [];

    const renameMod = (mod) => {
        /*  
           NOTE TO SELF ABOUT Platform.mods[mod.modId] AFTER SEARCHING FOR HOURS
           HOW TO GET SOMETHING LIKE `Platform.mods.${mod.modId}` TO WORK:

           Dot Notation
               With dot notation, the compiler interprets the code literally.
               Whatever is written after the dot is assumed to be a STRING;
               the compiler then looks for an eponymous property on the object.

           Bracket Notation
               With bracket notation, on the other hand, whatever is written inside
               the brackets will be interpreted as a VARIABLE and evaluated first.
               Only then will the compiler look for a key corresponding to the evaluated expression.
        */
        const modRef = Platform.mods[mod.modId];
        /* Check if mod is installed */
        if (modRef != undefined) {
            /*
               new String() allows to store the current name and refer to it
               later, even after the initial value (modRef.name) gets updated
            */
            const defaultModName = new String(modRef.name);
            /* Check if mod already has preferred name and skip rename if it does */
            if (modRef.name != mod.preferredModName) {
                modRef.name = mod.preferredModName;
                modRenamedMessages.push(
                    `[RENAMED] Mod has been renamed: ${defaultModName} => ${mod.preferredModName} [id: ${mod.modId}]`
                );
            } else {
                modSkippedPreferredMessages.push(
                    `[SKIPPED] Mod has preferred name, skipping rename! ${defaultModName} [id: ${mod.modId}]`
                );
            }
        } else {
            modSkippedNotInstalledMessages.push(`[SKIPPED] Mod is not installed, skipping rename! [id: ${mod.modId}]`);
        }
    };

    /* Rename mods */
    modsToRename.forEach((mod) => renameMod(mod));

    /* Add all messages to 1 array after sorting
       them and add dividers where needed */
    modAllMessages.push(
        modSkippedNotInstalledMessages.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }))
    );
    modSkippedNotInstalledMessages.length > 0 &&
        modAllMessages.push(
            '-'.repeat(modSkippedNotInstalledMessages[modSkippedNotInstalledMessages.length - 1].length)
        );

    modAllMessages.push(modSkippedPreferredMessages.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })));
    modSkippedPreferredMessages.length > 0 &&
        modAllMessages.push('-'.repeat(modSkippedPreferredMessages[modSkippedPreferredMessages.length - 1].length));

    modAllMessages.push(modRenamedMessages.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })));

    /* Print out all messages, grouped by activity,
       alphabetically sorted per group, ignoring case */
    modAllMessages.forEach((message) => console.log(message));
});
