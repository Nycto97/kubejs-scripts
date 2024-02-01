/*
   Copyright (c) 2023, Jelle Van Goethem
   All rights reserved.
 
   This source code is licensed under the BSD-style license found in the
   LICENSE file in the root directory of this source tree.
*/

// priority: 1000

/* Listen to post-init event, after all mods have loaded */
StartupEvents.postInit(() => {
    const modNotLoadedLogs = [];
    const modSkippedLogs = [];
    const modRenamedLogs = [];

    const combinedModLogs = [];

    const renameMod = (modInfo) => {
        const modId = modInfo.id;
        const preferredModName = modInfo.preferredName;

        if (Platform.isLoaded(modId)) {
            let mod = Platform.mods[modId],
                modName = new String(mod.getName());

            if (modName != preferredModName) {
                mod.setName(preferredModName);

                if (global.isModRenameLogEnabled) {
                    modRenamedLogs.push(
                        `[RENAMED] Mod has been renamed: ${modName} => ${preferredModName} [id: ${modId}]`
                    );
                }
            } else {
                if (global.isModRenameLogEnabled) {
                    modSkippedLogs.push(`[SKIPPED] Mod has preferred name, skipping rename! ${modName} [id: ${modId}]`);
                }
            }
        } else {
            if (global.isModRenameLogEnabled) {
                modNotLoadedLogs.push(`[SKIPPED] Mod is not installed, skipping rename! [id: ${modId}]`);
            }
        }
    };

    modsToRename.forEach((mod) => {
        renameMod(mod);
    });

    if (global.isModRenameLogEnabled) {
        /* Add all messages to 1 array after sorting
           them and add dividers where needed */
        if (modNotLoadedLogs.length) {
            combinedModLogs.push(modNotLoadedLogs.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })));
            combinedModLogs.push('-'.repeat(modNotLoadedLogs[modNotLoadedLogs.length - 1].length));
        }

        if (modSkippedLogs.length) {
            combinedModLogs.push(modSkippedLogs.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })));
            combinedModLogs.push('-'.repeat(modSkippedLogs[modSkippedLogs.length - 1].length));
        }

        if (modRenamedLogs.length)
            combinedModLogs.push(modRenamedLogs.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })));

        /* Print out all messages, grouped by activity,
           alphabetically sorted per group, ignoring case */
        if (combinedModLogs.length) {
            combinedModLogs.forEach((log) => {
                console.log(log);
            });
        }
    }
});
