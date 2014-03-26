//
// Definicja modelu do zapamietania wydarzen w kalendarzu
//
// https://npmjs.org/package/calendar-tools
//
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    ;
//
//==============================================================================
var CalEventSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'ServiceUser' },
    summary: { type: String, require: true, trim: true: default: '' },
    description: { type: String, require: false, trim: true, default: '__ brak opisu __' }
    dt_start: { type: Date, require: true, index: {unique: false} },
    dt_stop: { type: Date, require: false, index: {unique: false} },
    all_day: { type: Boolean, require: false, default: false }
});
//
//==============================================================================
//
module.exports = mongoose.model('CalEvent', CalEventSchema);
//
// EOF
//