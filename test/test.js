const { sep } = require('node:path')
const esbuild = require('esbuild')
const linariaPlugin = require('..')

const stylis = require('stylis')
stylis.set({ prefix: false })

const build = () => esbuild.build({
  entryPoints: ['src/index.ts'],
  outdir: 'dist',
  jsxFactory: 'h',
  jsxFragment: 'Fragment',
  bundle: true,
  minify: true,
  plugins: [linariaPlugin({
    preprocess: (code, args) => args.path.endsWith(`${sep}App.tsx`) ? code + ';document.body.dataset.preprocessed = "yes"' : code
  })],
})

const test = async () => {
  const path = require('path')
  const assert = require('assert')
  const puppeteer = require('puppeteer')
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.goto('file://' + path.resolve(__dirname, 'test.html'))
  assert.strictEqual('grid', await page.evaluate(`getComputedStyle(document.getElementById('grid')).display`))
  assert.strictEqual('flex', await page.evaluate(`getComputedStyle(document.getElementById('before-flex'), ':before').display`))
  assert.strictEqual('yes', await page.evaluate(`document.body.dataset.preprocessed`))
  await browser.close()
}

const main = async () => {
  await build()
  await test()
  console.log('success')
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
