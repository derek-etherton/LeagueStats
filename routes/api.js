const express = require('express');
const router = express.Router();
const LeagueJS = require('LeagueJS');

const API_KEY = process.env.RIOT_API_KEY;
const leagueJs = new LeagueJS(API_KEY);


router.get('/', function(req, res, next) {
    res.send('healthy');
});

/**
 * Retrieves the specified user from the League API, returning JSON containing
 * id
 * accountId
 * puuid
 * name
 * profileIconId
 * revisionDate
 * summonerLevel
 */
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

function getMatchListByUsername(username, callback) {
    getUser(username, (data) => {
        const accountId = data.accountId;
        if (!accountId) { console.error("No accountId found"); callback(null); }

        getMatchList(data.accountId, (matchList) => {
            callback(matchList);
        });
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

module.exports = router;
