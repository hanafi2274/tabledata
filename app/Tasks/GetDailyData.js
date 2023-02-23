'use strict'

const Task = use('Task')

class GetDailyData extends Task {
  static get schedule () {
    return '0 */1 * * * *'
  }

  async handle () {
    this.info('Task GetDailyData handle')
  }
}

module.exports = GetDailyData
