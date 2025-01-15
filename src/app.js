const fs = require('fs');
const path = require('path');

// Load the list of owned games
const ownedGames = ['Game A', 'Game B', 'Game C']; // Example list, replace with actual input

// Load the complete list of games from games.json
const gamesFilePath = path.join(__dirname, 'data', 'games.json');
let allGames = [];

fs.readFile(gamesFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading games.json:', err);
        return;
    }
    allGames = JSON.parse(data);
    displayMissingGames();
});

// Function to display missing games
function displayMissingGames() {
    const missingGames = allGames.filter(game => !ownedGames.includes(game.title));
    
    const missingGamesList = document.getElementById('missing-games');
    missingGamesList.innerHTML = '';

    if (missingGames.length === 0) {
        missingGamesList.innerHTML = '<p>No missing games!</p>';
    } else {
        missingGames.forEach(game => {
            const listItem = document.createElement('li');
            listItem.textContent = game.title;
            missingGamesList.appendChild(listItem);
        });
    }
}