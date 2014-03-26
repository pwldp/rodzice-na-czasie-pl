//
// Definicja modelu: typy szkół
//
//
//==============================================================================
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ServiceUser = require("../schema/ServiceUser")
    , SchoolSubject = require("../schema/SchoolSubject")
    , util = require("util")
    ;
//
//==============================================================================
//var emptyVoiv = 
var TeacherInSchoolSchema = new Schema({
    user: { type:Schema.Types.ObjectId, ref: 'ServiceUser', index: {unique:false} },		// uzytkownik ktory jest nauczycielem
    school: { type:Schema.Types.ObjectId, ref: 'ServiceGroup', index: { unique:false} },		// szkoła w ktorej jest nayczycielem
    subject_id: { type:Schema.Types.ObjectId, ref: 'SchoolSubject', index: { unique:false} },	// id przedmiotu MEN
    subject_name: { type:String, required:false, index:{ unique:false} },				// nazwa przedmioty sposza listy MEN
    confirmed: { type:Boolean, required:false, default:false},
    confirmed_dt: { type: Date, required:false, default: Date.now()},
    confirmed_by_user:{ type:Schema.Types.ObjectId, ref: 'ServiceUser', index: {unique:false} },	// kto go zaakceptowal
    deleted: { type:Boolean, required:false, default:false},
    deleted_dt: { type: Date, required:false, default: Date.now()},
});
//
TeacherInSchoolSchema.pre('save', function(next) {
    //
    if (this.isModified('confirmed') && this.confirmed===true ) {
	this.confirmed_dt = Date.now();
    };
    //
    if (this.isModified('deleted') && this.deleted===true ) {
	this.deleted_dt = Date.now();
    };
    //
    next();
});
//
var TeacherInSchool = mongoose.model('TeacherInSchool', TeacherInSchoolSchema);
module.exports = TeacherInSchool;
//
// EOF
//