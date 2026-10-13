
package com.footyscoutmaster.backend.service;

import java.util.List;
import java.util.ArrayList;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.footyscoutmaster.backend.model.Player;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ApiFootballService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public ApiFootballService(
            @Value("${api.football.key}") String apiKey,
            ObjectMapper objectMapper) {

        this.restClient = RestClient.builder()
                .baseUrl("https://v3.football.api-sports.io")
                .defaultHeader("x-apisports-key", apiKey)
                .build();

        this.objectMapper = objectMapper;
    }

    public List<Player> getPlayers(int league, int season, int page) {

        String response = restClient.get()
            .uri(uriBuilder -> uriBuilder
                    .path("/players")
                    .queryParam("league", league)
                    .queryParam("season", season)
                    .queryParam("page", page)
                    .build())
            .retrieve()
            .body(String.class);

        List<Player> players = new ArrayList<>();

        try {
            JsonNode root = objectMapper.readTree(response);

            for (JsonNode record : root.path("response")) {
                JsonNode player = record.path("player");
                JsonNode statistics = record.path("statistics").path(0);
                JsonNode games = statistics.path("games");
                JsonNode goals = statistics.path("goals");
                JsonNode team = statistics.path("team");

                players.add(new Player(
                        player.path("id").asInt(),
                        player.path("name").asText("Unknown"),
                        player.path("age").asInt(),
                        player.path("nationality").asText("Unknown"),
                        team.path("name").asText("Unknown"),
                        games.path("position").asText("Unknown"),
                        games.path("appearences").asInt(),
                        goals.path("total").asInt(),
                        goals.path("assists").asInt(),
                        games.path("rating").asDouble()
                ));
            }

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to process player data", e);
        }

        return players;
    }
}
