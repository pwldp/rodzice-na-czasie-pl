//
// Definicja modelu do zapamietania godzin lekcyjnych zdefiniowanych dla ucznia
//
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    ;
//
//==============================================================================
var SchoolTimetableHourSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'ServiceUser' },
    kid_id: { type: Schema.Types.ObjectId, ref: 'Kid' },
    
    hour0: {
	start: { type: String, lowercase: true, trim: true: default: '' },
	stop: { type: String, lowercase: true, trim: true, default: '' }
    }
    hour1: {
	start: { type: String, lowercase: true, trim: true: default: '8:00' },
	stop: { type: String, lowercase: true, trim: true, default: '8:45' }
    },
    hour2: {
	start: { type: String, lowercase: true, trim: true: default: '8:55' },
	stop: { type: String, lowercase: true, trim: true, default: '9:40' }
    },
    hour3: {
	start: { type: String, lowercase: true, trim: true: default: '9:50' },
	stop: { type: String, lowercase: true, trim: true, default: '10:35' }
    },
    hour4: {
	start: { type: String, lowercase: true, trim: true: default: '10:45' },
	stop: { type: String, lowercase: true, trim: true, default: '11:30' }
    },
    hour5: {
	start: { type: String, lowercase: true, trim: true: default: '11:40' },
	stop: { type: String, lowercase: true, trim: true, default: '12:25' }
    },
    hour6: {
	start: { type: String, lowercase: true, trim: true: default: '12:45' },
	stop: { type: String, lowercase: true, trim: true, default: '13:30' }
    },
    hour7: {
	start: { type: String, lowercase: true, trim: true: default: '13:40' },
	stop: { type: String, lowercase: true, trim: true, default: '14:25' }
    },
    hour8: {
	start: { type: String, lowercase: true, trim: true: default: '14:30' },
	stop: { type: String, lowercase: true, trim: true, default: '15:15' }
    },
    hour9: {
	start: { type: String, lowercase: true, trim: true: default: '15:25' },
	stop: { type: String, lowercase: true, trim: true, default: '16:10' }
    },
    hour10: {
	start: { type: String, lowercase: true, trim: true: default: '' },
	stop: { type: String, lowercase: true, trim: true, default: '' }
    },
    hour11: {
	start: { type: String, lowercase: true, trim: true: default: '' },
	stop: { type: String, lowercase: true, trim: true, default: '' }
    },
    hour12: {
	start: { type: String, lowercase: true, trim: true: default: '' },
	stop: { type: String, lowercase: true, trim: true, default: '' }
    },
    hour13: {
	start: { type: String, lowercase: true, trim: true: default: '' },
	stop: { type: String, lowercase: true, trim: true, default: '' }
    },
    hour14: {
	start: { type: String, lowercase: true, trim: true: default: '' },
	stop: { type: String, lowercase: true, trim: true, default: '' }
    }
});
//
//==============================================================================
//
module.exports = mongoose.model('SchoolTimetableHour', SchoolTimetableHourSchema);
//
// EOF
//