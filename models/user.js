var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
var SALT_FACTOR = 10;

//Define user schema
var userSchema = mongoose.Schema({
    username: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    createAt: {type: Date, default: Date.now()},
    displayName: String,
    bio: String
});

//Getting name
userSchema.methods.name = function () {
    return this.displayName || this.username;
}

//Hashing password
var noop = function() {};

userSchema.pre("save", function (done) {
    var user = this;
    if(!user.isModified("password")){
        return done();
    }
    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if(err) {return done(err);}
        bcrypt.hash(user.password, salt, noop,
            function (err, hashedPassword) {
                if(err) { return done(err); }
                user.password = hashedPassword;
                done();
            });
    });
});

//Checking password
userSchema.methods.checkPassword = function (guess, done) {
    bcrypt.compare(guess, this.password, function (err, isMatch) {
        done(err, isMatch);
    });
};

//Outputting usermodel
var User = mongoose.model("User", userSchema);

module.exports = User;