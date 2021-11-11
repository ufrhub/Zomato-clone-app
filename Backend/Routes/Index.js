/********************* Import Router From The Express *********************/

const Express = require("express");
const Router = Express.Router(); // [ Routter() ] =:> It is a Pre Defined Function




/********************* Import The Controllers *********************/

const LocationsController = require("../Controllers/Locations");
const MealTypesController = require("../Controllers/MealTypes");
const MenuController = require("../Controllers/Menu")
const RestaurantsController = require("../Controllers/Restaurants");
const UsersController = require("../Controllers/Users");
const PaymentsController = require("../Controllers/Payments");




/********************* Declare The Routes And Bind With The Controller Methods *********************/

    ///**************** Locations ****************///

     Router.get("/getAllLocations", LocationsController.getAllLocations);
     Router.get("/getLocationByID/:ID", LocationsController.getLocationByID);



    ///**************** MealTypes ****************///

     Router.get("/getAllMealTypes", MealTypesController.getAllMealTypes);



    ///**************** Menu ****************///

     Router.get("/getMenuByRestaurant/:ID", MenuController.getMenuByRestaurant);



    ///**************** Restaurants ****************///

     Router.get("/getAllRestaurants", RestaurantsController.getAllRestaurants);
     Router.get("/getAllRestaurantsByLocation/:CityName", RestaurantsController.getAllRestaurantsByLocation);
     Router.get("/getRestaurantByID/:ID", RestaurantsController.getRestaurantByID);
     Router.post("/FilterRestaurants", RestaurantsController.FilterRestaurants);



    ///**************** Login and SignUp ****************///

     Router.post("/Login", UsersController.Login);
     Router.post("/Signup", UsersController.Signup);



    ///**************** Payments and Payments Callback ****************///

     Router.post("/Payment", PaymentsController.Payment);
     Router.post("/PaymentCallback", PaymentsController.PaymentCallback);





/********************* Export The Routes *********************/

module.exports = Router; // [ module ] & [ exports ] =:> These are Pre Defined Instruction in Node-JS