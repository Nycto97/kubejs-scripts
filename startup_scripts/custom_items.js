/*
   Copyright (c) 2023, Jelle Van Goethem
   All rights reserved.
 
   This source code is licensed under the BSD-style license found in the
   LICENSE file in the root directory of this source tree.
*/

// priority: 998

/* Register custom items */
StartupEvents.registry('item', (event) => {
    /* 
       Adding custom items under the mod's namespace so that
       JEI shows these items along the mod's items and blocks 
    */

    if (Platform.isLoaded('undergarden')) {
        event.create('undergarden:crushed_raw_cloggrum').texture('nycto:item/crushed_raw_cloggrum');

        event.create('undergarden:crushed_raw_froststeel').texture('nycto:item/crushed_raw_froststeel');

        event.create('undergarden:crushed_raw_utherium').texture('nycto:item/crushed_raw_utherium');

        event.create('undergarden:crushed_raw_regalium').texture('nycto:item/crushed_raw_regalium');

        event.create('undergarden:regalic_shard').texture('nycto:item/regalic_shard');
    }
});
