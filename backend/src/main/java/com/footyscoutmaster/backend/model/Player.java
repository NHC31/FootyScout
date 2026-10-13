
package com.footyscoutmaster.backend.model;

public class Player {

    private int id;
    private String name;
    private int age;
    private String nationality;
    private String team;
    private String position;
    private int appearances;
    private int goals;
    private int assists;
    private double rating;

    public Player(
            int id,
            String name,
            int age,
            String nationality,
            String team,
            String position,
            int appearances,
            int goals,
            int assists,
            double rating) {

        this.id = id;
        this.name = name;
        this.age = age;
        this.nationality = nationality;
        this.team = team;
        this.position = position;
        this.appearances = appearances;
        this.goals = goals;
        this.assists = assists;
        this.rating = rating;
    }

    public int getId() { return id; }
    public String getName() { return name; }
    public int getAge() { return age; }
    public String getNationality() { return nationality; }
    public String getTeam() { return team; }
    public String getPosition() { return position; }
    public int getAppearances() { return appearances; }
    public int getGoals() { return goals; }
    public int getAssists() { return assists; }
    public double getRating() { return rating; }
}
