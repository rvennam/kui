/*
 * Copyright 2017 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This sample plugin uses the companion "create-echo" plugin to create a sample action,
 * then adds a field, and opens the sidecar to show that field.
 *
 */

'use strict'

const { ui } = require('../../../content/js/ui')
const repl = require('../../../content/js/repl')

/**
 * This is the command handler. Handlers can return plain strings,
 * which will then be printed in the CLI portion of the UI.
 *
 * More sophisticated examples can return Promises of values. If the
 * value, or promise thereof, evaluates to a whisk entity, then the
 * sidecar will be opened to show it.
 *
 * If you want the repl only to print "ok", then return true
 *
 * If you want the repl to print an error string in red text, then throw new Error("error message")
 *
 */
const openSidecar = ({ argv, command, argvNoOptions, parsedOptions }) => {
  return repl.qexec('sample create action') // qexec will use the repl to perform a nested evaluation
    .then(action => {
      action.demo = { sampleField: 'This is a sample sidecar mode' } // here we add a field
      return ui.showEntity(action, { show: 'demo' }) // and open the sidecar, specifying that our new field should be shown
    })
}

/**
 * This is the exported module. It registers a handler for "sample sidecar" commands
 *
 */
module.exports = (commandTree, prequire) => {
  commandTree.listen('/sample/sidecar', openSidecar, { docs: 'Open the sidecar' })
}
