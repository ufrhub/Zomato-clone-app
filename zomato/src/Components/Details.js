import React, { Component } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "../Styles/Details.css";
import QueryString from "query-string";
import Server from "axios";
import { API_URL } from "../Contants";
import Modal from "react-modal";

const CustomStyles = {
    content: {
        height: "800px",
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        width: "800px",
        background: "white",
        zIndex: 1000,
    },
};

Modal.setAppElement("#root");

export default class Details extends Component {
    constructor() {
        super();
        this.state = {
            RestaurantDetails: null,
            Menu: null,
            IsMenuModalOpen: false,
            TotalPrice: 0,
        };
    }

    componentDidMount() {
        // Capture the Restaurant ID from the Query Parameters from the URL:
        const Restaurant_id = QueryString.parse(this.props.location.search);
        const { ID } = Restaurant_id;

        // Make API call to get the Restaurant Details from the API:
        Server.get(`${API_URL}/getRestaurantByID/${ID}`)
            .then((Response) => {
                this.setState({
                    RestaurantDetails: Response.data.restaurants,
                });
            })
            .catch((Error) => {
                console.log(Error);
            });

        // Make API call to get the Menu from the Restaurant:
        Server.get(`${API_URL}/getMenuByRestaurant/${ID}`)
            .then((Response) => {
                this.setState({
                    Menu: Response.data.menu,
                });
            })
            .catch((Error) => {
                console.log(Error);
            });
    }

    OpenMenuModal = () => {
        this.setState({
            IsMenuModalOpen: true,
        });
    };

    CloseMenuModal = () => {
        this.setState({
            IsMenuModalOpen: false,
        });
    };

    HandleAddItem = (Item) => {
        const { TotalPrice } = this.state;
        this.setState({
            TotalPrice: TotalPrice + Item.itemPrice,
        });
    };

    isObject = (Value) => {
        return typeof Value === "[object]";
    };

    isDate = (Value) => {
        return Object.prototype.toString.call(Value) === "[object Date]";
    };

    stringifyValue = (Value) => {
        if (this.isObject(Value) && !this.isDate(Value)) {
            return JSON.stringify(Value);
        } else {
            return Value;
        };
    };

    BuildForm = (Details) => {
        const { action, params } = Details;
        const Form = document.createElement("form");
        Form.setAttribute("method", "POST");
        Form.setAttribute("action", action);
        Object.keys(params).forEach(Key => {
            const Input = document.createElement("input");
            Input.setAttribute("type", "hidden");
            Input.setAttribute("name", Key);
            Input.setAttribute("value", this.stringifyValue(params[Key]));
            Form.appendChild(Input);
        });

        return Form;
    };

    POST_InformationToPaytm = (Information) => {
        // Build the form Data:
        const Form = this.BuildForm(Information);

        // Attach in the Request Body:
        document.body.appendChild(Form);

        // Submit thr Form:
        Form.submit();

        // Destroy the Form:
        Form.remove();
    };

    getCheckSum = (Data) => {
        return fetch(`${API_URL}/Payment`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },

            body: JSON.stringify(Data)
        }).then(Result => {
            return Result.json();
        }).catch(Error => {
            console.log(Error);
        });
    };

    PaymentHandler = () => {
        // payment integration logic

        // (1) make API call to the BE /payment and the get the payment checksum
        // (2) go to the paytm website

        const Data = {
            PayableAmmount: this.state.TotalPrice,
            CustomerEmail: "iamumar@edureka.com",
            CustomerMobileNumber: "7777777777"
        };

        this.getCheckSum(Data).then(Result => {
            let Information = {
                action: `https://securegw-stage.paytm.in/order/process`,
                params: Result
            }

            this.POST_InformationToPaytm(Information);

        }).catch(Error => {
            console.log(Error);
        });

    };

    render() {
        const { RestaurantDetails, Menu, IsMenuModalOpen, TotalPrice } = this.state;

        return (
            <React.Fragment>
                <div className="container Details">
                    {RestaurantDetails ? (
                        <>
                            <div className="Images">
                                <Carousel showThumbs={false}>
                                    {RestaurantDetails.thumb.map((Item, Index) => {
                                        return (
                                            <div>
                                                <img
                                                    key={Index}
                                                    src={require("../Assets/" + Item).default}
                                                    alt="Image Not Available"
                                                />
                                            </div>
                                        );
                                    })}
                                </Carousel>
                            </div>
                            <div className="RestaurantName my-3">
                                {RestaurantDetails.name}
                                <button
                                    className="OrderBtn btn btn-danger float-end mt-5 row"
                                    onClick={this.OpenMenuModal}
                                >
                                    Place Online Order
                                </button>
                            </div>
                            <div className="myTabs">
                                <Tabs>
                                    <TabList>
                                        <Tab>Overview</Tab>
                                        <Tab>Contact</Tab>
                                    </TabList>
                                    <TabPanel>
                                        <div className="About my-3 mt-5">About This Place</div>
                                        <div className="Cuisine">Cuisine</div>
                                        <div className="Cuisines">
                                            {RestaurantDetails.cuisine.map((Item, Index) => {
                                                return <span key={Index}>{Item.name}, </span>;
                                            })}
                                        </div>
                                        <div className="Cuisine mt-3">Average Cost</div>
                                        <div className="Cuisines">
                                            ₹{RestaurantDetails.min_price} for two people (approx.)
                                        </div>
                                    </TabPanel>
                                    <TabPanel>
                                        <div className="About my-3 mt-5">
                                            {RestaurantDetails.name} Restaurant
                                        </div>
                                        <div className="Cuisine mt-4">
                                            Address :{" "}
                                            <div className="Cuisines text-muted Address">
                                                {" "}
                                                {RestaurantDetails.locality}, {RestaurantDetails.city}
                                            </div>
                                        </div>
                                        <div className="Cuisine my-4">
                                            Phone Number :{" "}
                                            <div className="Number text-danger">
                                                {RestaurantDetails.contact_number}
                                            </div>
                                        </div>
                                    </TabPanel>
                                </Tabs>
                            </div>

                            <Modal isOpen={IsMenuModalOpen} style={CustomStyles}>
                                <h2 className="text-danger">
                                    Menu
                                    <button
                                        onClick={this.CloseMenuModal}
                                        className="btn btn-outline-danger float-end"
                                    >
                                        X
                                    </button>
                                </h2>

                                <h3 className="text-center text-success">
                                    {RestaurantDetails.name}
                                </h3>

                                <ul className="Menu">
                                    {Menu && Menu.map((Item, Index) => {
                                        return (
                                            <li key={Index}>
                                                <div className="row no-gutters MenuItem">
                                                    <div className="col-12">
                                                        {Item.isVeh ? (
                                                            <div className="text-danger fs-6">
                                                                Veg
                                                                <span className="col-2 float-end">
                                                                    <button
                                                                        className="btn btn-light addButton"
                                                                        onClick={() => this.HandleAddItem(Item)}
                                                                    >
                                                                        Add
                                                                    </button>
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="text-danger fs-6">
                                                                Non-Veg
                                                                <span className="col-2 float-end">
                                                                    <button
                                                                        className="btn btn-light addButton"
                                                                        onClick={() => this.HandleAddItem(Item)}
                                                                    >
                                                                        Add
                                                                    </button>
                                                                </span>
                                                            </div>
                                                        )}

                                                        <div className="Cuisines">{Item.itemName}</div>
                                                        <div className="Cuisines">
                                                            &#8377; {Item.itemPrice}
                                                        </div>
                                                        <div className="Cuisines">
                                                            {Item.itemDescription}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>

                                <div className="mt-3 fs-4">
                                    Subtotal <span className="mt-4">&#8377; {TotalPrice}</span>
                                    <button
                                        className="btn btn-danger float-end"
                                        onClick={this.PaymentHandler}
                                    >
                                        Pay Now
                                    </button>
                                </div>
                            </Modal>
                        </>
                    ) : (
                        <div>Loading...</div>
                    )}
                </div>
            </React.Fragment>
        );
    }
}
