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

    if (isBlockAndItemCountLogEnabled)
        console.log(`There are ${itemIds.length} items and ${blockIds.length} blocks registered`);
});

/**
 * Validates the number and types of arguments. If the validation fails, it throws an error.
 *
 * Note: This function uses direct type checks with 'typeof', 'instanceof', and 'Array.isArray()' for validation.
 * This is to avoid circular dependencies and potential infinite loops, as utility functions like 'isString' or 'isNumber' are defined using 'checkArguments'.
 * 'typeof' is used for primitive types, 'instanceof' is used for RegExp and Date objects, and 'Array.isArray()' is used for Arrays.
 *
 * @param {string} funcName - The name of the function to check the arguments for.
 * @param {*} args - The arguments to check.
 * @param {number|string|Array<number|string>} numArgs - The expected number of arguments or an Array of valid numbers of arguments.
 * @param {string|Array<string>|Array<Array<string>>|undefined} [argTypes] - The expected types of the arguments.
 *
 * @throws {RangeError} If the number of arguments or the value of an argument does not match the expected value or range.
 * @throws {TypeError} If the type of an argument does not match the expected type.
 *
 * @returns {void}
 */
function checkArguments(funcName, args, numArgs, argTypes) {
    /**
     * A string containing info about the expected numArgs.
     *
     * @type {string}
     */
    const expectedNumArgs = `string containing a positive integer, positive integer, or array of strings containing positive integers or positive integers`;
    /**
     * A string containing info about the expected argTypes.
     *
     * @type {string}
     */
    const expectedArgTypes = `non-empty string, array of non-empty strings, array of arrays of non-empty strings, or undefined`;

    /**
     * Checks if the argument is of one of the expected types or instances and not empty if argument is an Array or a string.
     *
     * @param {*} arg - The argument to check.
     * @param {string|Array<string>} expectedType - The expected type(s) of the argument.
     *
     * @returns {void}
     *
     * @throws {TypeError} If the argument is not of any of the expected types.
     * @throws {RangeError} If the argument is an empty Array or an empty string.
     */
    function checkArg(arg, expectedTypes) {
        let isValidType = false;
        let isEmptyArray = false;
        let isEmptyString = false;

        if (!Array.isArray(expectedTypes)) {
            expectedTypes = [expectedTypes];
        }

        for (let expectedType of expectedTypes) {
            expectedType = expectedType.toLowerCase();

            switch (expectedType) {
                case 'regular expression':
                case 'regexp':
                case 'regex':
                    isValidType =
                        arg instanceof RegExp ||
                        (arg.toString().startsWith('/') && arg.toString().lastIndexOf('/') > 0);
                    break;
                case 'array':
                case '[]':
                    isValidType = Array.isArray(arg);
                    isEmptyArray = arg.length < 1;
                    break;
                case 'array<string>':
                case 'string[]':
                    isValidType = Array.isArray(arg) && arg.every((subArg) => typeof subArg === 'string');
                    isEmptyArray = arg.length < 1;
                    break;
                case 'array<number>':
                case 'number[]':
                    isValidType = Array.isArray(arg) && arg.every((subArg) => typeof subArg === 'number');
                    isEmptyArray = arg.length < 1;
                    break;
                case 'array<integer>':
                case 'array<int>':
                case 'integer[]':
                case 'int[]':
                    isValidType = Array.isArray(arg) && arg.every(Number.isInteger);
                    isEmptyArray = arg.length < 1;
                    break;
                case 'date':
                    isValidType = arg instanceof Date;
                    break;
                case 'tageventjs':
                    isValidType = arg instanceof TagEventJS;
                    break;
                case 'object':
                    isValidType = typeof arg === 'object' && arg !== null && !Array.isArray(arg);
                    break;
                case 'string':
                    isValidType = typeof arg === 'string';
                    isEmptyString = arg.trim().length < 1;
                    break;
                case 'bool':
                case 'boolean':
                    isValidType = typeof arg === 'boolean';
                    break;
                default:
                    isValidType = typeof arg === expectedType;
            }

            if (isValidType) {
                break;
            }
        }

        /* Throws an error if the argument isn't of any of the expected types. */
        if (!isValidType) {
            throwTypeError(arg, 'arg', expectedTypes.join(' or '), `'${funcName}' function`);
        }

        /* Throws an error if the argument is an empty Array or an empty string. */
        if (isEmptyArray || isEmptyString) {
            throwRangeError(
                'arg',
                `non-empty ${expectedTypes.join(' or ')}`,
                `empty ${expectedTypes.join(' or ')}`,
                `'${funcName}' function`
            );
        }
    }

    /* Throws an error if the provided 'funcName' isn't a string. */
    if (typeof funcName !== 'string') {
        throwTypeError(funcName, 'funcName', 'string', 'function');
    }

    /* Throws an error if the provided 'funcName' is an empty string. */
    if (funcName.trim().length < 1) {
        throwRangeError('funcName', 'non-empty string', `empty string`, 'function');
    }

    if (typeof args === 'undefined') {
        throwRangeError('args', '1 or more arguments', 0, `'${funcName}' function`);
    }

    /* Converts 'numArgs' to a number and puts it in an array if it's a non-empty string, or throws an error if 'numArgs' is an empty string. */
    if (typeof numArgs === 'string') {
        if (numArgs.trim().length < 1) {
            throwRangeError('numArgs', expectedNumArgs, `empty string`, `'${funcName}' function`);
        }

        numArgs = [Number(numArgs.trim())];
    }

    /* Puts 'numArgs' in an array if it's a number bigger than 0, or throws an error if 'numArgs' is a number smaller than 1. */
    if (typeof numArgs === 'number') {
        if (numArgs < 1) {
            throwRangeError('numArgs', expectedNumArgs, numArgs, `'${funcName}' function`);
        }

        numArgs = [numArgs];
    }

    /*
        Converts each string element to a number if 'numArgs' is an array, or throws
        an error if 'numArgs' isn't an array or if not all elements are integers.
    */
    if (Array.isArray(numArgs)) {
        numArgs = numArgs.map((arg) => (typeof arg === 'string' ? Number(arg.trim()) : arg));

        if (!numArgs.every(Number.isInteger)) {
            throwRangeError('numArgs', expectedNumArgs, numArgs.join(', '), `'${funcName}' function`);
        }
    } else {
        throwTypeError(numArgs, 'numArgs', expectedNumArgs, `'${funcName}' function`);
    }

    /* Validates if argTypes is a non-empty string, array of non-empty strings, or array of arrays with non-empty strings. */
    if (typeof argTypes !== 'undefined') {
        if (typeof argTypes === 'string') {
            if (argTypes.trim().length < 1) {
                throwRangeError('argTypes', expectedArgTypes, `empty string`, `'${funcName}' function`);
            }

            /* Converts argTypes to an array if it's a non-empty string. */
            argTypes = [argTypes.trim()];
        } else if (Array.isArray(argTypes)) {
            /* If argTypes is an array, check if every element is either a string or an array of strings. */
            if (
                !argTypes.every(
                    (arg) =>
                        typeof arg === 'string' ||
                        (Array.isArray(arg) && arg.every((subArg) => typeof subArg === 'string'))
                )
            ) {
                throwTypeError(argTypes, 'argTypes', expectedArgTypes, `'${funcName}' function`);
            }

            /* Trims all string elements. */
            argTypes = argTypes.map((arg) =>
                typeof arg === 'string' ? arg.trim() : arg.map((subArg) => subArg.trim())
            );

            /* If argTypes is an array, check if every element is either a non-empty string or an array of non-empty strings. */
            if (
                !argTypes.every((arg) =>
                    typeof arg === 'string' ? arg.length > 0 : arg.every((subArg) => subArg.length > 0)
                )
            ) {
                throwRangeError(
                    'argTypes',
                    expectedArgTypes,
                    `array or array of arrays containing 1 or more empty strings`,
                    `'${funcName}' function`
                );
            }
        } else {
            throwTypeError(argTypes, 'argTypes', expectedArgTypes, `'${funcName}' function`);
        }
    }

    /* Validates the number of arguments. */
    if (!numArgs.includes(args.length)) {
        throwRangeError('number of arguments', `one of ${numArgs.join(', ')}`, args.length, `'${funcName}' function`);
    }

    /* Validates the types of the arguments if 'argTypes' is defined. */
    if (argTypes !== undefined) {
        for (let i = 0; i < args.length; i++) {
            checkArg(args[i], argTypes[i]);
        }
    }
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
const isArray = (value) => {
    checkArguments('isArray', arguments, 1);

    return Array.isArray(value);
};

/**
 * Checks if a value is an Array and not empty.
 *
 * @param {*} value - The value to check.
 *
 * @throws {RangeError} If number of arguments is not 1.
 *
 * @returns {boolean} True if the value is an Array and not empty.
 */
const isArrayAndNotEmpty = (value) => isArray(value) && value.length > 0;

/**
 * Checks if a value is a boolean.
 *
 * @param {*} value - The value to check.
 *
 * @throws {RangeError} If number of arguments is not 1.
 *
 * @returns {boolean} True if the value is a boolean.
 */
const isBoolean = (value) => {
    checkArguments('isBoolean', arguments, 1);

    return typeof value === 'boolean';
};

/**
 * Checks if a value is defined.
 *
 * @param {*} value - The value to check.
 *
 * @throws {RangeError} If number of arguments is not 1.
 *
 * @returns {boolean} True if the value is defined.
 */
const isDefined = (value) => {
    checkArguments('isDefined', arguments, 1);

    return typeof value !== 'undefined';
};

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
const isRegExp = (value) => {
    checkArguments('isRegExp', arguments, 1);

    return value instanceof RegExp || (value.toString().startsWith('/') && value.toString().lastIndexOf('/') > 0);
};

/**
 * Checks if a value is a string.
 *
 * @param {*} value - The value to check.
 *
 * @throws {RangeError} If number of arguments is not 1.
 *
 * @returns {boolean} True if the value is a string.
 */
const isString = (value) => {
    checkArguments('isString', arguments, 1);

    return typeof value === 'string';
};

/**
 * Checks if a value is a string and not empty.
 *
 * @param {*} value - The value to check.
 *
 * @throws {RangeError} If number of arguments is not 1.
 *
 * @returns {boolean} True if the value is a string and not empty.
 */
const isStringAndNotEmpty = (value) => isString(value) && value.trim().length > 0;

/**
 * Checks if a value is a TagEventJS.
 *
 * @param {*} value - The value to check.
 *
 * @throws {RangeError} If number of arguments is not 1.
 *
 * @returns {boolean} True if the value is a TagEventJS.
 */
const isTagEventJS = (value) => {
    checkArguments('isTagEventJS', arguments, 1);

    return value instanceof TagEventJS;
};

/**
 * Checks if a value is undefined.
 *
 * @param {*} value - The value to check.
 *
 * @throws {RangeError} If number of arguments is not 1.
 *
 * @returns {boolean} True if the value is undefined.
 */
const isUndefined = (value) => !isDefined(value);

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
const itemsExist = (itemIds) => {
    checkArguments('itemsExist', arguments, 1, ['string', 'string[]']);

    /* Wraps 'itemIds' in an array for further processing, if it isn't an array already. */
    if (!isArray(itemIds)) itemIds = [itemIds];

    return itemIds.map((itemId) => formatResourceLocationStr(itemId)).every((itemId) => Item.exists(itemId));
};

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
const logItemNotFound = (itemId, activityType, itemType) => {
    checkArguments('logItemNotFound', arguments, [2, 3], ['string', 'string', 'string']);

    const prefix = itemType ? `${itemType.trim()} item` : 'Item';

    console.warn(`${prefix} with id ${itemId.trim()} is not found! Skipping ${activityType.trim()}...`);
};

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
const logModNotLoaded = (modName, activityType) => {
    checkArguments('logModNotLoaded', arguments, 2, ['string', 'string']);

    console.warn(`${modName.trim()} mod is not loaded! Skipping ${activityType.trim()}...`);
};

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
const logTagNotFound = (tagId, activityType, tagType) => {
    checkArguments('logTagNotFound', arguments, [2, 3], ['string', 'string', 'string']);

    const prefix = tagType ? `${tagType.trim()} tag` : 'Tag';

    console.warn(`${prefix} #${tagId.trim()} is not found! Skipping ${activityType.trim()}...`);
};

/**
 * Formats a namespaced id or path to a valid Resource Location string.
 *
 * @param {string} id - The namespaced id or path to format.
 * @param {boolean|undefined} [isPath=false] - Whether id includes a path. Allows forward slashes '/' if true. Default: false.
 *
 * @throws {RangeError} If number of arguments is not 1 or 2, or if 'id' is an empty string.
 * @throws {TypeError} If 'id' is not a string, or if 'isPath' is defined but not a boolean.
 *
 * @returns {string} The formatted Resource Location string.
 */
const formatResourceLocationStr = (id, isPath) => {
    checkArguments('formatResourceLocationStr', arguments, [1, 2], ['string', 'boolean']);

    /* Defaults 'isPath' to false if it's undefined. */
    if (isUndefined(isPath)) {
        isPath = false;
    }

    /**
     * Regular expression pattern for string validation.
     * Matches any character that is not a lowercase alphanumeric, underscore, hyphen, period, or colon.
     * If 'isPath' is true, it does not match forward slashes either.
     *
     * @type {RegExp}
     */
    const pattern = isPath ? /[^0-9a-z_\-./:]/g : /[^0-9a-z_\-.:]/g;

    /* 
        Formats 'id' by converting to lower case, trimming start and end spaces, replacing remaining
        spaces with underscores, and applying the regex pattern to remove disallowed characters.
    */
    return id.toLowerCase().trim().replace(/\s+/g, '_').replace(pattern, '');
};

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
const removeDuplicates = (values) => {
    checkArguments('removeDuplicates', arguments, 1, '[]');

    return values.filter((value, index) => values.indexOf(value) === index);
};

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

global['formatResourceLocationStr'] = formatResourceLocationStr;

global['removeDuplicates'] = removeDuplicates;

global['throwError'] = throwError;
