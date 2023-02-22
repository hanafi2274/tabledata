'use strict'

const Task = use('Task')

class Coba extends Task {
  static get schedule () {
    return '* * * * * *'
  }

  async handle () {
    this.info('Task Coba handle')
  }
}

module.exports = Coba
