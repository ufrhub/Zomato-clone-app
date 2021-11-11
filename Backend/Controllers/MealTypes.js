/********************* Import The Models *********************/

const { request, response } = require("express");
const MealTypesModel = require("../Models/MealTypes");




/********************* Export The Controller Functionality *********************/

    ///**************** (1) Get All The MealTypes ****************///

    exports.getAllMealTypes = (Request, Response) => {

        MealTypesModel.find().then(Result => {

            Response.status(200).json(

                {

                    message: "MealTypes List",

                    mealTypes: Result

                }

            )

         }).catch(Error => {

            Response.status(500).json(

                {

                    message: "Error in Database",

                    error: Error

                }

            )

         });

    };