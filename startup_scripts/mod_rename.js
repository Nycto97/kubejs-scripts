/*
   Copyright (c) 2023, Jelle Van Goethem
   All rights reserved.
 
   This source code is licensed under the BSD-style license found in the
   LICENSE file in the root directory of this source tree.
*/

// priority: 1000

/* Listen to post-init event, after all mods have loaded */
StartupEvents.postInit(() => {
    /**
     * The logs of mods to rename that aren't loaded.
     * @type {string[]}
     * @const
     */
    const notLoadedModLogs = [];
    /**
     * The logs of mods to rename that got skipped.
     * @type {string[]}
     * @const
     */
    const skippedModLogs = [];
    /**
     * The logs of mods to rename that got renamed.
     * @type {string[]}
     * @const
     */
    const renamedModLogs = [];
    /**
     * All logs of mods to rename.
     * @type {string[]}
     * @const
     */
    const modLogs = [];

    /**
     * TODO:
     * Decide if isModRenameLogEnabled checks in renameMod() are needed for performance or if
     * it's OK to push the strings into the arrays, even when isModRenameLogEnabled is false.
     */

    /**
     * Renames a mod.
     * @param {Object} modToRenameInfo - Info about the mod to rename.
     * @param {string} modToRenameInfo.id - The id of the mod to rename.
     * @param {string} modToRenameInfo.preferredName - The preferred name for the mod to rename.
     */
    const renameMod = (modToRenameInfo) => {
        if (!modToRenameInfo.id && !modToRenameInfo.preferredName) {
            if (global.isModRenameLogEnabled)
                skippedModLogs.push('[WARN] Mod id and mod preferred name are not defined or empty! Skipping rename');
            return;
        }

        if (!modToRenameInfo.id && modToRenameInfo.preferredName) {
            if (global.isModRenameLogEnabled)
                skippedModLogs.push(
                    `[WARN] Mod id is not defined or empty! Skipping renaming to ${modToRenameInfo.preferredName}`
                );
            return;
        }

        if (modToRenameInfo.id && !modToRenameInfo.preferredName) {
            if (global.isModRenameLogEnabled)
                skippedModLogs.push(
                    `[WARN] Mod preferred name is not defined or empty! Skipping rename [id: ${modToRenameInfo.id}]`
                );
            return;
        }

        /**
         * The id of the mod to rename.
         * @type {string}
         * @const
         */
        const modToRenameId = modToRenameInfo.id;
        /**
         * The preferred name for the mod to rename.
         * @type {string}
         * @const
         */
        const modToRenamePreferredName = modToRenameInfo.preferredName;

        if (!Platform.isLoaded(modToRenameId)) {
            /* TODO: Update logModNotLoaded() and use it here. */
            if (global.isModRenameLogEnabled)
                notLoadedModLogs.push(`[INFO] Mod is not loaded! Skipping rename [id: ${modToRenameId}]`);
            return;
        }

        /**
         * Info about the mod.
         * @type {PlatformWrapper.ModInfo}
         * @const
         */
        const modInfo = Platform.mods[modToRenameId];
        /**
         * The mod name.
         * @type {string}
         * @const
         */
        const modName = new String(modInfo.getName());

        if (modName == modToRenamePreferredName) {
            if (global.isModRenameLogEnabled)
                skippedModLogs.push(`[INFO] Mod has preferred name! Skipping rename [id: ${modToRenameId}]`);
            return;
        }

        modInfo.setName(modToRenamePreferredName);

        if (global.isModRenameLogEnabled)
            renamedModLogs.push(
                `[INFO] Mod has been renamed! ${modName} => ${modToRenamePreferredName} [id: ${modToRenameId}]`
            );
    };

    modsToRenameInfo.forEach((modInfo) => renameMod(modInfo));

    if (global.isModRenameLogEnabled) {
        /**
         * Sorts logs alphabetically, ignoring case.
         * @param {string[]} logs - The logs to sort.
         * @returns {string[]} The sorted logs.
         */
        let sortLogs = (logs) => logs.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));

        /**
         * Composes a divider.
         * @param {string[]} logs - The logs to compose a divider for.
         * @returns {string} The divider.
         */
        let composeDivider = (logs) => '-'.repeat(logs[logs.length - 1].length);

        /**
         * Pushes logs to combined logs after sorting them and optionally adding a divider.
         * @param {string[]} logs - The logs to sort, optionally add a divider for and push to combined logs.
         * @param {boolean} addDivider - Whether or not a divider should be added under the group of logs.
         */
        let pushLogs = (logs, addDivider) => {
            modLogs.push(sortLogs(logs));

            if (addDivider) modLogs.push(composeDivider(logs));
        };

        if (notLoadedModLogs.length) pushLogs(notLoadedModLogs, true);

        if (skippedModLogs.length) pushLogs(skippedModLogs, renamedModLogs.length ? true : false);

        if (renamedModLogs.length) pushLogs(renamedModLogs, false);

        /* Print out all logs, grouped by activity,
           alphabetically sorted per group, ignoring case */
        if (modLogs.length) modLogs.forEach((log) => console.log(log));
    }
});
