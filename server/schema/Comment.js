//
// Definicja modelu do obslugi dyskusji
//
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ServiceUser = require("../schema/ServiceUser")
    , Post = require("../schema/Post")
    ;
//
//==============================================================================
var CommentSchema = new Schema({    
    id: { type: String, required: false }
    , post_id: { type: Schema.Types.ObjectId, ref: 'Post', index: {unique: false} }
    , owner_id: { type: Schema.Types.ObjectId, ref: 'ServiceUser', index: {unique: false} }
    , content: { type: String, required: true }
    , created_dt: {type: Date, required: true, default: Date.now()}
    , edited_dt: {type: Date, required: false}
});
//
//==============================================================================
CommentSchema.pre('save', function(next) {
    //
    if (this.id === undefined ) {
	this.id = this._id;
    };
    //
    this.edited_dt = Date.now();
    //
    next();
});
//
//==============================================================================

//
//==============================================================================
//var CommentSchema  = mongoose.model('Comment', CommentSchema);
//
//module.exports = CommentSchema;
var Comment  = mongoose.model('Comment', CommentSchema);
//
module.exports = Comment;
//
// EOF
//