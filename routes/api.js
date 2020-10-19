const express = require('express');
const router = express.Router();
const LeagueJS = require('LeagueJS');

const API_KEY = process.env.RIOT_API_KEY;
const leagueJs = new LeagueJS(API_KEY);


router.get('/', function(req, res, next) {
    res.send('healthy');
});


/***************************************
 *  ENDPOINTS
 **************************************/

router.get('/user/:username', function(req, res, next) {
    const username = req.params.username;
    getUser(username, (data) => {
        res.send(data);
    });
});

router.get('/user/:username/matchlist', function(req, res, next) {
    const username = req.params.username;
    getMatchListByUsername(username, (data) => {
        res.send(data);
    });
});

router.get('/user/:username/matchhistory', function(req, res, next) {
    const username = req.params.username;
    getMatchListByUsername(username, (matchList) => {
        const fullMatches = matchList.matches;
        let matchHistory = [];

        // For now, just looking at first five matches in detail
        // To implement pagination, we'd need to make use of the startIndex, endIndex, and totalGames
        for (let i = 0; i < fullMatches.length && i < 5; i++) {
            const match = fullMatches[i];

            getGameById(match.gameId, (gameData) => {
                console.log(i);
                matchHistory.push(gameData);

                // last iteration
                if ( i >= fullMatches.length - 1 || i >= 4) {
                    res.send(matchHistory);
                    break;
                }
            });
        }
    });
});

/***************************************
 *  RIOT API METHODS
 **************************************/

function getGameById(gameId, callback) {
    leagueJs.Match
    .gettingById(gameId)
    .then(data => {
        callback(data);
    })
    .catch(err => {
        console.error(err);
        callback(err);
    });
}

function getMatchList(accountId, callback){
    leagueJs.Match
        .gettingListByAccount(accountId)
        .then(data => {
            callback(data);
        })
        .catch(err => {
            console.error(err);
            callback(err);
        });
}

function getUser(username, callback){
    leagueJs.Summoner
        .gettingByName(username)
        .then(data => {
            callback(data);
        })
        .catch(err => {
            console.error(err);
            callback(err);
        });
}

/***************************************
 *  HELPER FUNCTIONS / BUSINESS LOGIC
 **************************************/

function getMatchListByUsername(username, callback) {
    getUser(username, (data) => {
        const accountId = data.accountId;
        if (!accountId) { console.error("No accountId found"); callback(null); }

        getMatchList(data.accountId, (matchList) => {
            callback(matchList);
        });
    });
}

module.exports = router;
