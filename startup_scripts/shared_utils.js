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

/**
 * The block ids of all blocks.
 *
 * @type {string[]}
 */
let blockIds;

/**
 * The item ids of all items.
 *
 * @type {string[]}
 */
let itemIds;

/* Listen to post-init event, after all mods have loaded */
StartupEvents.postInit(() => {
    blockIds = Block.getTypeList()
        .toArray()
        .map((blockId) => `${blockId}`)
        .filter((blockId) => blockId !== 'minecraft:air');

    itemIds = Item.getTypeList()
        .toArray()
        .map((itemId) => `${itemId}`)
        .filter((itemId) => itemId !== 'minecraft:air');

    global['blockIds'] = blockIds;
    global['itemIds'] = itemIds;

    if (isBlockAndItemCountLogEnabled) {
        console.info(`There are ${blockIds.length} blocks and ${itemIds.length} items registered.`);

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

        /*
            Converts the maps to arrays of [modName, count] pairs, sorts
            them in descending order of count, and logs the sorted counts.
        */
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
 * Checks if the argument is of one of the expected types or instances and
 *     not empty if argument is an Array, a string or an Object.
 *
 * IMPORTANT: This function is intended to be used only in conjunction with
 *     the checkArguments function, and should not be used independently!
 *
 * @param {string} functionName - The name of the function to check the argument for.
 * @param {*} argument - The argument to check.
 * @param {string|string[]} expectedType - The expected type(s) of the argument.
 *
 * @returns {void}
 *
 * @throws {TypeError} If the argument is not of any of the expected types.
 * @throws {RangeError} If the argument is an empty Array or an empty Object, or is/contains an empty string.
 *
 * @see {@link checkArguments}
 */
function checkArgument(functionName, argument, expectedTypes) {
    let isValidType = false;
    let isEmptyArray = false;
    let isEmptyObject = false;
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
            case 'arr':
            case '[]':
                isValidType = Array.isArray(argument);
                isEmptyArray = Array.isArray(argument) && argument.length === 0;
                break;
            case 'array<integer>':
            case 'arr<integer>':
            case 'array<int>':
            case 'arr<int>':
            case 'integer[]':
            case 'int[]':
                isValidType = Array.isArray(argument) && argument.every(Number.isInteger);
                isEmptyArray = Array.isArray(argument) && argument.length === 0;
                break;
            case 'array<number>':
            case 'arr<number>':
            case 'array<num>':
            case 'arr<numb>':
            case 'number[]':
            case 'num[]':
                isValidType = Array.isArray(argument) && argument.every((subArg) => typeof subArg === 'number');
                isEmptyArray = Array.isArray(argument) && argument.length === 0;
                break;
            case 'array<string>':
            case 'arr<string>':
            case 'array<str>':
            case 'arr<str>':
            case 'string[]':
            case 'str[]':
                isValidType = Array.isArray(argument) && argument.every((subArg) => typeof subArg === 'string');
                isEmptyArray = Array.isArray(argument) && argument.length === 0;
                isEmptyString =
                    (typeof argument === 'string' && subArg.trim() === '') ||
                    (Array.isArray(argument) &&
                        argument.some((subArg) => typeof subArg === 'string' && subArg.trim() === ''));
                break;
            case 'boolean':
            case 'bool':
                isValidType = typeof argument === 'boolean';
                break;
            case 'date':
                isValidType = argument instanceof Date;
                break;
            case 'integer':
            case 'int':
                isValidType = Number.isInteger(argument);
                break;
            case 'number':
            case 'num':
                isValidType = typeof argument === 'number';
                break;
            case 'object':
            case 'obj':
            case '{}':
                isValidType = typeof argument === 'object' && Object.getPrototypeOf(argument) === Object.prototype;
                isEmptyObject =
                    typeof argument === 'object' &&
                    Object.getPrototypeOf(argument) === Object.prototype &&
                    Object.keys(argument).length === 0;
                break;
            case 'regular expression':
            case 'regexp':
            case 'regex':
                isValidType =
                    argument instanceof RegExp || (`${argument}`.startsWith('/') && `${argument}`.lastIndexOf('/') > 0);
                break;
            case 'string':
            case 'str':
                isValidType = typeof argument === 'string';
                isEmptyString = typeof argument === 'string' && argument.trim() === '';
                break;
            case 'tageventjs':
                isValidType = argument instanceof TagEventJS;
                break;
            default:
                isValidType = typeof argument === expectedType;
        }

        /* Stops checking the other types if the argument is of a valid type. */
        if (isValidType) {
            break;
        }
    }

    /* Throws a TypeError if the argument isn't of any of the expected types. */
    if (!isValidType) {
        throwError('TypeError', argument, 'argument', expectedTypes.join(' or '), `'${functionName}' function`);
    }

    /* Throws a RangeError if the argument is an empty Array, an empty Object or is/contains an empty string. */
    if (isEmptyArray || isEmptyObject || isEmptyString) {
        let type = isEmptyArray ? 'array' : isEmptyObject ? 'object' : 'string';

        throwError(
            'RangeError',
            argument,
            'argument',
            `non-empty ${type}`,
            `'${functionName}' function`,
            `empty ${type}`
        );
    }
}

/**
 * Validates the number and types of arguments. If the validation fails, it throws an error.
 *
 * Note: Always include 'undefined' in 'argumentTypes' for optional parameters, even if they have default values.
 *     This prevents errors when calling the function with later parameters but omitting earlier optional ones.
 *     For example, use ['string', ['string', 'undefined'], 'string'] if the 2nd parameter is optional and a 3rd param
 *     is provided. This ensures the function correctly handles the 2nd param being omitted,
 *     even if it defaults to a string.
 *
 * Note: This function uses direct type checks with 'typeof', 'instanceof', and 'Array.isArray()' for validation.
 *     This is to avoid circular dependencies and potential infinite loops, as utility
 *     functions like 'isString' or 'isNumber' are defined using 'checkArguments'.
 *
 * @param {string} functionName - The name of the function to check the arguments for.
 * @param {Object|*[]} arguments - The arguments to check. Can be the arguments object or an array of arguments.
 * @param {number|string|(number|string)[]} numberOfArguments - The expected number of arguments or
 *     an Array of valid numbers of arguments.
 * @param {string|string[]|string[][]|undefined} [argumentTypes] - The expected types of the arguments, or undefined.
 *
 * @returns {void} This function does not return anything. It throws an error if the validation fails.
 *
 * @throws {RangeError} If the number of arguments or the value of an argument
 *     does not match the expected value or range.
 * @throws {TypeError} If the type of an argument does not match the expected type.
 *
 * @see {@link checkArgument}
 */
function checkArguments(functionName, arguments, numberOfArguments, argumentTypes) {
    /**
     * A string containing info about the expected 'numberOfArguments'.
     *
     * @type {string}
     * @const
     */
    const expectedNumberOfArguments =
        'string containing a positive integer, positive integer,' +
        ' or array of strings containing positive integers and positive integers';
    /**
     * A string containing info about the expected 'argumentTypes'.
     *
     * @type {string}
     * @const
     */
    const expectedArgumentTypes =
        'non-empty string, array of non-empty strings,' + ' array of arrays of non-empty strings, or undefined';

    /* Throws a TypeError if 'functionName' isn't a string. */
    if (typeof functionName !== 'string') {
        throwError('TypeError', functionName, 'functionName', 'string', 'function');
    }
    /* Throws a RangeError if 'functionName' is an empty string. */
    if (functionName.trim() === '') {
        throwError('RangeError', functionName, 'functionName', 'non-empty string', 'function', `empty string`);
    }

    /* Throws a TypeError if 'arguments' isn't the arguments object or an array */
    if (!(Object.prototype.toString.call(arguments) === '[object Arguments]' || Array.isArray(arguments))) {
        throwError(
            'TypeError',
            arguments,
            'arguments',
            'the arguments object or array of arguments',
            `'${functionName}' function`
        );
    }

    /* Throws a RangeError if 'arguments' is an empty arguments object or an empty array. */
    if (arguments.length === 0) {
        throwError(
            'RangeError',
            arguments,
            'arguments',
            'non-empty arguments object or array of arguments',
            `'${functionName}' function`,
            `empty ${Array.isArray(arguments) ? 'array' : 'arguments object'}`
        );
    }

    /* Iterates over 'arguments' and checks if strings, arrays and objects are not empty. */
    for (let i = 0; i < arguments.length; i++) {
        /* Throws a RangeError if an argument is an empty string. */
        if (typeof arguments[i] === 'string' && arguments[i].trim() === '') {
            throwError(
                'RangeError',
                arguments,
                `arguments[${i}]`,
                'non-empty string, array with non-empty strings or non-empty object',
                `'${functionName}' function`,
                'empty string'
            );
        }
        /* Throws a RangeError if an argument is an empty array. */
        if (Array.isArray(arguments[i]) && arguments[i].length === 0) {
            throwError(
                'RangeError',
                arguments,
                `arguments[${i}]`,
                'non-empty string, array with non-empty strings or non-empty object',
                `'${functionName}' function`,
                'empty array'
            );
        }
        /* Throws a RangeError if an argument is an array containing an empty string. */
        if (Array.isArray(arguments[i]) && arguments[i].some((arg) => typeof arg === 'string' && arg.trim() === '')) {
            throwError(
                'RangeError',
                arguments,
                `arguments[${i}]`,
                'non-empty string, array with non-empty strings or non-empty object',
                `'${functionName}' function`,
                'array with empty strings'
            );
        }
        /* Throws a RangeError if an argument is an empty object. */
        if (
            typeof arguments[i] === 'object' &&
            Object.getPrototypeOf(arguments[i]) === Object.prototype &&
            Object.keys(arguments[i]).length === 0
        ) {
            throwError(
                'RangeError',
                arguments,
                `arguments[${i}]`,
                'non-empty string, array with non-empty strings or non-empty object',
                `'${functionName}' function`,
                'empty object'
            );
        }
    }

    /*
        Throws a RangeError if 'numberOfArguments' is an empty string, or casts 'numberOfArguments'
        to a number after trimming and wraps it in an array for further processing.
    */
    if (typeof numberOfArguments === 'string') {
        if (numberOfArguments.trim() === '') {
            throwError(
                'RangeError',
                numberOfArguments,
                'numberOfArguments',
                expectedNumberOfArguments,
                `'${functionName}' function`,
                `empty string`
            );
        }

        numberOfArguments = [Number(numberOfArguments.trim())];
    }
    /*
        Throws a RangeError if 'numberOfArguments' is a number smaller
        than 1, or wraps it in an array for further processing.
    */
    if (typeof numberOfArguments === 'number') {
        if (numberOfArguments < 1) {
            throwError(
                'RangeError',
                numberOfArguments,
                'numberOfArguments',
                expectedNumberOfArguments,
                `'${functionName}' function`,
                numberOfArguments
            );
        }

        numberOfArguments = [numberOfArguments];
    }
    /* Throws a TypeError if 'numberOfArguments' isn't an array at this point. */
    if (!Array.isArray(numberOfArguments)) {
        throwError(
            'TypeError',
            numberOfArguments,
            'numberOfArguments',
            expectedNumberOfArguments,
            `'${functionName}' function`
        );
    }
    /* Throws a RangeError if 'numberOfArguments' is an empty array. */
    if (numberOfArguments.length === 0) {
        throwError(
            'RangeError',
            numberOfArguments,
            'numberOfArguments',
            expectedNumberOfArguments,
            `'${functionName}' function`,
            `empty array`
        );
    }

    /* Casts each string in 'numberOfArguments' to a number after trimming. */
    numberOfArguments = numberOfArguments.map((argNumber) =>
        typeof argNumber === 'string' ? Number(argNumber.trim()) : argNumber
    );

    /* Throws a RangeError if not all numbers in 'numberOfArguments' are integers. */
    if (!numberOfArguments.every(Number.isInteger)) {
        throwError(
            'RangeError',
            numberOfArguments,
            'numberOfArguments',
            expectedNumberOfArguments,
            `'${functionName}' function`,
            numberOfArguments.join(', ')
        );
    }

    /* Throws a RangeError if the number of arguments doesn't match the expected value or range. */
    if (!numberOfArguments.includes(arguments.length)) {
        throwError(
            'RangeError',
            arguments,
            'number of arguments',
            `one of ${numberOfArguments.join(', ')}`,
            `'${functionName}' function`,
            arguments.length
        );
    }

    /* Checks the types of the arguments if 'argumentTypes' is defined. */
    if (typeof argumentTypes !== 'undefined') {
        /*
            Throws a RangeError if 'argumentTypes' is an empty string, or
            wraps it in an array after trimming for further processing.
        */
        if (typeof argumentTypes === 'string') {
            if (argumentTypes.trim() === '') {
                throwError(
                    'RangeError',
                    argumentTypes,
                    'argumentTypes',
                    expectedArgumentTypes,
                    `'${functionName}' function`,
                    `empty string`
                );
            }

            argumentTypes = [argumentTypes.trim()];
        }
        /* Throws a TypeError if 'argumentTypes' isn't an array at this point. */
        if (!Array.isArray(argumentTypes)) {
            throwError(
                'TypeError',
                argumentTypes,
                'argumentTypes',
                expectedArgumentTypes,
                `'${functionName}' function`
            );
        }
        /* Throws a RangeError if 'argumentTypes' is an empty array. */
        if (argumentTypes.length === 0) {
            throwError(
                'RangeError',
                argumentTypes,
                'argumentTypes',
                expectedArgumentTypes,
                `'${functionName}' function`,
                `empty array`
            );
        }
        /* Throws a TypeError if not all elements in 'argumentTypes' are strings or arrays of strings. */
        if (
            !argumentTypes.every(
                (argType) =>
                    typeof argType === 'string' ||
                    (Array.isArray(argType) && argType.every((subArgType) => typeof subArgType === 'string'))
            )
        ) {
            throwError(
                'TypeError',
                argumentTypes,
                'argumentTypes',
                expectedArgumentTypes,
                `'${functionName}' function`
            );
        }

        /* Trims all strings in 'argumentTypes'. */
        argumentTypes = argumentTypes.map((argType) =>
            typeof argType === 'string' ? argType.trim() : argType.map((subArgType) => subArgType.trim())
        );

        /* Throws a RangeError if 'argumentTypes' contains an empty string. */
        if (
            !argumentTypes.every((argType) =>
                typeof argType === 'string' ? argType !== '' : argType.every((subArgType) => subArgType !== '')
            )
        ) {
            throwError(
                'RangeError',
                argumentTypes,
                'argumentTypes',
                expectedArgumentTypes,
                `'${functionName}' function`,
                `array or array of arrays containing 1 or more empty strings`
            );
        }

        /* Checks the types of the arguments. */
        for (let i = 0; i < arguments.length; i++) {
            checkArgument(functionName, arguments[i], argumentTypes[i]);
        }
    }
}

/**
 * Formats a namespaced id or path to a valid Resource Location string.
 *
 * @param {string} id - The namespaced id or path to format. Cannot contain more than 1 colon ':'.
 * @param {boolean} [isPath=false] - Whether 'id' includes a path. If true, allows forward slashes '/'. Default: false.
 *
 * @throws {RangeError} If number of arguments is not 1 or 2, or if 'id' is an empty string,
 *     or if 'id' contains more than 1 colon.
 * @throws {TypeError} If 'id' is not a string, or if 'isPath' is defined but not a boolean.
 *
 * @returns {string} The formatted Resource Location string.
 */
function formatResourceLocationStr(id, isPath) {
    checkArguments('formatResourceLocationStr', arguments, [1, 2], ['string', ['boolean', 'undefined']]);

    /* Throws a RangeError if 'id' contains more than 1 colon. */
    if (id.split(':').length > 2) {
        throwError(
            'RangeError',
            id,
            'id',
            `'id' not to contain more than 1 colon ':'`,
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
 * @todo Fix the check for RegExp instances. Rhino's regexes are not instances of RegExp.
 *     They're from dev.latvian.mods.rhino.regexp.NativeRegExp.
 *     Currently there's no way to check if a value is an instance of a Rhino RegExp.
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
    return isString(value) && value.trim() !== '';
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
 * Note: This function is not called recursively within itself to
 *     prevent an infinite loop and a potential stack overflow.
 *
 * Note: The 'checkArguments' function is not used in this function to validate the parameters because
 *     it could create a circular dependency as 'checkArguments' also uses this function.
 *     Instead, basic type checks are used to validate the parameters.
 *
 * @param {string} errorType - The type of error to throw ('RangeError' or 'TypeError').
 * @param {*} argument - The argument that caused the error.
 * @param {string} argumentName - The name of the invalid argument.
 * @param {string} expected - The expected value, range, or type of the argument.
 * @param {string} action - The action that was being performed when the error occurred.
 * @param {*} [received=typeof arg] - The actual value of the argument that caused the error
 *     (only used for RangeError). Default: typeof argument.
 *
 * @returns {void}
 *
 * @throws {RangeError|TypeError} Throws a RangeError or TypeError based on 'errorType'.
 *     If 'errorType' is not 'RangeError' or 'TypeError', a generic Error is thrown.
 *     Also throws a TypeError if 'errorType', 'argumentName', 'expected', or 'action' is not a string, or a RangeError
 *     if 'errorType', 'argumentName', 'expected', or 'action' is an empty string, or if 'argument' is undefined.
 */
function throwError(errorType, argument, argumentName, expected, action, received) {
    /*
        Throws a TypeError if 'errorType' isn't a string,
        or a RangeError if 'errorType' is an empty string.
    */
    if (!isStringAndNotEmpty(errorType)) {
        if (!isString(errorType)) {
            throw new TypeError(
                `Invalid 'errorType'! Expected string, but received ${typeof errorType}.` +
                    ' Aborting throwing initial error...'
            );
        } else {
            throw new RangeError(
                `Invalid 'errorType'! Expected non-empty string, but received empty string.` +
                    ' Aborting throwing initial error...'
            );
        }
    }

    /* Throws a RangeError if 'argument' is undefined. */
    if (isUndefined(argument)) {
        throw new RangeError(
            `Invalid 'argument'! Expected an argument, but received none. Aborting throwing initial error...`
        );
    }

    /*
        Throws a TypeError if 'argumentName' isn't a string,
        or a RangeError if 'argumentName' is an empty string.
    */
    if (!isStringAndNotEmpty(argumentName)) {
        if (!isString(argumentName)) {
            throw new TypeError(
                `Invalid 'argumentName'! Expected string, but received ${typeof argumentName}.` +
                    ' Aborting throwing initial error...'
            );
        } else {
            throw new RangeError(
                `Invalid 'argumentName'! Expected non-empty string, but received empty string.` +
                    ' Aborting throwing initial error...'
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
                `Invalid 'expected'! Expected string, but received ${typeof expected}.` +
                    ' Aborting throwing initial error...'
            );
        } else {
            throw new RangeError(
                `Invalid 'expected'! Expected non-empty string, but received empty string.` +
                    ' Aborting throwing initial error...'
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
                `Invalid 'action'! Expected string, but received ${typeof action}.` +
                    ' Aborting throwing initial error...'
            );
        } else {
            throw new RangeError(
                `Invalid 'action'! Expected non-empty string, but received empty string.` +
                    ' Aborting throwing initial error...'
            );
        }
    }

    /* Defaults 'received' to 'typeof argument' if it's undefined. */
    if (isUndefined(received)) received = typeof argument;

    /* Trims 'errorType'. */
    errorType = errorType.trim();

    const message =
        `Invalid '${argumentName.trim()}'! Expected ${expected.trim()}, but received ${received}.` +
        ` Aborting ${action.trim()}...`;

    switch (errorType) {
        case 'RangeError':
            throw new RangeError(message);
        case 'TypeError':
            throw new TypeError(message);
        default:
            throw new Error(
                `Invalid 'errorType'! Expected 'RangeError' or 'TypeError', but received ${errorType}.` +
                    ' Aborting throwing initial error...'
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

global['removeDuplicates'] = removeDuplicates;

global['throwError'] = throwError;
