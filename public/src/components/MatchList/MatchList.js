import React from 'react';
import MatchCard from '../MatchCard/MatchCard';

class MatchComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = { matchHistory: "" };
    }


    getMatchHistory() {
        fetch("http://localhost:9000/api/user/tyler1/matchhistory")
            .then(res => res.json())
            .then(res => this.setState({ matchHistory: res }));
    }

    componentDidMount() {
        this.getMatchHistory();
    }

    render() {
        if (this.state.matchHistory.length === 0) {
            return <p>Loading...</p>;
        }

        return (
            <div>
                {this.state.matchHistory.map((value, index) => {
                    return <MatchCard data={value}></MatchCard>
                })}
            </div>
        );
    }
}



export default MatchComponent;