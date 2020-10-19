import React from 'react';
import './MatchCard.css';

function MatchCard(props) {
    const data = props.data;
    const playerStats = data.stats.stats;

    if (!data || data.length === 0) {
        return <p>Loading...</p>;
    }

    console.log(data);

    return (
        <div className="match-card">
            <p className="summoner-name">{data.summonerName}</p>
            <div className="stats-container">
                <p className="victory-status">{playerStats.win ? "Win" : "Loss"}</p>
                <div className="kda-container">
                    <p className="kda">{playerStats.kills}</p>
                    <p className="kda">{playerStats.deaths}</p>
                    <p className="kda">{playerStats.assists}</p>
                </div>
            </div>
        </div>
    );
}

// function processData(data) {
//     const duration = data.gameDuration;

//     const playerData = processPlayerData(data.participantIdentities);
// }

// function processPlayerData(data) {
//     console.log(data);
// }

export default MatchCard;