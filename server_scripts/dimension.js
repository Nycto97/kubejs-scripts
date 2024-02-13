/*
   Copyright (c) 2023, Jelle Van Goethem
   All rights reserved.
 
   This source code is licensed under the BSD-style license found in the
   LICENSE file in the root directory of this source tree.
*/

/* Show a title on screen and send a message regarding
   shaders to the player when they change dimension */
CommonAddedEvents.playerChangeDimension((event) => {
    const username = event.player.username;
    const server = event.server;

    const dimensions = server
        .levelKeys()
        .toArray()
        .map((levelKey) => levelKey.location().toString());

    const oldDimension = event.oldLevel.dimension.toString();
    const newDimension = event.newLevel.dimension.toString();

    const dimensionWhitelistForShader = [
        'minecraft:overworld',
        'minecraft:the_end',
        'minecraft:the_nether',
        'arsomega:demon_realm',
        'nycto:usw_vanilla'
    ].filter((dimension) => dimensions.includes(dimension));

    const isOldDimensionWhitelisted = dimensionWhitelistForShader.includes(oldDimension);
    const isNewDimensionWhitelisted = dimensionWhitelistForShader.includes(newDimension);

    if (global.isPlayerDimensionChangeLogEnabled) {
        console.log(`${username} moved from ${oldDimension.split(':')[1]} to ${newDimension.split(':')[1]}`);
    }

    const shaderTip =
        "\u00A7bTip:\u00A7f Press ESC > Options > Control Settings > Key Binds > type 'shader' in the text field > bind Toggle Shaders to F7";

    // TODO test .notify method instead of this approach
    if (isOldDimensionWhitelisted && !isNewDimensionWhitelisted) {
        server.scheduleInTicks(60, () => {
            server.runCommandSilent(`title ${username} times 15 125 18`);
            server.runCommandSilent(
                `title ${username} subtitle [{"text":"Please ","color":"white"},{"text":"disable ","color":"red"},{"text":"your shader!","color":"white"}]`
            );
            server.runCommandSilent(
                `title ${username} title [{"text":"Disable ","color":"red"},{"text":"Shader","color":"white"}]`
            );
            event.player.tell(
                `\u00A7cShaders break the skybox, lightning, atmosphere and custom effects in (most) non-vanilla dimensions!\n\n${shaderTip}`
            );
        });
    }

    if (isNewDimensionWhitelisted && !isOldDimensionWhitelisted) {
        server.scheduleInTicks(60, () => {
            server.runCommandSilent(`title ${username} times 15 95 18`);
            server.runCommandSilent(
                `title ${username} subtitle [{"text":"You may ","color":"white"},{"text":"re-enable ","color":"green"},{"text":"your shader :)","color":"white"}]`
            );
            server.runCommandSilent(
                `title ${username} title [{"text":"Enable ","color":"green"},{"text":"Shader","color":"white"}]`
            );
            event.player.tell(
                `\u00A7aIt is recommended to enable shaders in The Overworld, The Nether, The End${
                    Platform.isLoaded('arsomega') ? ', Demon Realm' : ''
                } and USW Vanilla!\n\n${shaderTip}`
            );
        });
    }
});
