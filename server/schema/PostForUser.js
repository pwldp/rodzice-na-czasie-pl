//
// Przechowywanie informacji, ktorzy uzytkownicy wskazany przez ID maja dostep do ktorego posta
//
var mongoose = require('mongoose')
    , ServiceGroup = require("../schema/ServiceUser")
    , Post = require("../schema/Post")
    , Schema = mongoose.Schema
    ;
//
//==============================================================================
var PostForUserSchema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: 'Post', index: {unique: false} }
    , user: { type: Schema.Types.ObjectId, ref: 'ServiceUser', index: {unique: false} }
    , edited_dt: {type: Date, required: true, default: Date.now()}
});  
//
//==============================================================================
var PostForUser  = mongoose.model('PostForUser', PostForUserSchema);
//
module.exports = PostForUser;
//
// EOF
//