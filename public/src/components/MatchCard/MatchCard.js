import React from 'react';

function MatchCard(props) {
    const data = props.data;

    let duration = '';

    if (data) {
        duration = data.gameDuration;
    }
    console.log(duration);
    
    return (
        <div>
            <p>{duration}</p>
        </div>
    );
}

export default MatchCard;