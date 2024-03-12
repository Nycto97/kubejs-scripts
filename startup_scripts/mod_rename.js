/**
 * @license BSD-3-Clause
 *
 * Copyright (c) 2023, Jelle Van Goethem
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

// priority: 1000

/* Listen to post-init event, after all mods have loaded */
StartupEvents.postInit(() => {
    /**
     * The logs of mods to rename that aren't loaded.
     *
     * @type {string[]}
     * @const
     */
    const notLoadedModLogs = [];
    /**
     * The logs of mods to rename that got skipped.
     *
     * @type {string[]}
     * @const
     */
    const skippedModLogs = [];
    /**
     * The logs of mods to rename that got renamed.
     *
     * @type {string[]}
     * @const
     */
    const renamedModLogs = [];
    /**
     * All logs of mods to rename.
     *
     * @type {string[]}
     * @const
     */
    const modLogs = [];

    /**
     * Renames a mod if it's loaded and doesn't have the preferred name.
     *
     * @param {Object} modToRenameInfo - Info about the mod to rename.
     * @param {string} modToRenameInfo.id - The id of the mod to rename.
     * @param {string} modToRenameInfo.preferredName - The preferred name for the mod to rename.
     */
    const renameMod = (modToRenameInfo) => {
        if (typeof modToRenameInfo.id === 'undefined' || typeof modToRenameInfo.preferredName === 'undefined') {
            if (global.isModRenameLogEnabled) {
                if (typeof modToRenameInfo.id === 'undefined' && typeof modToRenameInfo.preferredName === 'undefined') {
                    skippedModLogs.push('[WARN] Mod id and mod preferred name are undefined! Skipping rename');
                } else if (typeof modToRenameInfo.id === 'undefined') {
                    skippedModLogs.push('[WARN] Mod id is undefined! Skipping rename');
                } else {
                    skippedModLogs.push('[WARN] Mod preferred name is undefined! Skipping rename');
                }
            }
            return;
        }

        if (typeof modToRenameInfo.id !== 'string' || typeof modToRenameInfo.preferredName !== 'string') {
            if (global.isModRenameLogEnabled) {
                if (typeof modToRenameInfo.id !== 'string' && typeof modToRenameInfo.preferredName !== 'string') {
                    skippedModLogs.push('[WARN] Mod id and mod preferred name are not strings! Skipping rename');
                } else if (typeof modToRenameInfo.id !== 'string') {
                    skippedModLogs.push(
                        `[WARN] Mod id is not a string! Skipping rename [preferred name: ${modToRenameInfo.preferredName}]`
                    );
                } else {
                    skippedModLogs.push(
                        `[WARN] Mod preferred name is not a string! Skipping rename [id: ${modToRenameInfo.id}]`
                    );
                }
            }
            return;
        }

        if (modToRenameInfo.id.trim().length === 0 || modToRenameInfo.preferredName.trim().length === 0) {
            if (global.isModRenameLogEnabled) {
                if (modToRenameInfo.id.trim().length === 0 && modToRenameInfo.preferredName.trim().length === 0) {
                    skippedModLogs.push('[WARN] Mod id and mod preferred name are empty! Skipping rename');
                } else if (modToRenameInfo.id.trim().length === 0) {
                    skippedModLogs.push(
                        `[WARN] Mod id is empty! Skipping renaming to ${modToRenameInfo.preferredName}`
                    );
                } else {
                    skippedModLogs.push(
                        `[WARN] Mod preferred name is empty! Skipping rename [id: ${modToRenameInfo.id}]`
                    );
                }
            }
            return;
        }

        /**
         * The id of the mod to rename.
         *
         * @type {string}
         * @const
         */
        const modId = modToRenameInfo.id;
        /**
         * The preferred name for the mod to rename.
         *
         * @type {string}
         * @const
         */
        const modPreferredName = modToRenameInfo.preferredName;

        if (!Platform.isLoaded(modId)) {
            if (isModRenameLogEnabled) {
                notLoadedModLogs.push(`${modPreferredName} is not loaded! Skipping rename...`);
            }

            return;
        }

        /**
         * Info about the mod.
         *
         * @type {PlatformWrapper.ModInfo}
         * @const
         */
        const modInfo = Platform.mods[modId];
        /**
         * The mod name.
         *
         * @type {string}
         * @const
         */
        const modName = new String(modInfo.getName());

        if (modName === modPreferredName) {
            if (isModRenameLogEnabled) {
                skippedModLogs.push(`${modName} has preferred name! Skipping rename...`);
            }

            return;
        }

        modInfo.setName(modPreferredName);

        if (isModRenameLogEnabled) {
            renamedModLogs.push(`Renamed ${modName} to ${modPreferredName}.`);
        }
    };

    if (!Array.isArray(modsToRenameInfo)) {
        console.warn('modsToRenameInfo is not an array! Skipping mod rename...');
        return;
    }

    if (modsToRenameInfo.length === 0) {
        console.warn('modsToRenameInfo is empty! Skipping mod rename...');
        return;
    }

    if (modsToRenameInfo.some((modInfo) => typeof modInfo !== 'object')) {
        console.warn('modsToRenameInfo contains non-object elements! Skipping mod rename...');
        return;
    }

    modsToRenameInfo.forEach((modInfo) => renameMod(modInfo));

    if (isModRenameLogEnabled) {
        /**
         * Sorts logs alphabetically, ignoring case.
         *
         * @param {string[]} logs - The logs to sort.
         *
         * @returns {string[]} The sorted logs.
         */
        let sortLogs = (logs) => logs.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));

        /**
         * Composes a divider.
         *
         * @param {string[]} logs - The logs to compose a divider for.
         *
         * @returns {string} The divider.
         */
        let composeDivider = (logs) => '-'.repeat(logs[logs.length - 1].length);

        /**
         * Pushes logs to combined logs after sorting them and optionally adding a divider.
         *
         * @param {string[]} logs - The logs to sort, optionally add a divider for and push to combined logs.
         * @param {boolean} addDivider - Whether a divider should be added under the group of logs.
         */
        let pushLogs = (logs, addDivider) => {
            sortLogs(logs).forEach((log) => modLogs.push(log));

            if (addDivider) modLogs.push(composeDivider(logs));
        };

        if (notLoadedModLogs.length) pushLogs(notLoadedModLogs, true);

        if (skippedModLogs.length) pushLogs(skippedModLogs, renamedModLogs.length ? true : false);

        if (renamedModLogs.length) pushLogs(renamedModLogs, false);

        /* Print out all logs, grouped by activity,
           alphabetically sorted per group, ignoring case. */
        if (modLogs.length) modLogs.forEach((log) => console.info(log));
    }
});
