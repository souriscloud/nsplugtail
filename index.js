#!/usr/bin/env node --experimental-json-modules

import fs from 'fs/promises'
import path from 'path'
import axios from 'axios'

import { printHelp } from './help.js'
import PackageInspector from './package.js'

async function runInspection(packageConfig = {}) {
  const inspector = new PackageInspector(packageConfig)
  console.log('Package', inspector.packageName, inspector.packageVersion)
  await inspector.runInspection()
}

async function loadFile(path) {
  try {
    return JSON.parse((await fs.readFile(path)).toString())
  } catch (err) {
    console.error(err)
    printHelp()
    return
  }
}

async function main(args, cwd) {
  console.log('arguments:', args)
  console.log('cwd:', cwd)
  
  let workingPath = cwd
  let jsonContent = ''
  if (args.length === 1) {
    let [customPath] = args

    if (!customPath.includes('package.json') || args.length > 1) {
      printHelp()
      return
    }

    if (customPath.includes('https://')) {
      // read from web (raw file!)
      try {
        jsonContent = await axios.get(customPath)
      } catch (err) {
        console.error(err)
        printHelp()
        return
      }
    } else {
      // normalize path
      try {
        customPath = path.normalize(customPath)
      } catch (err) {
        console.error(err)
        printHelp()
        return
      }
      // read file
      jsonContent = await loadFile(customPath)
    }
  }

  const targetPackageConfigPath = path.join(cwd, 'package.json')
  console.log('target:', targetPackageConfigPath)
  jsonContent = await loadFile(targetPackageConfigPath)

  await runInspection(jsonContent)
}

const [,,...args] = process.argv
const cwd = process.cwd()
await main(args, cwd)
