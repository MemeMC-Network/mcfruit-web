// Player Stats JavaScript
const API_BASE_URL = 'http://localhost:8080/api'; // Change this to your server's API endpoint

// Search for player
async function searchPlayer() {
    const searchInput = document.getElementById('player-search');
    const username = searchInput.value.trim();

    if (!username) {
        alert('Please enter a player username');
        return;
    }

    const loading = document.getElementById('stats-loading');
    const error = document.getElementById('stats-error');
    const statsContainer = document.getElementById('player-stats');

    // Show loading
    loading.style.display = 'flex';
    error.style.display = 'none';
    statsContainer.style.display = 'none';

    try {
        const response = await fetch(`${API_BASE_URL}/player/${username}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Player "${username}" not found or hasn't played on MCFruit`);
            }
            throw new Error('Failed to fetch player stats');
        }

        const playerData = await response.json();
        
        // Hide loading
        loading.style.display = 'none';
        
        // Display player stats
        displayPlayerStats(playerData);
        statsContainer.style.display = 'block';

    } catch (err) {
        console.error('Error loading player stats:', err);
        loading.style.display = 'none';
        error.style.display = 'flex';
        document.getElementById('stats-error-message').textContent = err.message;
    }
}

// Display player stats
function displayPlayerStats(player) {
    // Player header
    document.getElementById('player-head').src = `https://mc-heads.net/avatar/${player.uuid || player.username}/128`;
    document.getElementById('player-head').alt = player.username;
    document.getElementById('player-name').textContent = player.username;
    document.getElementById('player-rank').textContent = `Rank #${player.rank || '-'}`;

    // Overall stats
    const totalWins = player.totalWins || 0;
    const totalLosses = player.totalLosses || 0;
    const winRate = totalWins + totalLosses > 0 
        ? ((totalWins / (totalWins + totalLosses)) * 100).toFixed(1)
        : '0.0';

    document.getElementById('total-wins').textContent = totalWins.toLocaleString();
    document.getElementById('total-losses').textContent = totalLosses.toLocaleString();
    document.getElementById('win-rate').textContent = `${winRate}%`;
    document.getElementById('current-streak').textContent = player.streak >= 0 ? `+${player.streak}` : player.streak;

    // Game mode stats
    const gamemodeStatsContainer = document.getElementById('gamemode-stats');
    gamemodeStatsContainer.innerHTML = '';

    if (player.gameModes && player.gameModes.length > 0) {
        player.gameModes.forEach(mode => {
            const modeWinRate = mode.wins + mode.losses > 0 
                ? ((mode.wins / (mode.wins + mode.losses)) * 100).toFixed(1)
                : '0.0';

            const modeCard = document.createElement('div');
            modeCard.className = 'gamemode-card';
            modeCard.innerHTML = `
                <div class="gamemode-header">
                    <h4>${formatModeName(mode.name)}</h4>
                    <span class="gamemode-elo">${mode.elo || 1000} ELO</span>
                </div>
                <div class="gamemode-stats-grid">
                    <div class="gamemode-stat">
                        <span class="label">Wins</span>
                        <span class="value">${mode.wins || 0}</span>
                    </div>
                    <div class="gamemode-stat">
                        <span class="label">Losses</span>
                        <span class="value">${mode.losses || 0}</span>
                    </div>
                    <div class="gamemode-stat">
                        <span class="label">Win Rate</span>
                        <span class="value">${modeWinRate}%</span>
                    </div>
                    <div class="gamemode-stat">
                        <span class="label">Streak</span>
                        <span class="value ${mode.streak >= 0 ? 'positive' : 'negative'}">${mode.streak >= 0 ? '+' : ''}${mode.streak || 0}</span>
                    </div>
                </div>
            `;
            gamemodeStatsContainer.appendChild(modeCard);
        });
    } else {
        gamemodeStatsContainer.innerHTML = '<p class="no-data">No game mode statistics available</p>';
    }
}

// Format mode name
function formatModeName(name) {
    const modeNames = {
        'nodebuff': 'NoDebuff',
        'debuff': 'Debuff',
        'sumo': 'Sumo',
        'builduhc': 'BuildUHC',
        'archer': 'Archer',
        'gapple': 'Gapple'
    };
    return modeNames[name.toLowerCase()] || name;
}

// Search on Enter key
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('player-search');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchPlayer();
            }
        });
    }
});
