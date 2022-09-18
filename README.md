# NSPlugTail - NativeScript Plugin Tail

Tool for inspecting your package.json NativeScript plugins updates.

## Usage

```shell
  npx nsplugtail [<path-to-package.json>]
```

**<path-to-package.json>** can be either **RAW** web served file (git raw link) or local present file
if path to package.json is ommitted, current working directory is used (appended by `package.json`)

## Info

Tool is filtering `dependencies` for patterns:
 - `nativescript`
 - `google`
 - `firebase`
and following package config keys has to be set:
 - `name`
 - `version`
 - `description`
 - `author`
 - `dependencies`

## Issues

Use GitHub Issues
