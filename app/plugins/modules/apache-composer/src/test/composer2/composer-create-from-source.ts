/*
 * Copyright 2018 IBM Corporation
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
import * as fs from 'fs'
import * as path from 'path'
const ROOT = process.env.TEST_ROOT
const common = require(path.join(ROOT, 'lib/common'))
const ui = require(path.join(ROOT, 'lib/ui'))
const cli = ui.cli
const sidecar = ui.sidecar
const srcDir = './data/composer/composer-source' // inputs for create-from-source

describe('composer create from source', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  // create from source
  fs.readdirSync(srcDir).forEach((file, idx) => {
    const name = `sourceTest-${idx}`

    // echo.js is used by require-relative.js, it isn't a composition on its own
    if (file.endsWith('.js') && file !== 'echo.js') {
      it(`should create a composer sequence from source ${file}`, () => cli.do(`app create ${name} ${path.join(srcDir, file)}`, this.app)
        .then(cli.expectOK)
        .then(sidecar.expectOpen)
        .then(sidecar.expectShowing(name))
        // .then(sidecar.expectBadge(badges.composerLib))
        .catch(common.oops(this)))
    }
  })
})
