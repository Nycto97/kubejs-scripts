/*
   Copyright (c) 2023, Jelle Van Goethem
   All rights reserved.
 
   This source code is licensed under the BSD-style license found in the
   LICENSE file in the root directory of this source tree.
*/

const modsToRename = [
    {
        modId: 'ad_astra_giselle_addon',
        modPreferredName: 'Ad Astra: Giselle Add-on'
    },
    {
        modId: 'alexsabnormalities',
        modPreferredName: "Alex's Mobs: Abnormalities"
    },
    {
        modId: 'animatica',
        modPreferredName: 'Animatica'
    },
    {
        modId: 'arseng',
        modPreferredName: 'Applied Energistics 2: Ars Énergistique (Ars Nouveau)'
    },
    {
        modId: 'merequester',
        modPreferredName: 'Applied Energistics 2: ME Requester'
    },
    {
        modId: 'ae2things',
        modPreferredName: 'Applied Energistics 2: Things'
    },
    {
        modId: 'ars_creo',
        modPreferredName: 'Ars Nouveau: Ars Creo (Create)'
    },
    {
        modId: 'ars_elemental',
        modPreferredName: 'Ars Nouveau: Ars Elemental'
    },
    {
        modId: 'ars_instrumentum',
        modPreferredName: 'Ars Nouveau: Ars Instrumentum'
    },
    {
        modId: 'arsomega',
        modPreferredName: 'Ars Nouveau: Ars Omega'
    },
    {
        modId: 'ars_scalaes',
        modPreferredName: 'Ars Nouveau: Ars Scalaes'
    },
    {
        modId: 'starbunclemania',
        modPreferredName: 'Ars Nouveau: Starbuncle Mania'
    },
    {
        modId: 'toomanyglyphs',
        modPreferredName: 'Ars Nouveau: Too Many Glyphs'
    },
    {
        modId: 'awesomedungeon',
        modPreferredName: 'Awesome Dungeon'
    },
    {
        modId: 'awesomedungeonnether',
        modPreferredName: 'Awesome Dungeon Nether Edition'
    },
    {
        modId: 'awesomedungeonocean',
        modPreferredName: 'Awesome Dungeon Ocean Edition'
    },
    {
        modId: 'awesomedungeonend',
        modPreferredName: 'Awesome Dungeon The End Edition'
    },
    {
        modId: 'bagus_lib',
        modPreferredName: 'Bagus Lib'
    },
    {
        modId: 'bintfar',
        modPreferredName: 'Bed Is Not Too Far Away'
    },
    {
        modId: 'better_beacons',
        modPreferredName: 'Better Beacons'
    },
    {
        modId: 'betterfpsdist',
        modPreferredName: 'Better FPS - Render Distance'
    },
    {
        modId: 'treasuredistance',
        modPreferredName: 'Better Treasure Map'
    },
    {
        modId: 'biomemusic',
        modPreferredName: 'Biome Music'
    },
    {
        modId: 'blockui',
        modPreferredName: 'BlockUI Library'
    },
    {
        modId: 'brutalbosses',
        modPreferredName: 'Brutal Bosses - Custom Bosses'
    },
    {
        modId: 'buildersaddition',
        modPreferredName: 'Builders Crafts & Additions'
    },
    {
        modId: 'cataclysm',
        modPreferredName: 'Cataclysm'
    },
    {
        modId: 'chunksending',
        modPreferredName: 'Chunk Sending'
    },
    {
        modId: 'clickadv',
        modPreferredName: 'Clickable Advancements'
    },
    {
        modId: 'computercraft',
        modPreferredName: 'ComputerCraft'
    },
    {
        modId: 'advancedperipherals',
        modPreferredName: 'ComputerCraft: Advanced Peripherals'
    },
    {
        modId: 'cccbridge',
        modPreferredName: 'ComputerCraft: Create Compat'
    },
    {
        modId: 'connectivity',
        modPreferredName: 'Connectivity'
    },
    {
        modId: 'constructionwand',
        modPreferredName: 'Construction Wands'
    },
    {
        modId: 'createbigcannons',
        modPreferredName: 'Create: Big Cannons'
    },
    {
        modId: 'createcafe',
        modPreferredName: 'Create: Cafe'
    },
    {
        modId: 'nocubescreateexp',
        modPreferredName: 'Create: Compact Experience'
    },
    {
        modId: 'createaddition',
        modPreferredName: 'Create: Crafts & Additions'
    },
    {
        modId: 'davebuildingmod',
        modPreferredName: "Create: Dave's Building Extended"
    },
    {
        modId: 'createdieselgenerators',
        modPreferredName: 'Create: Diesel Generators'
    },
    {
        modId: 'createcasing',
        modPreferredName: 'Create: Encased'
    },
    {
        modId: 'create_enchantment_industry',
        modPreferredName: 'Create: Enchantment Industry'
    },
    {
        modId: 'garnished',
        modPreferredName: 'Create: Garnished'
    },
    {
        modId: 'creategoggles',
        modPreferredName: 'Create: Goggles'
    },
    {
        modId: 'liquidburner',
        modPreferredName: 'Create: Liquid Burner'
    },
    {
        modId: 'create_crush_everything',
        modPreferredName: 'Create: Recycle Everything'
    },
    {
        modId: 'create_sabers',
        modPreferredName: 'Create: Sabers'
    },
    {
        modId: 'createindustry',
        modPreferredName: 'Create: The Factory Must Grow'
    },
    {
        modId: 'culllessleaves',
        modPreferredName: 'Cull Less Leaves'
    },
    {
        modId: 'cupboard',
        modPreferredName: 'Cupboard'
    },
    {
        modId: 'darkpaintings',
        modPreferredName: 'Dark Paintings'
    },
    {
        modId: 'darkutils',
        modPreferredName: 'Dark Utilities'
    },
    {
        modId: 'drawerfps',
        modPreferredName: 'DrawerFPS'
    },
    {
        modId: 'dtbop',
        modPreferredName: "Dynamic Trees - Biomes O' Plenty"
    },
    {
        modId: 'dtquark',
        modPreferredName: 'Dynamic Trees - Quark'
    },
    {
        modId: 'earthmobsmod',
        modPreferredName: 'Earth Mobs'
    },
    {
        modId: 'enchantwithmob',
        modPreferredName: 'Enchant With Mob'
    },
    {
        modId: 'enchdesc',
        modPreferredName: 'Enchantment Descriptions'
    },
    {
        modId: 'endlessbiomes',
        modPreferredName: 'Endless Biomes'
    },
    {
        modId: 'entityculling',
        modPreferredName: 'Entity Culling'
    },
    {
        modId: 'abnormals_delight',
        modPreferredName: "Farmer's Delight: Abnormals Delight"
    },
    {
        modId: 'aetherdelight',
        modPreferredName: "Farmer's Delight: Aether Delight"
    },
    {
        modId: 'alexsdelight',
        modPreferredName: "Farmer's Delight: Alex's Delight"
    },
    {
        modId: 'brewinandchewin',
        modPreferredName: "Farmer's Delight: Brewin' And Chewin'"
    },
    {
        modId: 'cataclysm_delight',
        modPreferredName: "Farmer's Delight: Cataclysm Delight"
    },
    {
        modId: 'collectorsreap',
        modPreferredName: "Farmer's Delight: Collector's Reap"
    },
    {
        modId: 'culturaldelights',
        modPreferredName: "Farmer's Delight: Cultural Delight"
    },
    {
        modId: 'delightful',
        modPreferredName: "Farmer's Delight: Delightful"
    },
    {
        modId: 'endersdelight',
        modPreferredName: "Farmer's Delight: Ender's Delight"
    },
    {
        modId: 'ends_delight',
        modPreferredName: "Farmer's Delight: End's Delight"
    },
    {
        modId: 'farmersrespite',
        modPreferredName: "Farmer's Delight: Farmer's Respite"
    },
    {
        modId: 'miners_delight',
        modPreferredName: "Farmer's Delight: Miner's Delight"
    },
    {
        modId: 'nethersdelight',
        modPreferredName: "Farmer's Delight: Nether's Delight"
    },
    {
        modId: 'fastasyncworldsave',
        modPreferredName: 'Fast Async World Save'
    },
    {
        modId: 'create_questing',
        modPreferredName: 'FTB Quests: Create Questing'
    },
    {
        modId: 'gpumemleakfix',
        modPreferredName: 'GPU Memory Leak Fix'
    },
    {
        modId: 'hunterillager',
        modPreferredName: "Hunter's Return"
    },
    {
        modId: 'incontrol',
        modPreferredName: 'In Control!'
    },
    {
        modId: 'metalbarrels',
        modPreferredName: 'Iron Barrels'
    },
    {
        modId: 'tieredshulkers',
        modPreferredName: 'Iron Shulker Boxes'
    },
    {
        modId: 'just_enough_beacons',
        modPreferredName: 'Just Enough Beacons'
    },
    {
        modId: 'justenoughprofessions',
        modPreferredName: 'Just Enough Professions'
    },
    {
        modId: 'kubejsadditions',
        modPreferredName: 'KubeJS: Additions'
    },
    {
        modId: 'kubejs_create',
        modPreferredName: 'KubeJS: Create'
    },
    {
        modId: 'kubejs_immersive_engineering',
        modPreferredName: 'KubeJS: Immersive Engineering'
    },
    {
        modId: 'lootjs',
        modPreferredName: 'KubeJS: LootJS'
    },
    {
        modId: 'morejs',
        modPreferredName: 'KubeJS: MoreJS'
    },
    {
        modId: 'kubejsprojecte',
        modPreferredName: 'KubeJS: ProjectE'
    },
    {
        modId: 'leaky',
        modPreferredName: 'Leaky - Farm Leak Detection'
    },
    {
        modId: 'lootintegrations',
        modPreferredName: 'Loot Integrations'
    },
    {
        modId: 'macawsbridgesbop',
        modPreferredName: "Macaw's Bridges - Biomes O' Plenty"
    },
    {
        modId: 'macawsbridgesbyg',
        modPreferredName: "Macaw's Bridges - Oh The Biomes You'll Go"
    },
    {
        modId: 'mcwfurnituresbop',
        modPreferredName: "Macaw's Furniture - Biomes O' Plenty"
    },
    {
        modId: 'mcwfurnituresbyg',
        modPreferredName: "Macaw's Furniture - Oh The Biomes You'll Go"
    },
    {
        modId: 'macawsroofsbop',
        modPreferredName: "Macaw's Roofs - Biomes O' Plenty"
    },
    {
        modId: 'macawsroofsbyg',
        modPreferredName: "Macaw's Roofs - Oh The Biomes You'll Go"
    },
    {
        modId: 'stylecolonies',
        modPreferredName: 'MineColonies: StyleColonies'
    },
    {
        modId: 'towntalk',
        modPreferredName: 'MineColonies: TownTalk'
    },
    {
        modId: 'cfm',
        modPreferredName: "MrCrayfish's Furniture"
    },
    {
        modId: 'cgm',
        modPreferredName: "MrCrayfish's Guns"
    },
    {
        modId: 'additionalguns',
        modPreferredName: "MrCrayfish's Guns: Additional Guns"
    },
    {
        modId: 'alloyedguns',
        modPreferredName: "MrCrayfish's Guns: Alloyed Guns (Create)"
    },
    {
        modId: 'peculiars',
        modPreferredName: 'Neapolitan: Peculiars'
    },
    {
        modId: 'respiteful',
        modPreferredName: 'Neapolitan: Respiteful'
    },
    {
        modId: 'seasonals',
        modPreferredName: 'Neapolitan: Seasonals'
    },
    {
        modId: 'notenoughanimations',
        modPreferredName: 'Not Enough Animations'
    },
    {
        modId: 'elevatorid',
        modPreferredName: 'OpenBlocks Elevator'
    },
    {
        modId: 'pneumaticcraft',
        modPreferredName: 'PneumaticCraft'
    },
    {
        modId: 'polyeng',
        modPreferredName: 'Polymorph: Applied Energistics 2'
    },
    {
        modId: 'refinedpolymorph',
        modPreferredName: 'Polymorph: Refined Storage'
    },
    {
        modId: 'equivadds',
        modPreferredName: 'ProjectE: Equivalent Additions'
    },
    {
        modId: 'expequiv',
        modPreferredName: 'ProjectE: Expanded Equivalence'
    },
    {
        modId: 'refinedstorageaddons',
        modPreferredName: 'Refined Storage: Add-ons'
    },
    {
        modId: 'rsrequestify',
        modPreferredName: 'Refined Storage: Requestify'
    },
    {
        modId: 'revampedwolf',
        modPreferredName: 'Revamped Wolf'
    },
    {
        modId: 'dragonfight',
        modPreferredName: 'Savage Ender Dragon'
    },
    {
        modId: 'servertick',
        modPreferredName: 'Server Tick'
    },
    {
        modId: 'smoothchunk',
        modPreferredName: 'Smooth Chunk Save'
    },
    {
        modId: 'spark',
        modPreferredName: 'Spark'
    },
    {
        modId: 'framedcompactdrawers',
        modPreferredName: 'Storage Drawers: Framed Compacting Drawers'
    },
    {
        modId: 'functionalstorage',
        modPreferredName: 'Storage Drawers: Functional Storage'
    },
    {
        modId: 'functional_storage_extra',
        modPreferredName: 'Storage Drawers: Functional Storage Extra'
    },
    {
        modId: 'structureessentials',
        modPreferredName: 'Structure Essentials'
    },
    {
        modId: 'deep_aether',
        modPreferredName: 'The Aether: Deep Aether'
    },
    {
        modId: 'aether_enhanced_extinguishing',
        modPreferredName: 'The Aether: Enhanced Extinguishing'
    },
    {
        modId: 'tflostblocks',
        modPreferredName: 'The Twilight Forest: Lost Blocks'
    },
    {
        modId: 'upgradednetherite_items',
        modPreferredName: 'Upgraded Netherite: Items'
    },
    {
        modId: 'upgradednetherite_ultimate',
        modPreferredName: 'Upgraded Netherite: Ultimerite'
    },
    {
        modId: 'useless_sword',
        modPreferredName: 'Useless Swords'
    },
    {
        modId: 'w2w2',
        modPreferredName: "Xaero's Map - Waystones Compat"
    }
];
