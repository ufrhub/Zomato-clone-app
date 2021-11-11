/********************* Import The Models *********************/

const { request, response } = require("express");
const UsersModel = require("../Models/Users");




/********************* Export The Controller Functionality *********************/

    ///**************** (1) Login ****************///

     exports.Login = (Request, Response) => {

        const {

            UserName,

            Password

        } = Request.body;

        UsersModel.find(

            {

                Email: UserName,

                Password: Password

            }

        ).then(Result => {

            if(Result.length > 0) {

                Response.status(200).json(

                    {
    
                        message: "User Logged In Successfully",

                        isLoggedIn: true,

                        User: Result[0]
                        
                    }

                );

            } else {

                Response.status(400).json(

                    {

                        message: "Please Enter the Correct Email and Password",

                        isLoggedIn: false,

                    }

                );

            };

        }).catch(Error => {

            Response.status(500).json(

                {

                    message: "Error In DataBase",

                    error: Error

                }

            );

        });

     };



    ///**************** (2) SignUp ****************///
     
     exports.Signup = (Request, Response) => {

        const {

            Email,

            Password,

            FirstName,

            LastName,

            MobileNumber

        } = Request.body;

            /////**************** Create a new Object of User Model Class ****************/////

             const UserObject = new UsersModel(

                 {

                     Email: Email,

                     Password: Password,

                     FirstName: FirstName,

                     LastName: LastName,

                     MobileNumber: MobileNumber

                 }

             );

            /////**************** Call for the Save Method for this Object ****************/////

             UserObject.save().then(Result => {

                Response.status(200).json(

                    {

                        message: "Account Created Successfully",

                        User: Result

                    }

                );

             }).catch(Error => {

                Response.status(500).json(

                    {
    
                        message: "Error In DataBase",
    
                        error: Error
    
                    }
    
                );

             }
             
        );

     };