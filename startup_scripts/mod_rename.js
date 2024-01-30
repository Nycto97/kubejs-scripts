/*
   Copyright (c) 2023, Jelle Van Goethem
   All rights reserved.
 
   This source code is licensed under the BSD-style license found in the
   LICENSE file in the root directory of this source tree.
*/

// priority: 1000

/* Listen to post-init event, after all mods have loaded */
StartupEvents.postInit(() => {
    const notLoadedModLogs = [],
        skippedModLogs = [],
        renamedModLogs = [],
        allModLogs = [];

    const renameMod = (modInfo) => {
        let modId = modInfo.id,
            preferredModName = modInfo.preferredName;

        if (Platform.isLoaded(modId)) {
            let mod = Platform.mods[modId],
                modName = new String(mod.getName());

            if (modName != preferredModName) {
                mod.setName(preferredModName);

                if (global.isModRenameLogEnabled)
                    renamedModLogs.push(
                        `[RENAMED] Mod has been renamed: ${modName} => ${preferredModName} [id: ${modId}]`
                    );
            } else {
                if (global.isModRenameLogEnabled)
                    skippedModLogs.push(`[SKIPPED] Mod has preferred name, skipping rename! ${modName} [id: ${modId}]`);
            }
        } else {
            if (global.isModRenameLogEnabled)
                notLoadedModLogs.push(`[SKIPPED] Mod is not installed, skipping rename! [id: ${modId}]`);
        }
    };

    modsToRename.forEach((mod) => renameMod(mod));

    if (global.isModRenameLogEnabled) {
        /* Add all messages to 1 array after sorting
           them and add dividers where needed */
        if (notLoadedModLogs.length) {
            allModLogs.push(notLoadedModLogs.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })));
            allModLogs.push('-'.repeat(notLoadedModLogs[notLoadedModLogs.length - 1].length));
        }

        if (skippedModLogs.length) {
            allModLogs.push(skippedModLogs.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })));
            allModLogs.push('-'.repeat(skippedModLogs[skippedModLogs.length - 1].length));
        }

        if (renamedModLogs.length)
            allModLogs.push(renamedModLogs.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })));

        /* Print out all messages, grouped by activity,
           alphabetically sorted per group, ignoring case */
        if (allModLogs.length) allModLogs.forEach((message) => console.log(message));
    }
});
