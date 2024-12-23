console.log(herpes.getStorageKey('spammer', 'answers'))
/*
    =========================================================
    -- Zero Dependency Spammer
    --- By: RatWithAFace
    ---- Created 12/3/23
    =========================================================
*/

// ==================== CONFIG ====================

const  answers  =  herpes.getStorageKey('spam', 'answers')
const  channelId  =  answers.channelId
const  token  =  herpes.getToken()
const  mode  =  answers.mode  ==  'Balance'  ?  1  :  2
const  content  =  answers.msgContent

let  balanceInterval  =  answers.interval
let  fullsendInterval  =  answers.interval * 34
let fullsendMessageAmount = 23 // Change only if you know what you're doing. This value should work perfectly.

// ====== BALANCE ======
function sendMessageBalance(cID, t, h, interval) {
    let body = JSON.stringify({"content": content})
    fetch(`https://discord.com/api/v9/channels/${cID}/messages`, { method: "POST", body: body, headers: h }).then((response) => { 
        if      ( response.status == 200 ) { console.log(`200 OK  | Message Sent! | Interval: ${interval}`); }
        else if ( response.status == 429 ) { console.log(`429 ERR | Rate Limited! | Interval: ${interval}`); }
        else    { console.log(`Status ${response.status}\n${response.json}`) }
        setTimeout(() => sendMessageBalance(cID, t, h, interval), interval)
    })
}

// ====== FULLSEND ======
function sendMessageFullsend(cID, h, interval) {
    sInterval = setInterval(() => {
        let body = JSON.stringify({"content": `@everyone`})
        let reqs = []
        for (let index = 0; index < fullsendMessageAmount; index++) {
            reqs.push(fetch(`https://discord.com/api/v9/channels/${cID}/messages`, { method: "POST", body: body, headers: h }))
        }
        Promise.all(reqs).then((responses) => {
            responses.forEach((i) => {
                if      ( i.status == 200 ) { console.log(`200 OK  | Message Sent!`) }
                else if ( i.status == 429 ) { console.log(`429 ERR | Rate Limited!`) }
                else    { console.log(`Status ${i.status}\n${i.json}`) }
            })
        })
    }, fullsendInterval)
}

mode === 1 ? sendMessageBalance(channelId, token, headers, balanceInterval) : sendMessageFullsend(channelId, headers, fullsendInterval)