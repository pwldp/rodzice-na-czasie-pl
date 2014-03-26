//
// Definicja modelu do obslugi czlonkow grup uzytkownikow w serwisie.
//
var mongoose = require('mongoose')
    , ServiceGroup = require("../schema/ServiceGroup")
    , Schema = mongoose.Schema;
//
//==============================================================================
var ServiceGroupMemberSchema = new Schema({
    group_id: { type: Schema.Types.ObjectId, ref: 'ServiceGroup', index: {unique: false} },
    user_id: { type: Schema.Types.ObjectId, ref: 'ServiceUser', index: {unique: false} },
    inviting_user: { type: Schema.Types.ObjectId, ref: 'ServiceUser' },
    roles:[{ type: String, required: false, default: "member", index: { unique: false } }],// ['member','teacher','class_teacher','moderator']
    accepted: { type: Boolean, required: false, default: false, index: {unique: false} },
    accepted_dt: {type: Date, required: false, default: Date.now()},
    creation_dt: {type: Date, default: Date.now() }
});
//
//==============================================================================
//
ServiceGroupMemberSchema.pre('save', function(next) {
    if (this.accepted_dt === undefined) {
	this.accepted_dt = Date.now();
    };
    if (this.isNew) {
	this.creation_dt = Date.now();
    };
    /*
    if (this.inviting_user === undefined) {
	this.inviting_user = this.user_id;
    };
    */
    //
    /*
    if (this.inviting_user = this.user_id) {
	this.accepted = true;
    };
    */
    //
    next();
});
//
//==============================================================================
//
var ServiceGroupMember = mongoose.model('ServiceGroupMember', ServiceGroupMemberSchema);
module.exports = ServiceGroupMember;
//
// EOF
//