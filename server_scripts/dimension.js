/**
 * @license BSD-3-Clause
 *
 * Copyright (c) 2023, Jelle Van Goethem
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* Show a title on screen and send a message regarding
   shaders to the player when they change dimension */
CommonAddedEvents.playerChangeDimension((event) => {
    const username = `${event.player.username}`;
    
    const server = event.server;

    const dimensions = server
        .levelKeys()
        .toArray()
        .map((levelKey) => `${levelKey.location()}`);

    const oldDimension = `${event.oldLevel.dimension}`;
    const newDimension = `${event.newLevel.dimension}`;

    const dimensionWhitelistForShader = [
        'minecraft:overworld',
        'minecraft:the_end',
        'minecraft:the_nether',
        'ae2:spatial_storage',
        'arsomega:demon_realm',
        'l2library:maze',
        'nycto:usw_vanilla',
        'tropicraft:tropics'
    ].filter((dimension) => dimensions.includes(dimension));

    const isOldDimensionWhitelisted = dimensionWhitelistForShader.includes(oldDimension);
    const isNewDimensionWhitelisted = dimensionWhitelistForShader.includes(newDimension);

    const shaderTip =
        '§bTip:§f Press ESC > Options > Control Settings > Key Binds >' +
        ` type 'shader' in the text field > bind Toggle Shaders to F7`;

    // TODO test .notify method instead of this approach
    if (isOldDimensionWhitelisted && !isNewDimensionWhitelisted) {
        server.scheduleInTicks(60, () => {
            server.runCommandSilent(`title ${username} times 15 125 18`);

            server.runCommandSilent(
                `title ${username} subtitle [{"text":"Please ","color":"white"},` +
                    '{"text":"disable ","color":"red"},{"text":"your shader!","color":"white"}]'
            );

            server.runCommandSilent(
                `title ${username} title [{"text":"Disable ","color":"red"},{"text":"Shader","color":"white"}]`
            );

            event.player.tell(
                '§cShaders break the skybox, lightning, atmosphere and' +
                    ' custom effects in (most) non-vanilla dimensions!\n' +
                    '\n' +
                    `${shaderTip}`
            );
        });
    }

    if (!isOldDimensionWhitelisted && isNewDimensionWhitelisted) {
        server.scheduleInTicks(60, () => {
            server.runCommandSilent(`title ${username} times 15 95 18`);
            
            server.runCommandSilent(
                `title ${username} subtitle [{"text":"You may ","color":"white"},` +
                    '{"text":"re-enable ","color":"green"},{"text":"your shader :)","color":"white"}]'
            );

            server.runCommandSilent(
                `title ${username} title [{"text":"Enable ","color":"green"},{"text":"Shader","color":"white"}]`
            );

            event.player.tell(
                '§aIt is recommended to enable shaders in The Overworld, The Nether, The End' +
                    `${dimensions.includes('arsomega:demon_realm') ? ', Demon Realm' : ''}` +
                    `${dimensions.includes('tropicraft:tropics') ? ', Tropics' : ''}` +
                    ' and USW Vanilla!\n' +
                    '\n' +
                    `${shaderTip}`
            );
        });
    }

    if (isPlayerDimensionChangeLogEnabled) {
        /**
         * Formats a dimension name by splitting the dimension Resource Location string
         *     at the colon and capitalizing the first letter of each word.
         *
         * Handles special cases like 'usw_vanilla' which becomes 'USW Vanilla'.
         *
         * @param {string} dimension - The dimension Resource Location string to format.
         *
         * @returns {string} The formatted dimension name.
         */
        let formatDimensionName = (dimension) => {
            /* Splits the string at the colon and takes the second part. */
            let dimensionName = dimension.split(':')[1];

            /* Handles special cases. */
            if (dimensionName === 'usw_vanilla') {
                return 'USW Vanilla';
            }

            /* Replaces underscores with spaces and capitalizes the first letter of each word. */
            dimensionName = dimensionName.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

            return dimensionName;
        };

        console.info(
            `${username} moved from ${formatDimensionName(oldDimension)} to ${formatDimensionName(newDimension)}`
        );
    }
});
