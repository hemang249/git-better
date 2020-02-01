const inquirer = require('inquirer')
const files = require('./files')

const getGithubCredentials = () => {
    const questions = [
        {
            name: 'username',
            type: 'input',
            message: 'Enter Your Github Username',
            validate: function(value) {
                if( !value.length ) {
                    return 'Please enter a valid username or email'
                } else {
                    return true
                }
            }
        },

        {
            name: 'password',
            type: 'password',
            message: 'Enter Your Github Password',
            validate: function(value) {
                if( !value.length ) {
                    return 'Please enter a valid username or email'
                } else {
                    return true
                }
            }
        }
    ]
    return inquirer.prompt( questions )

}

const getRepoDetails = () => {
    const argv = require('minimist')(process.argv.slice(2))
    
    const questions = [
        {
            type: 'input',
            name: 'name',
            message: 'Enter a name for the Repository',
            default: argv._[0] || files.getCurrentDirectoryBase(),
            
        },

        {
            type: 'input',
            name: 'description',
            message: 'Optionally Describe your repository',
            default: argv._[1] || null
        },

        {
            type: 'list',
            name: 'visibility',
            message: 'Public or Private',
            choices: ['public', 'private'],
            default: 'public'
        }
    ]

    return inquirer.prompt(questions)
}

module.exports = {getGithubCredentials, getRepoDetails}