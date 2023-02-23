'use strict'
const Env = use('Env')

const Task = use('Task')

class Coba extends Task {
  static get schedule () {
    return '* * * * * *'
  }

  async handle () {
    console.log(Env.get('MONGO_URL'))
  }
}

module.exports = Coba
