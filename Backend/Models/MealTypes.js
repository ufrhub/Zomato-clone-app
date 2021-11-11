/********************* Import The Mongoose Library *********************/

const Mongoose = require("mongoose");




/********************* Create The Schema *********************/

const MealtypeSchema = Mongoose.Schema;

const MealTypeSchemaObject = new MealtypeSchema(

    ///**************** Declare The Fields Present In The Collection ****************///

    {

        name: {

            type: String, // Give the Type of this Field :

            required: true // Give Required as True if this Field is Compulsory else False :

        },

        content: {

            type: String, // Give the Type of this Field :

            required: true // Give Required as True if this Field is Compulsory else False :

        },

        image: {

            type: String, // Give the Type of this Field :

            required: true // Give Required as True if this Field is Compulsory else False :

        },

        meal_type: {

            type: Number, // Give the Type of this Field :

            required: true // Give Required as True if this Field is Compulsory else False :

        }

    }
    
);




/********************* Create The Model From Schema And Connect To The MongoDB Collection And Export The Model *********************/

module.exports = Mongoose.model("MealTypesModel", MealTypeSchemaObject, "MealTypes");


/*


    [ module.exports ] =:> Pre Defined Module To Export Data From Given Database Details :


    [ Mongoose ] =:> Variable Containing Library Of Mongoose { Line No. 3 } :


    [ model ] =:> This Method Passes Some Parameters :
        => [ (<"Name_Of_Model_From_Controller">, <Schema>, <"Name_Of_Collection_From_Database">) ] 


    [ "Locations" ] =:> From Locations Controller File { Line No. 4 }:


    [ LocationSchema ] =:> From { Line No. 12 } :


    [ "Locations" ] =:> From MongoDB Database Collection :


*/