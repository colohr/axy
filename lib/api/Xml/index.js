const XmlApi = require('./Api')
const XmlClass = require('./Class')
//exports
module.exports.Api = XmlApi
module.exports.Class = XmlClass
module.exports.dom = require('./dom')
module.exports.Struct = require('./Struct')
module.exports.rename = XmlClass.rename


