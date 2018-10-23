var mongoose = require("mongoose");
var Comment = require("./comment");
var User = require("./user");

var datadbSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    desc: String,
    comments: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Datadb", datadbSchema);

