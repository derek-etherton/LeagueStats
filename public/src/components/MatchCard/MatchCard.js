import React from 'react';
import './MatchCard.css';

function MatchCard(props) {
    const data = props.data;
    const playerStats = data.stats.stats;

    if (!data || data.length === 0) {
        return <p>Loading...</p>;
    }

    console.log(data);

    const getItems = () => {
        let items = [];
    
        if (playerStats.item0 !== null) {
            items.push(playerStats.item0);
        }
        if (playerStats.item1 !== null) {
            items.push(playerStats.item1);
        }
        if (playerStats.item2 !== null) {
            items.push(playerStats.item2);
        }
        if (playerStats.item3 !== null) {
            items.push(playerStats.item3);
        }
        if (playerStats.item4 !== null) {
            items.push(playerStats.item4);
        }
        if (playerStats.item5 !== null) {
            items.push(playerStats.item5);
        }
        if (playerStats.item6 !== null) {
            items.push(playerStats.item6);
        }

        return items;
    }

    const gameDuration = Math.floor(data.gameDuration / 60);

    return (
        <div className="match-card">
            <div className="summoner-container">
                <p className="summoner-name">{data.summonerName}</p>
                <p className="champion">{data.stats.championId}</p>
                <p className="victory-status">{playerStats.win ? "Win" : "Loss"}</p>
                <p className="game-duration">{gameDuration + " Min"}</p>
            </div>
            <div className="spells-container">
                <p className="spell">{data.stats.spell1Id}</p>
                <p className="spell">{data.stats.spell2Id}</p>
            </div>
            <div className="level-container">
                <p className="level">{playerStats.champLevel}</p>
                <p className="creep-score">{playerStats.totalMinionsKilled 
                    + "(" + (playerStats.totalMinionsKilled / gameDuration).toFixed(1) + ")"}
                </p>
            </div>
            <div className="stats-container">
                <p className="kda">{playerStats.kills} / {playerStats.deaths} / {playerStats.assists}</p>
            </div>

            <div className="items-container">
                <b>Items: </b>
                {getItems().map((value, index) => {
                            return <p className="item" key={"item-" + index}>{value}</p>
                })}
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