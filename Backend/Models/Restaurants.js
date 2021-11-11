/********************* Import The Mongoose Library *********************/

const Mongoose = require("mongoose");




/********************* Create The Schema *********************/

const RestaurantSchema = Mongoose.Schema;

const RestaurantSchemaObject = new RestaurantSchema( 

    ///**************** Declare The Fields Present In The Collection ****************///

    {

        name: {

            type: String, // Give the Type of this Field :

            required: true // Give Required as True if this Field is Compulsory else False :

        },

        city: {

            type: String, // Give the Type of this Field :

            required: true // Give Required as True if this Field is Compulsory else False :

        },

        location_id: {

            type: Number, // Give the Type of this Field :

            required: true // Give Required as True if this Field is Compulsory else False :

        },

        city_id: {

            type: Number, // Give the Type of this Field :

            required: true // Give Required as True if this Field is Compulsory else False :

        },

        locality: {

            type: String, // Give the Type of this Field :

            required: true // Give Required as True if this Field is Compulsory else False :

        },

        thumb: {

            type: Array, // Give the Type of this Field :

            required: true // Give Required as True if this Field is Compulsory else False :

        },

        aggregate_rating: {

            type: Number, // Give the Type of this Field :

            required: true // Give Required as True if this Field is Compulsory else False :

        },

        rating_text: {

            type: String, // Give the Type of this Field :

            required: true // Give Required as True if this Field is Compulsory else False :

        },

        min_price: {

            type: Number, // Give the Type of this Field :

            required: true // Give Required as True if this Field is Compulsory else False :

        },

        contact_number: {

            type: Number, // Give the Type of this Field :

            required: true // Give Required as True if this Field is Compulsory else False :

        },

        cuisine: {

            type: Array, // Give the Type of this Field :

            required: true // Give Required as True if this Field is Compulsory else False :

        },

        image: {

            type: String, // Give the Type of this Field :

            required: true // Give Required as True if this Field is Compulsory else False :

        },

        mealtype_id: {

            type: Number, // Give the Type of this Field :

            required: true // Give Required as True if this Field is Compulsory else False :

        }

    }

);




/********************* Create The Model From Schema And Connect To The MongoDB Collection And Export The Model *********************/

module.exports = Mongoose.model("RestaurantsModel", RestaurantSchemaObject, "Restaurants");


/*


    [ module.exports ] =:> Pre Defined Module To Export Data From Given Database Details :


    [ Mongoose ] =:> Variable Containing Library Of Mongoose { Line No. 3 } :


    [ model ] =:> This Method Passes Some Parameters :
        => [ (<"Name_Of_Model_From_Controller">, <Schema>, <"Name_Of_Collection_From_Database">) ] 


    [ "Locations" ] =:> From Locations Controller File { Line No. 4 }:


    [ LocationSchema ] =:> From { Line No. 12 } :


    [ "Locations" ] =:> From MongoDB Database Collection :


*/