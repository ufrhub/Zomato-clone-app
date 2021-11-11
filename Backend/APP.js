console.log("Backend Server Started");

/********************* Import The Required Pakages *********************/

const Express = require("express");

const Mongoose = require("mongoose");

const BodyParser = require("body-parser");





/********************* Import The Routes *********************/

const Routes = require("./Routes/Index");

const { request, response } = require("express");




/********************* Initialise The Libraries *********************/

const App = Express(); // To Start the Express Server :

App.use(BodyParser.json()); // To Read Data from the POST Request Body :

const Port = 7071; // Declaration of Port Number :




/********************* Handle The CORS *********************/

App.use((Request, Response, next) => {
    Response.setHeader("Access-Control-Allow-Origin", "*"); // [*] =:> All the Incoming Requests from All the Origins will be Unblocked: 
    // ["http://localhost:3000"] =:> Ony the Incoming Request from Front-End will be Unblocked :

    Response.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE"); // Only GET, PUT, POST, DELETE type of Incoming Requests from the Origin will be Unblocked :

    Response.setHeader("Access-Control-Allow-Headers", "*"); // Only Content-Type and Authorization type of Incoming Requests from Headers will be Unblocked :

    next(); // It Prevents The Termination Of Codes :
});


// ["http://localhost:3000"] =:> Ony the Incoming Request from Front-End will be Unblocked:
// [*] =:> All the Incoming Requests from All the Origins will be Unblocked:
// ["GET, PUT, POST, DELETE"] =:> Only GET, PUT, POST, DELETE type of Incoming Requests from the Origin will be Unblocked:
// ["Content-Type, Authorization"] =:>  Only Content-Type and Authorization type of Incoming Requests from Headers will be Unblocked:




/********************* Start Using The Routes *********************/

App.use("/", Routes);  // ["/"] =:> Base Route or Version // [ Routes ] =:> Variable created to import routes in { Line No. 16 } :




/********************* Connect To MongoDB *********************/

/* 


    To Connect with the MongoDB we need :- 

        (1) Address of the MongoDB =:>
            -> MongoDB in our Computer will be running at the address of ["mongodb://127.0.0.1:27017"]
            -> MongoDB in a Cloud Instance [MongoDb Atlus] : 
                => Go to https://cloud.mongodb.com/
                => Login and go to Database Access
                => ADD NEW DATABASE USER or Select the User and save user_name and password
                => Go to Database and click on Connect and then Connect your Application
                => Then Copy the Path or Address of Server
                    [
                        mongodb+srv://Umar:<password>@cluster0.t3sop.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
                    ]
                => Then Replace the user and password with the user that you have selected or created in Database Access
                => Then Replace ["myFirstDatabase"] with Your Database which you want to Connect with

        (2) We need to listen to the Server Connection =:> 
            -> ["mongoose.connect("<address_of_server>", {"<some_configuration>"}).then().catch()"]


*/


Mongoose.connect("mongodb+srv://UmarFarooque:MyServer2021@cluster0.t3sop.mongodb.net/Zomato?retryWrites=true&w=majority",

                    {

                            useNewUrlParser : true,

                            useUnifiedTopology : true

                    }).then(Success => {

                        console.log("Connected to MongoDB");


                    ///**************** Start The Server ****************///

                        App.listen(Port, () => {

                            console.log(`Server is listening at Port : ${Port}`)

                        });

                    }).catch(Error => {

                        console.log("Connection Error" + Error);

                    });


       



