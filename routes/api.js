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
router.get("/user/:username", function(req, res, next) {
    const username = req.params.username;
  
    leagueJs.Summoner
      .gettingByName(username)
      .then(data => {
          res.send(data);
      })
      .catch(err => {
          console.log(err);
      });
  });

module.exports = router;
