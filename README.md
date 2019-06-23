# @digitaloptgroup/cli-dev-server-plugin

A development server to run you ADN app locally.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@digitaloptgroup/cli-dev-server-plugin.svg)](https://npmjs.org/package/@digitaloptgroup/cli-dev-server-plugin)
[![Downloads/week](https://img.shields.io/npm/dw/@digitaloptgroup/cli-dev-server-plugin.svg)](https://npmjs.org/package/@digitaloptgroup/cli-dev-server-plugin)
[![License](https://img.shields.io/npm/l/@digitaloptgroup/cli-dev-server-plugin.svg)](https://github.com/DigitalOptGroup/cli-dev-server-plugin/blob/master/package.json)

<!-- toc -->

- [Usage](#usage)
- [Commands](#commands)
  <!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g @digitaloptgroup/plugin-start
$ plugin-dogcli-start COMMAND
running command...
$ plugin-dogcli-start (-v|--version|version)
@digitaloptgroup/plugin-start/0.0.1-devpreview-14 linux-x64 node-v10.14.2
$ plugin-dogcli-start --help [COMMAND]
USAGE
  $ plugin-dogcli-start COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`plugin-dogcli-start start`](#plugin-dogcli-start-start)

## `plugin-dogcli-start start`

run a local server for development

```
USAGE
  $ plugin-dogcli-start start

OPTIONS
  -p, --port=port
  -s, --script=script

EXAMPLE
  $ dog start

  # Start on a custom port
  $ dog start --port 3001

  # Point to a non-standard script location
  $ dog start --script ./my-script.js
```

_See code: [src/commands/start.ts](https://github.com/DigitalOptGroup/cli-plugin-start/blob/v0.0.1-devpreview-14/src/commands/start.ts)_

<!-- commandsstop -->
