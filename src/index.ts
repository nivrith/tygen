import {Command, flags} from '@oclif/command'
import chalk from 'chalk';
import * as figlet from 'figlet';
import * as walk from 'walk-sync';
import * as Path from 'path';
import { readFileSync,  outputFileSync, copySync } from 'fs-extra';
import {compile} from 'handlebars';
import * as inquirer from 'inquirer';
import * as Case from 'case';
import {UserInput} from './user-input.interface';
import {prompts} from './prompts';
import { cwd } from 'process';
const trimEnd = require('lodash.trimend');
import * as emoji from 'node-emoji';


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


  static UserData: UserInput;

  static args = [{name: 'name'}]

  async init() {
    const {args, flags} = this.parse(Tygen)
    // do some initializati on
    await this.printAscii()

    await this.getUserInput(args, flags);
  }

  async run() {
    // start the spinner
    this.log(emoji.get('drum_with_drumsticks'), chalk.grey(`Preparing couldron...`));
    this.log(emoji.get('pizza'), chalk.grey(`Adding magic ingredients...`));



    const {args, flags} = this.parse(Tygen)

    const name = flags.name || 'world'

    const paths = await this.getTemplatePaths();

    for (let path of paths) {
      let resolvedPath = Path.resolve(__dirname, 'templates' , path);
      let outputPath = Path.resolve(cwd(), Tygen.UserData.name.kebab, path);
      if(this.isHandlebars(path)){
        let source: string = readFileSync(resolvedPath, 'utf8').toString();
        source = await this.compile(source);
        outputFileSync(outputPath.replace(/\.hbs$/, ''), source);
      } else {
        copySync(resolvedPath, outputPath);
      }
    }

    this.log(chalk.green(emoji.get('sparkles'),`Poof! ${Tygen.UserData.name.kebab} created!!`));

  }
  async printAscii(): Promise<void> {
    this.log(
      chalk.blue(
        figlet.textSync('tygen', {horizontalLayout: 'full'})
      )
    )
  }

  async getTemplatePaths() {
    return walk(Path.resolve(__dirname, './templates'), { directories: false });
  }

  async isHandlebars(path: string) {
    const hbsTest = /\.hbs$/;
    return path.match(hbsTest);
  }
  async compile (source: string): Promise<string> {
    const template = compile(source)
    return template(Tygen.UserData);
  }



  async getUserInput(args: any, flags: any) {
    const props: any = await inquirer.prompt(
      prompts(args, flags)
    )

    Tygen.UserData = {
      name: {
        camel: Case.camel(props.name),
        pascal: Case.pascal(props.name),
        kebab: Case.kebab(props.name)
      },
      description : props.description,
      repo: {
        name: Case.kebab(props.name),
        username: props.githubUsername
      },
      author: {
        name:  {
        camel: Case.camel(props.name),
        pascal: Case.pascal(props.name),
        kebab: Case.kebab(props.name)
      },
        email: props.email
      }
    };
  }

}

export = Tygen


