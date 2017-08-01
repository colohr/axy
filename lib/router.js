const express = require('express')
const fxy = require('fxy')
const router = express()
const public_folder = fxy.join(__dirname,'../public')
//const element_library = fxy.join(public_folder,'element')
router.use(express.static(public_folder))
module.exports = router