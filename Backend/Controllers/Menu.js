/********************* Import The Models *********************/

const MenuModel = require("../Models/Menu");




/********************* Export The Controller Functionality *********************/

    exports.getMenuByRestaurant = (Request, Response) => {

        const RestaurantID = Request.params.ID // [ ID ] =:> From Router's File { Index.js Line No. 38 } :

        MenuModel.find({ ID: RestaurantID }).then(Result => {

            Response.status(200).json(

                {

                    message: `Menu For Restaurant ${RestaurantID}`,

                    menu: Result

                }

            )

         }).catch(Error => {

            Response.status(500).json(

                {

                    message: "Error in Database",

                    error: Error

                }

            );

         });

    };