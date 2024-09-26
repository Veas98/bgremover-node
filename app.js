const { removeBackground } = require('@imgly/background-removal-node')
const fs = require('fs')
const path = require('path')

async function removeImageBackground(imgSource) {
    try {
        const blob = await removeBackground(imgSource)

        return Buffer.from(await blob.arrayBuffer())
    } catch (error) {
        throw new Error('Error removing background: ' + error)
    }
}

async function processFolder(inputFolderPath, outputFolderPath) {
    try {
        const files = fs.readdirSync(inputFolderPath)

        if (!fs.existsSync(outputFolderPath)) {
            fs.mkdirSync(outputFolderPath)
        }

        for (const file of files) {
            const filePath = path.join(inputFolderPath, file)
            const fileExtension = path.extname(file).toLowerCase()

            console.log(`Processing ${file}...`)

            const resultBuffer = await removeImageBackground(filePath)
            const outputFilePath = path.join(outputFolderPath, path.basename(file, fileExtension) + '.png')
            fs.writeFileSync(outputFilePath, resultBuffer, { encoding: 'base64' })

            console.log(`${file} processed and saved as ${outputFilePath}`)

        }

        console.log('All images processed successfully.')
    } catch (error) {
        console.error('Error:', error.message)
    }
}

async function main() {
    const path = require('path');
    const inputFolderPath = path.join(__dirname, 'before');
    const outputFolderPath = path.join(__dirname, 'after');

    await processFolder(inputFolderPath, outputFolderPath)
}

main()
