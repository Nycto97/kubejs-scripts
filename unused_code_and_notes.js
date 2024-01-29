/*
   Copyright (c) 2023, Jelle Van Goethem
   All rights reserved.
 
   This source code is licensed under the BSD-style license found in the
   LICENSE file in the root directory of this source tree.
*/

/*

   ATTENTION

   This file contains of notes and code that currently
   isn't used, but might be useful in the future.

*/

/* ----------------------------------------------------------------- */

/*
   INFO:
   Using RegEx with \/^(.)*$\/
    / -> Start and end of RegEx
    ^ -> Start of line
    ( -> Start of group
    . -> Match any character
    ) -> End of group
    * -> Match group 0 or more times
    $ -> End of line

   Example: /^some_mod:.*vertical_slab$/
   some_mod:vertical_slab matches

   Use this RegEx to match lines not containing a certain word:
   /^whatever:textyouwant((?!word).)*$/
*/

/* ----------------------------------------------------------------- */

/*
   NOTE:
   .some() can be used to avoid repetitive code:

   global.allBlocks.filter(
       (block) =>
           block.endsWith('thisThing') ||
           block.endsWith('thatThing') ||
           block.endsWith('...')
   );

   Can also be written as:

   const someThings = ['thisThing', 'thatThing', '...'];
   someThings.some((thing) => block.endsWith(thing));
*/

/* ----------------------------------------------------------------- */

/* 
   The following code can only be used to manually copy/paste the output
   from console.log to the In Control! config file, as it is not possible
   to write [] to json files with JsonIO.write() (provided by KubeJS).
*/

/* 
   NEW, BETTER, EASIER APPROACH !
   RULE 1: ALLOW MINECRAFT MOBS
   RULE 2: DENY ALL MODS
   FIRST RULE THAT MATCHES, STOPS THAT MOB FROM BEING AFFECTED BY
   FOLLOWING RULES, UNLESS continue: true IS SPECIFIED IN THE RULE

[
    {
        "result": "allow",
        "mod": "minecraft",
        "dimension": "nycto:usw_vanilla",
        "onjoin": true
    },
    {
        "result": "deny",
        "dimension": "nycto:usw_vanilla",
        "onjoin": true
    }
]
   
   INFO
   @ChiefArug:
   "When a rule matches and has a result, then InControl! stops processing
   further rules for that mob unless the rule also specified continue: true.
   
   So if you have a result: allow, it will stop InControl!
   processing any further rules, including deny ones."
*/

// const allServerModIds = Platform.getList();
// const arrayWithAllModIdsForInControlBlacklist = [];
// const arrayWithAllModIdsForInControlBlacklistStringified = [];
// const constructBlacklistObject = (modId) => {
//     return {
//         result: 'deny',
//         mod: modId,
//         dimension: 'nycto:usw_vanilla',
//         onjoin: true
//     };
// };

// allServerModIds.forEach((modId) => {
//     modId != 'minecraft' && arrayWithAllModIdsForInControlBlacklist.push(constructBlacklistObject(modId));
// });

// arrayWithAllModIdsForInControlBlacklist.map((object) => {
//     arrayWithAllModIdsForInControlBlacklistStringified.push(JSON.stringify(object));
// });

// console.log(
//     `There are ${arrayWithAllModIdsForInControlBlacklistStringified.length} mods loaded on the server (including minecraft, forge and jar in jar mods).`
// );

// for (let i = 0; i < 5; i++) {
//     console.log('-'.repeat(89));
// }
// console.log(`${'-'.repeat(21)} START MANUALLY GENERATED InControl! BLACKLIST ${'-'.repeat(21)}`);
// //console.log('--- This is only for visual reference, actual json gets written to InControl! config! ---');
// for (let i = 0; i < 5; i++) {
//     console.log('-'.repeat(89));
// }
// console.log(`[${arrayWithAllModIdsForInControlBlacklistStringified.toString()}]`);
// for (let i = 0; i < 5; i++) {
//     console.log('-'.repeat(89));
// }
// console.log(`${'-'.repeat(22)} END MANUALLY GENERATED InControl! BLACKLIST ${'-'.repeat(22)}`);
// for (let i = 0; i < 5; i++) {
//     console.log('-'.repeat(89));
// }

// const filePath = 'config/incontrol/spawn.json';

// JsonIO.write(filePath, arrayWithAllModIdsForInControlBlacklistStringified.toString());

// JsonIO.read(filePath) != null
//     ? console.log(`File has been successfully saved to "Server Nycto/${filePath}"`)
//     : console.log(
//           `Something went wrong! Failed to save to "Server Nycto/${filePath}" Config file not found, meaning the script successfully located and deleted the file, but failed to write to it! Please check and fix your JsonIO.write() call!`
//       );

/* ----------------------------------------------------------------- */

// INFO: NOT MY CODE, USE/FIGURE OUT WHENEVER I NEED TO HIDE RECIPES IN JEI !!!

// console.info('The Factory Must Be Clean!');

// const $Function = Java.loadClass('java.util.function.Function');
// const $Collectors = Java.loadClass('java.util.stream.Collectors');

// //NetworkEvents.dataReceived('loggedIn', event => {
// const recipeManager = global.jeiRuntime.getRecipeManager();
// let hideCreateRecipe = (inRecipeType, inRecipeID, stage) => {
//     let javaRecipeCategories = recipeManager
//         .createRecipeCategoryLookup()
//         .get()
//         .collect($Collectors.toMap((event) => event.getRecipeType().getUid(), $Function.identity()));
//     let javaRecipeCategory = javaRecipeCategories.get(Utils.id(inRecipeType));
//     let javaRecipeType = javaRecipeCategory.getRecipeType();
//     let javaRecipeID = global.jeiRuntime.recipeManager
//         .createRecipeLookup(javaRecipeCategory.getRecipeType())
//         .get()
//         .filter((rec) => rec.id == inRecipeID)
//         .findFirst()
//         .get();
//     if (!event.player.stages.has(stage)) {
//         recipeManager.hideRecipes(javaRecipeType, [javaRecipeID]);
//     }
//     console.log(javaRecipeID);
// };
// hideCreateRecipe('create:sequenced_assembly', ['create:sequenced_assembly/track'], 'railway_logistics');
// //hideCreateRecipe('railway_logistics','create:sequenced_assembly', ['create:sequenced_assembly/track'])
// //})

// /*ClientEvents.loggedIn(event => {
//     if(!event.player.stages.has('railway_logistics')) {
//         JEIAddedEvents.onRuntimeAvailable(event => {
//             const recipeManager = event.data.getRecipeManager()
//             event.data.
//         })
//     }
// })*/

// NetworkEvents.dataReceived('railways', (event) => {
//     const recipeManager = global.jeiRuntime.getRecipeManager();
//     let unhideCreateRecipe = (stage, inRecipeType, inRecipeID) => {
//         let javaRecipeCategories = recipeManager
//             .createRecipeCategoryLookup()
//             .get()
//             .collect($Collectors.toMap((event) => event.getRecipeType().getUid(), $Function.identity()));
//         let javaRecipeCategory = javaRecipeCategories.get(Utils.id(inRecipeType));
//         let javaRecipeType = javaRecipeCategory.getRecipeType();
//         let javaRecipeID = global.jeiRuntime.recipeManager
//             .createRecipeLookup(javaRecipeCategory.getRecipeType())
//             .get()
//             .filter((rec) => rec.id == inRecipeID)
//             .findFirst()
//             .get();
//         if (event.player.stages.has(stage)) {
//             recipeManager.unhideRecipes(javaRecipeType, [javaRecipeID]);
//         }
//     };
//     console.log('Check JEI');
//     unhideCreateRecipe('railway_logistics', 'create:sequenced_assembly', ['create:sequenced_assembly/track']);
// });

/* ----------------------------------------------------------------- */

/* Make end_portal_frame breakable */

// BlockEvents.modification((event) => event.modify('minecraft:end_portal_frame', (block) => (block.destroySpeed = 0.3)));

/* BlockEvents.modification((event) => {
    const sharedHardness = 1.5; // 1.5 is the default hardness
    event.modify('modId:block1RegistryName', (block) => (block.hardness = sharedHardness));
    event.modify('modId:block2RegistryName', (block) => (block.hardness = sharedHardness));
    event.modify('modId:block3RegistryName', (block) => (block.hardness = sharedHardness));
}); */
