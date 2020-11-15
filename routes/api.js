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
            const dataMapping = { "accountId": accountId, "matches": matchHistory };

            const cleanHistory = parseMatchData(dataMapping);
            res.send(cleanHistory);
        }
    }
});

/***************************************
 *  HELPER FUNCTIONS / BUSINESS LOGIC
 **************************************/

function findParticipantData(accountId, participantIds) {
    let i;
    for (i = 0; i < participantIds.length; i++) {
        const participant = participantIds[i];
        if (participant.player.accountId.normalize() == accountId.normalize()) {
            return participant;
        }
    }

    console.error("Account ID not found as match participant");
    return null;
}

function getSummonerData(fullStats) {
    let summonerData = {};
    summonerData.stats = {};

    summonerData.championId = fullStats.championId;
    summonerData.spell1Id = fullStats.spell1Id;
    summonerData.spell2Id = fullStats.spell2Id;

    summonerData.stats.win = fullStats.stats.win;
    summonerData.stats.champLevel = fullStats.stats.champLevel;
    summonerData.stats.totalMinionsKilled = fullStats.stats.totalMinionsKilled;
    summonerData.stats.kills = fullStats.stats.kills;
    summonerData.stats.deaths = fullStats.stats.deaths;
    summonerData.stats.assists = fullStats.stats.assists;

    return summonerData;
}

function parseMatchData(data) {
    const accountId = data.accountId;
    const matches = data.matches;

    let matchDataList = [];

    matches.forEach(match => {
        let matchData = {};

        const participantData = findParticipantData(accountId, match.participantIdentities);

        const id = participantData.participantId;

        matchData.participantId = id;
        matchData.summonerName = participantData.player.summonerName;
        matchData.gameDuration = match.gameDuration;

        matchData.summoner = getSummonerData(match.participants[id - 1]);

        matchDataList.push(matchData);
    });

    return matchDataList;
}

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
