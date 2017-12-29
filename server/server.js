/**
 * BASE SETUP
 * ============================================
 */
import _config from '../config'
import express from 'express'
import bodyparser from 'body-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

var app = express() /** defines the app using express */
var router = express.Router() /** get an instance of express router */
var port = process.env.port || 8080
dotenv.config()

app.use(bodyparser.urlencoded({extended: true})) /**
 * Returns middleware that only parses urlencoded bodies.
 * With the extended option set to true this will accept key value pairs of any type
 * If extended option is setto false it will accept key value pairs only as string or array
 */
app.use(bodyparser.json()) /** Return middleware that only parses Json */

router.get('/', (req, res) => {
  return res.json({message: 'Wup wup you just awoke yuri'})
})
router.use('/auth', require('./authRoutes'))
router.use(require('./groupRoutes')) /**
 * register separated routes
 */

app.use('/api/', router) /** register routes */
app.listen(port, () => {
  console.log('Yuri is live on port: ' + port)
})

mongoose.connect(_config.URI, {useMongoClient: true}, err => {
  err && console.log(err.message)
}) /** create connection to mongoDB via Mlab */
