/*
   Copyright (c) 2023, Jelle Van Goethem
   All rights reserved.
 
   This source code is licensed under the BSD-style license found in the
   LICENSE file in the root directory of this source tree.
*/

/* Show a title on screen and send a message regarding
   shaders to the player when they change dimension */
CommonAddedEvents.playerChangeDimension((event) => {
    const playerName = event.player.getUsername(),
        server = event.server;

    const dimensionOld = event.getOldLevel().dimension.toString(),
        dimensionNew = event.getNewLevel().dimension.toString();

    const dimensionWhitelistForShader = [
        'minecraft:overworld',
        'minecraft:the_end',
        'minecraft:the_nether',
        'nycto:usw_vanilla'
    ];

    /* Demon Realm is currently the only custom non-overworld
       dimension where everything looks better with shader */
    global.isLoaded('arsomega') && dimensionWhitelistForShader.push('arsomega:demon_realm');

    const isDimensionOldWhitelisted = dimensionWhitelistForShader.includes(dimensionOld),
        isDimensionNewWhitelisted = dimensionWhitelistForShader.includes(dimensionNew);

    const titleDisableShaderCmd = `title ${playerName} title [{"text":"Disable ","color":"red"},{"text":"Shader","color":"white"}]`,
        subtitleDisableShaderCmd = `title ${playerName} subtitle [{"text":"Please ","color":"white"},{"text":"disable ","color":"red"},{"text":"your shader!","color":"white"}]`;

    const messageDisableShaderInfo =
        '\u00A7cShaders break the skybox, lightning, atmosphere and custom effects in (most) non-vanilla dimensions!';

    const titleEnableShaderCmd = `title ${playerName} title [{"text":"Enable ","color":"green"},{"text":"Shader","color":"white"}]`,
        subtitleEnableShaderCmd = `title ${playerName} subtitle [{"text":"You may ","color":"white"},{"text":"re-enable ","color":"green"},{"text":"your shader :)","color":"white"}]`;

    const messageEnableShaderInfo = `\u00A7aIt is recommended to enable shaders in The Overworld, The Nether, The End${
        global.isLoaded('arsomega') ? ', Demon Realm' : ''
    } and USW Vanilla!`;

    const messageShaderTip =
        "\u00A7bTip:\u00A7f Press ESC > Options > Control Settings > Key Binds > type 'shader' in the text field > bind Toggle Shaders to F7";

    console.log(
        `${playerName} moved from ${dimensionOld.substring(dimensionOld.indexOf(':') + 1)} to ${dimensionNew.substring(
            dimensionNew.indexOf(':') + 1
        )}`
    );

    // TODO test .notify method instead of this approach
    // NOTE Use server.scheduleInTicks(100, () => {...}) to delay execution
    !isDimensionNewWhitelisted &&
        isDimensionOldWhitelisted &&
        server.scheduleInTicks(60, () => {
            server.runCommandSilent(`title ${playerName} times 15 125 18`) &&
                server.runCommandSilent(subtitleDisableShaderCmd) &&
                server.runCommandSilent(titleDisableShaderCmd) &&
                event.player.tell(`${messageDisableShaderInfo}\n\n${messageShaderTip}`);
        });

    !isDimensionOldWhitelisted &&
        isDimensionNewWhitelisted &&
        server.scheduleInTicks(60, () => {
            server.runCommandSilent(`title ${playerName} times 15 95 18`) &&
                server.runCommandSilent(subtitleEnableShaderCmd) &&
                server.runCommandSilent(titleEnableShaderCmd) &&
                event.player.tell(`${messageEnableShaderInfo}\n\n${messageShaderTip}`);
        });
});
