const isValidSource = require('./is-valid-source')
const isValidTarget = require('./is-valid-target')
const loadGistFiles = require('./load-gist-files')
const parseArgs = require('./parse-args')
const saveFiles = require('./save-files')

const loadGist = ({ args }) => {
  const argv = parseArgs(args)
  const source = argv._[1]
  const destination = argv._[2] || process.cwd()

  if (!source) {
    return Promise.reject(new Error('failed to load: source is not specified'))
  }

  if (!isValidSource(source)) {
    return Promise.reject(new Error('failed to load: source suppose to be a valid gist hash'))
  }

  if (!destination) {
    return Promise.reject(new Error('failed to load: destination is not specified'))
  }

  return isValidTarget(destination)
    .then(() => console.log('loading files...'))
    .then(() => loadGistFiles(source))
    .then(files => saveFiles(files, destination))
    .then(files => console.log(`${files.length} file(s) were created:\n${files.join('\n')}`))
    .then(() => ({ path: destination, install: argv.install }))
    .catch((error) => {
      throw new Error(`failed to load source because of '${error.message}'`)
    })
}

module.exports.execute = loadGist
