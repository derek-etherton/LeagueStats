import React from 'react';
import MatchCard from '../MatchCard/MatchCard';
import './MatchList.css';

class MatchList extends React.Component {

    constructor(props) {
        super(props);
        this.state = { username: '', matchHistory: '', isLoading: false };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(event) {
        event.preventDefault();

        this.state.username = document.getElementById('userInput').value;

        this.setState({ isLoading: true });

        const response = await this.getMatchHistory(this.state.username)
            .catch(error => { console.error(error.name) });

        this.setState({ matchHistory: response, isLoading: false });
    }

    async getMatchHistory(username) {
        const response = await fetch(`http://localhost:9000/api/user/${username}/matchhistory`);

        if (!response.ok) {
            const message = `Error: ${response.status}`
            throw new Error(message);
        }

        const json = await response.json();
        return json;
    }

    render() {
        return (
            <div className="match-list">
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Summoner Name:
                        <input id="userInput" type="text" name="username" />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                { this.state.isLoading &&
                    <div>
                        Loading...
                    </div>
                }
                { this.state.matchHistory &&
                    <div>
                        {this.state.matchHistory.map((value, index) => {
                            return <MatchCard data={value} key={index}></MatchCard>
                        })}
                    </div>
                }
            </div>
        );
    }
}

export default MatchList;