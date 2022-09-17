import chalk from 'chalk'
import packageConfig from './package.json' assert { type: 'json'}

const { author, name, version } = packageConfig
const log = console.log
const printStyles = {
  default: chalk.bgBlack.green,
  bold: chalk.bgBlack.green.bold,
  comment: chalk.bgBlack.grey.italic,
}

export function printHelp() {
  log(printStyles.default(`NativeScript Plugin Tail [${name}@${version}]`))
  log(printStyles.bold('\tAuthor:\t') + printStyles.comment(author))
  log(printStyles.default('\t'))
  log(printStyles.default(`Usage: npx ${name} ${printStyles.bold('<path-to-package.json>')}`))
  log(printStyles.default('\t'))
}