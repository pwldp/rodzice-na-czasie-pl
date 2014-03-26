//
// Definicja modeli obslugi ankiet ankiety
//
// https://npmjs.org/package/calendar-tools
//
var ss = require("socketstream")
    , mongoose = require("mongoose")
    , ServiceGroupMember = require("../schema/ServiceGroupMember")
    , Schema = mongoose.Schema
    , moment = require("moment")
    ;
//
//==============================================================================
var PollSchema = new Schema({
    id: { type: String, require: false, index: {unique: true}},
    user: { type: Schema.Types.ObjectId, ref: 'ServiceUser' },	// wstawiajacy ankiete
    question: { type: String, require: false, trim: true },
    descr: { type: String, require: false, trim: true, default: '__ brak opisu __' },
    dt_start: { type: Date, require: false, index: {unique: false} },
    dt_stop: { type: Date, require: false, index: {unique: false} },
    dt_created: { type: Date, require: false, index: {unique: false} },
    dt_edited: { type: Date, require: false, default: Date.now() },
    groups: [{ type: Schema.Types.ObjectId, ref: 'ServiceGroup' }],
    //choices: [{ type: Schema.Types.ObjectId, ref: 'PollChoice' }],
    choices: [{ 
	choice:{ type: String, trim: true },
	counter: { type: Number, default: 0},
    }],
    vote_counter:{ type: Number, require:0, default: 0},
    //votes: [{ type: Schema.Types.ObjectId, ref: 'PollVote' }],
    votes: [{ 
	user: { type: Schema.Types.ObjectId, ref: 'ServiceUser' },
	choice: { type: String, require: true},
	dt_vote: { type: Date, require: false, default:Date.now() },
    }],
    comment: { type: Schema.Types.ObjectId, ref: 'Post' },
    deleted: { type: Boolean, required:false, default:false},
    dt_deleted: { type: Date, require: false, default: Date.now() },
    anon: { type: Boolean, required:false, default:false},
});
//
//
//==============================================================================
PollSchema.pre('save', function(next) {
    console.log("PollSchema.pre.save");
    var poll = this;
    poll.id = poll._id;
    var now = moment();
    if (poll.isNew) poll._wasNew=true;
    if (this.dt_start === undefined){
	this.dt_start = now;
	this.dt_stop = null;
    };
    if (this.dt_stop === undefined || this.dt_stop === null){
	this.dt_stop = now.add('days', 14);
    };
    //
    poll.dt_edited = now;
    // zeruje liczniki oddanych glosow
    poll.choices.forEach(function(choice){
	choice.counter = 0;
    });
    // zliczam glosy na poszczególne odpowiedzi
    poll.vote_counter = 0;
    poll.votes.forEach(function(vote){
	poll.vote_counter+=1;
	for (var i=0; i<poll.choices.length; i++){
	    if (vote.choice==poll.choices[i]._id){
		poll.choices[i].counter+=1;
		break;
	    };
	};
    });
    //
    next();
});
//
//
//==============================================================================
PollSchema.post('save', function(next) {
    console.log("PollSchema.POST.save");
    var poll = this;
    if (poll._wasNew){
	//console.log("PollSchema - wysylam powiadomienie, do adresatow ankiety, ze jest nowa ankieta");
	ServiceGroupMember
	.find({group_id:{$in: poll.groups}})
	.select("user_id")
	.exec(function(err, sgmList){
	    if (err) console.err("Poll.POST.Save.error:"+err);
	    sgmList.forEach(function(sgm){
		if (String(sgm.user_id)!==String(poll.user)){
		    //console.log("Send new poll's info to: "+sgm.user_id+", "+poll.user);
		    var msg = {id:poll._id, type:"new"};
		    ss.api.publish.user(sgm.user_id, 'msg', msg);
		};
	    });
	});
    };
});
//
//
module.exports = mongoose.model('Poll', PollSchema);
//
//==============================================================================
//
/*
var PollChoiceSchema = new Schema({
    choice: { type: String, require: true, trim: true },
    votes: { type: Number, require: false, default: 0 }	// licznik oddanych glosow na ta opcje
});
PollChoice = mongoose.model('PollChoice', PollChoiceSchema);
*/
//
//
//module.exports = mongoose.model('PollChoice', PollChoiceSchema);
//
//==============================================================================
//
/*
var PollVoteSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'ServiceUser' },	// glosujacy
    choice: { type: Schema.Types.ObjectId, ref: 'PollChoice' },
    dt_vote: { type: Date, require: false, default: Date.now() }
});
PollVote = mongoose.model('PollVote', PollVoteSchema);
*/
//
//
//module.exports = mongoose.model('PollChoice', PollChoiceSchema);
//
//==============================================================================
//
/*
var PollAssignGroupSchema = new Schema({
    group_id: { type: Schema.Types.ObjectId, ref: 'ServiceGroup' },	// grupa, ktora ma dostep do ankiety
    poll_id: { type: Schema.Types.ObjectId, ref: 'PollDescr' },
});
*/
//
//
//module.exports = mongoose.model('PollAssignGroup', PollAssignGroupSchema);
//
// EOF
//