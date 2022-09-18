import chalk from 'chalk'

export const log = console.log

export const chlk = {
  _: chalk,
  default: chalk.bgBlack.green,
  comment: chalk.bgBlack.gray.italic,
  error: chalk.bgRedBright.black,
  pkgLatest: chalk.bgGreenBright.black,
  pkgUpdate: chalk.bgYellow.black,
}

export function errWrapper(err, description = 'Unknown error!') {
  log(chlk.error.bold(description))
  log(chlk.error(err))
}

export function pkgWrapper(pkgName, pkgVersion, isLatest = false, latest = null) {
  if (isLatest) {
    log(
      chlk.pkgLatest('\t- ' + chlk._.italic(pkgName)
      + '@' + chlk._.italic(pkgVersion) + ': is latest...')
    )
    return
  }

  log(
    chlk.pkgUpdate('\t- ' + chlk._.italic(pkgName)
    + '@' + chlk._.italic.bold(pkgVersion)
    + ': UPDATE AVAILABLE ' + chlk._.bold(latest ?? '?'))
  )
}
