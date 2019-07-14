import {Command, flags} from '@oclif/command'
import chalk from 'chalk'
import * as figlet from 'figlet'
const walk = require('walk-sync')
import * as Path from 'path'
import {readFileSync, outputFileSync, copySync} from 'fs-extra'
import {compile} from 'handlebars'
import * as inquirer from 'inquirer'
import * as Case from 'case'
import {UserData} from './user-data.interface'
import {prompts} from './prompts'
import {cwd} from 'process'
import * as emoji from 'node-emoji'
import {GitConfig} from './git-config.interface'
const homeDir = require('home-dir')
import childCommand from 'child-command'
class Tygen extends Command {
  static description = 'Generate release ready npm module project'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    name: flags.string({char: 'n', description: 'name of the new package'}),
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    open: flags.boolean({char: 'o', description: 'open project in vscode'}),
    // flag with no value (-f, --force)
    // force: flags.boolean({char: 'f'}),
  }

  static UserData: UserData

  static GitConfig: GitConfig

  static args = [{name: 'name'}]

  async init() {
    const {args, flags} = this.parse(Tygen)
    // do some initializati on
    await this.printAscii()
    await this.getGitConfig()
    await this.getUserInput({args, flags, git: Tygen.GitConfig})

  }

  async run() {
    // start the spinner
    this.log(emoji.get('drum_with_drumsticks'), chalk.grey('Preparing cauldron...'))
    this.log(emoji.get('pizza'), chalk.grey('Adding magic ingredients...'))

    const paths = await this.getTemplatePaths()

    for (let path of paths) {
      let resolvedPath = Path.resolve(__dirname, 'templates' , path)
      let outputPath = Path.resolve(cwd(), Tygen.UserData.name.kebab, path)
      if (this.isHandlebars(path)) {
        let source: string = readFileSync(resolvedPath, 'utf8').toString()
        source = await this.compile(source)
        outputFileSync(outputPath.replace(/\.hbs$/, ''), source)
      } else {
        copySync(resolvedPath, outputPath)
      }
    }

    this.log(chalk.green(emoji.get('sparkles'), `Poof! ${Tygen.UserData.name.kebab} created!!`))

  }
  async printAscii(): Promise<void> {
    this.log(
      chalk.blue(
        figlet.textSync('tygen', {horizontalLayout: 'full'})
      )
    )
  }

  async getGitConfig() {
    let gitConfig: GitConfig = {
      user: {
        name: undefined,
        email: undefined
      }
    }
    try {
      await childCommand('which git')
      const {stdout: name} = await childCommand('git config --global user.name')
      gitConfig.user.name = name.toString().trimRight()
      const {stdout: email} = await childCommand('git config --global user.email')
      gitConfig.user.email = email.toString().trimRight()

    } catch {
      return gitConfig
    }
    Tygen.GitConfig = gitConfig
    return gitConfig
  }

  async getTemplatePaths() {
    return walk(Path.resolve(__dirname, './templates'), {directories: false})
  }

  async isHandlebars(path: string) {
    const hbsTest = /\.hbs$/
    return hbsTest.test(path)
  }
  async compile(source: string): Promise<string> {
    const template = compile(source)
    return template(Tygen.UserData)
  }

  async persistDefaults() {
    try {
      outputFileSync(homeDir('.tygen'), JSON.stringify(Tygen.UserData))
    } catch {
    }
  }
  async getUserInput(config: {args: any, flags: any, git: any}) {
    const props: any = await inquirer.prompt(
      prompts(config)
    )

    Tygen.UserData = {
      name: {
        full: Case.title(props.authorName),
        camel: Case.camel(props.name),
        pascal: Case.pascal(props.name),
        kebab: Case.kebab(props.name)
      },
      description : props.description,
      repo: {
        name: Case.kebab(props.name),
        username: props.githubUsername
      },
      gitConfig: {
        user: {
          name: props.githubUsername,
          email: props.email
        }
      },
      author: {
        name:  {
          full: Case.title(props.authorName),
          camel: Case.camel(props.authorName),
          pascal: Case.pascal(props.authorName),
          kebab: Case.kebab(props.authorName)
        },
        email: props.email
      }
    }
  }

  async finally() {
    await this.persistDefaults()
  }

}

export = Tygen
