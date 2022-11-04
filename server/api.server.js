const register = require('react-server-dom-webpack/node-register')
register()
const babelRegister = require('@babel/register')

babelRegister({
  ignore: [/[\\\/](build|server|node_modules)[\\\/]/],
  presets: [['react-app', { runtime: 'automatic' }]],
  plugins: ['@babel/transform-modules-commonjs'],
})

const express = require('express')
const path = require('path')
const { readFileSync } = require('fs')

const { renderToPipeableStream } = require('react-server-dom-webpack/writer')
const React = require('react')
const ReactApp = require('../src/App.server').default

const PORT = process.env.PORT || 4000
const app = express()

app.use(express.json())

app.listen(PORT, () => {
  console.log('React Notes listening at 4000...')
})

function handleErrors(fn) {
  return async function (req, res, next) {
    try {
      return await fn(req, res)
    } catch (x) {
      next(x)
    }
  }
}

app.get(
  '/',
  handleErrors(async function (_req, res) {
    await waitForWebpack()
    const html = readFileSync(
      path.resolve(__dirname, '../build/index.html'),
      'utf8'
    )
    // Note: this is sending an empty HTML shell, like a client-side-only app.
    // However, the intended solution (which isn't built out yet) is to read
    // from the Server endpoint and turn its response into an HTML stream.
    res.send(html)
  })
)

async function renderReactTree(res, props) {
  await waitForWebpack()
  const manifest = readFileSync(
    path.resolve(__dirname, '../build/react-client-manifest.json'),
    'utf8'
  )
  const moduleMap = JSON.parse(manifest)
  const { pipe } = renderToPipeableStream(
    React.createElement(ReactApp, props),
    moduleMap
  )
  pipe(res)
}

function sendResponse(req, res, redirectToId) {
  const location = JSON.parse(req.query.location) // location: {"selectedId":3,"isEditing":false,"searchText":""}
  if (redirectToId) {
    location.selectedId = redirectToId
  }
  res.set('X-Location', JSON.stringify(location)) // ?
  renderReactTree(res, {
    selectedId: location.selectedId,
    isEditing: location.isEditing,
    searchText: location.searchText,
  })
}

app.get('/react', function (req, res) {
  sendResponse(req, res, null)
})

app.use(express.static('build'))
app.use(express.static('public'))

// waitForWebpack을 통해 webpack 빌드가 완료될 때까지 무한 반복(체킹)
async function waitForWebpack() {
  while (true) {
    try {
      readFileSync(path.resolve(__dirname, '../build/index.html'))
      return
    } catch (err) {
      console.log(
        'Could not find webpack build output. Will retry in a second...'
      )
      console.error(err)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }
}
