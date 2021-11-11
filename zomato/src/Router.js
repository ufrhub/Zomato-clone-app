import React, { Component } from 'react';
import { Route, BrowserRouter } from "react-router-dom";
import Header from './Components/Header'
import Home from "./Components/Home";
import Details from "./Components/Details";
import Filter from "./Components/Filter";

export default class Router extends Component {
    render() {
        return (
            <BrowserRouter>
                <Header />
                <Route exact path="/" component={Home}></Route>
                <Route path="/Home" component={Home}></Route>
                <Route path="/Details" component={Details}></Route>
                <Route path="/Filter" component={Filter}></Route>
            </BrowserRouter >
        )
    };
};
