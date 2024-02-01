/*
   Copyright (c) 2023, Jelle Van Goethem
   All rights reserved.
 
   This source code is licensed under the BSD-style license found in the
   LICENSE file in the root directory of this source tree.
*/

/* Show a title on screen and send a message regarding
   shaders to the player when they change dimension */
CommonAddedEvents.playerChangeDimension((event) => {
    const playerName = event.player.getUsername();
    const server = event.server;

    const dimensionOld = event.getOldLevel().dimension.toString();
    const dimensionNew = event.getNewLevel().dimension.toString();

    const dimensionWhitelistForShader = [
        'minecraft:overworld',
        'minecraft:the_end',
        'minecraft:the_nether',
        'nycto:usw_vanilla'
    ];

    if (Platform.isLoaded('arsomega')) {
        dimensionWhitelistForShader.push('arsomega:demon_realm');
    }

    const isDimensionOldWhitelisted = dimensionWhitelistForShader.includes(dimensionOld);
    const isDimensionNewWhitelisted = dimensionWhitelistForShader.includes(dimensionNew);

    if (global.isPlayerDimensionChangeLogEnabled) {
        console.log(
            `${playerName} moved from ${dimensionOld.substring(
                dimensionOld.indexOf(':') + 1
            )} to ${dimensionNew.substring(dimensionNew.indexOf(':') + 1)}`
        );
    }

    const messageShaderTip =
        "\u00A7bTip:\u00A7f Press ESC > Options > Control Settings > Key Binds > type 'shader' in the text field > bind Toggle Shaders to F7";

    // TODO test .notify method instead of this approach
    if (!isDimensionNewWhitelisted && isDimensionOldWhitelisted) {
        server.scheduleInTicks(60, () => {
            server.runCommandSilent(`title ${playerName} times 15 125 18`);
            server.runCommandSilent(
                `title ${playerName} subtitle [{"text":"Please ","color":"white"},{"text":"disable ","color":"red"},{"text":"your shader!","color":"white"}]`
            );
            server.runCommandSilent(
                `title ${playerName} title [{"text":"Disable ","color":"red"},{"text":"Shader","color":"white"}]`
            );
            event.player.tell(
                `\u00A7cShaders break the skybox, lightning, atmosphere and custom effects in (most) non-vanilla dimensions!\n\n${messageShaderTip}`
            );
        });
    }

    if (!isDimensionOldWhitelisted && isDimensionNewWhitelisted) {
        server.scheduleInTicks(60, () => {
            server.runCommandSilent(`title ${playerName} times 15 95 18`);
            server.runCommandSilent(
                `title ${playerName} subtitle [{"text":"You may ","color":"white"},{"text":"re-enable ","color":"green"},{"text":"your shader :)","color":"white"}]`
            );
            server.runCommandSilent(
                `title ${playerName} title [{"text":"Enable ","color":"green"},{"text":"Shader","color":"white"}]`
            );
            event.player.tell(
                `\u00A7aIt is recommended to enable shaders in The Overworld, The Nether, The End${
                    Platform.isLoaded('arsomega') ? ', Demon Realm' : ''
                } and USW Vanilla!\n\n${messageShaderTip}`
            );
        });
    }
});
