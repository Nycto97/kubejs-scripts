/*
   Copyright (c) 2023, Jelle Van Goethem
   All rights reserved.
 
   This source code is licensed under the BSD-style license found in the
   LICENSE file in the root directory of this source tree.
*/

/* 
   INFO:
   This file will spit out certain modded blocks to add
   to block.properties from Complementary Reimagined.
   https://modrinth.com/shader/complementary-reimagined
    
   By adding modded blocks to block.properties, modded blocks get
   treated by the shader the same way vanilla blocks get treated,
   essentially making the shader compatible with modded blocks.
*/

/* 
   ATTENTION:
   Always transfer over ALL added data from block.properties to
   new block.properties when updating shader! Not only data
   generated by this script, but also data added manually!
*/

// priority: 1

if (Platform.isClientEnvironment()) {
    if (global.logShaderBlockIdDump) {
        let blockIds;

        const combineAndFormatBlockIds = (vanillaBlockIds, moddedBlockIdsFiltered, moddedBlockIds) => {
            let combinedAndFormattedBlockIdsStr = '';

            moddedBlockIdsFiltered.forEach((blockId) => moddedBlockIds.push(blockId));

            moddedBlockIds.sort().forEach((blockId) => (combinedAndFormattedBlockIdsStr += blockId.concat(' ')));

            combinedAndFormattedBlockIdsStr = vanillaBlockIds
                .concat(' ')
                .concat(combinedAndFormattedBlockIdsStr)
                .slice(0, vanillaBlockIds.length + combinedAndFormattedBlockIdsStr.length);

            return { moddedBlockIds: moddedBlockIds, combinedAndFormattedBlockIdsStr: combinedAndFormattedBlockIdsStr };
        };

        const printBlockIdsForShader = (
            moddedBlockIds,
            combinedAndFormattedBlockIdsStr,
            blockType,
            shaderBlockId,
            isModdedBlockIdsOnly
        ) =>
            console.log(
                `\n\nFiltered out ${moddedBlockIds.length} modded ${blockType} block ids. ${
                    !isModdedBlockIdsOnly ? `Merged vanilla and modded ${blockType} block ids. ` : ''
                }Please add these to block.${shaderBlockId} in block.properties from Complementary Reimagined.\n\n${combinedAndFormattedBlockIdsStr}\n`
            );

        /*
           FOLIAGE
        */

        // TODO: kelp, seagrass en vine en vines apart
        // TODO: some need to get removed from here and put on another more dedicated block id!
        // prettier-ignore
        const foliage = [
            'allium', 'amaranth', 'bird_of_paradise', 'bluebell', 'bluet', 'brush', 'bush', 'cartwheel', 'cattail', 'cattails', 'cosmos', 'crop', 'crops', 'crocus', 'bulbis_anomaly', 'bulbis_oddity', 'daisy', 'dandelion', 'delphinium', 'dianthus', 'fern', 'fiddlehead', 'flower', 'flowers', 'frond', 'grass', 'hibiscus', 'mayapple', 'orchid', 'orchids', 'poppy', 'roots', 'rose', 'roses', 'rush', 'sapling', 'saplings', 'searocket', 'sprout', 'gilia', 'sprouts', 'stem', 'shrub', 'stems', 'tulip', 'tulips', 'violet', 'weed', 'weeds', 'wheat'
];
        const vanillaFoliageBlockIds =
            'grass short_grass fern oak_sapling spruce_sapling birch_sapling jungle_sapling acacia_sapling dark_oak_sapling bamboo_sapling cherry_sapling dead_bush dandelion poppy blue_orchid allium azure_bluet red_tulip orange_tulip white_tulip pink_tulip oxeye_daisy cornflower lily_of_the_valley wither_rose sweet_berry_bush wheat carrots potatoes beetroots pumpkin_stem melon_stem nether_sprouts warped_roots crimson_roots sunflower:half=lower lilac:half=lower rose_bush:half=lower peony:half=lower tall_grass:half=lower large_fern:half=lower torchflower_crop';
        const moddedFoliageBlockIdsFiltered = global.allBlockIds.filter(
            (blockId) =>
                !blockId.startsWith('minecraft:') &&
                !blockId.startsWith('dtterralith:') &&
                !blockId.includes('potted') &&
                !blockId.includes('hanging_sign') &&
                !blockId.includes('music_disc') &&
                !blockId.includes('seagrass') &&
                !blockId.includes('wonderful_wheat') &&
                (foliage.some((f) => blockId.endsWith(f)) || blockId.includes('wild_'))
        );

        /* INFO: Add other block ids that should be treated as foliage to the array */
        blockIds = combineAndFormatBlockIds(vanillaFoliageBlockIds, moddedFoliageBlockIdsFiltered, []);

        printBlockIdsForShader(blockIds.moddedBlockIds, blockIds.combinedAndFormattedBlockIdsStr, 'foliage', '10004');

        /*
           LEAVES
        */

        const vanillaLeavesBlockIds =
            'leaves leaves2 oak_leaves spruce_leaves birch_leaves jungle_leaves acacia_leaves dark_oak_leaves azalea_leaves flowering_azalea_leaves mangrove_leaves cherry_leaves';
        const moddedLeavesBlockIdsFiltered = global.allBlockIds.filter(
            (blockId) =>
                !blockId.startsWith('minecraft:') &&
                !blockId.startsWith('dtterralith:') &&
                !blockId.includes('tea_leaves') &&
                blockId.endsWith('leaves')
        );

        /* INFO: Add other block ids that should be treated as leaves to the array */
        blockIds = combineAndFormatBlockIds(vanillaLeavesBlockIds, moddedLeavesBlockIdsFiltered, []);

        printBlockIdsForShader(blockIds.moddedBlockIds, blockIds.combinedAndFormattedBlockIdsStr, 'leaves', '10008');

        /*
           (MODDED) ORES
        */

        const moddedOreBlockIdsFiltered = global.allBlockIds.filter(
            (block) =>
                !block.startsWith('minecraft:') &&
                !block.startsWith('forbidden_arcanus:') &&
                !block.includes('coal') &&
                block.endsWith('_ore')
        );
        /* INFO: Add other block ids that should be treated as ores to the array */
        const moddedOreBlockIds = ['infernalexp:dimstone'];
        moddedOreBlockIdsFiltered.forEach((blockId) => moddedOreBlockIds.push(blockId));
        let formattedOreBlockIds = '';
        moddedOreBlockIds.sort().forEach((blockId) => (formattedOreBlockIds += blockId.concat(' ')));
        formattedOreBlockIds = formattedOreBlockIds.slice(0, formattedOreBlockIds.length - 1);

        printBlockIdsForShader(moddedOreBlockIds, formattedOreBlockIds, 'ore', '10024', true);

        /*
           IRON
        */

        /* TODO: add all dark iron block ids like cast iron, industrial iron,
           dark iron, compressed iron, etc to correct blockId (netherite? coal?) */

        /* 
           NOTE: twilightforest:ironwood_block gets darkened but still looks good,
           still don't know if this block id should stay added or get removed.
   
           additional_lights iron blocks work, but torch for example get darkened a bit
   
           Add additionallanterns ?
        */

        // TODO look in JEI which block ids to add here
        const vanillaIronBlockIds = 'iron_block iron_trapdoor heavy_weighted_pressure_plate';
        const moddedIronBlockIdsFiltered = global.allBlockIds.filter((blockId) =>
            RegExp(
                /^(?!minecraft).*:(?!.*(cast|compressed|dark|industrial|rough)).*iron.*(block|fence|nub).*(?!(cast|compressed|dark|industrial|rough))$/
            ).test(blockId)
        );

        /* INFO: Add other block ids that should be treated as iron blocks to the array */
        blockIds = combineAndFormatBlockIds(vanillaIronBlockIds, moddedIronBlockIdsFiltered, [
            'buildersaddition:iron_ladder',
            'ironbookshelves:iron_bookshelf',
            'ironfurnaces:iron_furnace'
        ]);

        printBlockIdsForShader(
            blockIds.moddedBlockIds,
            blockIds.combinedAndFormattedBlockIdsStr,
            'iron block',
            '10264'
        );

        // TODO add modded normal glass block ids, add Easy Villagers and Easy Piglins glass block ids as well

        /*
           STAINED GLASS
        */

        const vanillaStainedGlassBlockIds =
            'stained_glass white_stained_glass orange_stained_glass magenta_stained_glass light_blue_stained_glass yellow_stained_glass lime_stained_glass pink_stained_glass gray_stained_glass light_gray_stained_glass cyan_stained_glass purple_stained_glass blue_stained_glass brown_stained_glass green_stained_glass red_stained_glass black_stained_glass';
        // TODO add other stained glass block ids to array
        // INFO: Connected Glass' stained glass blocks does not have 'stained' in the block id!
        // Include tinted glass?
        const moddedStainedGlassBlockIdsFiltered = global.allBlockIds.filter(
            (blockId) =>
                !blockId.startsWith('minecraft:') &&
                !blockId.includes('pane') &&
                !blockId.includes('tinted') &&
                (blockId.endsWith('stained_glass') ||
                    blockId.startsWith('connectedglass:borderless_glass_') ||
                    blockId.startsWith('connectedglass:clear_glass_') ||
                    blockId.startsWith('connectedglass:scratched_glass_'))
        );

        /* INFO: Add other block ids that should be treated as stained glass to the array */
        blockIds = combineAndFormatBlockIds(vanillaStainedGlassBlockIds, moddedStainedGlassBlockIdsFiltered, []);

        printBlockIdsForShader(
            blockIds.moddedBlockIds,
            blockIds.combinedAndFormattedBlockIdsStr,
            'stained glass',
            '30000'
        );
    } else {
        console.log('Dumping for Complementary Shader disabled!');
        console.log("Set 'logShaderBlockIdDump = true' in settings.js to enable!");
    }
}
