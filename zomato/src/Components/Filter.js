import React, { Component } from 'react';
import '../Styles/Filter.css'
import { withRouter } from 'react-router-dom';
import QueryString from 'query-string';
import Server from 'axios';
import { API_URL } from '../Contants';


class Filter extends Component {

    constructor() {
        super();
        this.state = {
            MealType: "",
            MealTypeID: 0,
            Locations: [],
            SelectedCityName: "",
            LocationsInCity: [],
            SelectedLocation: "",
            PageNumber: 1,
            RestaurantsList: [],
            TotalResults: 0,
            NumberOfPages: 0,
            Cuisines: [],
            HighCost: undefined,
            LowCost: undefined,
            SortOrder: 1
        };
    };

    componentDidMount() {
        // Capture the MealType and MealType ID from the Query Parameters from the URL:
        const MealType_MealTypeID = QueryString.parse(this.props.location.search);
        const { MealType, MealTypeID } = MealType_MealTypeID;

        this.setState({
            MealType,
            MealTypeID
        });

        // Set the City ID in LocalStorage:
        const City_ID = localStorage.getItem("City_ID");

        // Make API call to get the List of Locations and Filter by city_id from the API:
        Server.get(`${API_URL}/getAllLocations/`).then(Response => {
            const locations = Response.data.locations;
            const selectedCity = locations.find(city => city.city_id == City_ID);
            const selectedCityLocations = locations.filter(city => city.city_id == City_ID);
            this.setState({
                Locations: locations,
                SelectedCityName: selectedCity.city,
                LocationsInCity: selectedCityLocations,
                SelectedLocation: selectedCityLocations[0].location_id,
            });
            setTimeout(() => this.FilterRestaurants(), 0);
        }).catch(Error => {
            console.log(Error);
        });
    };

    FilterRestaurants() {
        // Logic to Filter the Restaurants
        const {
            MealTypeID,
            SelectedLocation,
            Cuisines,
            HighCost,
            LowCost,
            SortOrder,
            PageNumber
        } = this.state;

        // Make API call to Filter the Restaurant
        const Request = {
            MealType: MealTypeID,
            Location: SelectedLocation,
            Page: PageNumber
        };

        if (Cuisines.length > 0) {
            Request.Cuisine = Cuisines
        };

        if (LowCost !== undefined && HighCost !== undefined) {
            Request.LowCost = LowCost
            Request.HighCost = HighCost
        };

        if (SortOrder !== undefined) {
            Request.Sort = SortOrder
        };

        Server({
            method: "POST",
            url: `${API_URL}/FilterRestaurants`,
            headers: { "Content-Type": "application/json" },
            data: Request
        }).then(Result => {
            const totalResults = Result.data.totalResultsCount;
            const PageSize = Result.data.pageSize;
            const numberOfPages = Math.ceil((totalResults / PageSize));

            this.setState({
                TotalResults: totalResults,
                PageNumber: Result.data.pageNumber,
                RestaurantsList: Result.data.restaurants,
                NumberOfPages: numberOfPages
            });

        }).catch(Error => {
            console.log(Error);
        });

    };

    HandleLocationChange = (Event) => {
        // Logic to Filter the Location
        const Location_ID = Event.target.value;
        this.setState({
            SelectedLocation: Location_ID
        });

        setTimeout(() => this.FilterRestaurants(), 0);
    };

    HandleCuisineChange = (Event, Cuisine) => {
        let { Cuisines } = this.state;
        const Index = Cuisines.indexOf(Cuisine);
        if (Index < 0 && Event.target.checked) {
            Cuisines.push(Cuisine);
        } else {
            Cuisines.splice(Index, 1);
        };

        this.setState({
            Cuisines: Cuisines
        });

        setTimeout(() => this.FilterRestaurants(), 0);
    };

    HandleCostChange = (Event, lowCost, highCost) => {
        this.setState({
            LowCost: lowCost,
            HighCost: highCost
        });

        setTimeout(() => this.FilterRestaurants(), 0);
    };

    HandleSortChange = (Event, sortOrder) => {
        this.setState({
            SortOrder: sortOrder
        });

        setTimeout(() => this.FilterRestaurants(), 0);
    };

    GoTORestaurantDetails = (Restaurant) => {
        const URL = `/Details?ID=${Restaurant._id}`
        this.props.history.push(URL)
    };

    HandlePageChange = (Page) => {
        if (Page < 1 ) return;
        this.setState({
            PageNumber: Page
        });

        console.log(Page)
        setTimeout(() => this.FilterRestaurants(), 0);
    };

    GetPages = () => {
        let { NumberOfPages } = this.state;
        let Pages = [];

        for (let i = 0; i < NumberOfPages; i++) {
            Pages.push(
                <div key={i} className="pagination-button" onClick={() => this.HandlePageChange(i + 1)}>{i + 1}</div>
            )
        };

        return Pages;
    };

    render() {

        const {
            MealType,
            SelectedCityName,
            LocationsInCity,
            RestaurantsList,
            PageNumber
        } = this.state;

        let CurrentPage = PageNumber;

        return (
            <React.Fragment>
                <div className="container-fluid no-padding filter-layout">
                    <div className="container">
                        <div className="heading">{MealType} Places in {SelectedCityName}</div>
                        <div className="row">
                            <div className="leftSection col-xl-3 col-lg-4 col-md-5">
                                <div className="filterSection">
                                    <div className="filter-heading">Filters</div>
                                    <div className="filter-subheading">Select Location</div>
                                    <select className="filter-location" onChange={(Event) => this.HandleLocationChange(Event)}>
                                        <option value="" selected>--Select Location--</option>
                                        {
                                            LocationsInCity.map((Item, Index) => {
                                                return <option key={Index} value={Item.location_id}>{Item.name}</option>
                                            })
                                        }
                                    </select>
                                    <div className="filter-subheading">Cuisine</div>
                                    <div>
                                        <input type="checkbox" className="filter-cuisine" name="cuisine" onChange={(Event) => this.HandleCuisineChange(Event, "North Indian")} /><span className="filter-cuisine">North Indian</span>
                                    </div>
                                    <div>
                                        <input type="checkbox" className="filter-cuisine" name="cuisine" onChange={(Event) => this.HandleCuisineChange(Event, "South Indian")} /><span className="filter-cuisine">South Indian</span>
                                    </div>
                                    <div>
                                        <input type="checkbox" className="filter-cuisine" name="cuisine" onChange={(Event) => this.HandleCuisineChange(Event, "Chinese")} /><span className="filter-cuisine">Chinese</span>
                                    </div>
                                    <div>
                                        <input type="checkbox" className="filter-cuisine" name="cuisine" onChange={(Event) => this.HandleCuisineChange(Event, "Fast Food")} /><span className="filter-cuisine">Fast Food</span>
                                    </div>
                                    <div>
                                        <input type="checkbox" className="filter-cuisine" name="cuisine" onChange={(Event) => this.HandleCuisineChange(Event, "Street Food")} /><span className="filter-cuisine">Street Food</span>
                                    </div>

                                    <div className="filter-subheading">Cost For Two</div>
                                    <input type="radio" className="filter-cuisine" name="cost" onChange={(Event) => this.HandleCostChange(Event, 0, 500)} /> Less than &#8377; 500
                                    <br />
                                    <input type="radio" className="filter-cuisine" name="cost" onChange={(Event) => this.HandleCostChange(Event, 500, 1000)} /> &#8377; 500 to &#8377; 1000
                                    <br />
                                    <input type="radio" className="filter-cuisine" name="cost" onChange={(Event) => this.HandleCostChange(Event, 1000, 1500)} /> &#8377; 1000 to &#8377; 1500
                                    <br />
                                    <input type="radio" className="filter-cuisine" name="cost" onChange={(Event) => this.HandleCostChange(Event, 1500, 2000)} /> &#8377; 1500 to &#8377; 2000
                                    <br />
                                    <input type="radio" className="filter-cuisine" name="cost" onChange={(Event) => this.HandleCostChange(Event, 2000, 200000)} /> &#8377; 2000+

                                    <div className="filter-heading">Sort</div>
                                    <input type="radio" className="filter-cuisine" name="sort" onChange={(Event) => this.HandleSortChange(Event, 1)} /> Price low to high
                                    <br />
                                    <input type="radio" className="filter-cuisine" name="sort" onChange={(Event) => this.HandleSortChange(Event, -1)} /> Price high to low
                                </div>
                            </div>
                            <div className="rightSection col-xl-9 col-lg-8 col-md-7">
                                <div className="resultSection">
                                    {
                                        RestaurantsList.length > 0
                                            ?
                                            RestaurantsList.map((Item, Index) => {
                                                return (
                                                    <div key={Index} onClick={() => this.GoTORestaurantDetails(Item)} className="result">
                                                        <div className="result-top row">
                                                            <div className="col-xl-2 col-lg-3 col-md-4">
                                                                <img src={require('../Assets/Breakfast.png').default} className="result-image" alt="not found" />
                                                            </div>
                                                            <div className="col-xl-10 col-lg-9 col-md-8">
                                                                <div className="result-header">{Item.name}</div>
                                                                <div className="result-subheader">{Item.locality}</div>
                                                                <div className="result-address">{Item.city}</div>
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className="result-bottom row">
                                                            <div className="col-xl-2 col-lg-3 col-md-4">
                                                                <div className="result-details">CUISINES:</div>
                                                                <div className="result-details">COST FOR TWO:</div>
                                                            </div>
                                                            <div className="col-xl-10 col-lg-9 col-md-8">
                                                                <div className="result-values">
                                                                    {
                                                                        Item.cuisine.map((item, index) => {
                                                                            return `${item.name}`
                                                                        })
                                                                    }
                                                                </div>
                                                                <div className="result-values">&#8377; {Item.min_price}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                            :
                                            <div className="text-danger text-center my-5">No Results Found</div>
                                    }

                                    {
                                        RestaurantsList.length > 0
                                            ?
                                            <div className="mypagination">
                                                <div className="pagination-button" onClick={() => this.HandlePageChange(--CurrentPage)}>&#8592;</div>
                                                {
                                                    this.GetPages()
                                                }
                                                <div className="pagination-button" onClick={() => this.HandlePageChange(++CurrentPage)}>&#8594;</div>
                                            </div>
                                            :
                                            null
                                    }


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    };
};

export default withRouter(Filter);