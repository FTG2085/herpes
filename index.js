// HERPES
// Modular Discord Token Utility

const figlet = require('figlet')
const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const readline = require('readline')
const herpes = require('./modules/herpes-main/herpes')
const gradient = require('gradient-string')

function title(subtext) {console.clear();console.log(gradient.summer(figlet.textSync('HERPES', { horizontalLayout: 'full', font: '4Max' }))+'\n'+chalk.cyanBright(chalk.bgBlue(subtext))+'\n')}

const { execSync } = require('child_process')

// Function to run shell commands
function runCommand(command) {
    try {
        return execSync(command, { stdio: 'pipe', encoding: 'utf-8' }).trim()
    } catch (error) {
        console.error(`Error executing command: ${command}`)
        console.error(error.message)
        process.exit(1)
    }
}

// Function to check for updates
function checkForUpdates() {
    console.log('Checking for updates...')

    // Fetch latest changes from the remote repository
    runCommand('git fetch origin')

    // Compare local and remote branches
    const localHash = runCommand('git rev-parse HEAD')
    const remoteHash = runCommand('git rev-parse origin/master')

    if (localHash !== remoteHash) {
        return true
    } else {
        return false
    }
}

// Token Manager
function tokenManager() {
    title('Herpes Token Manager - By FTG2085')
    function tokens() {return JSON.parse(fs.readFileSync(path.resolve(__dirname, 'storage/tokens.json')))}
    ctokens = tokens()

    // Display tokens
    if (ctokens.length === 0) {
        console.log(chalk.yellowBright('No tokens found!\n'))
    } else {
        for (let i = 0; i < ctokens.length; i++) {
            console.log(chalk.yellow(`${ctokens[i].name}: ${chalk.yellowBright(ctokens[i].token)} ${ctokens[i].enabled ? chalk.greenBright('✔') : chalk.redBright('✖')}`))
        }
        console.log('\n')
    }

    // Token menu
    inquirer.prompt([
        {
            type: 'list',
            name: 'tokenMenu',
            message: 'What would you like to do?',
            choices: ['Enable/Disable Tokens', 'Add Token', 'Delete Token', 'Back']
        }
    ]).then(answers => {
        switch (answers.tokenMenu) {
            case 'Enable/Disable Tokens':
                var tokenChoices = []
            
                for (let i = 0; i < ctokens.length; i++) {
                    tokenChoices.push({name: ctokens[i].name, value: ctokens[i].name, checked: ctokens[i].enabled})
                }
                inquirer.prompt([{
                    type: 'list',
                    name: 'enableTokens',
                    message: 'Select token to enable:',
                    choices: ctokens.map(token => token.name)
                }])
                .then(answers => {
                    for (let i = 0; i < ctokens.length; i++) {
                        if (answers.enableTokens == ctokens[i].name) {
                            ctokens[i].enabled = true
                        } else {
                            ctokens[i].enabled = false
                        }
                    }
                    fs.writeFileSync(path.resolve(__dirname, 'storage/tokens.json'), JSON.stringify(ctokens))
                    tokenManager()
                })
                break;
            case 'Add Token':
                inquirer.prompt([{
                    type: 'input',
                    name: 'token',
                    message: 'Enter a token:',
                    validate: function (value) {
                        var tokenRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
                        if (tokenRegex.test(value)) {
                            return true
                        } else {
                            return 'Invalid token!'
                        }
                    }
                }, {
                    type: 'input',
                    name: 'name',
                    message: 'Enter a name for the token:'
                }])
                .then(answers => {
                    ctokens.push({name: answers.name, token: answers.token, enabled: false})
                    fs.writeFileSync(path.resolve(__dirname, 'storage/tokens.json'), JSON.stringify(ctokens))
                    tokenManager()
                })
                break;
            case 'Delete Token':
                inquirer.prompt([{
                    type: 'list',
                    name: 'selectToken',
                    message: 'Select a token to delete:',
                    choices: ctokens.map(token => token.name)
                }])
                .then(answers => {
                    ctokens = ctokens.filter(token => token.name !== answers.selectToken)
                    fs.writeFileSync(path.resolve(__dirname, 'storage/tokens.json'), JSON.stringify(ctokens))
                    tokenManager()
                })
                break;
            case 'Back':
                mainMenu()
                break;
        }
    })
}

async function load(module, moduleJson, moduleName) {
    async function evalModule() {
        title(`Module: ${moduleName} - Herpes By FTG2085`)
        try {
            console.log(chalk.greenBright('Loading Module...'));
            await eval(module)
            if (!moduleJson.recursive) {
                await waitForKeyPress()
            }
        } catch (err) {
            console.error('Error reading or evaluating the module:', err)
        }
    }
    if ("prompts" in moduleJson) {
        inquirer.prompt(moduleJson.prompts).then(async answers => {
            herpes.initStorage(moduleName)
            herpes.setStorageKey(moduleName, 'answers', answers)
            evalModule()
        })
    } else {
        evalModule()
    }
}

function waitForKeyPress() {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        })
  
        rl.question(chalk.yellowBright('Press ENTER to continue.\n'), () => {
            rl.close()
            mainMenu()
            resolve()
        })
    })
}

async function loadModules() {
    title('Module Loader - By FTG2085')
    const moduleFiles = fs.readdirSync(path.resolve(__dirname, 'modules'))
    const visibleModules = moduleFiles.filter(file => {
        const modulePath = path.join(path.resolve(__dirname, 'modules'), file)
        const stats = fs.statSync(modulePath)
        
        if (stats.isDirectory()) {
          const moduleJsonPath = path.join(modulePath, 'module.json')
          if (fs.existsSync(moduleJsonPath)) {
            const moduleJson = JSON.parse(fs.readFileSync(moduleJsonPath, 'utf-8'))
            
            if (moduleJson.visible === true) {
              return true
            }
          }
        }
        
        return false
    })

    inquirer.prompt([{
        type: 'list',
        name: 'selectModule',
        message: 'Select a module to load:',
        choices: visibleModules
    }])
    .then(async answers => {
        const modulePath = path.join(path.resolve(__dirname, 'modules'), answers.selectModule)
        const moduleJsonPath = path.join(modulePath, 'module.json')
        const moduleJson = JSON.parse(fs.readFileSync(moduleJsonPath, 'utf-8'))
        const module = fs.readFileSync(path.join(modulePath, moduleJson.entry), 'utf-8')
        await load(module, moduleJson, answers.selectModule)
    })
}

function mainMenu() {
    title('Modular Discord Token Utility - By FTG2085')
    console.log(chalk.yellowBright('Welcome to Herpes!'))
    inquirer.prompt([
        {
            type: 'list',
            name: 'mainMenu',
            message: 'What would you like to do?',
            choices: ['Token Manager', 'Load Module', 'Exit']
        }
    ]).then(answers => {
        switch (answers.mainMenu) {
            case 'Token Manager':
                tokenManager()
                break;
            case 'Load Module':
                loadModules()
                break;
            case 'Exit':
                title('Goodbye! - Created By FTG2085')
                process.exit()
                break;
        }
    })
}

checkForUpdates() ? title('Herpes needs an update! Run "npm run update" to update.') : mainMenu()