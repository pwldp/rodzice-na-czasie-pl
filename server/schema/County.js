//
// Definicja modelu: powiat
//
//==============================================================================
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = mongoose.Schema.ObjectId
    , Voivodeship = require("./Voivodeship")
    ;
//
//==============================================================================
//
var CountySchema = new Schema({
    name: {type: String, required:true, index:{unique:false} },
    slug: {type: String, required:false, index:{unique:false} },
    teryt: {type: String, required:false, index:{unique:false} },
    teryt_woj: {type: String, required:false, index:{unique:false} },
    teryt_pow: {type: String, required:false, index:{unique:false} },
    voiv_id: {type: ObjectId, ref: 'Voivodeship', index:{unique:false} },
    voiv_name: {type: String, required:false, index:{unique:false} },
});
//
//==============================================================================
//
module.exports = mongoose.model('County', CountySchema);
//
// EOF
//