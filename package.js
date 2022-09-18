import axios from 'axios'

import { log, chlk, pkgWrapper } from './logger.js'

const PACKAGE_FILTERS = ['nativescript', 'google', 'firebase']
const CONFIG_VALIDATOR = ['name', 'version', 'description', 'author', 'dependencies']

function isConfigValid(packageConfig = {}) {
  return CONFIG_VALIDATOR.every(p => Object.keys(packageConfig).includes(p))
}

export default class PackageInspector {

  constructor(packageConfig = {}) {
    if (!isConfigValid(packageConfig)) {
      throw new Error('package.json is not valid! Some of mandatory keys are missing!')
    }

    this._config = packageConfig
  }

  // getters
  get packageName() { return this._config.name }
  get packageVersion() { return this._config.version }
  get packageDescription() { return this._config.description }
  get packageAuthor() { return this._config.author }
  get packageDependencies() { return this._config.dependencies }
  get packageConfig() { return this._config }
  get packageDependenciesEntries() { return Object.entries(this._config.dependencies) }
  get packagesToInspect() {
    return this.packageDependenciesEntries
      .filter(
        ([pkgName, pkgVersion]) => 
          PACKAGE_FILTERS.some(p => pkgName.includes(p))
      )
  }

  async inspectPackage([pkgName, pkgVersion]) {
    if (['^', '~'].includes(pkgVersion[0])) {
      pkgVersion = pkgVersion.substring(1)
    }
    const url = `https://registry.npmjs.org/${pkgName}`
    const { data } = await axios.get(url, {
      responseType: 'json'
    })

    delete data.readme

    const latest = data['dist-tags']?.latest
    if (!latest) {
      log(chlk.error('No latest ' + chlk._.bold('dist-tag') + '! Package: ' + chlk._.bold(pkgName)))
    } else {
      pkgWrapper(pkgName, pkgVersion, pkgVersion.includes(latest), latest)
    }
  }

  async runInspection() {
    for (let pkgEntry of this.packagesToInspect) {
      await this.inspectPackage(pkgEntry)
    }
  }
}
