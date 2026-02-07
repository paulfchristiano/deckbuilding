import { readFile, writeFile } from 'node:fs/promises'
import { build } from 'esbuild'

function stripModulePreloads(html) {
    return html.replace(/^\s*<link rel="modulepreload"[^>]*>\s*$/gm, '')
}

function inlineStylesheet(html, css) {
    const stylesheetPattern = /<link rel="stylesheet"[^>]*href="style\.css"[^>]*\/?>/
    if (stylesheetPattern.test(html)) {
        return html.replace(stylesheetPattern, `<style>\n${css}\n</style>`)
    }
    return html.replace('</head>', `<style>\n${css}\n</style>\n</head>`)
}

function swapEntryScript(html) {
    return html.replace(
        /<script type="module" src="main\.js"><\/script>/,
        '<script defer src="app.js"></script>'
    )
}

async function main() {
    await build({
        entryPoints: ['public/main.js'],
        outfile: 'app.js',
        bundle: true,
        platform: 'browser',
        format: 'iife',
        minify: false,
        sourcemap: false,
        target: ['es2018'],
    })

    const [htmlSource, cssSource] = await Promise.all([
        readFile('public/index.html', 'utf8'),
        readFile('public/style.css', 'utf8')
    ])

    let html = htmlSource
    html = stripModulePreloads(html)
    html = inlineStylesheet(html, cssSource)
    html = swapEntryScript(html)
    await writeFile('index.html', html, 'utf8')
}

await main()
