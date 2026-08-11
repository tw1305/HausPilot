import sharp from 'sharp'
import { fileURLToPath } from 'node:url'

const source = fileURLToPath(new URL('./icon-source.jpg', import.meta.url))

await sharp(source).resize(512, 512).png().toFile('public/icon-512.png')
await sharp(source).resize(192, 192).png().toFile('public/icon-192.png')

console.log('Icons erzeugt: public/icon-512.png, public/icon-192.png')
