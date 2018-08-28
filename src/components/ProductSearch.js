import React, {Component} from 'react';
import FoundProducts from './FoundProducts';
import Loader from './common/Loader';
import PageControls from './common/PageControls';
import Search from './common/Search';
import TabHeaders from './common/TabHeaders';

export default class ProductSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: "collection-search",
            activeSearchRequests: 0,
            amountOfResults: 0
        };
        this.select = this.select.bind(this);
        this.startedSearchRequest = this.startedSearchRequest.bind(this);
        this.finishedSearchRequest = this.finishedSearchRequest.bind(this);
    }

    componentDidMount() {
        let defaultParams = Object.assign({}, this.props.collectionSearchParams);
        this.props.changeParams(defaultParams);
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    select(id) {
        this.setState({
            selected: id
        });
    }

    startedSearchRequest() {
        if (this._isMounted) {
            this.setState({activeSearchRequests: this.state.activeSearchRequests + 1});
        }
    }

    finishedSearchRequest(result) {
        if (this._isMounted) {
            this.setState({
                activeSearchRequests: this.state.activeSearchRequests - 1,
                amountOfResults: result && result.properties && result.properties.totalResults || 0
            });
            if(result) {
                this.select('collection-results');
            }
        }
    }

    render() {
        let description = this.props.selectedCollection.properties && this.props.selectedCollection.properties.title;

        let searchResultsTitle = 'Search results (' + this.state.amountOfResults + ')';
        let tabs = [
            {id: "collection-search", title: "Product Search"},
            {id: "collection-results", title: searchResultsTitle}
        ];

        // Total
        return (
            <div className="sidebar-block content active" id="collection-content">
                <TabHeaders tabs={tabs} select={this.select} selected={this.state.selected} />

                <div className={"sidebar-tab " + (this.state.selected === "collection-search" ? "active" : "")}
                     id="collection-search">
                    <Search searchService={this.props.searchService}
                            updateResult={this.props.updateResult}
                            relation='results'
                            startedSearchRequest={this.startedSearchRequest}
                            finishedSearchRequest={this.finishedSearchRequest}
                            worldWindow={this.props.worldWindow}
                            searchParams={this.props.searchParams}
                            changeParams={this.props.changeParams}
                    />
                    {this.state.activeSearchRequests > 0 && <Loader/>}
                </div>

                <div className={"sidebar-tab " + (this.state.selected === "collection-results" ? "active" : "")}
                     id="collection-results">
                    <FoundProducts productsResult={this.props.productsResult}
                                   selectProduct={this.props.selectProduct}
                                   selectedProduct={this.props.selectedProduct}
                    />
                    {this.props.productsResult.properties && this.props.productsResult.properties.totalResults > 0 &&
                    <PageControls currentResult={this.props.productsResult}
                                  updateResult={this.props.updateResult}
                                  startedSearchRequest={this.startedSearchRequest}
                                  finishedSearchRequest={this.finishedSearchRequest}
                    />
                    }
                    {this.state.activeSearchRequests > 0 && <Loader/>}
                </div>
            </div>
        )
    }
}