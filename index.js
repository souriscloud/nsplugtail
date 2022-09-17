#!/usr/bin/env node --experimental-json-modules

import fs from 'fs/promises'
import path from 'path'

import { printHelp } from './help.js'
import { httpsGet } from './client.js'
// import { packageLookup } from './lookup.js'

// await packageLookup('@nativescript/core')
// printHelp()

async function main(args, cwd) {
  console.log('arguments:', args)
  console.log('cwd:', cwd)
  
  let workingPath = cwd
  if (args.length === 1) {
    let [customPath] = args
    try {
      customPath = path.normalize(customPath)
    } catch (err) {
      console.error(err)
      printHelp()
      return
    }

    if (!customPath.includes('package.json')) {
      printHelp()
      return
    }

    let rawContent = ''
    if (customPath.includes('https://')) {
      try {
        rawContent = await httpsGet(customPath)
      } catch (err) {
        console.error(err)
        printHelp()
        return
      }
    } else {
      try {
        rawContent = (await fs.readFile(customPath)).toString()
      } catch (err) {
        console.error(err)
        printHelp()
        return
      }
    }

    console.log('file content:')
    console.log(rawContent)
  }

  if (args.length > 1) {
    printHelp()
    return
  }

  const targetPackageConfigPath = path.join(cwd, 'package.json')
  console.log('target:', targetPackageConfigPath)
}

const [,,...args] = process.argv
const cwd = process.cwd()
await main(args, cwd)
