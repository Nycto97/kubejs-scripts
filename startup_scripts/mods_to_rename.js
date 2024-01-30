/*
   Copyright (c) 2023, Jelle Van Goethem
   All rights reserved.
 
   This source code is licensed under the BSD-style license found in the
   LICENSE file in the root directory of this source tree.
*/

// priority: 1001

const modsToRename = [
    {
        id: 'ad_astra_giselle_addon',
        preferredName: 'Ad Astra: Giselle Add-on'
    },
    {
        id: 'alexsabnormalities',
        preferredName: "Alex's Mobs: Abnormalities"
    },
    {
        id: 'animatica',
        preferredName: 'Animatica'
    },
    {
        id: 'arseng',
        preferredName: 'Applied Energistics 2: Ars Énergistique (Ars Nouveau)'
    },
    {
        id: 'merequester',
        preferredName: 'Applied Energistics 2: ME Requester'
    },
    {
        id: 'ae2things',
        preferredName: 'Applied Energistics 2: Things'
    },
    {
        id: 'ars_creo',
        preferredName: 'Ars Nouveau: Ars Creo (Create)'
    },
    {
        id: 'ars_elemental',
        preferredName: 'Ars Nouveau: Ars Elemental'
    },
    {
        id: 'ars_instrumentum',
        preferredName: 'Ars Nouveau: Ars Instrumentum'
    },
    {
        id: 'arsomega',
        preferredName: 'Ars Nouveau: Ars Omega'
    },
    {
        id: 'ars_scalaes',
        preferredName: 'Ars Nouveau: Ars Scalaes'
    },
    {
        id: 'starbunclemania',
        preferredName: 'Ars Nouveau: Starbuncle Mania'
    },
    {
        id: 'toomanyglyphs',
        preferredName: 'Ars Nouveau: Too Many Glyphs'
    },
    {
        id: 'awesomedungeon',
        preferredName: 'Awesome Dungeon'
    },
    {
        id: 'awesomedungeonnether',
        preferredName: 'Awesome Dungeon Nether Edition'
    },
    {
        id: 'awesomedungeonocean',
        preferredName: 'Awesome Dungeon Ocean Edition'
    },
    {
        id: 'awesomedungeonend',
        preferredName: 'Awesome Dungeon The End Edition'
    },
    {
        id: 'bagus_lib',
        preferredName: 'Bagus Lib'
    },
    {
        id: 'bintfar',
        preferredName: 'Bed Is Not Too Far Away'
    },
    {
        id: 'better_beacons',
        preferredName: 'Better Beacons'
    },
    {
        id: 'betterfpsdist',
        preferredName: 'Better FPS - Render Distance'
    },
    {
        id: 'treasuredistance',
        preferredName: 'Better Treasure Map'
    },
    {
        id: 'biomemusic',
        preferredName: 'Biome Music'
    },
    {
        id: 'blockui',
        preferredName: 'BlockUI Library'
    },
    {
        id: 'brutalbosses',
        preferredName: 'Brutal Bosses - Custom Bosses'
    },
    {
        id: 'buildersaddition',
        preferredName: 'Builders Crafts & Additions'
    },
    {
        id: 'cataclysm',
        preferredName: 'Cataclysm'
    },
    {
        id: 'chunksending',
        preferredName: 'Chunk Sending'
    },
    {
        id: 'clickadv',
        preferredName: 'Clickable Advancements'
    },
    {
        id: 'computercraft',
        preferredName: 'ComputerCraft'
    },
    {
        id: 'advancedperipherals',
        preferredName: 'ComputerCraft: Advanced Peripherals'
    },
    {
        id: 'cccbridge',
        preferredName: 'ComputerCraft: Create Compat'
    },
    {
        id: 'connectivity',
        preferredName: 'Connectivity'
    },
    {
        id: 'constructionwand',
        preferredName: 'Construction Wands'
    },
    {
        id: 'createbigcannons',
        preferredName: 'Create: Big Cannons'
    },
    {
        id: 'createcafe',
        preferredName: 'Create: Cafe'
    },
    {
        id: 'nocubescreateexp',
        preferredName: 'Create: Compact Experience'
    },
    {
        id: 'createaddition',
        preferredName: 'Create: Crafts & Additions'
    },
    {
        id: 'davebuildingmod',
        preferredName: "Create: Dave's Building Extended"
    },
    {
        id: 'createdieselgenerators',
        preferredName: 'Create: Diesel Generators'
    },
    {
        id: 'createcasing',
        preferredName: 'Create: Encased'
    },
    {
        id: 'create_enchantment_industry',
        preferredName: 'Create: Enchantment Industry'
    },
    {
        id: 'garnished',
        preferredName: 'Create: Garnished'
    },
    {
        id: 'creategoggles',
        preferredName: 'Create: Goggles'
    },
    {
        id: 'liquidburner',
        preferredName: 'Create: Liquid Burner'
    },
    {
        id: 'create_crush_everything',
        preferredName: 'Create: Recycle Everything'
    },
    {
        id: 'create_sabers',
        preferredName: 'Create: Sabers'
    },
    {
        id: 'createindustry',
        preferredName: 'Create: The Factory Must Grow'
    },
    {
        id: 'culllessleaves',
        preferredName: 'Cull Less Leaves'
    },
    {
        id: 'cupboard',
        preferredName: 'Cupboard'
    },
    {
        id: 'darkpaintings',
        preferredName: 'Dark Paintings'
    },
    {
        id: 'darkutils',
        preferredName: 'Dark Utilities'
    },
    {
        id: 'drawerfps',
        preferredName: 'DrawerFPS'
    },
    {
        id: 'dtbop',
        preferredName: "Dynamic Trees - Biomes O' Plenty"
    },
    {
        id: 'dtquark',
        preferredName: 'Dynamic Trees - Quark'
    },
    {
        id: 'earthmobsmod',
        preferredName: 'Earth Mobs'
    },
    {
        id: 'enchantwithmob',
        preferredName: 'Enchant With Mob'
    },
    {
        id: 'enchdesc',
        preferredName: 'Enchantment Descriptions'
    },
    {
        id: 'endlessbiomes',
        preferredName: 'Endless Biomes'
    },
    {
        id: 'entityculling',
        preferredName: 'Entity Culling'
    },
    {
        id: 'abnormals_delight',
        preferredName: "Farmer's Delight: Abnormals Delight"
    },
    {
        id: 'aetherdelight',
        preferredName: "Farmer's Delight: Aether Delight"
    },
    {
        id: 'alexsdelight',
        preferredName: "Farmer's Delight: Alex's Delight"
    },
    {
        id: 'brewinandchewin',
        preferredName: "Farmer's Delight: Brewin' And Chewin'"
    },
    {
        id: 'cataclysm_delight',
        preferredName: "Farmer's Delight: Cataclysm Delight"
    },
    {
        id: 'collectorsreap',
        preferredName: "Farmer's Delight: Collector's Reap"
    },
    {
        id: 'culturaldelights',
        preferredName: "Farmer's Delight: Cultural Delight"
    },
    {
        id: 'delightful',
        preferredName: "Farmer's Delight: Delightful"
    },
    {
        id: 'endersdelight',
        preferredName: "Farmer's Delight: Ender's Delight"
    },
    {
        id: 'ends_delight',
        preferredName: "Farmer's Delight: End's Delight"
    },
    {
        id: 'farmersrespite',
        preferredName: "Farmer's Delight: Farmer's Respite"
    },
    {
        id: 'miners_delight',
        preferredName: "Farmer's Delight: Miner's Delight"
    },
    {
        id: 'nethersdelight',
        preferredName: "Farmer's Delight: Nether's Delight"
    },
    {
        id: 'fastasyncworldsave',
        preferredName: 'Fast Async World Save'
    },
    {
        id: 'create_questing',
        preferredName: 'FTB Quests: Create Questing'
    },
    {
        id: 'gpumemleakfix',
        preferredName: 'GPU Memory Leak Fix'
    },
    {
        id: 'hunterillager',
        preferredName: "Hunter's Return"
    },
    {
        id: 'incontrol',
        preferredName: 'In Control!'
    },
    {
        id: 'metalbarrels',
        preferredName: 'Iron Barrels'
    },
    {
        id: 'tieredshulkers',
        preferredName: 'Iron Shulker Boxes'
    },
    {
        id: 'just_enough_beacons',
        preferredName: 'Just Enough Beacons'
    },
    {
        id: 'justenoughprofessions',
        preferredName: 'Just Enough Professions'
    },
    {
        id: 'kubejsadditions',
        preferredName: 'KubeJS: Additions'
    },
    {
        id: 'kubejs_create',
        preferredName: 'KubeJS: Create'
    },
    {
        id: 'kubejs_immersive_engineering',
        preferredName: 'KubeJS: Immersive Engineering'
    },
    {
        id: 'lootjs',
        preferredName: 'KubeJS: LootJS'
    },
    {
        id: 'morejs',
        preferredName: 'KubeJS: MoreJS'
    },
    {
        id: 'kubejsprojecte',
        preferredName: 'KubeJS: ProjectE'
    },
    {
        id: 'leaky',
        preferredName: 'Leaky - Farm Leak Detection'
    },
    {
        id: 'lootintegrations',
        preferredName: 'Loot Integrations'
    },
    {
        id: 'macawsbridgesbop',
        preferredName: "Macaw's Bridges - Biomes O' Plenty"
    },
    {
        id: 'macawsbridgesbyg',
        preferredName: "Macaw's Bridges - Oh The Biomes You'll Go"
    },
    {
        id: 'mcwfurnituresbop',
        preferredName: "Macaw's Furniture - Biomes O' Plenty"
    },
    {
        id: 'mcwfurnituresbyg',
        preferredName: "Macaw's Furniture - Oh The Biomes You'll Go"
    },
    {
        id: 'macawsroofsbop',
        preferredName: "Macaw's Roofs - Biomes O' Plenty"
    },
    {
        id: 'macawsroofsbyg',
        preferredName: "Macaw's Roofs - Oh The Biomes You'll Go"
    },
    {
        id: 'stylecolonies',
        preferredName: 'MineColonies: StyleColonies'
    },
    {
        id: 'towntalk',
        preferredName: 'MineColonies: TownTalk'
    },
    {
        id: 'cfm',
        preferredName: "MrCrayfish's Furniture"
    },
    {
        id: 'cgm',
        preferredName: "MrCrayfish's Guns"
    },
    {
        id: 'additionalguns',
        preferredName: "MrCrayfish's Guns: Additional Guns"
    },
    {
        id: 'alloyedguns',
        preferredName: "MrCrayfish's Guns: Alloyed Guns (Create)"
    },
    {
        id: 'peculiars',
        preferredName: 'Neapolitan: Peculiars'
    },
    {
        id: 'respiteful',
        preferredName: 'Neapolitan: Respiteful'
    },
    {
        id: 'seasonals',
        preferredName: 'Neapolitan: Seasonals'
    },
    {
        id: 'notenoughanimations',
        preferredName: 'Not Enough Animations'
    },
    {
        id: 'elevatorid',
        preferredName: 'OpenBlocks Elevator'
    },
    {
        id: 'pneumaticcraft',
        preferredName: 'PneumaticCraft'
    },
    {
        id: 'polyeng',
        preferredName: 'Polymorph: Applied Energistics 2'
    },
    {
        id: 'refinedpolymorph',
        preferredName: 'Polymorph: Refined Storage'
    },
    {
        id: 'equivadds',
        preferredName: 'ProjectE: Equivalent Additions'
    },
    {
        id: 'expequiv',
        preferredName: 'ProjectE: Expanded Equivalence'
    },
    {
        id: 'refinedstorageaddons',
        preferredName: 'Refined Storage: Add-ons'
    },
    {
        id: 'rsrequestify',
        preferredName: 'Refined Storage: Requestify'
    },
    {
        id: 'revampedwolf',
        preferredName: 'Revamped Wolf'
    },
    {
        id: 'dragonfight',
        preferredName: 'Savage Ender Dragon'
    },
    {
        id: 'servertick',
        preferredName: 'Server Tick'
    },
    {
        id: 'smoothchunk',
        preferredName: 'Smooth Chunk Save'
    },
    {
        id: 'spark',
        preferredName: 'Spark'
    },
    {
        id: 'framedcompactdrawers',
        preferredName: 'Storage Drawers: Framed Compacting Drawers'
    },
    {
        id: 'functionalstorage',
        preferredName: 'Storage Drawers: Functional Storage'
    },
    {
        id: 'functional_storage_extra',
        preferredName: 'Storage Drawers: Functional Storage Extra'
    },
    {
        id: 'structureessentials',
        preferredName: 'Structure Essentials'
    },
    {
        id: 'deep_aether',
        preferredName: 'The Aether: Deep Aether'
    },
    {
        id: 'aether_enhanced_extinguishing',
        preferredName: 'The Aether: Enhanced Extinguishing'
    },
    {
        id: 'tflostblocks',
        preferredName: 'The Twilight Forest: Lost Blocks'
    },
    {
        id: 'upgradednetherite_items',
        preferredName: 'Upgraded Netherite: Items'
    },
    {
        id: 'upgradednetherite_ultimate',
        preferredName: 'Upgraded Netherite: Ultimerite'
    },
    {
        id: 'useless_sword',
        preferredName: 'Useless Swords'
    },
    {
        id: 'w2w2',
        preferredName: "Xaero's Map - Waystones Compat"
    }
];
