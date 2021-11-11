import React, { Component } from 'react';
import '../Styles/Home.css';
import TopSection from './Wallpaper';
import BottomSection from './QuickSearches';
import Server from 'axios';
const MY_API_URL = require('../Contants').API_URL;

export default class Home extends Component {

    constructor() {
        super();
        this.state = {
            locations: [],
            mealtypes: []
        }
    };

    componentDidMount() {
        // to get all locations:
        Server.get(`${MY_API_URL}/getAllLocations`).then(Response => {
            this.setState({
                locations: Response.data.locations
            })
        }).catch(Error => {
            console.log(Error);
        });

        // to get all mealtypes:
        Server.get(`${MY_API_URL}/getAllMealTypes`).then(Response => {
            this.setState({
                mealtypes: Response.data.mealTypes
            })
        }).catch(Error => {
            console.log(Error);
        });
    }

    render() {
        const { locations, mealtypes } = this.state;
        return (
            <React.Fragment >
                <TopSection Locations={locations} />
                <BottomSection MealTypes={mealtypes} />
            </React.Fragment >
        )
    };
};


