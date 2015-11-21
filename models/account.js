var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    email: String,
    name: String,
    username: String,
    password: String,
    admin: Boolean,
    following: []
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('accounts', Account);
