// MAIN HERPES MODULE

const fs = require('fs')
const path = require('path')

/**
 * Retrieves a value from a module's storage data by key.
 *
 * @param {string} module - The name of the module whose storage data is to be retrieved.
 * @param {string} key - The key of the value to be retrieved.
 * @returns {any} The value associated with the given key, or undefined if no such value exists.
 */
function getStorageKey(module, key) {
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, `../../storage/${module}.json`)))[key]
}

/**
 * Sets a key-value pair in a module's storage data.
 *
 * @param {string} module - The name of the module whose storage data is to be modified.
 * @param {string} key - The key of the value to be set.
 * @param {any} value - The value to be set.
 */
function setStorageKey(module, key, value) {
   var storage = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../../storage/${module}.json`)))
   storage[key] = value
   fs.writeFileSync(path.resolve(__dirname, `../../storage/${module}.json`), JSON.stringify(storage))
}

/**
 * Retrieves and parses the storage data for a given module.
 *
 * @param {string} module - The name of the module whose storage data is to be retrieved.
 * @returns {Object} The parsed JSON object representing the module's storage data.
 */
function getStorage(module) {
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, `../../storage/${module}.json`)))
}

/**
 * Overwrites the storage data for a given module with the given new storage data.
 *
 * @param {string} module - The name of the module whose storage data is to be overwritten.
 * @param {Object} newStorage - The new storage data to be written over the module's storage data.
 */
function setStorage(module, newStorage) {
    fs.writeFileSync(path.resolve(__dirname, `../../storage/${module}.json`), JSON.stringify(newStorage))
}

/**
 * Initializes a module's storage data by creating a new, empty JSON file
 * at the path `storage/${module}.json`.
 *
 * @param {string} module - The name of the module whose storage data is to be initialized.
 */
function initStorage(module) {
    fs.writeFileSync(path.resolve(__dirname, `../../storage/${module}.json`), JSON.stringify({}))
}

/**
 * Retrieves the first enabled token in the list of saved tokens.
 *
 * @returns {string} The first enabled token, or undefined if no tokens are enabled.
 */
function getToken() {
    tokens = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../storage/tokens.json')))
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].enabled) {
            return tokens[i].token
        }
    }
}

module.exports = {
    getStorageKey,
    setStorageKey,
    getStorage,
    setStorage,
    initStorage, 
    getToken
}
