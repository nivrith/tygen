import * as superb from 'superb'
import * as utils from './utils'
import {Questions} from 'inquirer'
import {GitConfig} from './git-config.interface'
const _s = require('underscore.string')
import Case from 'case'
export const prompts = (config: {args: any, flags: any, git: GitConfig}) => {
  // tslint:disable-next-line: no-unused
  const {args, flags, git} = config
  const questions: Questions = [
    {
      name: 'name',
      message: 'What do you want to name your module?',
      default: _s.slugify(args.name || 'awesome-package'),
      filter: (x: string) => utils.slugifyPackageName(x)
    },
    {
      name: 'description',
      message: 'What is your module description?',
      default: `My ${superb.random()} module`
    },
    {
      name: 'webpack',
      message: 'would you like to use webpack?',
      type: 'confirm',
      default: false
    },
    {
      name: 'authorName',
      message: 'What is your name?',
      default: git.user.name || 'Spiderman',
      validate: (x: string) => x.length > 0 ? true : 'You have to provide your name'
    },
    {
      name: 'githubUsername',
      message: 'What is your GitHub username?',
      default: Case.kebab(git.user.name || 'spiderman'),
      validate: (x: string) => x.length > 0 ? true : 'You have to provide a username'
    },
    {
      name: 'email',
      message: 'What is your email',
      default: git.user.email,
      validate: (x: string) => validateEmail(x) ? true : 'You have to provide a valid email'
    }
  ]
  return questions
}
function validateEmail(email: string) {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}
