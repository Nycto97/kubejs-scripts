/**
 * @license BSD-3-Clause
 *
 * Copyright (c) 2023, Jelle Van Goethem
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

// priority: 999

/**
 * Loads the TagEventJS class.
 *
 * @type {Internal.TagEventJS}
 * @const
 */
const TagEventJS = Java.loadClass('dev.latvian.mods.kubejs.server.tag.TagEventJS');

let itemIds;

let blockIds;

/* Listen to post-init event, after all mods have loaded */
StartupEvents.postInit(() => {
    /**
     * The item ids of all items.
     *
     * @type {List<string>}
     */
    itemIds = Item.getTypeList();

    /**
     * The block ids of all blocks.
     *
     * @type {List<string>}
     */
    blockIds = Block.getTypeList();

    global['itemIds'] = itemIds;
    global['blockIds'] = blockIds;

    if (isBlockAndItemCountLogEnabled) {
        console.info(`[INFO] There are ${itemIds.length} items and ${blockIds.length} blocks registered`);

        /* Creates maps to store the count of items and blocks for each mod. */
        let modItemCounts = {};
        let modBlockCounts = {};

        /* Iterates over each item id. */
        for (let itemId of itemIds) {
            /* Splits the item id at the colon to get the mod name. */
            let [modName] = itemId.split(':');

            /* If the mod name is not already in the map, adds it with a count of 1. */
            /* If the mod name is already in the map, increments its count. */
            modItemCounts[modName] = (modItemCounts[modName] || 0) + 1;
        }

        /* Iterates over each block id. */
        for (let blockId of blockIds) {
            /* Splits the block id at the colon to get the mod name. */
            let [modName] = blockId.split(':');

            /* If the mod name is not already in the map, adds it with a count of 1. */
            /* If the mod name is already in the map, increments its count. */
            modBlockCounts[modName] = (modBlockCounts[modName] || 0) + 1;
        }

        /* Converts the maps to arrays of [modName, count] pairs, sorts them in descending order of count, and logs the sorted counts. */
        Object.entries(modItemCounts)
            .sort((a, b) => b[1] - a[1])
            .forEach(([modName, count]) => {
                console.info(`ITEM: Mod '${modName}' has ${count} item${count > 1 ? 's' : ''}.`);
            });

        Object.entries(modBlockCounts)
            .sort((a, b) => b[1] - a[1])
            .forEach(([modName, count]) => {
                console.info(`BLOCK: Mod '${modName}' has ${count} block${count > 1 ? 's' : ''}.`);
            });
    }
});

/**
 * Checks if the argument is of one of the expected types or instances and not empty if argument is an Array or a string.
 *
 * IMPORTANT: This function is intended to be used only in conjunction with
 *     the checkArguments function, and should not be used independently!
 *
 * @param {string} funcName - The name of the function to check the argument for.
 * @param {*} arg - The argument to check.
 * @param {string|Array<string>} expectedType - The expected type(s) of the argument.
 *
 * @returns {void}
 *
 * @throws {TypeError} If the argument is not of any of the expected types.
 * @throws {RangeError} If the argument is an empty Array or an empty string.
 *
 * @see {@link checkArguments}
 */
function checkArg(funcName, arg, expectedTypes) {
    let isValidType = false;
    let isEmptyArray = false;
    let isEmptyString = false;

    /* Wraps 'expectedTypes' in an array for further processing, if it isn't an array already. */
    if (!Array.isArray(expectedTypes)) {
        expectedTypes = [expectedTypes];
    }

    /* Iterates over 'expectedTypes'. */
    for (let expectedType of expectedTypes) {
        /* Converts 'expectedType' to lowercase for consistent comparison. */
        expectedType = expectedType.toLowerCase();

        /* Checks the type of the argument against the expected type(s). */
        switch (expectedType) {
            case 'array':
            case '[]':
                isValidType = Array.isArray(arg);
                isEmptyArray = arg.length < 1;
                break;
            case 'array<integer>':
            case 'array<int>':
            case 'integer[]':
            case 'int[]':
                isValidType = Array.isArray(arg) && arg.every(Number.isInteger);
                isEmptyArray = arg.length < 1;
                break;
            case 'array<number>':
            case 'number[]':
                isValidType = Array.isArray(arg) && arg.every((subArg) => typeof subArg === 'number');
                isEmptyArray = arg.length < 1;
                break;
            case 'array<string>':
            case 'string[]':
                isValidType = Array.isArray(arg) && arg.every((subArg) => typeof subArg === 'string');
                isEmptyArray = arg.length < 1;
                isEmptyString = arg.some((subArg) => subArg.trim().length < 1);
                break;
            case 'bool':
            case 'boolean':
                isValidType = typeof arg === 'boolean';
                break;
            case 'date':
                isValidType = arg instanceof Date;
                break;
            case 'int':
            case 'integer':
                isValidType = Number.isInteger(arg);
                break;
            case 'num':
            case 'number':
                isValidType = typeof arg === 'number';
                break;
            case 'obj':
            case 'object':
            case '{}':
                isValidType = typeof arg === 'object' && arg !== null && !Array.isArray(arg);
                break;
            case 'regular expression':
            case 'regexp':
            case 'regex':
                isValidType =
                    arg instanceof RegExp || (arg.toString().startsWith('/') && arg.toString().lastIndexOf('/') > 0);
                break;
            case 'str':
            case 'string':
                isValidType = typeof arg === 'string';
                isEmptyString = arg.trim().length < 1;
                break;
            case 'tageventjs':
                isValidType = arg instanceof TagEventJS;
                break;
            default:
                isValidType = typeof arg === expectedType;
        }

        /* Stops checking the other types if the argument is of a valid type. */
        if (isValidType) {
            break;
        }
    }

    /* Throws a TypeError if the argument isn't of any of the expected types. */
    if (!isValidType) {
        throwError('TypeError', arg, 'arg', expectedTypes.join(' or '), `'${funcName}' function`);
    }

    /* Throws a RangeError if the argument is an empty Array or an empty string. */
    if (isEmptyArray || isEmptyString) {
        throwError(
            'RangeError',
            arg,
            'arg',
            `non-empty ${isEmptyArray ? 'array' : 'string'}`,
            `'${funcName}' function`,
            `empty ${isEmptyArray ? 'array' : 'string'}`
        );
    }
}

/**
 * Validates the number and types of arguments. If the validation fails, it throws an error.
 *
 * Note: This function uses direct type checks with 'typeof', 'instanceof', and 'Array.isArray()' for validation.
 * This is to avoid circular dependencies and potential infinite loops, as utility functions like 'isString' or 'isNumber' are defined using 'checkArguments'.
 *
 * @param {string} funcName - The name of the function to check the arguments for.
 * @param {*} args - The arguments to check.
 * @param {number|string|Array<number|string>} numArgs - The expected number of arguments or an Array of valid numbers of arguments.
 * @param {string|Array<string>|Array<Array<string>>|undefined} [argTypes] - The expected types of the arguments.
 *
 * @returns {void}
 *
 * @throws {RangeError} If the number of arguments or the value of an argument does not match the expected value or range.
 * @throws {TypeError} If the type of an argument does not match the expected type.
 *
 * @see {@link checkArg}
 */
function checkArguments(funcName, args, numArgs, argTypes) {
    /**
     * A string containing info about the expected numArgs.
     *
     * @type {string}
     * @const
     */
    const expectedNumArgs = `string containing a positive integer, positive integer, or array of strings containing positive integers and positive integers`;
    /**
     * A string containing info about the expected argTypes.
     *
     * @type {string}
     * @const
     */
    const expectedArgTypes = `non-empty string, array of non-empty strings, array of arrays of non-empty strings, or undefined`;

    /* Throws a TypeError if 'funcName' isn't a string. */
    if (typeof funcName !== 'string') {
        throwError('TypeError', funcName, 'funcName', 'string', 'function');
    }
    /* Throws a RangeError if 'funcName' is an empty string. */
    if (funcName.trim().length < 1) {
        throwError('RangeError', funcName, 'funcName', 'non-empty string', 'function', `empty string`);
    }

    /* Throws a RangeError if 'args' is undefined. */
    if (typeof args === 'undefined') {
        throwError('RangeError', args, 'args', '1 or more arguments', `'${funcName}' function`, '0');
    }

    /*
        Throws a RangeError if 'numArgs' is an empty string, or casts 'numArgs' to
        a number after trimming and wraps it in an array for further processing.
    */
    if (typeof numArgs === 'string') {
        if (numArgs.trim().length < 1) {
            throwError('RangeError', numArgs, 'numArgs', expectedNumArgs, `'${funcName}' function`, `empty string`);
        }

        numArgs = [Number(numArgs.trim())];
    }
    /*
        Throws a RangeError if 'numArgs' is a number smaller
        than 1, or wraps it in an array for further processing.
    */
    if (typeof numArgs === 'number') {
        if (numArgs < 1) {
            throwError('RangeError', numArgs, 'numArgs', expectedNumArgs, `'${funcName}' function`, numArgs);
        }

        numArgs = [numArgs];
    }
    /* Throws a TypeError if 'numArgs' isn't an array at this point. */
    if (!Array.isArray(numArgs)) {
        throwError('TypeError', numArgs, 'numArgs', expectedNumArgs, `'${funcName}' function`);
    }
    /* Throws a RangeError if 'numArgs' is an empty array. */
    if (numArgs.length < 1) {
        throwError('RangeError', numArgs, 'numArgs', expectedNumArgs, `'${funcName}' function`, `empty array`);
    }

    /* Casts each string in 'numArgs' to a number after trimming. */
    numArgs = numArgs.map((arg) => (typeof arg === 'string' ? Number(arg.trim()) : arg));

    /* Throws a RangeError if not all numbers in 'numArgs' are integers. */
    if (!numArgs.every(Number.isInteger)) {
        throwError('RangeError', numArgs, 'numArgs', expectedNumArgs, `'${funcName}' function`, numArgs.join(', '));
    }

    /* Throws a RangeError if the number of arguments doesn't match the expected value or range. */
    if (!numArgs.includes(args.length)) {
        throwError(
            'RangeError',
            args,
            'number of arguments',
            `one of ${numArgs.join(', ')}`,
            `'${funcName}' function`,
            args.length
        );
    }

    /* Checks the types of the arguments if 'argTypes' is defined. */
    if (typeof argTypes !== 'undefined') {
        /*
            Throws a RangeError if 'argTypes' is an empty string, or
            wraps it in an array after trimming for further processing.
        */
        if (typeof argTypes === 'string') {
            if (argTypes.trim().length < 1) {
                throwError(
                    'RangeError',
                    argTypes,
                    'argTypes',
                    expectedArgTypes,
                    `'${funcName}' function`,
                    `empty string`
                );
            }

            argTypes = [argTypes.trim()];
        }
        /* Throws a TypeError if 'argTypes' isn't an array at this point. */
        if (!Array.isArray(argTypes)) {
            throwError('TypeError', argTypes, 'argTypes', expectedArgTypes, `'${funcName}' function`);
        }
        /* Throws a RangeError if 'argTypes' is an empty array. */
        if (argTypes.length < 1) {
            throwError('RangeError', argTypes, 'argTypes', expectedArgTypes, `'${funcName}' function`, `empty array`);
        }
        /* Throws a TypeError if not all elements in 'argTypes' are strings or arrays of strings. */
        if (
            !argTypes.every(
                (arg) =>
                    typeof arg === 'string' || (Array.isArray(arg) && arg.every((subArg) => typeof subArg === 'string'))
            )
        ) {
            throwError('TypeError', argTypes, 'argTypes', expectedArgTypes, `'${funcName}' function`);
        }

        /* Trims all strings in 'argTypes'. */
        argTypes = argTypes.map((arg) => (typeof arg === 'string' ? arg.trim() : arg.map((subArg) => subArg.trim())));

        /* Throws a RangeError if 'argTypes' contains an empty string. */
        if (
            !argTypes.every((arg) =>
                typeof arg === 'string' ? arg.length > 0 : arg.every((subArg) => subArg.length > 0)
            )
        ) {
            throwError(
                'RangeError',
                argTypes,
                'argTypes',
                expectedArgTypes,
                `'${funcName}' function`,
                `array or array of arrays containing 1 or more empty strings`
            );
        }

        /* Checks the types of the arguments. */
        for (let i = 0; i < args.length; i++) {
            checkArg(funcName, args[i], argTypes[i]);
        }
    }
}

/**
 * Formats a namespaced id or path to a valid Resource Location string.
 *
 * @param {string} id - The namespaced id or path to format. Cannot contain more than 1 colon (':').
 * @param {boolean|undefined} [isPath=false] - Whether 'id' includes a path. If true, allows forward slashes ('/'). Default: false.
 *
 * @throws {RangeError} If number of arguments is not 1 or 2, or if 'id' is an empty string, or if 'id' contains more than 1 colon.
 * @throws {TypeError} If 'id' is not a string, or if 'isPath' is defined but not a boolean.
 *
 * @returns {string} The formatted Resource Location string.
 */
function formatResourceLocationStr(id, isPath) {
    checkArguments('formatResourceLocationStr', arguments, [1, 2], ['string', ['boolean', undefined]]);

    /* Throws a RangeError if 'id' contains more than 1 colon. */
    if (id.split(':').length > 2) {
        throwError(
            'RangeError',
            id,
            'id',
            `'id' not to contain more than 1 colon (':')`,
            `'formatResourceLocationStr' function`,
            `'id' containing ${id.split(':').length - 1} colons`
        );
    }

    /* Defaults 'isPath' to false if it's undefined. */
    isPath = isPath ? isPath : false;

    /**
     * RexExp pattern for Resource Location string validation.
     *
     * Matches any character that isn't a lowercase alphanumeric, underscore, hyphen, period, or colon.
     * If 'isPath' is true, it doesn't match forward slashes either.
     *
     * @type {RegExp}
     */
    const pattern = isPath ? /[^0-9a-z_\-./:]/g : /[^0-9a-z_\-.:]/g;

    /* 
        Formats 'id' by converting to lowercase, trimming start and end spaces, replacing remaining
        spaces with underscores, and applying the regex pattern to remove disallowed characters.
    */
    return id.toLowerCase().trim().replace(/\s+/g, '_').replace(pattern, '');
}

/**
 * Checks if a value is an Array.
 *
 * @param {*} value - The value to check.
 *
 * @throws {RangeError} If number of arguments is not 1.
 *
 * @returns {boolean} True if the value is an Array.
 */
function isArray(value) {
    checkArguments('isArray', arguments, 1);

    return Array.isArray(value);
}

/**
 * Checks if a value is an Array and not empty.
 *
 * @param {*} value - The value to check.
 *
 * @throws {RangeError} If number of arguments is not 1.
 *
 * @returns {boolean} True if the value is an Array and not empty.
 */
function isArrayAndNotEmpty(value) {
    return isArray(value) && value.length > 0;
}

/**
 * Checks if a value is a boolean.
 *
 * @param {*} value - The value to check.
 *
 * @throws {RangeError} If number of arguments is not 1.
 *
 * @returns {boolean} True if the value is a boolean.
 */
function isBoolean(value) {
    checkArguments('isBoolean', arguments, 1);

    return typeof value === 'boolean';
}

/**
 * Checks if a value is defined.
 *
 * @param {*} value - The value to check.
 *
 * @throws {RangeError} If number of arguments is not 1.
 *
 * @returns {boolean} True if the value is defined.
 */
function isDefined(value) {
    checkArguments('isDefined', arguments, 1);

    return typeof value !== 'undefined';
}

/**
 * Checks if a value is a RegExp.
 *
 * @param {*} value - The value to check.
 *
 * @throws {RangeError} If number of arguments is not 1.
 *
 * @returns {boolean} True if the value is a RegExp or looks like a RegExp.
 *
 * Temporary solution! Will also match any string starting with a forward slash and containing another.
 *
 * @todo Fix the check for RegExp instances. Rhino's regexes are not instances of RegExp. They're from dev.latvian.mods.rhino.regexp.NativeRegExp. Currently there's no way to check if a value is an instance of a Rhino RegExp.
 */
function isRegExp(value) {
    checkArguments('isRegExp', arguments, 1);

    return value instanceof RegExp || (`${value}`.startsWith('/') && `${value}`.lastIndexOf('/') > 0);
}

/**
 * Checks if a value is a string.
 *
 * @param {*} value - The value to check.
 *
 * @throws {RangeError} If number of arguments is not 1.
 *
 * @returns {boolean} True if the value is a string.
 */
function isString(value) {
    checkArguments('isString', arguments, 1);

    return typeof value === 'string';
}

/**
 * Checks if a value is a string and not empty.
 *
 * @param {*} value - The value to check.
 *
 * @throws {RangeError} If number of arguments is not 1.
 *
 * @returns {boolean} True if the value is a string and not empty.
 */
function isStringAndNotEmpty(value) {
    return isString(value) && value.trim().length > 0;
}

/**
 * Checks if a value is a TagEventJS.
 *
 * @param {*} value - The value to check.
 *
 * @throws {RangeError} If number of arguments is not 1.
 *
 * @returns {boolean} True if the value is a TagEventJS.
 */
function isTagEventJS(value) {
    checkArguments('isTagEventJS', arguments, 1);

    return value instanceof TagEventJS;
}

/**
 * Checks if a value is undefined.
 *
 * @param {*} value - The value to check.
 *
 * @throws {RangeError} If number of arguments is not 1.
 *
 * @returns {boolean} True if the value is undefined.
 */
function isUndefined(value) {
    return !isDefined(value);
}

/**
 * Checks if (an) item(s) exist(s) in the registry.
 *
 * @param {string|string[]} itemIds - The item id(s) to check.
 *
 * @throws {RangeError} If number of arguments is not 1, or if 'itemIds' is an empty string or an empty Array.
 * @throws {TypeError} If 'itemIds' is not a string or an array of strings.
 *
 * @returns {boolean} True if the item(s) exist(s).
 */
function itemsExist(itemIds) {
    checkArguments('itemsExist', arguments, 1, ['string', 'string[]']);

    /* Wraps 'itemIds' in an array for further processing, if it isn't an array already. */
    if (!isArray(itemIds)) itemIds = [itemIds];

    return itemIds.map((itemId) => formatResourceLocationStr(itemId)).every((itemId) => Item.exists(itemId));
}

/**
 * Logs a warning if an item is not found.
 *
 * @param {string} itemId - The item id.
 * @param {string} activityType - The skipped activity.
 * @param {string|undefined} [itemType] - The item type.
 *
 * @throws {RangeError} If number of arguments is not 2 or 3.
 * @throws {TypeError} If 'itemId' or 'activityType' is not a string, or if 'itemType' is defined but not a string.
 *
 * @returns {void}
 */
function logItemNotFound(itemId, activityType, itemType) {
    checkArguments('logItemNotFound', arguments, [2, 3], ['string', 'string', 'string']);

    const prefix = itemType ? `${itemType.trim()} item` : 'Item';

    console.warn(`${prefix} with id ${itemId.trim()} is not found! Skipping ${activityType.trim()}...`);
}

/**
 * Logs a warning if a mod is not loaded.
 *
 * @param {string} modName - The mod name.
 * @param {string} activityType - The skipped activity.
 *
 * @throws {RangeError} If number of arguments is not 2.
 * @throws {TypeError} If 'modName' or 'activityType' is not a string.
 *
 * @returns {void}
 */
function logModNotLoaded(modName, activityType) {
    checkArguments('logModNotLoaded', arguments, 2, ['string', 'string']);

    console.warn(`${modName.trim()} mod is not loaded! Skipping ${activityType.trim()}...`);
}

/**
 * Logs a warning if a tag is not found.
 *
 * @param {string} tagId - The tag id.
 * @param {string} activityType - The activity type.
 * @param {string|undefined} [tagType] - The tag type.
 *
 * @throws {RangeError} If number of arguments is not 2 or 3.
 * @throws {TypeError} If 'tagId' or 'activityType' is not a string, or if 'tagType' is defined but not a string.
 *
 * @returns {void}
 */
function logTagNotFound(tagId, activityType, tagType) {
    checkArguments('logTagNotFound', arguments, [2, 3], ['string', 'string', 'string']);

    const prefix = tagType ? `${tagType.trim()} tag` : 'Tag';

    console.warn(`${prefix} #${tagId.trim()} is not found! Skipping ${activityType.trim()}...`);
}

/**
 * Removes duplicate values from an Array.
 *
 * @param {*[]} values - The Array from which to remove duplicates.
 *
 * @throws {RangeError} If number of arguments is not 1, or if 'values' is an empty Array.
 * @throws {TypeError} If 'values' is not an Array.
 *
 * @returns {*[]} A new Array with unique elements.
 */
function removeDuplicates(values) {
    checkArguments('removeDuplicates', arguments, 1, '[]');

    return values.filter((value, index) => values.indexOf(value) === index);
}

/**
 * Throws an error with a structured message.
 *
 * Note: This function is not called recursively within itself to prevent an infinite loop and a potential stack overflow.
 *
 * Note: The 'checkArguments' function is not used in this function to validate the parameters because it could create a circular dependency as 'checkArguments' also uses this function. Instead, basic type checks are used to validate the parameters.
 *
 * @param {string} errorType - The type of error to throw ('RangeError' or 'TypeError').
 * @param {*} arg - The argument that caused the error.
 * @param {string} argName - The name of the invalid argument.
 * @param {string} expected - The expected value, range, or type of the argument.
 * @param {string} action - The action that was being performed when the error occurred.
 * @param {*} [received=typeof arg] - The actual value of the argument that caused the error (only used for RangeError).
 *
 * @returns {void}
 *
 * @throws {RangeError|TypeError} Throws a RangeError or TypeError based on 'errorType'. If 'errorType' is not 'RangeError' or 'TypeError', a generic Error is thrown.
 */
function throwError(errorType, arg, argName, expected, action, received) {
    /*
        Throws a TypeError if 'errorType' isn't a string,
        or a RangeError if 'errorType' is an empty string.
    */
    if (!isStringAndNotEmpty(errorType)) {
        if (!isString(errorType)) {
            throw new TypeError(
                `Invalid 'errorType'! Expected string, but received ${typeof errorType}. Aborting throwing initial error...`
            );
        } else {
            throw new RangeError(
                `Invalid 'errorType'! Expected non-empty string, but received empty string. Aborting throwing initial error...`
            );
        }
    }

    /* Throws a RangeError if 'arg' is undefined. */
    if (isUndefined(arg)) {
        throw new RangeError(
            `Invalid 'arg'! Expected an argument, but received none. Aborting throwing initial error...`
        );
    }

    /*
        Throws a TypeError if 'argName' isn't a string,
        or a RangeError if 'argName' is an empty string.
    */
    if (!isStringAndNotEmpty(argName)) {
        if (!isString(argName)) {
            throw new TypeError(
                `Invalid 'argName'! Expected string, but received ${typeof argName}. Aborting throwing initial error...`
            );
        } else {
            throw new RangeError(
                `Invalid 'argName'! Expected non-empty string, but received empty string. Aborting throwing initial error...`
            );
        }
    }

    /*
        Throws a TypeError if 'expected' isn't a string,
        or a RangeError if 'expected' is an empty string.
    */
    if (!isStringAndNotEmpty(expected)) {
        if (!isString(expected)) {
            throw new TypeError(
                `Invalid 'expected'! Expected string, but received ${typeof expected}. Aborting throwing initial error...`
            );
        } else {
            throw new RangeError(
                `Invalid 'expected'! Expected non-empty string, but received empty string. Aborting throwing initial error...`
            );
        }
    }

    /*
        Throws a TypeError if 'action' isn't a string,
        or a RangeError if 'action' is an empty string.
    */
    if (!isStringAndNotEmpty(action)) {
        if (!isString(action)) {
            throw new TypeError(
                `Invalid 'action'! Expected string, but received ${typeof action}. Aborting throwing initial error...`
            );
        } else {
            throw new RangeError(
                `Invalid 'action'! Expected non-empty string, but received empty string. Aborting throwing initial error...`
            );
        }
    }

    /* Defaults 'received' to 'typeof arg' if it's undefined. */
    if (isUndefined(received)) {
        received = typeof arg;
    }

    const message = `Invalid '${argName.trim()}'! Expected ${expected.trim()}, but received ${received}. Aborting ${action.trim()}...`;

    switch (errorType) {
        case 'RangeError':
            throw new RangeError(message);
        case 'TypeError':
            throw new TypeError(message);
        default:
            throw new Error(
                `Invalid error type: '${errorType}'! Expected 'RangeError' or 'TypeError'. Aborting throwing initial error...`
            );
    }
}

/* Global exports */

global['checkArguments'] = checkArguments;

global['formatResourceLocationStr'] = formatResourceLocationStr;

global['isArray'] = isArray;
global['isArrayAndNotEmpty'] = isArrayAndNotEmpty;
global['isBoolean'] = isBoolean;
global['isDefined'] = isDefined;
global['isRegExp'] = isRegExp;
global['isString'] = isString;
global['isStringAndNotEmpty'] = isStringAndNotEmpty;
global['isTagEventJS'] = isTagEventJS;
global['isUndefined'] = isUndefined;

global['itemsExist'] = itemsExist;

global['logItemNotFound'] = logItemNotFound;
global['logModNotLoaded'] = logModNotLoaded;
global['logTagNotFound'] = logTagNotFound;

global['removeDuplicates'] = removeDuplicates;

global['throwError'] = throwError;
