import express from 'express'
import groupController from './groupController'
import messageController from './messageController'
import userController from './userController'

let router = express.Router()

router.post('/group', (req, res) => {
  var name = req.body.groupname
  var token = req.body.token
  var group = new groupController.NewGroup(name) /**
   * new group object from constructor
   */
  var response = userController.validator(group.name, token) /**
   * handles input validation
   */
  if (response === 'group input validation success') {
    userController.createGroup(group.name, token, res) /**
     * save group to DB
     */
  } else {
    res.json({ msg: response })
  }
})

router.put('/group/:groupId/user', (req, res) => {
  var email = req.body.email
  var groupId = req.params.groupId
  let token = req.body.token
  userController.addUser(email, groupId, token, res)
})

router.post('/group/:groupId/message', (req, res) => {
  let message = req.body.content
  let _groupId = req.params.groupId
  let token = req.body.token

  var messageObj = new messageController.NewMessage(message)
  userController.createMesssage(messageObj.content, token, _groupId, res)
})

router.get('/group/:groupId/messages', (req, res) => {
  let groupId = req.params.groupId
  userController.getMessages(groupId, res)
})

module.exports = router
