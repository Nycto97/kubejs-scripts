/*
   Copyright (c) 2023, Jelle Van Goethem
   All rights reserved.
 
   This source code is licensed under the BSD-style license found in the
   LICENSE file in the root directory of this source tree.
*/

ServerEvents.tags('worldgen/biome', (event) => {
    /* Rotten Creatures */
    if (Platform.isLoaded('rottencreatures')) {
        event.add('rottencreatures:burned_whitelist', '#forge:is_hot/nether');
        if (Platform.isLoaded('byg')) {
            event.add('rottencreatures:burned_whitelist', ['byg:crimson_gardens', 'byg:magma_wastes']);
        }
        /* Remove biomes included in #forge:is_hot/nether that don't fit the mob */
        // TODO find out why this doesn't work
        // TODO when found out, also remove these from nycto:lava_squid_spawns
        if (Platform.isLoaded('biomesoplenty')) {
            event.remove('rottencreatures:burned_whitelist', [
                'biomesoplenty:crystalline_chasm',
                'biomesoplenty:undergrowth',
                'biomesoplenty:withered_abyss'
            ]);
        }
        if (Platform.isLoaded('gardens_of_the_dead')) {
            event.remove('rottencreatures:burned_whitelist', 'gardens_of_the_dead:soulblight_forest');
        }
        event.remove('rottencreatures:burned_whitelist', 'minecraft:soul_sand_valley');

        event.add('rottencreatures:frostbitten_whitelist', '#forge:is_snowy');

        event.add('rottencreatures:glacial_hunter_whitelist', '#forge:is_snowy');

        event.add('rottencreatures:mummy_whitelist', '#forge:is_desert');

        event.add('rottencreatures:swampy_whitelist', '#forge:is_swamp');
    }

    /* Monster Plus */
    if (Platform.isLoaded('monsterplus')) {
        if (Platform.isLoaded('biomesoplenty')) {
            event.add('nycto:crystal_zombie_spawns', 'biomesoplenty:crystalline_chasm');
        }
        event.add('nycto:crystal_zombie_spawns', '#minecraft:is_overworld');

        if (Platform.isLoaded('byg')) {
            event.add('nycto:lava_squid_spawns', ['byg:crimson_gardens', 'byg:magma_wastes']);
        }
        event.add('nycto:lava_squid_spawns', '#forge:is_hot/nether');
    }

    /* Creatures and Beasts */
    if (Platform.isLoaded('cnb')) {
        event.add('nycto:cactem_spawns', ['#minecraft:is_badlands', '#forge:is_desert']);

        // TODO check where Naturalist Lizards spawn
        event.add('nycto:cnb_lizard_spawns', '#nycto:cactem_spawns');
    }

    // TODO update this to just combine all tags and add elements to both tags don't hardcode the elements like now!
    /* Add BYG beaches to minecraft:is_beach tag
       since they're wrongly tagged as forge:is_beach */
    if (Platform.isLoaded('byg')) {
        event.add('minecraft:is_beach', ['byg:basalt_barrera', 'byg:dacite_shore', 'byg:rainbow_beach']);
    }
});
