import React, { Component } from 'react';
import QuickSearchBox from './QuickSearchBox';

export default class QuickSearches extends Component {
    render() {
        const { MealTypes } = this.props;
        return (
            <React.Fragment>
                <section className="container BOTTOM-SECTION">
                    <div className="Main-Heading-Bottom-Section row">Quick Searches</div>
                    <div className="Main-SubHeading-Bottom-Section row">Discover restaurants by type of meal</div>
                    <div className="Search-Boxes-and-Contents row row-cols-1 row-cols-md-2 row-cols-xl-3 ms-4">
                        {
                            MealTypes.map((Item, Index) => {
                                return <QuickSearchBox key={Index} imgSrc={require("../Assets/" + Item.image).default} title={Item.name} description={Item.content} MealType={Item.meal_type}/>
                            })
                        }
                    </div>
                </section>
            </React.Fragment>
        )
    }
}
