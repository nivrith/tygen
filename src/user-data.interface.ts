import {GitConfig} from './git-config.interface'

interface Name {
  full: string,
  camel: string,
  pascal: string,
  kebab: string

}

interface Repo {
  name: string,
  username: string
}
export interface UserData {
  name: Name

  description: string,
  repo: Repo,

  gitConfig: GitConfig,

  author: {
    name: Name,
    email: string
  }
}

export default UserData
