//
// Obsługa wiadomości 
//
var mongoose = require("mongoose")
    , Msg = require("../schema/Msg")
    , ServiceUser = require("../schema/ServiceUser")
    , Schema = mongoose.Schema
    , util = require("util")
    ;
//==============================================================================
var MsgFolderSchema = new Schema({
    msg: { type: Schema.Types.ObjectId, ref: 'Msg', index: {unique: false} }
    , owner: { type: Schema.Types.ObjectId, ref: 'ServiceUser', index: {unique: false} }
    , folder: {type:String, required:false, default: 'inbox', index: {unique: false} }	// [inbox, outbox, trash]
    , status: {type:String, required:false, default: 'new', index: {unique: false} }	// [new,read,deleted]
    , status_change_dt: {type: Date, required: false}
    , created_dt: {type: Date, required: false, default: Date.now()}
    , deleted: {type:Boolean, required:false, default:false}
    , deleted_dt: {type: Date, required: false}	// skasowane wiadomosci sa usuwane po 30 dniach od skasowania
});
//
//==============================================================================
MsgFolderSchema.pre('save', function(next) {
    //
    next();
});
//
//==============================================================================
var MsgFolder  = mongoose.model('MsgFolder', MsgFolderSchema);
//
module.exports = MsgFolder;
//
// EOF
//