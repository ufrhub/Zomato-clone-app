/********************* Import The Models *********************/

const { request, response } = require("express");
const LocationsModel = require("../Models/Locations");




/********************* Export The Controller Functionality *********************/

    ///**************** (1) Get All The Locations ****************///

    exports.getAllLocations = (Request, Response) => {

        LocationsModel.find().then(Result => {

            Response.status(200).json(
                
                {

                    message: "Location Fetched",

                    locations: Result

                }
                
            );

         }).catch(Error => {

            Response.status(500).json(
                
                {

                    message: "Error in Database",

                    error: Error

                }
            
            )

         });

    };



    ///**************** (2) Get All The Locations By ID ****************///

    exports.getLocationByID = (Request, Response) => {

        const LocationID = Request.params.ID

        LocationsModel.find(

            {

                location_id: LocationID // [ location_id ] =:> From Locations Model File { Line No. 34 } And [ LocationID ] =:> From { Line No. 53 } :

            }

         ).then(Result => {

            Response.status(200).json(
                
                {

                    message: "Location Fetched By ID",

                    locations: Result

                }
                
            );

         }).catch(Error => {

            Response.status(500).json(
                
                {

                    message: "Error in Database",
                    
                    error: Error

                }
            
            )

         });

    };