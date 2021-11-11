import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class QuickSearchBox extends Component {

    NavigateToFilterRestaurant = () => {
        this.props.history.push(`Filter?MealType=${this.props.title}&MealTypeID=${this.props.MealType}`)
    };

    render() {
        return (
            <React.Fragment>
                <div className="Search-Box me-4 p-0" onClick={this.NavigateToFilterRestaurant}>
                    <div className="right">
                        <img src={this.props.imgSrc} alt="Image not found" className="Search-Box-Image" />
                    </div>
                    <div className="left">
                        <h3 className="Search-Box-Heading row">{this.props.title}</h3>
                        <p className="Search-Box-Paragraph row">{this.props.description}</p>
                    </div>
                </div>
            </React.Fragment>
        )
    }
};

export default withRouter(QuickSearchBox);
