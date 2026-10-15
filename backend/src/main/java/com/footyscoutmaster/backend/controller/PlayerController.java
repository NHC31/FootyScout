
package com.footyscoutmaster.backend.controller;

import com.footyscoutmaster.backend.dto.PlayerPageResponse;
import com.footyscoutmaster.backend.model.Player;
import com.footyscoutmaster.backend.service.ApiFootballService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class PlayerController {

    private final ApiFootballService apiFootballService;

    public PlayerController(ApiFootballService apiFootballService) {
        this.apiFootballService = apiFootballService;
    }

    @GetMapping("/api/players")
    public PlayerPageResponse getPlayers(
            @RequestParam(defaultValue = "39") int league,
            @RequestParam(defaultValue = "2024") int season,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(required = false) String team,
            @RequestParam(required = false) String position,
            @RequestParam(required = false) Integer minAge,
            @RequestParam(required = false) Integer maxAge) {

        if (page < 1) {
            throw new IllegalArgumentException(
                    "Page must be at least 1");
        }

        PlayerPageResponse result =
                apiFootballService.getPlayers(
                        league, season, page);

        List<Player> filteredPlayers =
                result.getPlayers().stream()
                        .filter(p -> team == null ||
                                p.getTeam().equalsIgnoreCase(team))
                        .filter(p -> position == null ||
                                p.getPosition().equalsIgnoreCase(position))
                        .filter(p -> minAge == null ||
                                p.getAge() >= minAge)
                        .filter(p -> maxAge == null ||
                                p.getAge() <= maxAge)
                        .collect(Collectors.toList());

        return new PlayerPageResponse(
                filteredPlayers,
                result.getCurrentPage(),
                result.getTotalPages(),
                filteredPlayers.size()
        );
    }
}
