import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Server from 'axios';
import { API_URL } from '../Contants';

class Wallpaper extends Component {

    constructor() {
        super();
        this.state = {
            restaurants: [],
            text: "",
            suggestions: []
        };
    };

    getRestaurantsForLocation = (Event) => {
        const LocationID = Event.target.value;
        const SelectedLocation = this.props.Locations.find(Item => Item.location_id === parseInt(LocationID));
        const CityID = SelectedLocation.city_id;
        const CityName = SelectedLocation.city;

        // Set the City ID in LocalStorage:
        localStorage.setItem("City_ID", CityID);

        // Fetch the Location for Selected Location:
        Server.get(`${API_URL}/getAllRestaurantsByLocation/${CityName}`).then(Response => {
            this.setState({
                restaurants: Response.data.restaurants
            });
        }).catch(Error => {
            console.log(Error);
        });
    };

    getRestaurantsForSearchText = (Event) => {
        const SearchText = Event.target.value;
        const { restaurants } = this.state;
        let Suggestions = [];
        if (SearchText.length > 0) {
            Suggestions = restaurants.filter(Item => Item.name.toLowerCase().includes(SearchText.toLowerCase()))
        }

        this.setState({
            text: SearchText,
            suggestions: Suggestions || []
        })
    };

    NavigateToRestaurant = (Restaurant) => {
        this.props.history.push(`/Details?ID=${Restaurant._id}`);
    };

    renderSuggestions = () => {
        const { suggestions } = this.state;
        if (suggestions.length === 0) {
            return null;
        };

        return (
            <ul className="suggestionsBox">
                {
                    suggestions.map((Item, Index) => {
                        return (
                            <li key={Index} className="SuggestionItem" onClick={() => this.NavigateToRestaurant(Item)}>

                                <div className="suggestionImage">
                                    <img src={require("../Assets/" + Item.image).default} alt="not found" />
                                </div>
                                <div className="suggestionText">
                                    <div className="suggestionTextName">
                                        {Item.name}
                                    </div>
                                    <div className="suggestionTextLocality">
                                        {Item.locality}
                                    </div>
                                </div>
                                <div className="orderButton text-danger">
                                    Order Now
                                </div>

                            </li>
                        )
                    })
                }
            </ul>
        )
    };

    render() {
        const { Locations } = this.props;
        return (
            <React.Fragment>
                <div className="Background-Image">
                    <img src={require("../Assets/Home.png").default} alt="Image not found" width="100%" height="500" />
                </div>
                <section className="container-flex TOP-SECTION">
                    <div className="Branding">
                        <div className="Logo position-absolute top-0 start-50 translate-middle-x">e!</div>
                        <div className="Main-Heading col-12">Find the best restaurants, cafés, and bars</div>
                    </div>
                    <div className="Type-and-Search-Options row ">
                        <div className="Search-Location col-12 col-md-5 text-md-end ">
                            <select className="Select-Location" onChange={this.getRestaurantsForLocation}>
                                <option value="" disabled selected>-- Select Location --</option>
                                {
                                    Locations.map((Item, Index) => {
                                        return <option key={Index} value={Item.location_id}>{Item.name}, {Item.city}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="Search-Restaurant col-12 col-lg-6 text-md-start ms-5">
                            <div className="restaurant">
                                <div className="searchSection">
                                    <i className="bi bi-search search-icon col-1 col-md-6"></i>
                                    <input type="text" className="Search-for-restaurants" placeholder="Search for restaurants" onChange={this.getRestaurantsForSearchText} />
                                    {
                                        this.renderSuggestions()
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        )
    }
};

export default withRouter(Wallpaper);
