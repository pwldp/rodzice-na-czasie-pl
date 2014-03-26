//
// Definicja modelu: wychowawca klasy
//
//
//==============================================================================
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = mongoose.Schema.ObjectId
    , ServiceUser = require("../schema/ServiceUser")
    , ServiceGroup = require("../schema/ServiceGroup")
    , util = require("util")
    ;
//
//==============================================================================
var ClassTeacherSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'ServiceUser', index:{unique:false} },			// ID uzytkownika nayczyciela, wychowawcy
    school_class: { type: Schema.Types.ObjectId, ref: 'ServiceGroup', index:{unique:false} },
    confirmed: {type: Boolean, required: false, default: false },
    confirmed_by_user: { type: Schema.Types.ObjectId, ref: 'ServiceUser' },
    confirmed_dt: { type: Date, required: false},
    deleted: {type: Boolean, required: false, default: false },
    deleted_dt: { type: Date, required: false},
    deleted_by_user: { type: Schema.Types.ObjectId, ref: 'ServiceUser' },
    created_dt: { type: Date, required: false, default: Date.now() },
});
//
//
ClassTeacherSchema.pre('save', function(next) {
    var ct = this;
    //
    if (ct.isModified('confirmed') || this.isNew){
	if (ct.confirmed===true) {
	    ct.confirmed_dt = Date.now();
	} else if (ct.confirmed===false) {
	    ct.confirmed_dt = ct.created_dt;
	};
    };
    //
    if (this.isModified('deleted') && this.deleted===true ) {
	this.deleted_dt = Date.now();
    };
    //
    next();
});
//
//
module.exports = mongoose.model('ClassTeacher', ClassTeacherSchema);
//
// EOF
//