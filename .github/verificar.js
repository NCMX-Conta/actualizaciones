// Comprueba una solicitud de publicación antes de hacer pública la versión:
// el programa del borrador debe tener el SHA-256 y tamaño de la solicitud,
// y la firma (hecha con la llave privada del titular, que nunca sale de su computadora)
// debe ser válida para "NeuralContaMX|versión|sha256" con la llave pública de la app.
const fs = require('fs'), crypto = require('crypto')
const [exe, solicitud] = process.argv.slice(2)
const s = JSON.parse(fs.readFileSync(solicitud, 'utf8'))
const LLAVE = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAi+fCfWNUAxoE31fscOyeLJJDAg3wn7GISGjWqDxP/us=
-----END PUBLIC KEY-----`
const falla = m => { console.error('ERROR: ' + m); process.exit(1) }
if (!/^\d+\.\d+\.\d+$/.test(s.version || '')) falla('versión no válida')
const datos = fs.readFileSync(exe)
const sha = crypto.createHash('sha256').update(datos).digest('hex')
if (sha !== s.sha256) falla(`el programa del borrador no es el firmado (${sha} ≠ ${s.sha256})`)
if (s.tamano && s.tamano !== datos.length) falla('el tamaño no coincide')
if (!crypto.verify(null, Buffer.from(`NeuralContaMX|${s.version}|${s.sha256}`), LLAVE, Buffer.from(s.firma || '', 'base64'))) falla('firma no válida')
console.log(`OK ${s.version} ${sha}`)
