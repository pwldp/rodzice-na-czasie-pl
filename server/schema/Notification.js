//
// Definicja modelu do obslugi powiadomien
//
// Dariusz Pawlak <pawlakdp@gmail.com>
// 2013.01.29
//
//==============================================================================
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    ;
//
//==============================================================================
var NotificationSchema = new Schema({
    id: { type: String, required: false, index:{unique:true} },
    from_user: { type: Schema.Types.ObjectId, ref: 'ServiceUser', index: {unique: false} },
    to_user_id: { type: Schema.Types.ObjectId, ref: 'ServiceUser', index: {unique: false} },	// wypelniane jezeli jest znany user_id
    to_user_email: { type: String, required: false},
    url: { type: String, required: false},
    type: { type: String, required: true, index: { unique: false } },
    created_dt: { type: Date, required: false, default: Date.now },
    updated_dt: { type: Date, required: false, default: Date.now },
    updated_by_user: { type: Schema.Types.ObjectId, ref: 'ServiceUser', index: {unique: false} },
    payload: { type: Schema.Types.Mixed, required: true },
    note: { type: String },
    status: { type: String, default: 'unknown' },
    status_change_dt: { type: Date, required: false},
});
//
NotificationSchema.pre('save', function(next) {
    this.id=this._id;
    //
    if (this.isModified('status')){
	this.status_change_dt = Date.now();
    };
    //
    next();
});

//
module.exports = mongoose.model('Notification', NotificationSchema);
//
// EOF
//