const express = require('express');
const router = express.Router();
const LeagueJS = require('leaguejs');

const API_KEY = process.env.RIOT_API_KEY;
const leagueJs = new LeagueJS(API_KEY);


router.get('/', function (req, res, next) {
    res.send('healthy');
});

/***************************************
 *  ENDPOINTS
 **************************************/

router.get('/user/:username', async function (req, res, next) {
    const username = req.params.username;

    const userData = await leagueJs.Summoner
        .gettingByName(username);

    res.send(userData);
});

router.get('/user/:username/matchlist', async function (req, res, next) {
    const username = req.params.username;
    const data = await getMatchListByUsername(username).catch(error => next(error));

    res.send(data);
});

/**
 * Given a LoL username, returns a list with the user's five most recent matches' data
 */
router.get('/user/:username/matchhistory', async function (req, res, next) {
    const username = req.params.username;

    if (!username) {
        throw new Error('Username is a required field');
    }

    const matchList = await getMatchListByUsername(username).catch(error => next(error));

    const fullMatches = matchList.matches.matches;
    const accountId = matchList.accountId;

    let matchHistory = [];

    // For now, just looking at first five matches in detail
    // To implement pagination, we'd need to make use of the startIndex, endIndex, and totalGames
    for (let i = 0; i < fullMatches.length && i < 5; i++) {
        const match = fullMatches[i];


        const gameData = await leagueJs.Match
            .gettingById(match.gameId);
        matchHistory.push(gameData);

        // last iteration
        if (i >= fullMatches.length - 1 || i >= 4) {
            res.send({ "accountId": accountId, "matches": matchHistory });
        }
    }
});

/***************************************
 *  HELPER FUNCTIONS / BUSINESS LOGIC
 **************************************/

async function getMatchListByUsername(username) {

    const userData = await leagueJs.Summoner
        .gettingByName(username);

    const accountId = userData.accountId;
    if (!accountId) { console.error("No accountId found"); throw new Error("No accountId found"); }

    const matchList = await leagueJs.Match
        .gettingListByAccount(accountId);

    return { "accountId": userData.accountId, "matches": matchList };
}

module.exports = router;
