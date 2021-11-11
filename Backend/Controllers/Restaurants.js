/********************* Import The Models *********************/

const { request, response } = require("express");
const RestaurantsModel = require("../Models/Restaurants");




/********************* Export The Controller Functionality *********************/

    ///**************** (1) Get All The Restaurants ****************///

    exports.getAllRestaurants = (Request, Response) => {

        RestaurantsModel.find().then(Result => {

            Response.status(200).json(

                {

                    message: "Restaurants List",

                    restaurants: Result

                }

            );

         }).catch(Error => {

            Response.status(500).json(

                {

                    message: "Error in Database",

                    error: Error

                }

            );

         });

    };



    ///**************** (2) Get All The Restaurants By Location ****************///

    exports.getAllRestaurantsByLocation = (Request, Response) => {

        const City = Request.params.CityName; // [ CityName ] =:> From Router's File { Index.js Line No. 45 } : 

        RestaurantsModel.find(

            {

                city: City // [ city ] =:> From Restaurants Model File { Line No. 26 } And [ City ] =:> From { Line No. 53 } :

            }

         ).then(Result => {

            Response.status(200).json(

                {

                    message: "Restaurants List By City Name",

                    restaurants: Result

                }

            );

         }).catch(Error => {

            Response.status(500).json(

                {

                    message: "Error in Database",

                    error: Error

                }

            );

         });

    };



    ///**************** (3) Get All The Restaurants By ID ****************///

    exports.getRestaurantByID = (Request, Response) => {

        const RestaurantID = Request.params.ID; // [ ID ] =:> From Router's File { Index.js Line No. 46 } :

        RestaurantsModel.find(

            {

                _id: RestaurantID // [ _id ] =:> From Restaurants DataBase And [ RestaurantID ] =:> From { Line No. 101 } :

            }

         ).then(Result => {

            Response.status(200).json(

                {

                    message: `Restaurant fetched for Id ${RestaurantID}`,

                    restaurants: Result[0]

                }

            );

         }).catch(Error => {

            Response.status(500).json(

                {

                    message: "Error in Database",

                    error: Error

                }

            );

         });

    };



    ///**************** (4) Filter The Restaurants Based On MealTypes, Location, Cuisine, Low Cost, High Cost, Sort, Page ****************///

    exports.FilterRestaurants = (Request, Response) => {

        const {

            MealType,

            Location,

            Cuisine,

            LowCost,

            HighCost,

            Sort,

            Page = 1

         } = Request.body;

        let Filters = {};


        /////**************** Filter Restaurants By MealType ****************/////

        if (MealType) {

            Filters.mealtype_id = MealType; // [ Filters ] =:> From { Line No. 168 } And [ mealtype_id ] =:> From Restaurants Model File { Line No. 114 } And [ MealType ] =:> From { Line No. 152 } :

         };


        /////**************** Filter Restaurants By Location ****************/////

        if (Location) {

            Filters.location_id = Location; // [ Filters ] =:> From { Line No. 168 } And [ location_id ] =:> From Restaurants Model File { Line No. 34 } And [ Location ] =:> From { Line No. 154 } :

         };


        /////**************** Filter Restaurants By Cuisine ****************/////

        if (Cuisine && Cuisine.length > 0) {

            Filters["cuisine.name"] = { // [ Filters ] =:> From { Line No. 168 } And [ "cousine.name" ] =:> From Database Restaurants Collection { cousine Array } :

                $in: Cuisine // [ Cuisine ] =:> From { Line No. 156 } And [ $in ] =:> Means { Equals To The Value In The Specified Array } :

            };

         };


        /////**************** Filter Restaurants By LowCost And HighCost ****************/////

        if (LowCost && HighCost) { // [ LowCost && HighCost ] =:> From { Line No. 58 and 60 } :

            if (LowCost == 0) {

                Filters.min_price = { // [ Filters ] =:> From { Line No. 168 } And [ min_price ] =:> From Restaurants Model File { Line No. 82 } :

                    $lt: HighCost // [ $lt ] =:> Means { Lower Than } :

                }

             } else {

                Filters.min_price = { // [ Filters ] =:> From { Line No. 168 } [ min_price ] =:> From Restaurants Model File { Line No. 82 }

                    $gt: LowCost, // [ $gt ] =:> Means [ Greater Than ] :

                    $lt: HighCost // [ $lt ] =:> Means [ Lower Than ] :

                };

             };

         };



        RestaurantsModel.find(Filters).sort( // [ Filters ] =:> From { Line No. 168 } And [ sort() ] =:> This Method is Used to Sort Data :

            {

                min_price: Sort // [ min_price ] =:> From Restaurants Model File { Line No. 82 } And [ Sort ] =:> From { Line No. 62 } :

            }

         ).then(Result => {

            /////**************** Filter Restaurants By Page Number ****************/////

            const PageLimit = 2;

            let TemporaryArray = [];

            function Paginate(Array, PageSize, PageNumber) {

                let PaginatedResult = [];

                PaginatedResult = Array.slice((PageNumber - 1) * PageSize, PageNumber * PageSize); // [ slice() ] =:> This Method Returns a Shallow Copy of a Portion of an Array into a New Array Object Selected from Start to End { End not Included } where Start and End Represent the Index of Items in that Array :

                return PaginatedResult;

            };

            TemporaryArray = Paginate(Result, PageLimit, Page);

            Response.status(200).json(

                {

                    message: "Filtered Restaurants List",

                    restaurants: TemporaryArray,

                    totalResultsCount: Result.length,

                    pageNumber: Page,

                    pageSize: PageLimit

                }

            );

         }).catch(Error => {

            Response.status(500).json(

                {

                    message: "Error in Database",

                    error: Error

                }

            );

         });

    };


