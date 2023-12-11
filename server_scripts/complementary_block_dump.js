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
    
   By adding modded blocks to block.properties, modded blocks get
   treated by the shader the same way vanilla blocks get treated.
*/

let blocks;

let allBlocks = Block.getTypeList();

const combineAndFormatBlocks = (blocksVanilla, blocksModdedFiltered, blocksModded) => {
    let blocksCombinedAndFormatted = '';

    blocksModdedFiltered.forEach((block) => blocksModded.push(block));

    blocksModded.sort().forEach((block) => (blocksCombinedAndFormatted += block.concat(' ')));

    blocksCombinedAndFormatted = blocksVanilla
        .concat(' ')
        .concat(blocksCombinedAndFormatted)
        .slice(0, blocksVanilla.length + blocksCombinedAndFormatted.length);

    return { moddedBlocks: blocksModded, combinedAndFormattedBlocks: blocksCombinedAndFormatted };
};

const printBlocksForShader = (moddedBlocks, combinedAndFormattedBlocks, blockType, shaderBlockId, isModdedBlockOnly) =>
    console.log(
        `\n\nFiltered out ${moddedBlocks.length} modded ${blockType} blocks. ${
            !isModdedBlockOnly ? `Merged vanilla and modded ${blockType} blocks. ` : ''
        }Please add these to block.${shaderBlockId} in block.properties from Complementary Reimagined.\n\n${combinedAndFormattedBlocks}\n`
    );

/*
   FOLIAGE
*/
// TODO: kelp, seagrass en vine en vines apart
// TODO: some need to get removed from here and put on another more dedicated blockId!
// prettier-ignore
const foliage = [
    'allium', 'amaranth', 'bird_of_paradise', 'bluebell', 'bluet', 'brush', 'bush', 'cartwheel', 'cattail', 'cattails', 'cosmos', 'crop', 'crops', 'crocus', 'bulbis_anomaly', 'bulbis_oddity', 'daisy', 'dandelion', 'delphinium', 'dianthus', 'fern', 'fiddlehead', 'flower', 'flowers', 'frond', 'grass', 'hibiscus', 'mayapple', 'orchid', 'orchids', 'poppy', 'roots', 'rose', 'roses', 'rush', 'sapling', 'saplings', 'searocket', 'sprout', 'gilia', 'sprouts', 'stem', 'shrub', 'stems', 'tulip', 'tulips', 'violet', 'weed', 'weeds', 'wheat'
];
const foliageVanilla =
    'grass short_grass fern oak_sapling spruce_sapling birch_sapling jungle_sapling acacia_sapling dark_oak_sapling bamboo_sapling cherry_sapling dead_bush dandelion poppy blue_orchid allium azure_bluet red_tulip orange_tulip white_tulip pink_tulip oxeye_daisy cornflower lily_of_the_valley wither_rose sweet_berry_bush wheat carrots potatoes beetroots pumpkin_stem melon_stem nether_sprouts warped_roots crimson_roots sunflower:half=lower lilac:half=lower rose_bush:half=lower peony:half=lower tall_grass:half=lower large_fern:half=lower torchflower_crop';
const foliageModdedFiltered = allBlocks.filter(
    (block) =>
        !block.startsWith('minecraft:') &&
        !block.startsWith('dtterralith:') &&
        !block.includes('potted') &&
        !block.includes('hanging_sign') &&
        !block.includes('music_disc') &&
        !block.includes('seagrass') &&
        !block.includes('wonderful_wheat') &&
        (foliage.some((f) => block.endsWith(f)) || block.includes('wild_'))
);

/* INFO: Add other blocks that should be treated as foliage to the moddedBlocks array */
blocks = combineAndFormatBlocks(foliageVanilla, foliageModdedFiltered, []);

printBlocksForShader(blocks.moddedBlocks, blocks.combinedAndFormattedBlocks, 'foliage', '10004');
/* 
   NOTE: This is the same as above, but with a different syntax.
         .some() can be used to avoid repetitive code
*/
/* console.log(
    allBlocks.filter(
        (block) =>
            !block.startsWith('minecraft:') &&
            !block.startsWith('dtterralith:') &&
            (block.endsWith('bush') ||
                block.endsWith('grass') ||
                block.endsWith('sapling') ||
                block.endsWith('vine') ||
                block.endsWith...
    )
); */

/*
   LEAVES
*/
const leavesVanilla =
    'leaves leaves2 oak_leaves spruce_leaves birch_leaves jungle_leaves acacia_leaves dark_oak_leaves azalea_leaves flowering_azalea_leaves mangrove_leaves cherry_leaves';
const leavesModdedFiltered = allBlocks.filter(
    (block) =>
        !block.startsWith('minecraft:') &&
        !block.startsWith('dtterralith:') &&
        !block.includes('tea_leaves') &&
        block.endsWith('leaves')
);

/* INFO: Add other blocks that should be treated as leaves to the moddedBlocks array */
blocks = combineAndFormatBlocks(leavesVanilla, leavesModdedFiltered, []);

printBlocksForShader(blocks.moddedBlocks, blocks.combinedAndFormattedBlocks, 'leaves', '10008');

/*
   (MODDED) ORES
*/
const oresModdedFiltered = allBlocks.filter(
    (block) => !block.startsWith('minecraft:') && !block.includes('coal') && block.endsWith('_ore')
);
/* INFO: Add other blocks that should be treated as ores to the moddedBlocks array */
const oresModded = ['infernalexp:dimstone'];
oresModdedFiltered.forEach((o) => oresModded.push(o));
let oresFormatted = '';
oresModded.sort().forEach((o) => (oresFormatted += o.concat(' ')));
oresFormatted = oresFormatted.slice(0, oresFormatted.length - 1);

printBlocksForShader(oresModded, oresFormatted, 'ore', '10024', true);

/*
   IRON BLOCKS
*/
/* TODO: add all dark iron blocks like cast iron, industrial iron,
   dark iron, compressed iron, etc to correct blockId (netherite? coal?) */
/* NOTE: twilightforest:ironwood_block get's darkened but still looks good,
   still don't know if this block should stay added or get removed.
   
   additional_lights iron blocks work, but torch for example get darkened a bit
   
   Add additionallanterns ? */
const ironBlocksVanilla = 'iron_block iron_trapdoor heavy_weighted_pressure_plate';
const ironBlocksModdedFiltered = allBlocks.filter((block) =>
    RegExp(
        /^(?!minecraft).*:(?!.*(cast|compressed|dark|industrial|rough)).*iron.*(block|fence|nub).*(?!(cast|compressed|dark|industrial|rough))$/
    ).test(block)
);

/* INFO: Add other blocks that should be treated as iron blocks to the moddedBlocks array */
blocks = combineAndFormatBlocks(ironBlocksVanilla, ironBlocksModdedFiltered, [
    'buildersaddition:iron_ladder',
    'ironbookshelves:iron_bookshelf',
    'ironfurnaces:iron_furnace'
]);

printBlocksForShader(blocks.moddedBlocks, blocks.combinedAndFormattedBlocks, 'iron block', '10264');

/*
   STAINED GLASS
*/
const stainedGlassVanilla =
    'stained_glass white_stained_glass orange_stained_glass magenta_stained_glass light_blue_stained_glass yellow_stained_glass lime_stained_glass pink_stained_glass gray_stained_glass light_gray_stained_glass cyan_stained_glass purple_stained_glass blue_stained_glass brown_stained_glass green_stained_glass red_stained_glass black_stained_glass';
// TODO fix and add conditions (Connected Glass' stained glass does not have stained in the blockId!)
const stainedGlassModdedFiltered = allBlocks.filter(
    (block) => !block.includes('minecraft:') && block.includes('connectedglass:')
    // block.endsWith('stained_glass')
    // || block.endsWith('')
);

/* INFO: Add other blocks that should be treated as stained glass to the moddedBlocks array */
blocks = combineAndFormatBlocks(stainedGlassVanilla, stainedGlassModdedFiltered, []);

printBlocksForShader(blocks.moddedBlocks, blocks.combinedAndFormattedBlocks, 'stained glass', '30000');
