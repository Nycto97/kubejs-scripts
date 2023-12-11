/*
   Copyright (c) 2023, Jelle Van Goethem
   All rights reserved.
 
   This source code is licensed under the BSD-style license found in the
   LICENSE file in the root directory of this source tree.
*/

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

JEIEvents.hideItems((event) => {
    /* Hide all vertical slabs from Builders Crafts and
       Additions from JEI GUI since Quark already adds all of these */
    event.hide(/buildersaddition:.*vertical_slab/);

    /* Hide all vertical slabs from Vertical Slabs Compat - Create: Deco
       from JEI GUI since Create: Deco already adds all of these */
    event.hide(/v_slab_compat:createdeco.*vertical_slab/);

    /* Hide vertical slab from Double Slabs
       from JEI GUI since Quark already adds this
       and this currently is uncraftable anyway and just acts
       as air when mining double slabbed vertical slabs when this
       is enabled in Double Slabs config (currently disabled) */
    event.hide('doubleslabs:vertical_slab');

    /* Hide all emerald armor from MoreCraft from JEI
       GUI since Useless Swords already adds all of these */
    event.hide([
        'morecraft:emerald_helmet',
        'morecraft:emerald_chestplate',
        'morecraft:emerald_leggings',
        'morecraft:emerald_boots'
    ]);

    /* Hide ruby gems, blocks and ores from MoreCraft
       from JEI GUI since we use Epic Samurai's ruby */
    event.hide(['morecraft:ruby', 'morecraft:ruby_block', 'morecraft:ruby_ore', 'morecraft:deepslate_ruby_ore']);
});

/*
-------------------------------------------------------------------------------
-------------------------------------------------------------------------------
-------------------------------------------------------------------------------
-------------------------------------------------------------------------------
-------------------------------------------------------------------------------
-------------------------------------------------------------------------------
*/

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
