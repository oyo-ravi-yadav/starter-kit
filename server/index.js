import '../client/app'
import path from 'path'
import * as express from 'express'
import cors from 'cors'
import chalk from 'chalk'
import manifestHelpers from 'express-manifest-helpers'
import bodyParser from 'body-parser'

const { PORT } = require('../config/constants')
const { paths, logMessage } = require('../config/helper')

require('dotenv').config()

const app = express.default()

app.use(cors())
app.use(paths.publicPath, express.static(path.join(paths.clientBuild)))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const manifestPath = `${paths.clientBuild}/assetsManifest.json`
app.use(
  manifestHelpers({
    manifestPath,
    cache: false
  })
)

app.get('/', (req, res) => {
  res.send(`
  <html>
  <head>
  <script src=${res.locals.getManifest().runtime.js}></script>
  <script src=${res.locals.getManifest().main.js}></script>
  <script src=${res.locals.getManifest().externalvendor.js}></script>
  </head>
  </html>
  `)
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  logMessage(`App is running: 🌎 http://localhost:${PORT || 8500}`)
})

export default app