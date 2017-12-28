import mongoose from 'mongoose'
var Schema = mongoose.Schema

var usersSchema = new Schema({
  username: String,
  email: String,
  password: String
})

var groupSchema = new Schema({
  _creator: { type: Schema.Types.ObjectId, ref: 'Users' },
  name: String,
  members: [{ email: String }]
}) /** The Group collection will store user id.
* The user id identifies the group owner or creator.
* It also will store a group name and a group members array
*/

var messageSchema = new Schema({
  _creator: { type: Schema.Types.ObjectId, ref: 'Users' },
  _groupid: { type: Schema.Types.ObjectId, ref: 'Groups' },
  _content: String
}) /** The Messages collection will store user id and group id.
* The user id identifies the message owner or creator.
* The group id will help us identify what group a message belongs to
* It will also store message contents in type String
*/

module.exports = {
  Users: mongoose.model('Users', usersSchema),
  Groups: mongoose.model('Groups', groupSchema),
  Messages: mongoose.model('Messages', messageSchema)
}
