/*
   Copyright (c) 2023, Jelle Van Goethem
   All rights reserved.
 
   This source code is licensed under the BSD-style license found in the
   LICENSE file in the root directory of this source tree.
*/

/*  
   NOTE TO SELF ABOUT Platform.mods[mod] AFTER SEARCHING FOR HOURS
   HOW TO GET SOMETHING LIKE `Platform.mods.${mod}` TO WORK:
   -> Platform.mods[mod] (which is not the same as Platform.mods.mod!)

   Dot Notation
      With dot notation, the compiler interprets the code literally.
      Whatever is written after the dot is assumed to be a STRING;
      the compiler then looks for an eponymous property on the object.

   Bracket Notation
      With bracket notation, on the other hand, whatever is written inside
      the brackets will be interpreted as a VARIABLE and evaluated first.
      Only then will the compiler look for a key corresponding to the evaluated expression.
*/

/* Listen to post-init event, after all mods have loaded */
StartupEvents.postInit(() => {
    const modSkippedNotInstalledMessages = [],
        modSkippedPreferredMessages = [],
        modRenamedMessages = [],
        modAllMessages = [];

    const renameMod = (modInfo) => {
        let modId = modInfo.modId,
            modPreferredName = modInfo.modPreferredName;

        /* Check if mod is installed */
        if (global.isLoaded(modId)) {
            let mod = Platform.mods[modId];
            /*
               new String() allows to store the current name and refer to it
               later, even after the initial value (mod.name) gets updated
            */
            let modName = new String(mod.getName());

            /* Check if mod already has preferred name and skip rename if it does */
            if (modName != modPreferredName) {
                /* Set mod name to preferred mod name */
                mod.setName(modPreferredName);

                modRenamedMessages.push(
                    `[RENAMED] Mod has been renamed: ${modName} => ${modPreferredName} [id: ${modId}]`
                );
            } else {
                modSkippedPreferredMessages.push(
                    `[SKIPPED] Mod has preferred name, skipping rename! ${modName} [id: ${modId}]`
                );
            }
        } else {
            modSkippedNotInstalledMessages.push(`[SKIPPED] Mod is not installed, skipping rename! [id: ${modId}]`);
        }
    };

    /* Rename mods */
    modsToRename.forEach((mod) => renameMod(mod));

    /* Add all messages to 1 array after sorting
       them and add dividers where needed */
    modAllMessages.push(
        modSkippedNotInstalledMessages.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }))
    );
    modSkippedNotInstalledMessages.length > 0 &&
        modAllMessages.push(
            '-'.repeat(modSkippedNotInstalledMessages[modSkippedNotInstalledMessages.length - 1].length)
        );

    modAllMessages.push(modSkippedPreferredMessages.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })));
    modSkippedPreferredMessages.length > 0 &&
        modAllMessages.push('-'.repeat(modSkippedPreferredMessages[modSkippedPreferredMessages.length - 1].length));

    modAllMessages.push(modRenamedMessages.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })));

    /* Print out all messages, grouped by activity,
       alphabetically sorted per group, ignoring case */
    modAllMessages.forEach((message) => console.log(message));
});
