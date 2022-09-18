#!/usr/bin/env node --experimental-json-modules

import fs from 'fs/promises'
import path from 'path'
import axios from 'axios'

import { printHelp } from './help.js'
import { log, chlk, errWrapper } from './logger.js'
import PackageInspector from './package.js'

async function runInspection(packageConfig = {}) {
  const inspector = new PackageInspector(packageConfig)
  log(
    chlk.default('Inspecting plugins in '
    + chlk._.bold(inspector.packageName)
    + ' v' + chlk._.bold(inspector.packageVersion) + ':')
  )
  await inspector.runInspection()
}

async function loadFile(path) {
  try {
    return JSON.parse((await fs.readFile(path)).toString())
  } catch (err) {
    errWrapper(err, 'Error when loading file from path: ' + chlk._.italic(path))
    printHelp()
    return
  }
}

async function main(args, cwd) {
  log(chlk.default.bold('NativeScript Plugin Tail - Tool for inspecting {N} plugins updates.'))

  log(chlk.default('\tCurrent working dir: ') + chlk.comment(cwd))
  
  let jsonContent = ''
  if (args.length === 1) {
    let [customPath] = args

    if (!customPath.includes('package.json') || args.length > 1) {
      printHelp()
      return
    }

    log(chlk.default('\tTarget: ') + chlk.comment(customPath))

    if (customPath.includes('https://')) {
      // read from web (raw file!)
      try {
        jsonContent = await axios.get(customPath)
      } catch (err) {
        errWrapper(err, 'Error when reading web file: ' + chlk._.italic(customPath))
        printHelp()
        return
      }
    } else {
      // normalize path
      try {
        customPath = path.normalize(customPath)
      } catch (err) {
        errWrapper(err, 'Error when reading file: ' + chlk._.italic(customPath))
        printHelp()
        return
      }
      // read file
      jsonContent = await loadFile(customPath)
    }
  } else {
    const defaultPath = path.join(cwd, 'package.json')
    log(chlk.default('\tTarget: ') + chlk.comment(defaultPath))
    jsonContent = await loadFile(defaultPath)
  }

  await runInspection(jsonContent)
  log(chlk.default('Inspection ended.'))
}

const [,,...args] = process.argv
const cwd = process.cwd()
await main(args, cwd)
