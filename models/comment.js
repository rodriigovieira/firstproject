var mongoose = require("mongoose");
var User = require("./user");

var commentSchema = new mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
    },
    desc: String
});


module.exports = mongoose.model("Comment", commentSchema);