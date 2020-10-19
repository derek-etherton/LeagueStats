import React from 'react';
import MatchCard from '../MatchCard/MatchCard';

class MatchList extends React.Component {

    constructor(props) {
        super(props);
        this.state = { username: "", matchHistory: "" };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        this.state.username = document.getElementById('userInput').value;

        this.getMatchHistory(this.state.username, (response) => {
            const accountId = response.accountId;
            const matches = response.matches;

            let matchDataList = [];

            matches.forEach(match => {
                let matchData = {};

                const participantData = this.findParticipantData(accountId, match.participantIdentities);
                const id = participantData.participantId;
            
                matchData.participantId = id;
                matchData.summonerName = participantData.player.summonerName;

                matchData.stats = match.participants[id - 1];

                matchDataList.push(matchData);
            });

            // this.processUserStats(participantData, matches);
            this.setState({ matchHistory: matchDataList });
        });
        event.preventDefault();
    }

    getMatchHistory(username, callback) {
        fetch("http://localhost:9000/api/user/" + username + "/matchhistory")
            .then(res => res.json())
            .then(res => callback(res));
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Summoner Name:
                        <input id="userInput" type="text" name="username"/>
                    </label>
                    <input type="submit" value="Submit"/>
                </form>
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

    findParticipantData(accountId, participantIds) {
        let i;
        for (i = 0; i < participantIds.length; i++) {
            const participant = participantIds[i];
            if (participant.player.accountId.normalize() == accountId.normalize()){
                return participant;
            }
        }

        console.error("Account ID not found as match participant");
        return null;
    }
}



export default MatchList;