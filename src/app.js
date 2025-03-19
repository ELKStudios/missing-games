document.addEventListener('DOMContentLoaded', () => {
    const ownedGamesInput = document.getElementById('ownedGames');
    const checkMissingButton = document.getElementById('checkMissing');
    const resetButton = document.getElementById('resetButton');
    const missingGamesDiv = document.getElementById('missingGames');
    const countrySelect = document.getElementById('countrySelect');
    const copyButton = document.getElementById('copyButton');

    async function fetchGames() {
        const selectedCountry = countrySelect.value.toLowerCase();
        const gamesFilePath = `./data/${selectedCountry}.json`;

        try {
            const response = await fetch(gamesFilePath);
            if (!response.ok) {
                throw new Error(`Error fetching games: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            missingGamesDiv.innerHTML = '<p>Error loading games data.</p>';
            return [];
        }
    }

    checkMissingButton.addEventListener('click', async () => {
        const allGames = await fetchGames();
        const ownedGames = ownedGamesInput.value
            .split(/\n|,/) // Split by new lines or commas
            .map(game => game.trim().toLowerCase())
            .filter(game => game); // Remove empty entries

        const missingGames = allGames.filter(game =>
            !ownedGames.includes(game.title.toLowerCase())
        );

        missingGamesDiv.innerHTML = ''; // Clear previous results

        if (missingGames.length === 0) {
            missingGamesDiv.innerHTML = '<p>No missing games!</p>';
            copyButton.classList.add('hidden'); // Hide copy button if nothing to copy
        } else {
            const list = document.createElement('ul');
            list.classList.add('game-list');

            missingGames.sort((a, b) => a.title.localeCompare(b.title)); // Sort alphabetically

            // Multi-column layout if more than 10 results
            if (missingGames.length > 10) {
                list.classList.add(missingGames.length > 20 ? 'more-than-20' : 'more-than-10');
            }

            missingGames.forEach(game => {
                const listItem = document.createElement('li');
                listItem.textContent = game.title;
                list.appendChild(listItem);
            });

            missingGamesDiv.appendChild(list);
            copyButton.classList.remove('hidden'); // Show copy button
        }
    });

    // ✅ Reset Button Functionality
    resetButton.addEventListener('click', () => {
        ownedGamesInput.value = ''; // Clear input field
        missingGamesDiv.innerHTML = ''; // Clear results
        copyButton.classList.add('hidden'); // Hide copy button
    });

    // ✅ Copy to Clipboard
    copyButton.addEventListener('click', () => {
        const missingGamesList = Array.from(missingGamesDiv.querySelectorAll('li'))
            .map(li => li.textContent)
            .join('\n');

        navigator.clipboard.writeText(missingGamesList).then(() => {
            alert('Copied to clipboard!');
        }).catch(err => console.error('Failed to copy:', err));
    });
});
