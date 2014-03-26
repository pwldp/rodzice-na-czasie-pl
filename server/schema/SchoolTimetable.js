//
// Definicja modelu do zapamietania plany lekcji ucznia
//
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , moment = require('moment')
    ;
//
//==============================================================================
var SchoolTimetableSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'ServiceUser', index: { unique: false } },
    kid_id: { type: Schema.Types.ObjectId, ref: 'Kid', index: { unique: true } },
    schooltimetablehour_id: { type: Schema.Types.ObjectId, ref: 'SchoolTimetableHour' },
    
    valid_from: {type: Date, required: false, index: {unique: false}},
    valid_to: {type: Date, required: false, index: {unique: false}},
    
    created_dt: {type: Date, required: false, index: {unique: false}, default: Date.now()},
    edited_dt: {type: Date, required: false, index: {unique: false}, default: Date.now()},
    // dni liczone od poniedzialku
    // poniedzialek
    day1_0: { type: String, trim: true, default: '' },
    day1_1: { type: String, trim: true, default: '' },
    day1_2: { type: String, trim: true, default: '' },
    day1_3: { type: String, trim: true, default: '' },
    day1_4: { type: String, trim: true, default: '' },
    day1_5: { type: String, trim: true, default: '' },
    day1_6: { type: String, trim: true, default: '' },
    day1_7: { type: String, trim: true, default: '' },
    day1_8: { type: String, trim: true, default: '' },
    day1_9: { type: String, trim: true, default: '' },
    day1_10: { type: String, trim: true, default: '' },
    day1_11: { type: String, trim: true, default: '' },
    day1_12: { type: String, trim: true, default: '' },
    day1_13: { type: String, trim: true, default: '' },
    day1_14: { type: String, trim: true, default: '' },
    // wtorek
    day2_0: { type: String, trim: true, default: '' },
    day2_1: { type: String, trim: true, default: '' },
    day2_2: { type: String, trim: true, default: '' },
    day2_3: { type: String, trim: true, default: '' },
    day2_4: { type: String, trim: true, default: '' },
    day2_5: { type: String, trim: true, default: '' },
    day2_6: { type: String, trim: true, default: '' },
    day2_7: { type: String, trim: true, default: '' },
    day2_8: { type: String, trim: true, default: '' },
    day2_9: { type: String, trim: true, default: '' },
    day2_10: { type: String, trim: true, default: '' },
    day2_11: { type: String, trim: true, default: '' },
    day2_12: { type: String, trim: true, default: '' },
    day2_13: { type: String, trim: true, default: '' },
    day2_14: { type: String, trim: true, default: '' },
    // sroda
    day3_0: { type: String, trim: true, default: '' },
    day3_1: { type: String, trim: true, default: '' },
    day3_2: { type: String, trim: true, default: '' },
    day3_3: { type: String, trim: true, default: '' },
    day3_4: { type: String, trim: true, default: '' },
    day3_5: { type: String, trim: true, default: '' },
    day3_6: { type: String, trim: true, default: '' },
    day3_7: { type: String, trim: true, default: '' },
    day3_8: { type: String, trim: true, default: '' },
    day3_9: { type: String, trim: true, default: '' },
    day3_10: { type: String, trim: true, default: '' },
    day3_11: { type: String, trim: true, default: '' },
    day3_12: { type: String, trim: true, default: '' },
    day3_13: { type: String, trim: true, default: '' },
    day3_14: { type: String, trim: true, default: '' },
    // czwartek
    day4_0: { type: String, trim: true, default: '' },
    day4_1: { type: String, trim: true, default: '' },
    day4_2: { type: String, trim: true, default: '' },
    day4_3: { type: String, trim: true, default: '' },
    day4_4: { type: String, trim: true, default: '' },
    day4_5: { type: String, trim: true, default: '' },
    day4_6: { type: String, trim: true, default: '' },
    day4_7: { type: String, trim: true, default: '' },
    day4_8: { type: String, trim: true, default: '' },
    day4_9: { type: String, trim: true, default: '' },
    day4_10: { type: String, trim: true, default: '' },
    day4_11: { type: String, trim: true, default: '' },
    day4_12: { type: String, trim: true, default: '' },
    day4_13: { type: String, trim: true, default: '' },
    day4_14: { type: String, trim: true, default: '' },
    // piatek
    day5_0: { type: String, trim: true, default: '' },
    day5_1: { type: String, trim: true, default: '' },
    day5_2: { type: String, trim: true, default: '' },
    day5_3: { type: String, trim: true, default: '' },
    day5_4: { type: String, trim: true, default: '' },
    day5_5: { type: String, trim: true, default: '' },
    day5_6: { type: String, trim: true, default: '' },
    day5_7: { type: String, trim: true, default: '' },
    day5_8: { type: String, trim: true, default: '' },
    day5_9: { type: String, trim: true, default: '' },
    day5_10: { type: String, trim: true, default: '' },
    day5_11: { type: String, trim: true, default: '' },
    day5_12: { type: String, trim: true, default: '' },
    day5_13: { type: String, trim: true, default: '' },
    day5_14: { type: String, trim: true, default: '' },
    // sobota
    day6_0: { type: String, trim: true, default: '' },
    day6_1: { type: String, trim: true, default: '' },
    day6_2: { type: String, trim: true, default: '' },
    day6_3: { type: String, trim: true, default: '' },
    day6_4: { type: String, trim: true, default: '' },
    day6_5: { type: String, trim: true, default: '' },
    day6_6: { type: String, trim: true, default: '' },
    day6_7: { type: String, trim: true, default: '' },
    day6_8: { type: String, trim: true, default: '' },
    day6_9: { type: String, trim: true, default: '' },
    day6_10: { type: String, trim: true, default: '' },
    day6_11: { type: String, trim: true, default: '' },
    day6_12: { type: String, trim: true, default: '' },
    day6_13: { type: String, trim: true, default: '' },
    day6_14: { type: String, trim: true, default: '' },
    // niedziela
    day7_0: { type: String, trim: true, default: '' },
    day7_1: { type: String, trim: true, default: '' },
    day7_2: { type: String, trim: true, default: '' },
    day7_3: { type: String, trim: true, default: '' },
    day7_4: { type: String, trim: true, default: '' },
    day7_5: { type: String, trim: true, default: '' },
    day7_6: { type: String, trim: true, default: '' },
    day7_7: { type: String, trim: true, default: '' },
    day7_8: { type: String, trim: true, default: '' },
    day7_9: { type: String, trim: true, default: '' },
    day7_10: { type: String, trim: true, default: '' },
    day7_11: { type: String, trim: true, default: '' },
    day7_12: { type: String, trim: true, default: '' },
    day7_13: { type: String, trim: true, default: '' },
    day7_14: { type: String, trim: true, default: '' }
});
//
//==============================================================================
var SchoolTimetableSchemaOLD2 = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'ServiceUser', index: { unique: false } },
    kid_id: { type: Schema.Types.ObjectId, ref: 'Kid', index: { unique: true } },
    schooltimetablehour_id: { type: Schema.Types.ObjectId, ref: 'SchoolTimetableHour' },
    
    valid_from: {type: Date, required: false, index: {unique: false}},
    valid_to: {type: Date, required: false, index: {unique: false}},
    
    created_dt: {type: Date, required: false, index: {unique: false}, default: Date.now()},
    edited_dt: {type: Date, required: false, index: {unique: false}, default: Date.now()},
    // dni liczone od poniedzialku
    // poniedzialek
    day1_0: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day1_1: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day1_2: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day1_3: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day1_4: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day1_5: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day1_6: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day1_7: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day1_8: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day1_9: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day1_10: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day1_11: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day1_12: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day1_13: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day1_14: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    // wtorek
    day2_0: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day2_1: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day2_2: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day2_3: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day2_4: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day2_5: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day2_6: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day2_7: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day2_8: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day2_9: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day2_10: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day2_11: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day2_12: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day2_13: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day2_14: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    // sroda
    day3_0: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day3_1: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day3_2: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day3_3: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day3_4: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day3_5: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day3_6: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day3_7: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day3_8: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day3_9: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day3_10: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day3_11: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day3_12: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day3_13: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day3_14: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    // czwartek
    day4_0: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day4_1: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day4_2: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day4_3: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day4_4: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day4_5: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day4_6: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day4_7: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day4_8: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day4_9: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day4_10: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day4_11: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day4_12: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day4_13: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day4_14: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    // piatek
    day5_0: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day5_1: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day5_2: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day5_3: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day5_4: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day5_5: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day5_6: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day5_7: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day5_8: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day5_9: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day5_10: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day5_11: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day5_12: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day5_13: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day5_14: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    // sobota
    day6_0: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day6_1: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day6_2: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day6_3: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day6_4: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day6_5: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day6_6: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day6_7: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day6_8: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day6_9: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day6_10: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day6_11: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day6_12: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day6_13: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day6_14: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    // niedziela
    day7_0: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day7_1: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day7_2: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day7_3: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day7_4: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day7_5: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day7_6: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day7_7: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day7_8: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day7_9: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day7_10: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day7_11: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day7_12: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day7_13: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
    day7_14: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },

});
//
//==============================================================================
var SchoolTimetableSchemaOLD = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'ServiceUser', index: { unique: false } },
    kid_id: { type: Schema.Types.ObjectId, ref: 'Kid', index: { unique: true } },
    schooltimetablehour_id: { type: Schema.Types.ObjectId, ref: 'SchoolTimetableHour' },
    
    valid_from: {type: Date, required: false, index: {unique: false}},
    valid_to: {type: Date, required: false, index: {unique: false}},
    
    created_dt: {type: Date, required: false, index: {unique: false}, default: Date.now()},
    edited_dt: {type: Date, required: false, index: {unique: false}, default: Date.now()},
    // dni liczone od poniedzialku
    // poniedzialek
    day1: {
    	hour0: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour1: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour2: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour3: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour4: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour5: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour6: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour7: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour8: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour9: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour10: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour11: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour12: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour13: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour14: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' }
    },
    // wtorek
    day2: {
    	hour0: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour1: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour2: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour3: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour4: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour5: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour6: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour7: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour8: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour9: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour10: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour11: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour12: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour13: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour14: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' }
    },
    // sroda
    day3: {
    	hour0: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour1: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour2: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour3: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour4: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour5: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour6: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour7: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour8: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour9: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour10: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour11: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour12: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour13: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour14: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' }
    },
    // czwartek
    day4: {
    	hour0: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour1: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour2: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour3: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour4: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour5: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour6: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour7: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour8: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour9: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour10: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour11: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour12: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour13: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour14: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' }
    },
    // piatek
    day5: {
    	hour0: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour1: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour2: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour3: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour4: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour5: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour6: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour7: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour8: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour9: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour10: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour11: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour12: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour13: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour14: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' }
    },
    // sobota
    day6: {
    	hour0: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour1: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour2: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour3: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour4: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour5: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour6: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour7: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour8: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour9: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour10: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour11: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour12: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour13: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour14: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' }
    },
    // niedziela
    day7: {
    	hour0: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour1: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour2: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour3: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour4: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour5: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour6: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour7: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour8: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour9: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour10: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour11: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour12: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour13: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' },
	hour14: { type: Schema.Types.ObjectId, ref: 'SchoolSubject' }
    }
});
//
//==============================================================================
SchoolTimetableSchema.pre('save', function(next) {
    console.log("Save school timetable, kid_id=", this.kid_id);
    //
    var valid_from = true;
    if (this.valid_from===undefined || this.valid_from===null || this.valid_from===""){
	valid_from = false;
    } else {
	if ( moment(this.valid_from).isValid()===false ){
	    valid_from = false;
	};
    }
    //console.log("valid_from= "+this.valid_from+", czy jest VALID="+valid_from);
    //
    var valid_to = true;
    if (this.valid_to===undefined || this.valid_to===null || this.valid_to===""){
	valid_to = false;
    } else {
	if ( moment(this.valid_to).isValid()===false ){
	    valid_to = false;
	};
    }
    //    
    //console.log("valid_to= "+this.valid_to);
    if (valid_from===false || valid_to===false){
	//console.log("Ustawiam przedzial roku szkolnego:");
	var now = moment();
	//console.log("year="+now.year());
	//console.log("month="+now.month());
	if (now.month()>=0 && now.month()<=5) {
	    this.valid_from = (now.year()-1) + "-09-01";
	    this.valid_to = now.year() + "-06-30";
	} else {
	    this.valid_from = now.year() + "-08-01";
	    this.valid_to = (now.year()+1) + "-06-30";
	};
	
    };
    //console.log("valid_from="+this.valid_from);
    //console.log("valid_to="+this.valid_to);
    //
    this.edited_dt = Date.now();
    //
    next();
});
/*
SchoolTimetableSchema.pre('validate', function (next) {
    console.log("SchoolTimetableSchema.validate()");
    
  if (err) handleError(err)
    else // validation passed
    });
    
    next();
});
*/
//
//
//==============================================================================
//
module.exports = mongoose.model('SchoolTimetable', SchoolTimetableSchema);
//
// EOF
//