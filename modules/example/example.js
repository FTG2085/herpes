const answers = herpes.getStorageKey('example', 'answers')

if (answers.example === 'Yes') {
    console.log('Running an example!')
    console.log(herpes.getToken())
} else {
    console.log('Not running an example!')
}