#!/usr/bin/env node

const chalk = require( 'chalk' )
const clear = require( 'clear' )
const figlet = require( 'figlet' )
const files = require( './lib/files' )
const github = require('./lib/github')

clear()

console.log(
    chalk.yellowBright (
        figlet.textSync('Git-Better', {
            horizontalLayout: 'full'
        })
    )
)

if( files.directoryExists('.git') ) {
    console.log( chalk.red("Already A Git Repository"))
    process.exit()
}

const getGithubToken = () => {
    let token = github.getStoredGithubToken()
    if(token) {
        return token
    }

    await github.setGithubCredentials()

    token = await github.registerNewToken()
    return token
}

const run = async () => {
    try {
      // Retrieve & Set Authentication Token
      const token = await getGithubToken()
      github.githubAuth(token)
  
      // Create remote repository
      const url = await repo.createRemoteRepo()
  
      // Set up local repository and push to remote
      await repo.setupRepo(url)
      console.log(chalk.green('All done!'))
    } catch(err) {
        if (err) {
          switch (err.status) {
            case 401:
              console.log(chalk.red('Couldn\'t log you in. Please provide correct credentials/token.'))
              break
            case 422:
              console.log(chalk.red('There already exists a remote repository with the same name'))
              break
            default:
              console.log(err)
          }
        }
    }
  }