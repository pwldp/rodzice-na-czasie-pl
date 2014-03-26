//
// Definicja modelu do obslugi dyskusji
//
var mongoose = require("mongoose")
    , Comment = require("../schema/Comment")
    , ServiceUser = require("../schema/ServiceUser")
    , ServiceGroup = require("../schema/ServiceGroup")
    , ServiceGroupMember = require("../schema/ServiceGroupMember")
    , PostForGroup = require("../schema/PostForGroup")
    , Schema = mongoose.Schema
    , slugify = require("slug")
    , util = require("util")
    ;
//
//==============================================================================
var PostSchema = new Schema({
    id: { type: String, required: false }
    , title: { type: String, required: true, index: { unique: false } }
    , slug: { type: String, required: false, index: { unique: false } }
    , content: { type: String, required: true }
    , owner: { type: Schema.Types.ObjectId, ref: 'ServiceUser', index: {unique: false} }	// uzytkownik, ktory zalozyl grupe
    , created_dt: {type: Date, required: true, default: Date.now()}
    , edited_dt: {type: Date, required: false}
    , private: { type: Boolean, required: false, default: true }
    , public: { type: Boolean, required: false, default: false }
    , groups: { type: Boolean, required: false, default: false }
    , groups_list: [{ type: Schema.Types.ObjectId, ref: 'ServiceGroup', index: {unique: false} }]
    , users: { type: Boolean, required: false, default: false }
    , users_list: [{ type: Schema.Types.ObjectId, ref: 'ServiceUser', index: {unique: false} }]
    , comments_num: {type: Number, required: false, default: 0}
    , last_comment_user_id: { type: Schema.Types.ObjectId, ref: 'ServiceUser', index: {unique: false} }	// id usera ktory ostatno dopisal komentarz
    , last_comment_id: { type: Schema.Types.ObjectId, ref: 'Comment', index: {unique: false} }	// id ostatnio dodanego komentarza
    , read_counter: {type: Number, required: false, default: 0}
});    
//
//==============================================================================
PostSchema.pre('save', function(next) {
    console.log("SAVE.0");
    this.slug = slugify(this.title.toLowerCase());
    //
    if (this.id === undefined ) {
	this.id = this._id;
    };
    //
    this.edited_dt = Date.now();
    //
    this.last_comment_user_id = this.owner;
    //
    //console.log("SAVE.1");
    if (this.private===undefined || typeof(this.private)!=="boolean" || !this.private){
	this.private = false;
    };
    //
    //console.log("SAVE.2 public="+typeof(this.public));
    if (typeof(this.public)==="boolean"){
	//console.log("SAVE.2 public= JEST BOOLEAN"+typeof(this.public));
    };
    if (this.public===undefined || typeof(this.public)!=="boolean" || !this.public){
	//console.log("SAVE.2 public= NIE POWINNO TEGO BYC");
	this.public = false;
    };
    // spr. czy nie ma sprzecznosci i dostep jest ustawiony na: public i private
    // jezeli tak jest to ustawiam na 'private'
    //console.log("SAVE.3"+this.public+", "+this.private);
    if (this.public===false && this.private===false){
	this.private = true;
    };
    //
    // jezeli ustawione sa ID grup to dostep tylko dla grup
    //console.log()
    if (this.groups && (this.private || this.public)){
	this.private = false;
	this.public = false;
	this.groups = true;
    }
    //
    console.log("SAVE.4");
    //
    this.edited_dt = Date.now();
    //
    next();
});
//
//==============================================================================
PostSchema.statics.isAccessibleByUser = function(post_id, user_id, cb){
    var thisPost = this;
    //console.log("thisPOST="+util.inspect(this));
    console.log("Post.statics.isAccessibleByUser("+post_id+","+user_id+")");
    // czytam liste grup, do ktorych nalezy user_id
    ServiceGroupMember
    .find({user_id:user_id, accepted:true})
    .select("group_id")
    .exec(function(err, membershipList){
	//console.log("membershipList:"+util.inspect(membershipList));
	thisPost.findById(post_id, function(err, post){
	    if (err) return cb(err);
	    //
	    //console.log("POST="+util.inspect(post));
	    //
	    if (post){
		if (post.private && String(post.owner)===String(user_id)){
		    // jeżeli jest wlascicielem post to ma do niego dostep
		    return cb(null, true);
		} else {
		    // spr. czy ma dostep do posta poprzez grupy, do ktorych nalezy
		    if (post.groups){
			// szukam pierwszej grupy do ktorej nalezy post i user_id
			if (membershipList){
			    var foundGroup = false;
			    membershipList.forEach(function(item){
				//console.log("indexOf="+post.groups_list.indexOf(item._id));
				if (post.groups_list.indexOf(item.group_id)>=0){
				    //console.log("Znalazlem:"+item._id);
				    foundGroup = true;
				};
			    });
			    return cb(null, foundGroup);
			} else {
			    return cb(null, false);
			};
		    } else {
			  return cb(null, false);
		    };
		};
	    } else {
		if (err) return cb("Nie znaleziono wpisu.");
	    };
	});
    });
    
};

//
//==============================================================================
var Post  = mongoose.model('Post', PostSchema);
//
module.exports = Post;
//
// EOF
//