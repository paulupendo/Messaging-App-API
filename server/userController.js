import R from 'ramda'
import _db from '../models/db_models'
import authController from './authController'

var groups = new _db.Groups()
var messages = new _db.Messages()

const isEmptyString = R.pipe(
  R.defaultTo(''),
  R.trim,
  R.isEmpty
)

const saveGroup = (token, res) => {
  _db.Users.findById(token.id, (err, user) => { /**
    * locate user in DB with particular id
    */
    if (err) {
      res.json({ msg: err })
    } else if (String(user._id) === token.id) {
      groups._creator = token.id /**
       * add user_id as group creator from decoded token
       */
      groups.save((err) => {
        if (err) {
          res.json({ msg: err.message })
        } else {
          res.json({ msg: 'Group successfuly created' })
        }
      }) /** add group to DB */
    } else {
      res.json({ msg: 'Ooops! Unauthorised access!' })
    }
  })
}

const saveMember = (group, existingUser, res) => {
  let userExists = group.members.some((user) => {
    return user.email === existingUser.email
  }) /**
   * check if user already exists in group
   */

  if (!userExists) {
    group.members.push({ email: existingUser.email }) /**
    * add new member to existing group
    * email serves as the identifier
    */
    group.save((err) => {
      if (err) {
        res.json({ msg: 'Ooops! An error occured' })
      }
      res.json({ msg: existingUser.username + ' was successfully added' })
    }) /** update group info */
  } else {
    res.json({ msg: 'Ooops! This member already exists' })
  }
}

const verifyUser = (address, group, res) => {
  _db.Users.find((err, users) => {
    if (err) {
      res.json({ msg: 'Ooops! An error occured' })
    } else {
      let userFound = users.find((user) => {
        return user.email === address
      }) /**
       * check if user exists in the DB
       * returns user object if user exists
       */
      if (userFound) {
        saveMember(group, userFound, res)
      } else {
        res.json({msg: 'Ooops! This user does not exist'})
      }
    }
  })
}

module.exports = {
  validator: function (name, token) {
    let response
    let emptyInput = R.any(isEmptyString, [name])

    if (emptyInput) {
      response = 'Ooops! Group name cannot be empty'
    } else if (isEmptyString(token)) {
      response = 'Ooops! Unauthorised'
    } else {
      response = 'group input validation success'
    }
    return response
  },
  createGroup: function (name, token, res) {
    groups.name = R.trim(name)
    let decodedToken = authController.verifyToken(token) /** decode token and get payload */
    if (decodedToken.hasOwnProperty('id') === false) {
      res.json({ msg: 'Authorisation error' })
    } else {
      saveGroup(decodedToken, res)
    }
  },
  addUser: function (email, groupid, token, res) {
    let emptyData = R.any(isEmptyString, [email])
    let decodedToken = authController.verifyToken(token) /** decode token and get payload */

    if (emptyData) {
      res.json({ msg: 'Ooops! Email cannot be empty' })
    } else if (decodedToken.hasOwnProperty('id') === false) {
      res.json({ msg: 'Authorisation error' })
    } else {
      this.groupValidation(groupid, email, res) /**
       * validates that group and user exists
       * adds user to group's member list
       */
    }
  },
  createMesssage: function (_content, token, groupid, res) {
    let decodedToken = authController.verifyToken(token) /** decode token and get payload */
    if (decodedToken.hasOwnProperty('id') === false) {
      res.json({ msg: 'Ooops! Authorisation error' })
    } else {
      _db.Users.findById(decodedToken.id, (err, user) => {
        if (err) {
          res.json({ msg: 'An error occured' })
        } else if (String(user._id) === decodedToken.id) {
          messages._content = _content
          messages._creator = decodedToken.id
          messages._groupid = groupid

          messages.save((err) => {
            if (err) {
              res.json({ msg: err.message })
            } else {
              res.json({ msg: 'Message posted successfuly' })
            }
          })
        } else {
          res.json({ msg: 'Authorisation error' })
        }
      })
    }
  },
  groupValidation: function (groupid, email, res) {
    _db.Groups.findById(groupid, (err, group) => {
      if (err) {
        res.json({ msg: 'An error occured' })
      } else if (group) {
        verifyUser(email, group, res)
      } else {
        res.json({ msg: 'Ooops! group does not exist' })
      }
    })
  },
  getMessages: function (groupid, res) {
    _db.Messages.find((err, messages) => {
      if (err) {
        res.json({ msg: 'Ooops! An error occured' })
      } else {
        let groupMesages = messages.filter((message) => {
          return String(message._groupid) === groupid
        })
        groupMesages.length > 0
          ? res.json({ msg: groupMesages })
          : res.json({ msg: 'Ooops! No messages here yet' })
      }
    })
  },
  deleteGroup: function () {
    // delete group
  },
  deleteMessage: function () {
    // delete messages
  },
  updateGroup: function () {
    // update group name
  },
  updateMessage: function () {
    // update message
  }
}
