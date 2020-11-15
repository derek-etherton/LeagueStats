import React from 'react';
import './MatchCard.css';
import { findChampion, getItems } from './DataDragonHelper';

function MatchCard(props) {
    const data = props.data;
    const playerStats = data.summoner.stats;

    if (!data || data.length === 0) {
        return <p>Loading...</p>;
    }


    const gameDuration = Math.floor(data.gameDuration / 60);

    return (
        <div className="match-card">
            <div className="summoner-container">
                <p className="summoner-name">{data.summonerName}</p>
                <p className="champion">{findChampion(data.summoner.championId)}</p>
                <p className="victory-status">{playerStats.win ? "Win" : "Loss"}</p>
                <p className="game-duration">{gameDuration + " Min"}</p>
            </div>
            <div className="spells-container">
                <p className="spell">{data.summoner.spell1Id}</p>
                <p className="spell">{data.summoner.spell2Id}</p>
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
                {getItems(playerStats).map((value, index) => {
                    return <p className="item" key={"item-" + index}>{value}</p>
                })}
            </div>
        </div>
    );
}

export default MatchCard;