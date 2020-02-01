const CLI = require('clui')
const fs = require('fs')
const git = require('simple-git/promis')()
const Spinner = cli.Spinner
const _ = require('lodash')

const inquirer = require('./inquirer')
const gh = require('./github')

module.exports = {
    createRemoRepo: async () => {
        const github = gh.getInstance()
        const answers = await inquirer.askRepoDetails()

        const data = {
            name: answers.name,
            description: answers.description,
            private: (answers.visibility === 'private')
        }

        const status = new Spinner('Creating remote Repo ...')
        status.start()

        try {
            const response = await github.repos.createForAuthenticatedUser(data)
            return response.data.ssh_url
        } catch(e) {
            throw err
        }  finally {
            status.stop()
        }
    },

    askIgnoreFiles: (filelist) => {
        const questions = [
          {
            type: 'checkbox',
            name: 'ignore',
            message: 'Select the files and/or folders you wish to ignore:',
            choices: filelist,
            default: ['node_modules', 'bower_components']
          }
        ];
        return inquirer.prompt(questions);
      },

      setUpRepo: async (url) => {
        const status = new Spinner('Initializing local repository and pushing to remote...')
        status.start()
      
        return git.init()
          .then(git.add('./*'))
          .then(git.commit('Initial commit'))
          .then(git.addRemote('origin', url))
          .then(git.push('origin', 'master'))
          .finally(status.stop())
      }
}