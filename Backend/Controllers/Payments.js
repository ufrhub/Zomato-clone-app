/********************* Import All The Required Pakages *********************/

require("dotenv").config();
const Formidable = require("formidable");
const HTTPS = require("https");
const { v4 : uuidv4 } = require("uuid");




/********************* Import The PaytmChecksum File To Authenticate The Payment Requests *********************/

const PaytmChecksumFile = require("./PaytmChecksum");




/********************* Export The Controller Functionality *********************/

    ///**************** (1) Payments ****************///

     exports.Payment = (Request, Response) => {

        const {

            PayableAmmount,

            CustomerEmail,

            CustomerMobileNumber

         } = Request.body;


        /////**************** Prepare The Request Object ****************/////

        let Parameters = {

            MID: process.env.PAYTM_MERCHANT_ID, // [ MID ] =:> Parameter For Merchant ID And [ process ] =:> Method To Process Information And [ env ] =:> Refer The .env File And [ Paytm_Merchant_ID ] =:> From .env File :

            WEBSITE: process.env.PAYTM_WEBSITE, // [ WEBSITE ] =:> Parameter For Website ID And [ process ] =:> Method to Process Information And [ env ] =:> Refer The .env File And [ WEBSTAGING ] =:> From .env File :
    
            CHANNEL_ID: process.env.PAYTM_CHANNEL_ID, // [ CHANNEL_ID ] =:> Parameter For Channel ID And [ process ] =:> Method to Process Information And [ env ] =:> Refer The .env File And [ Retail ] =:> From .env File
    
            INDUSTRY_TYPE_ID: process.env.PAYTM_INDUSTRY_TYPE, // [ INDUSTRY_TYPE_ID ] =:> Parameter For Industry Type And [ process ] =:> Method to Process Information And [ env ] =:> Refer The .env File And [ Retail ] =:> From .env File :
    
            ORDER_ID: uuidv4(), // [ ORDER_ID ] =:> Parameter For Order ID And [ uuidv4() ] =:> From {Line No. 6} :
    
            CUST_ID: CustomerEmail, // [ CUST_ID ] =:> Parameter For Customer ID And [ CustomerEmail ] =:> From {Line No. 28} :
    
            TXN_AMOUNT: PayableAmmount.toString(), // [ TXN_AMOUNT ] =:> Parameter For Customer ID And [ PayableAmmount ] =:> From {Line No. 26} :
    
            EMAIL: CustomerEmail, // [ EMAIL ] =:> Parameter For Customer Email And [ CustomerEmail ] =:> From {Line No. 28} :
    
            MOBILE_NO: CustomerMobileNumber.toString(), // [ MOBILE_NUMBER ] =:> Parameter For Mobile Number And [ CustomerMobileNumber ] =:> From {Line No. 30} :
    
            CALLBACK_URL: 'http://localhost:7071/PaymentCallback' // [ CALLBACK_URL ] =:> Parameter For Callback url And [ "http://localhost:7071/PaymentCallback" ] =:> Callback url Link :

         }; 


        /////**************** Use PaytmChecksum To Generate A Signature ****************/////

        let Signature = PaytmChecksumFile.generateSignature(Parameters, process.env.PAYTM_MERCHANT_KEY);

        Signature.then(Result => {

            let PaytmChecksumResponce = {

                ...Parameters, // [ ...Parameters ] =:> It is the Request Object from { Line No. 45 } :

                "CHECKSUMHASH": Result // [ CHECKSUMHASH ] =:> It is a Result or Response which I will get from the generateSignature of Paytm Checksum Library : 

            };

            Response.json(PaytmChecksumResponce);

         }).catch(Error => {

            Response.status(500).json({

                message: "Error in Payment",

                error: Error

            });

         });

    };

    

/********************* It Is Called By The Paytm Server, And Paytm Server Will Send The Transaction Status *********************/
    
    ///**************** (2) Payments Callback ****************///
    
    exports.PaymentCallback = (Request, Response) => {

        /////**************** We Need To Read The Transaction Details ****************/////

        const Form = new Formidable.IncomingForm();

        Form.parse(Request, (Error, Fields, File) => {

            /////**************** Check For The Error ****************/////

            if (Error) {

                console.log(Error);

                Response.status(500).json({ Error });

             };


            /////**************** Verify The Signature ****************/////

            const ChecksumHash = Fields.CHECKSUMHASH;

            const IsVerified = PaytmChecksumFile.verifySignature(Fields, process.env.Paytm_Merchant_Key, ChecksumHash);

            if (IsVerified) {

                /////**************** Response Is Valid : Make An API Call To Get The Transaction Status Form Paytm Server ****************/////

                let Parameter = {

                    MerchantID: Fields.MID,
                    
                    ORDER_ID: Fields.ORDERID

                 };

                PaytmChecksumFile.generateSignature(Parameter, process.env.PAYTM_MERCHANT_KEY).then(Chucksum => {

                    Parameter["CHECKSUMHASH"] = Chucksum;

                    const Data = JSON.stringify(Parameter);

                    const RequestObject = {

                        hostname: "securegw-stage.paytm.in",

                        port: "443",

                        path: "/order/status",

                        method: "POST",

                        header: {

                            "Content-Type": "application/json",

                            "content-Length": "data.length"

                         },

                        data: Data

                     };

                    let RESPONSE = "";

                    let REQUEST = HTTPS.request(RequestObject, (ResponseFromPaytmServer) => {

                        ResponseFromPaytmServer.on("data", (Chunk) => {

                            RESPONSE += Chunk;

                         });

                        ResponseFromPaytmServer.on("end", () => {

                            if (Fields.STATUS === "TXN_SUCCESS") {

                                /////**************** Transaction Is Successful ****************/////

                                /////**************** Zomato BackEnd Will Inform The Zomato FrontEnd ****************/////

                                Response.sendFile(__dirname + "/TransactionSuccessful.html");

                             } else {

                                /////**************** Transaction Is Failure ****************/////

                                /////**************** Zomato BackEnd Will Inform The Zomato FrontEnd ****************/////

                                Response.sendFile(__dirname + "/TransactionFailure.html");

                             };

                         });

                     });

                    REQUEST.write(Data);

                    REQUEST.end();

                 }).catch(Error => {

                    Response.status(500).json({

                        message: "Error in Payment",
                        
                        error: Error

                     });

                 });

             } else {

                /////**************** Response Not Valid ****************/////

                console.log("Checksum Mismatched");

                Response.status(500).json({ Error: "It's a Hacker" });

             };

         });

    };