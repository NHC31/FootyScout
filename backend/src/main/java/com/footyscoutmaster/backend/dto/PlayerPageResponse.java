
package com.footyscoutmaster.backend.dto;

import com.footyscoutmaster.backend.model.Player;
import java.util.List;

public class PlayerPageResponse {

    private final List<Player> players;
    private final int currentPage;
    private final int totalPages;
    private final int totalResults;

    public PlayerPageResponse(
            List<Player> players,
            int currentPage,
            int totalPages,
            int totalResults) {

        this.players = players;
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.totalResults = totalResults;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public int getTotalResults() {
        return totalResults;
    }
}

