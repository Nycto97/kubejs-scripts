/**
 * @license BSD-3-Clause
 *
 * Copyright (c) 2023, Jelle Van Goethem
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

ServerEvents.tags('entity_type', (event) => {
    event.add('minecraft:skeletons', /^((?!summon).)*skeleton.*$/);
});
