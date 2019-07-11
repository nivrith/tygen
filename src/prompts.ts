import * as superb from 'superb';
import * as utils from './utils';
const _s = require('underscore.string');


export const prompts = (args:any, flags:any) => [
  {
    name: 'name',
    message: 'What do you want to name your module?',
    default: _s.slugify(args.name || 'awesome-package'),
    filter: (x:string) => utils.slugifyPackageName(x)
  },
  {
    name: 'description',
    message: 'What is your module description?',
    default: `My ${superb.random()} module`
  },
  {
    name: 'githubUsername',
    message: 'What is your GitHub username?',
    store: true,
    validate: (x:string) => x.length > 0 ? true : 'You have to provide a username'
  },
  {
    name: 'email',
    message: 'What is your email',
    store: true,
    validate: (x:string) => validateEmail(x) ? true : 'You have to provide a valid email'
  }
]

function validateEmail(email: string) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
