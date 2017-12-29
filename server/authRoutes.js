import R from 'ramda'
import express from 'express'
import authController from './authController'
import _db from '../models/db_models'

var router = express.Router()
var userModel = new _db.Users() /** new instance of the User model */

router.post('/signup', (req, res) => {
  let newUser = new authController.UserInfo(req.body.name, req.body.email, req.body.password, req.body.confirmPass) /**
   * create a new user object with user info
   */
  let response = authController.validateInput(newUser.name, newUser.email, newUser.password, newUser.confirmPass) /**
   * validate user input and check for edge-cases
   */
  if (response === 'success') {
    authController.ValidateUserAndSave(_db.Users, userModel, newUser, res) /**
     * check if name already exists in DB
     * save new data to db if it does not exist
     */
  } else {
    res.json({ msg: response }) /**
     * send json response with input validation error info
     */
  }
})

router.post('/signin', (req, res) => {
  var userObj = R.omit(['confirmPass', 'name'], new authController.UserInfo()) /**
   * create new user object instance omitting some properties
   */
  userObj.email = req.body.email
  userObj.password = req.body.password

  authController.userAuth(_db.Users, userObj, res) /**
   * handels user authentication
   */
})

module.exports = router
