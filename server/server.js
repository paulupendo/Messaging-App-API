/**
 * BASE SETUP
 * ============================================
 */
import express from 'express'
import bodyparser from 'body-parser'

var app = express() /** defines the app using express */
var router = express.Router() /** get an instance of express router */
var port = process.env.port || 8080

app.use(bodyparser.urlencoded({extended: true})) /**
 * Returns middleware that only parses urlencoded bodies.
 * With the extended option set to true this will accept key value pairs of any type
 * If extended option is set to false it will accept key value pairs only as string or array
 */
app.use(bodyparser.json()) /** Return middleware that only parses Json */

router.get('/', (req, res) => {
  return res.json({message: 'Wup wup you just awoke yuri'})
})

app.use('/api/', router) /** register routes */

app.listen(port, () => {
  console.log('Yuri is live on port: ' + port)
}) /** Start our server */
