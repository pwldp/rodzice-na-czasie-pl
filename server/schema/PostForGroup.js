//
// Przechowywanie informacji, ktora grupa ma dostep do ktorego posta
//
var mongoose = require('mongoose')
    //, CommentSchema = require("../schema/Comment")
    , ServiceGroup = require("../schema/ServiceGroup")
    , Post = require("../schema/Post")
    , Schema = mongoose.Schema
    ;
//
//==============================================================================
var PostForGroupSchema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: 'Post', index: {unique: false} }
    , group: { type: Schema.Types.ObjectId, ref: 'ServiceGroup', index: {unique: false} }
    , edited_dt: {type: Date, required: true, default: Date.now()}
});  
//
//==============================================================================
var PostForGroup  = mongoose.model('PostForGroup', PostForGroupSchema);
//
module.exports = PostForGroup;
//
// EOF
//