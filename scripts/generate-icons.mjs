import sharp from 'sharp'

const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="96" fill="#0f172a" />
  <path d="M256 96 96 224v192a16 16 0 0 0 16 16h96V320h96v112h96a16 16 0 0 0 16-16V224Z"
    fill="none" stroke="#14b8a6" stroke-width="24" stroke-linejoin="round" stroke-linecap="round" />
</svg>
`

await sharp(Buffer.from(svg)).resize(512, 512).png().toFile('public/icon-512.png')
await sharp(Buffer.from(svg)).resize(192, 192).png().toFile('public/icon-192.png')

console.log('Icons erzeugt: public/icon-512.png, public/icon-192.png')
