# Herpes 
Herpes is a fully modular Discord token utility designed to provide a simple and efficient way to manage Discord tokens, whether through userbots or more "nefarious" purposes.

## Getting Started
To get started with Herpes, head to the latest release on GitHub.
Or alternatively, if you have git installed, use this:
```batch
git clone https://github.com/FTG2085/herpes.git
```
Once downloaded, navigate to the main directory and run these two commands:
```batch
npm i
node index.js
```
This will launch Herpes's main menu, allowing you to have access to all the great features Herpes has to offer!

### Token Manager
The token manager allows users to add, delete, and enable/disable tokens. Tokens are stored in a JSON file and can be managed through here. When you enable a token, this tells Herpes and its modules which token to execute commands on. In the future this will be multi-threaded and multiple tokens can be enabled at once. But sadly for now, that is not possible on v1.0.0.
### Loading Modules
The module loader is responsible for loading and executing modules. It checks for the existence of a `module.json` file in each module folder and loads the module if it is visible.

## Modules
Modules are quite easy and simple. Each module has its own individual storage JSON in the `/storage/` directory. This is where input from the user, or any data storage really, is stored and accessible by the module itself. Each module is located in the `/modules/` directory and requires a very specific file structure.
```
/module-name
├── module-name.js
└── module.json
```

The name of the folder that contains the module is the name. Every module has the script file (`module-name.js`) and a `module.json` file. The script file does not necessarily have to be the same as the name of the module, yet it is recommended. A `module.json` holds the properties of a module, including its prompting information if provided. 

**module.json** example:

```json
{
	"entry": "./example.js",
	"visible": false,
    "author": "user",
	"prompts": [
		{
			"name": "example",
			"message": "Do you want to run an example?",
			"type": "list",
			"choices": ["Yes", "No"]
        }, {
			"name": "example2",
			"message": "Do you want to run an example?",
			"type": "input"
		}
	]
}
```

`"entry"` **string**: the file path for the module script.
`"visible"` **boolean**: whether or not the module is visible to Herpes.
`"prompts"` **array**: any array of [inquirer prompt objects](https://www.npmjs.com/package/inquirer#objects)
`"author"`	**string**: the name of the author
`"recursive"` **boolean**: whether or not the module is a loop.

### Herpes Module Functions
Each module has access to a few functions that are necessary for functionality. Modules are ran and processed in the Herpes `index.js` file, so there is no need to import these functions.
```js
herpes.getStorageKey('module', 'key')
herpes.setStorageKey('module', 'key', value)
herpes.getStorage('module')
herpes.setStorage('module', newStorage)
herpes.initStorage('module')
herpes.getToken()
``` 
**herpes.getStorageKey(module, key)**: Retrieves a value from a module's storage data by key.
 - `module` *string*: The name of the module whose storage data is to be retrieved.
 - `key` *string*: The key of the value to be retrieved.
 - returns *any*: The value associated with the given key, or undefined if no such value exists.

**setStorageKey(module, key, value)**: Sets a key-value pair in a module's storage data.
 - `module` *string*: The name of the module whose storage data is to be modified.
 - `key` *string*: The key of the value to be set.
 - `value` *any*: The value to be set.

**getStorage(module)**: Retrieves and parses the storage data for a given module.
 - `module` *string*: The name of the module whose storage data is to be retrieved.
 - returns *object*: The parsed JSON object representing the module's storage data.

**setStorage('module', newStorage)**: Overwrites the storage data for a given module with the given new storage data.
 - `module` *string*: The name of the module whose storage data is to be overwritten.
 - `newStorage` *object*: The new storage data to be written over the module's storage data.

**initStorage(module)**: Initializes a module's storage data by creating (or resetting) a new, empty JSON file at the path `storage/${module}.json`.
 - `module` *string*: The name of the module whose storage data is to be initialized.

**getToken()**: Retrieves the first enabled token in the list of saved tokens.
 - returns *string*: The first enabled token, or undefined if no tokens are enabled.

### Creating a Module
Creating a module is easy! If you have an existing script you'd like to implement, this makes things even easier.
For example, below is a simple discord spamming script that has multiple user inputs!

**spam.js**:
```js
// ==================== CONFIG ====================
const  channelId  =  ""  // Channel id (not user)
const  token  =  ""  // Your discord authentication token

const  mode  =  2  // 1 = Balance | 2 = Fullsend
const  content  =  '@everyone' // Message to spam

let  balanceInterval  =  300
let  fullsendInterval  =  10000// Change only if you know what you're doing. This value should work perfectly.
let  fullsendMessageAmount  =  23  // Change only if you know what you're doing. This value should work perfectly.

let  headers  =  {"Content-Type": "application/json", "Authorization": token }

// ====== BALANCE ======
function  sendMessageBalance(cID, t, h, interval) {
	let  body  =  JSON.stringify({"content":  `@everyone`})
	fetch(`https://discord.com/api/v9/channels/${cID}/messages`, { method:  "POST", body:  body, headers:  h }).then((response) => {
		if ( response.status  ==  200 ) { console.log(`200 OK | Message Sent! | Interval: ${interval}`); }
		else  if ( response.status  ==  429 ) { console.log(`429 ERR | Rate Limited! | Interval: ${interval}`); }
		else { console.log(`Status ${response.status}\n${response.json}`) }
		setTimeout(() =>  sendMessageBalance(cID, t, h, interval), interval)
	})
}

// ====== FULLSEND ======

function  sendMessageFullsend(cID, h, interval) {
	sInterval  =  setInterval(() => {
		let  body  =  JSON.stringify({"content":  `@everyone`})
		let  reqs  = []
		for (let  index  =  0; index  <  fullsendMessageAmount; index++) {
			reqs.push(fetch(`https://discord.com/api/v9/channels/${cID}/messages`, { method:  "POST", body:  body, headers:  h }))
		}
		Promise.all(reqs).then((responses) => {
			responses.forEach((i) => {
				if ( i.status  ==  200 ) { console.log(`200 OK | Message Sent!`) }
				else  if ( i.status  ==  429 ) { console.log(`429 ERR | Rate Limited!`) }
				else { console.log(`Status ${i.status}\n${i.json}`) }
			})
		})
	}, fullsendInterval)

}

mode === 1  ?  sendMessageBalance(channelId, token, headers, balanceInterval) :  sendMessageFullsend(channelId, headers, fullsendInterval)
```
Converting this from a normal script to a module is mostly simple. First, let's create a `module.json`.

**module.json**:
```json
{
	"entry": "./spam.js",
	"visible": true, 
	"author": "myname",
	"prompts": [
		{
			"name": "channelId",
			"type": "input",
			"message": "Channel ID:"
		}, {
			"name": "msgContent",
			"type": "input",
			"message": "Message Content:"
		}, {
			"name": "mode",
			"type": "list",
			"message": "Mode:",
			"choices": ["Balance", "Fullsend"]
		}, {
			"name": "interval",
			"type": "number",
			"message": "Message interval (ms):",
			"default": "300"
		}
	]
}
		
```
This module will now prompt the user for a channel ID to spam, the message they want to spam, which mode the script will use, and the message interval in milliseconds. Now, it's time to implement these into the spam.js.

**spam.js diff** (edited):
```diff
// ==================== CONFIG ====================

- const  channelId  =  "1216870352831906037"  // Channel id (not user)
- const  token  =  "MTE4MjE0MzM5MDI4NTA0NTg4NA.GQUyau.q27VpbKGNWek9b6eJCRvJTkzB_wuTrLIcXsCPA"  // Your discord authentication token
- const  mode  =  2  // 1 = Balance | 2 = Fullsend
- const  content  =  '@everyone' // Message to spam
+ const  answers  =  getStorageKey('spam', 'answers')
+ const  channelId  =  answers.channelId
+ const  token  =  getToken()
+ const  mode  =  answers.mode  ==  'Balance'  ?  1  :  2
+ const  content  =  answers.msgContent

- let  balanceInterval  =  300
- let  fullsendInterval  =  10000// Change only if you know what you're doing. This value should work perfectly.
+ let  balanceInterval  =  answers.interval
+ let  fullsendInterval  =  answers.interval * 34
let  fullsendMessageAmount  =  23  // Change only if you know what you're doing. This value should work perfectly.
let  headers  =  {"Content-Type": "application/json", "Authorization": token } 

// ====== BALANCE ======
function  sendMessageBalance(cID, t, h, interval) {
	let  body  =  JSON.stringify({"content":  `@everyone`})
	fetch(`https://discord.com/api/v9/channels/${cID}/messages`, { method:  "POST", body:  body, headers:  h }).then((response) => {
		if ( response.status  ==  200 ) { console.log(`200 OK | Message Sent! | Interval: ${interval}`); }
		else  if ( response.status  ==  429 ) { console.log(`429 ERR | Rate Limited! | Interval: ${interval}`); }
		else { console.log(`Status ${response.status}\n${response.json}`) }
		setTimeout(() =>  sendMessageBalance(cID, t, h, interval), interval)
	})
}

// ====== FULLSEND ======

function  sendMessageFullsend(cID, h, interval) {
	sInterval  =  setInterval(() => {
		let  body  =  JSON.stringify({"content":  `@everyone`})
		let  reqs  = []
		for (let  index  =  0; index  <  fullsendMessageAmount; index++) {
			reqs.push(fetch(`https://discord.com/api/v9/channels/${cID}/messages`, { method:  "POST", body:  body, headers:  h }))
		}
		Promise.all(reqs).then((responses) => {
			responses.forEach((i) => {
				if ( i.status  ==  200 ) { console.log(`200 OK | Message Sent!`) }
				else  if ( i.status  ==  429 ) { console.log(`429 ERR | Rate Limited!`) }
				else { console.log(`Status ${i.status}\n${i.json}`) }
			})
		})
	}, fullsendInterval)

}

mode === 1  ?  sendMessageBalance(channelId, token, headers, balanceInterval) :  sendMessageFullsend(channelId, headers, fullsendInterval)
```

And that's it! This is now a fully functioning module for Herpes. Feel free to adapt your own scripts to Herpes or create your own modules from scratch.
