package com.platform.dto;

import java.util.Set;

public class AuthResponse {
    private String token;
    private Long userId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private Set<String> roles;

    
    public AuthResponse() {
    }

    public AuthResponse(String token, String username, String email, Set<String> roles) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.roles = roles;
    }

    public AuthResponse(String token, String username, String email) {
        this.token = token;
        this.username = username;
        this.email = email;
    }
    public AuthResponse(String token,String username, String email, String firstName, String lastName) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public AuthResponse(String token, Long userId, String username, String email, String firstName, String lastName) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public AuthResponse(String token){
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    public Set<String> getRoles() {
        return roles;
    }
    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
    // @Override
    // public String toString() {
    //     return "AuthResponse{" +
    //             "token='" + token + '\'' +
    //             ", username='" + username + '\'' +
    //             ", email='" + email + '\'' +
    //             ", firstName='" + firstName + '\'' +
    //             ", lastName='" + lastName + '\'' +
    //             ", roles=" + roles +
    //             '}';
    // }
}