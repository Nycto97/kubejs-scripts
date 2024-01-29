/*
   Copyright (c) 2023, Jelle Van Goethem
   All rights reserved.
 
   This source code is licensed under the BSD-style license found in the
   LICENSE file in the root directory of this source tree.
*/

/* 
   INFO:
   KubeJS cannot make stack sizes bigger than 64, but can still be
   used to make unstackable items stackable and to increase stack
   sizes of items that have a default max stack size smaller than 64.
*/

/* 
   NOTE:
   Tags are currently unsupported.
*/

// TODO find out if vanilla items can be used without adding minecraft: prefix
// TODO add all signs to 32 or 64 stacksize group (RegEx?)

/* Modify items */
ItemEvents.modification((event) => {
    const maxStackSize5 = ['minecraft:enchanted_book'],
        maxStackSize10 = [
            'minecraft:potion',
            'minecraft:splash_potion',
            'minecraft:lingering_potion',
            'minecraft:minecart',
            'minecraft:white_bed',
            'minecraft:orange_bed',
            'minecraft:magenta_bed',
            'minecraft:light_blue_bed',
            'minecraft:yellow_bed',
            'minecraft:lime_bed',
            'minecraft:pink_bed',
            'minecraft:gray_bed',
            'minecraft:light_gray_bed',
            'minecraft:cyan_bed',
            'minecraft:purple_bed',
            'minecraft:blue_bed',
            'minecraft:brown_bed',
            'minecraft:green_bed',
            'minecraft:red_bed',
            'minecraft:black_bed'
        ],
        maxStackSize50 = [],
        maxStackSize64 = ['minecraft:egg', 'minecraft:bucket', 'minecraft:ender_pearl'];

    isLoaded('cgm') && maxStackSize50.push('cgm:missile', 'cgm:grenade');

    maxStackSize5.forEach((item) => event.modify(item, (i) => (i.maxStackSize = 5)));

    maxStackSize10.forEach((item) => event.modify(item, (i) => (i.maxStackSize = 10)));

    maxStackSize50.forEach((item) => event.modify(item, (i) => (i.maxStackSize = 50)));

    maxStackSize64.forEach((item) => event.modify(item, (i) => (i.maxStackSize = 64)));
});
