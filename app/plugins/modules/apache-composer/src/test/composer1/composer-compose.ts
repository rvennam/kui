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

import { ISuite } from '../../../../../../../tests/lib/common'
import { join } from 'path'
const ROOT = process.env.TEST_ROOT
const common = require(join(ROOT, 'lib/common'))

const ui = require(join(ROOT, 'lib/ui'))
const cli = ui.cli
const expectedError = `Usage: This command is intended for use from the CLI, to launch this graphical Shell.
You are already here. Welcome!`

describe('try using "shell" to open the graphical shell, when already in the graphical shell', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  it('should fail when executing "shell"', () => cli.do('shell', this.app)
    .then(cli.expectError(0, expectedError))
    .catch(common.oops(this)))
})
