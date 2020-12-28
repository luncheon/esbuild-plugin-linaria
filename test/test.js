const esbuild = require('esbuild')
const linariaPlugin = require('..')

const stylis = require('stylis')
stylis.set({ prefix: false })

const build = () => esbuild.build({
  entryPoints: ['src/app.tsx'],
  outdir: 'dist',
  jsxFactory: 'h',
  jsxFragment: 'Fragment',
  bundle: true,
  minify: true,
  plugins: [linariaPlugin()],
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
  await browser.close()
  console.log('success')
}

const main = async () => {
  await build()
  await test()
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
