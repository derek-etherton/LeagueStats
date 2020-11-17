
import LeagueJS from 'leaguejs';
const API_KEY = process.env['RIOT_API_KEY'];
const leagueJs = new LeagueJS(API_KEY);

class SummonerStats {
    win!: boolean;
    champLevel!: number;
    totalMinionsKilled!: number;
    kills!: number;
    assists!: number;
    deaths!: number;
}

class SummonerData {
    championId!: number;
    spell1Id!: number;
    spell2Id!: number;
    stats!: SummonerStats;
}

class MatchData {
    participantId!: number;
    summonerName!: string;
    gameDuration!: number;
    summoner!: SummonerData;
}

function findParticipantData(accountId: string, participantIds: any[]) {
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

function parseMatchData(data: any) {
    const accountId = data.accountId;
    const matches = data.matches;

    let matchDataList: MatchData[] = [];

    matches.forEach((match: any) => {
        let matchData = new MatchData();

        const participantData = findParticipantData(accountId, match.participantIdentities);

        const id = participantData.participantId;

        matchData.summoner = JSON.parse(match.participants[id - 1]);
        matchData.summonerName = participantData.player.summonerName;
        matchData.participantId = id;
        matchData.summonerName = participantData.player.summonerName;
        matchData.gameDuration = match.gameDuration;

        matchDataList.push(matchData);
    });

    return matchDataList;
}

async function getMatchListByUsername(username: string) {

    const userData = await leagueJs.Summoner
        .gettingByName(username);

    const accountId = userData.accountId;
    if (!accountId) { console.error("No accountId found"); throw new Error("No accountId found"); }

    const matchList = await leagueJs.Match
        .gettingListByAccount(accountId);

    return { "accountId": userData.accountId, "matches": matchList };
}