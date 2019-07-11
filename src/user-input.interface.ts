
interface Name {
  camel: string,
  pascal: string,
  kebab: string

}

interface Repo {
  name: string,
  username: string
}
export interface UserInput {
  name: Name

  description: string,
  repo: Repo,

  author: {
    name: Name,
    email: string
  }
}

export default UserInput
