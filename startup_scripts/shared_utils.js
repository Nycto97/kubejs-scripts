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

/* Listen to post-init event, after all mods have loaded */
StartupEvents.postInit(() => {
    /**
     * The item ids of all items.
     *
     * @type {List<string>}
     * @const
     */
    const itemIds = Item.getTypeList();

    /**
     * The block ids of all blocks.
     *
     * @type {List<string>}
     * @const
     */
    const blockIds = Block.getTypeList();

    global['itemIds'] = itemIds;
    global['blockIds'] = blockIds;

    if (global.isBlockAndItemCountLogEnabled)
        console.log(`There are ${global.itemIds.length} items and ${global.blockIds.length} blocks registered`);
});

/**
 * Validates the number and types of arguments before invoking the original function.
 * If the validation fails, it throws an error without invoking the original function.
 *
 * Note: This function uses direct type checks with 'typeof', 'instanceof', and 'Array.isArray()' for validation.
 * This is to avoid circular dependencies and potential infinite loops, as utility functions like 'isString' or 'isNumber' are defined using 'checkArguments'.
 * 'typeof' is used for primitive types, 'instanceof' is used for RegExp and Date objects, and 'Array.isArray()' is used for Arrays.
 *
 * @param {Function} func - The original function to be invoked after validation.
 * @param {number|string|Array<number|string>} numArgs - The expected number of arguments or an Array of valid numbers of arguments.
 * @param {string|Array<string>|undefined} [argTypes] - The expected types of the arguments.
 *
 * @returns {Function} A new function that validates the number and types of arguments before invoking func.
 *
 * @throws {RangeError} If the number of arguments or the value of an argument does not match the expected value or range.
 * @throws {TypeError} If the type of an argument does not match the expected type.
 *
 * @todo Add logic so that each expected type, can be more than 1 expected type. For example a non-empty string or a RegExp or an Array.
 */
function checkArguments(func, numArgs, argTypes) {
    /**
     * Throws a RangeError with a structured message.
     *
     * @param {string} argName - The name of the invalid argument.
     * @param {string} expected - The expected value or range of the argument.
     * @param {*} received - The actual value of the argument that caused the error.
     * @param {string} action - The action that was being performed when the error occurred.
     *
     * @returns {void}
     *
     * @throws {RangeError} Always throws a RangeError.
     */
    function throwRangeError(argName, expected, received, action) {
        throw new RangeError(
            `[ERROR] Invalid '${argName}'! Expected ${expected}, but received ${received}. Aborting ${action}...`
        );
    }

    /**
     * Throws a TypeError with a structured message.
     *
     * @param {*} arg - The argument that caused the error.
     * @param {string} argName - The name of the invalid argument.
     * @param {string} expected - The expected type of the argument.
     * @param {string} action - The action that was being performed when the error occurred.
     *
     * @returns {void}
     *
     * @throws {TypeError} Always throws a TypeError.
     */
    function throwTypeError(arg, argName, expected, action) {
        throw new TypeError(
            `[ERROR] Invalid '${argName}'! Expected ${expected}, but received ${typeof arg}. Aborting ${action}...`
        );
    }

    /* Throws an error if the provided function isn't a function. */
    if (typeof func !== 'function') {
        throwTypeError(func, 'func', 'function', `function call to ${func.name}`);
    }

    /* Converts 'numArgs' to a number and puts it in an array, if it's a string. */
    if (typeof numArgs === 'string') {
        numArgs = [Number(numArgs)];
    }

    /* Puts 'numArgs' in an array if it's a number. */
    if (typeof numArgs === 'number') {
        numArgs = [numArgs];
    }

    /*
        Converts each string element to a number if 'numArgs' is an array, or throws
        an error if 'numArgs' isn't an array or if not all elements are integers.
    */
    if (Array.isArray(numArgs)) {
        numArgs = numArgs.map((arg) => (typeof arg === 'string' ? Number(arg) : arg));

        if (!numArgs.every(Number.isInteger)) {
            throwRangeError(
                'numArgs',
                'integer or array of integers',
                numArgs.join(', '),
                `function call to ${func.name}`
            );
        }
    } else {
        throwTypeError(numArgs, 'numArgs', 'number, string, or array', `function call to ${func.name}`);
    }

    /*
        Puts 'argTypes' in an array if it's defined and is a string, or throws
        an error if 'argTypes' isn't an array or if not all elements are strings.
    */
    if (typeof argTypes !== 'undefined') {
        if (typeof argTypes === 'string') {
            argTypes = [argTypes];
        } else if (
            !Array.isArray(argTypes) ||
            (Array.isArray(argTypes) && !argTypes.every((arg) => typeof arg === 'string'))
        ) {
            throwTypeError(
                argTypes,
                'argTypes',
                'string, array of strings, or undefined',
                `function call to ${func.name}`
            );
        }
    }

    /*
        Returns a new function that validates the number and
        types of arguments before invoking the original function.
    */
    return function () {
        /* Throws an error if the number of arguments doesn't match the expected value or range. */
        if (!numArgs.includes(arguments.length)) {
            throwRangeError(
                'number of arguments',
                `one of ${numArgs.join(', ')}`,
                arguments.length,
                `function call to ${func.name}`
            );
        }

        /**
         * Checks if the argument is of the expected type.
         *
         * @param {*} arg - The argument to check.
         * @param {string} expectedType - The expected type of the argument.
         *
         * @returns {void}
         *
         * @throws {TypeError} If the argument is not of the expected type.
         */
        function checkArgType(arg, expectedType) {
            let isValid = true;

            switch (expectedType) {
                case 'RegExp':
                    isValid =
                        arg instanceof RegExp ||
                        (arg.toString().startsWith('/') && arg.toString().lastIndexOf('/') > 0);
                    break;
                case 'Array':
                    isValid = Array.isArray(arg);
                    break;
                case 'nonEmptyArray':
                    isValid = Array.isArray(arg) && arg.length > 0;
                    break;
                case 'Date':
                    isValid = arg instanceof Date;
                    break;
                case 'Object':
                    isValid = typeof arg === 'object' && arg !== null && !Array.isArray(arg);
                    break;
                case 'nonEmptyString':
                    isValid = typeof arg === 'string' && arg.trim().length > 0;
                    break;
                default:
                    isValid = typeof arg === expectedType;
            }

            /* Throws an error if the argument isn't of the expected type. */
            if (!isValid) {
                throwTypeError(arg, 'arg', expectedType, `function call to ${func.name}`);
            }
        }

        /* Validates the types of the arguments if 'argTypes' is defined. */
        if (argTypes !== undefined) {
            for (let i = 0; i < arguments.length; i++) {
                checkArgType(arguments[i], argTypes[i]);
            }
        }

        /* Invokes the original function with the provided arguments if all validations pass. */
        return func.apply(this, arguments);
    };
}

/**
 * Checks if the provided value is an Array.
 *
 * @param {*} value - The value to check.
 *
 * @returns {boolean} True if the value is an Array, false otherwise.
 */
const isArray = Array.isArray;

/**
 * Checks if the provided value is of type 'boolean'.
 *
 * @param {*} value - The value to check.
 *
 * @returns {boolean} True if the value is of type 'boolean', false otherwise.
 */
const isBoolean = (value) => typeof value === 'boolean';

/**
 * Checks if the provided value is defined.
 *
 * @param {*} value - The value to check.
 *
 * @returns {boolean} True if the value is defined, false otherwise.
 */
const isDefined = (value) => typeof value !== 'undefined';

/**
 * Checks if the provided 'value' is a non-empty array.
 *
 * @param {*} value - The value to check.
 *
 * @returns {boolean} True if 'value' is a non-empty array, false otherwise.
 */
const isNonEmptyArray = (value) => {
    if (!isArray(value)) {
        console.warn(`[WARN] Expected 'value' to be an array, got ${typeof value}`);
        return false;
    }

    return value.length > 0;
};

/**
 * Checks if the provided 'value' is a non-empty string.
 *
 * @param {*} value - The value to check.
 *
 * @returns {boolean} True if 'value' is a non-empty string, false otherwise.
 */
const isNonEmptyString = (value) => {
    if (!isString(value)) {
        console.warn(`[WARN] Expected 'value' to be a string, got ${typeof value}`);
        return false;
    }

    return value.trim().length > 0;
};

/**
 * Checks if the provided value is of instance RegExp.
 *
 * @param {*} value - The value to check.
 *
 * @returns {boolean} True if the value is of instance RegExp, false otherwise.
 */
const isRegExp = (value) => value instanceof RegExp;

/**
 * Checks if the provided value is of type 'string'.
 *
 * @param {*} value - The value to check.
 *
 * @returns {boolean} True if the value is of type 'string', false otherwise.
 */
const isString = (value) => typeof value === 'string';

/**
 * Checks if the provided value is of type 'undefined'.
 *
 * @param {*} value - The value to check.
 *
 * @returns {boolean} True if the value is of type 'undefined', false otherwise.
 */
const isUndefined = (value) => !isDefined(value);

/**
 * Checks if item(s) exist(s) in the registry.
 *
 * @param {string|string[]} itemIds - The item id or item ids to check.
 *
 * @returns {boolean} True if the item(s) exist(s), false otherwise.
 */
const itemsExist = (itemIds) => {
    if (!itemIds?.length) return false;

    if (!isArray(itemIds)) itemIds = [itemIds];

    return itemIds.every((itemId) => Item.exists(itemId));
};

/**
 * Logs a warning if an item is not found.
 *
 * @param {string} itemId - The item id.
 * @param {string} activityType - The skipped activity.
 * @param {string} [itemType] - The item type.
 *
 * @returns {void}
 */
const logItemNotFound = (itemId, activityType, itemType) => {
    let prefix = itemType ? `${itemType} item` : 'Item';

    console.warn(`[WARN] ${prefix} with id ${itemId} is not found! Skipping ${activityType}`);
};

/**
 * Logs a warning if a mod is not loaded.
 *
 * @param {string} modName - The mod name.
 * @param {string} activityType - The skipped activity.
 *
 * @returns {void}
 */
const logModNotLoaded = (modName, activityType) =>
    console.log(`[WARN] ${modName} mod is not loaded! Skipping ${activityType}`);

/**
 * Logs a warning if a tag is not found.
 *
 * @param {string} tagId - The tag id.
 * @param {string} activityType - The activity type.
 * @param {string} [tagType] - The tag type.
 *
 * @returns {void}
 */
const logTagNotFound = (tagId, activityType, tagType) => {
    let prefix = tagType ? `${tagType} tag` : 'Tag';

    console.warn(`[WARN] ${prefix} #${tagId} is not found! Skipping ${activityType}`);
};

/**
 * Formats a namespaced id or path to a valid Resource Location string.
 *
 * @param {string} id - The namespaced id or path to format.
 * @param {boolean} [isPath=false] - Whether id includes a path. Allows forward slashes '/' if true. Default: false.
 *
 * @returns {string} The formatted Resource Location string.
 *
 * @throws {RangeError} If 'id' is an empty string.
 * @throws {TypeError} If 'id' is not a string, or if 'isPath' is defined but not a boolean.
 */
const formatResourceLocationStr = (id, isPath) => {
    /* Checks if 'id' is a non-empty string. */
    if (!isStringAndNotEmpty(id)) {
        if (isString(id)) {
            throw new RangeError(
                `[ERROR] Invalid 'id'. Expected non-empty string, but received empty string. Aborting formatting...`
            );
        } else {
            throw new TypeError(
                `[ERROR] Invalid 'id'. Expected non-empty string, but received ${typeof id}. Aborting formatting...`
            );
        }
    }

    /* Checks if 'isPath' is a boolean. If it's undefined, defaults it to false. */
    if (!isBoolean(isPath)) {
        if (isDefined(isPath)) {
            throw new TypeError(
                `[ERROR] Invalid 'isPath'. Expected boolean value true or false, but received ${typeof isPath}. Aborting formatting...`
            );
        }

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
 * @returns {*[]|undefined} A new Array with unique elements, or undefined if argument is invalid.
 */
const removeDuplicates = (values) => {
    if (!isArrayAndNotEmpty(values)) {
        console.warn(
            `[WARN] Invalid 'values'. Expected an Array, but received ${typeof values}. Skipping removing duplicates...`
        );
        return;
    }

    return values.filter((value, index) => values.indexOf(value) === index);
};

global['logModNotLoaded'] = logModNotLoaded;
global['logItemIdNotFound'] = logItemNotFound;
global['logTagNotFound'] = logTagNotFound;
