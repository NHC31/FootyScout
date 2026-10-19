import { useEffect, useState } from "react";
import "./App.css";


type Player = {
  id: number;
  name: string;
  age: number;
  nationality: string;
  team: string;
  position: string;
  appearances: number;
  goals: number;
  assists: number;
  rating: number;
};

type PlayerResponse = {
  players: Player[];
  currentPage: number;
  totalPages: number;
  totalResults: number;
};

function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState("All Positions");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  useEffect(() => {
    async function loadPlayers() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/players?page=${currentPage}`);

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        const data: PlayerResponse = await response.json();

        setPlayers(data.players);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } catch {
        setError(
          "Could not load players. Make sure your Spring Boot backend is running."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPlayers();
  }, [currentPage]);

  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      player.name.toLowerCase().includes(search.toLowerCase()) ||
      player.team.toLowerCase().includes(search.toLowerCase());

    const matchesPosition =
      position === "All Positions" || player.position === position;

    return matchesSearch && matchesPosition;
  });

  const averageRating =
    players.length > 0
      ? (
          players.reduce((sum, player) => sum + player.rating, 0) /
          players.length
        ).toFixed(2)
      : "0.00";

  const totalGoals = players.reduce(
    (sum, player) => sum + player.goals,
    0
  );

  const totalAssists = players.reduce(
    (sum, player) => sum + player.assists,
    0
  );

  const playerInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .replace(/\./g, "")
      .slice(0, 2);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">FS</div>
          <div>
            <h2>FootyScout</h2>
            <span>PLAYER INTELLIGENCE</span>
          </div>
        </div>

        <div className="nav-label">WORKSPACE</div>

        <nav>
          <a className="nav-item active" href="#dashboard">
            <span>▦</span> Dashboard
          </a>
          <a
            className={`nav-item ${selectedPlayer ? "" : ""}`}
            href="#players"
            onClick={() => setSelectedPlayer(null)}
          >
            <span>♙</span> Players
          </a>
          <a className="nav-item" href="#statistics">
            <span>▤</span> Statistics
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="status-dot" />
          <div>
            <strong>API Connection</strong>
            <p>Premier League · 2024</p>
          </div>
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        {!selectedPlayer && (
          <>
            <header className="topbar">
              <div>
                <span className="eyebrow">
                  SCOUTING WORKSPACE / OVERVIEW
                </span>
                <h1>Player Dashboard</h1>
                <p className="subtitle">
                  Discover talent. Analyze performance. Find your next star.
                </p>
              </div>

              <div className="season-badge">
                <span className="live-dot" />
                PREMIER LEAGUE <span className="season-year">2024</span>
              </div>
            </header>

            <section className="stats-grid" id="statistics">
              <div className="stat-card">
                <div className="stat-top">
                  <span className="stat-label">PLAYERS ON PAGE</span>
                  <span className="stat-icon">♙</span>
                </div>
                <div className="stat-value">{players.length}</div>
                <p className="stat-description">Current player batch</p>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span className="stat-label">AVERAGE RATING</span>
                  <span className="stat-icon">★</span>
                </div>
                <div className="stat-value">{averageRating}</div>
                <p className="stat-description">Average player rating</p>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span className="stat-label">GOALS</span>
                  <span className="stat-icon">⚽</span>
                </div>
                <div className="stat-value">{totalGoals}</div>
                <p className="stat-description">Goals in current batch</p>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span className="stat-label">ASSISTS</span>
                  <span className="stat-icon">↗</span>
                </div>
                <div className="stat-value">{totalAssists}</div>
                <p className="stat-description">Assists in current batch</p>
              </div>
            </section>

            <section className="players-section" id="players">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">PLAYER DATABASE</span>
                  <h2>Explore Players</h2>
                  <p>
                    Select a player to explore their profile and statistics.
                  </p>
                </div>
                <span className="results-badge">
                  {filteredPlayers.length} players shown
                </span>
              </div>

              <div className="filters">
                <div className="search-box">
                  <span>⌕</span>
                  <input
                    type="text"
                    placeholder="Search player or club..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>

                <select
                  value={position}
                  onChange={(event) => setPosition(event.target.value)}
                  aria-label="Filter by position"
                >
                  <option>All Positions</option>
                  <option>Goalkeeper</option>
                  <option>Defender</option>
                  <option>Midfielder</option>
                  <option>Attacker</option>
                  <option>Forward</option>
                </select>
              </div>

              {loading && (
                <div className="message">
                  <div className="loader" />
                  Loading players...
                </div>
              )}

              {!loading && error && (
                <div className="message error-message">
                  <strong>Connection error</strong>
                  <p>{error}</p>
                </div>
              )}

              {!loading && !error && (
                <>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>PLAYER</th>
                          <th>CLUB</th>
                          <th>POSITION</th>
                          <th>AGE</th>
                          <th>APPS</th>
                          <th>G</th>
                          <th>A</th>
                          <th>RATING</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredPlayers.map((player) => (
                          <tr
                            key={player.id}
                            className="clickable-row"
                            onClick={() => setSelectedPlayer(player)}
                            tabIndex={0}
                            onKeyDown={(event) => {
                              if (
                                event.key === "Enter" ||
                                event.key === " "
                              ) {
                                event.preventDefault();
                                setSelectedPlayer(player);
                              }
                            }}
                            aria-label={`View profile for ${player.name}`}
                          >
                            <td>
                              <div className="player-cell">
                                <div className="player-avatar">
                                  {playerInitials(player.name)}
                                </div>
                                <div>
                                  <strong>{player.name}</strong>
                                  <span>{player.nationality}</span>
                                </div>
                              </div>
                            </td>
                            <td>{player.team}</td>
                            <td>
                              <span className="position-tag">
                                {player.position}
                              </span>
                            </td>
                            <td>{player.age}</td>
                            <td>{player.appearances}</td>
                            <td>{player.goals}</td>
                            <td>{player.assists}</td>
                            <td>
                              <span className="rating">
                                {player.rating > 0
                                  ? player.rating.toFixed(2)
                                  : "—"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {filteredPlayers.length === 0 && (
                      <div className="empty-state">
                        No players match your search or position filter.
                      </div>
                    )}
                  </div>

                  <div className="pagination">
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                    <div className="pagination-buttons">
                      <button
                        disabled={currentPage <= 1 || loading}
                        onClick={() => setCurrentPage((page) => page - 1)}
                      >
                        ← Previous
                      </button>
                      <button
                        disabled={currentPage >= totalPages || loading}
                        onClick={() => setCurrentPage((page) => page + 1)}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                </>
              )}
            </section>
          </>
        )}

        {selectedPlayer && (
          <section className="profile-section">
            <button
              className="back-button"
              onClick={() => setSelectedPlayer(null)}
            >
              ← Back to players
            </button>

            <div className="profile-header">
              <div className="profile-avatar">
                {playerInitials(selectedPlayer.name)}
              </div>

              <div>
                <span className="eyebrow">PLAYER PROFILE</span>
                <h1>{selectedPlayer.name}</h1>
                <p className="subtitle">
                  {selectedPlayer.team} · {selectedPlayer.position}
                </p>
              </div>
            </div>

            <div className="profile-details">
              <div className="profile-detail">
                <span>AGE</span>
                <strong>{selectedPlayer.age}</strong>
              </div>
              <div className="profile-detail">
                <span>NATIONALITY</span>
                <strong>{selectedPlayer.nationality}</strong>
              </div>
              <div className="profile-detail">
                <span>CLUB</span>
                <strong>{selectedPlayer.team}</strong>
              </div>
              <div className="profile-detail">
                <span>POSITION</span>
                <strong>{selectedPlayer.position}</strong>
              </div>
            </div>

            <h2 className="profile-stats-heading">
              Performance Statistics
            </h2>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-top">
                  <span className="stat-label">APPEARANCES</span>
                  <span className="stat-icon">♙</span>
                </div>
                <div className="stat-value">
                  {selectedPlayer.appearances}
                </div>
                <p className="stat-description">Season appearances</p>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span className="stat-label">GOALS</span>
                  <span className="stat-icon">⚽</span>
                </div>
                <div className="stat-value">{selectedPlayer.goals}</div>
                <p className="stat-description">Season goals</p>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span className="stat-label">ASSISTS</span>
                  <span className="stat-icon">↗</span>
                </div>
                <div className="stat-value">{selectedPlayer.assists}</div>
                <p className="stat-description">Season assists</p>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span className="stat-label">RATING</span>
                  <span className="stat-icon">★</span>
                </div>
                <div className="stat-value">
                  {selectedPlayer.rating > 0
                    ? selectedPlayer.rating.toFixed(2)
                    : "—"}
                </div>
                <p className="stat-description">Average API rating</p>
              </div>
            </div>

            <div className="profile-note">
              <span className="eyebrow">SCOUTING NOTE</span>
              <p>
                This profile displays the player data currently provided by
                your API. More detailed scouting metrics can be added later.
              </p>
            </div>
          </section>
        )}

        <footer>
          <span>FOOTYSCOUTMASTER</span>
          <span>Built for smarter scouting.</span>
        </footer>
      </main>
    </div>
  );
}

export default App;