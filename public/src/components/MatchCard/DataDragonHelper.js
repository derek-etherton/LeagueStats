import champions from '../../data/champion.json';

// champions.json should be refactored to be a mapping 
// from ID : data, then we would be able to perform constant-time lookups
export function findChampion(key) {
    for (var champion in champions.data) {
        if (champions.data[champion].key == key) {
            return champion;
        }
    }
}

export function getItems (playerStats ){
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