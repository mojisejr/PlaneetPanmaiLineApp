// Polyfills for Node.js test environment
// This must run before any other setup files
import { TextEncoder, TextDecoder } from 'util'
import 'whatwg-fetch'

global.TextEncoder = TextEncoder as typeof global.TextEncoder
global.TextDecoder = TextDecoder as typeof global.TextDecoder
