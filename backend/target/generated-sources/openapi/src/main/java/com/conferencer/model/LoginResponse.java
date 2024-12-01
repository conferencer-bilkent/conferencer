package com.conferencer.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * LoginResponse
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2024-12-01T12:22:06.707512+03:00[Europe/Istanbul]")
public class LoginResponse {

  @JsonProperty("token")
  private String token;

  @JsonProperty("userId")
  private Integer userId;

  public LoginResponse token(String token) {
    this.token = token;
    return this;
  }

  /**
   * JWT token for authentication
   * @return token
  */
  
  @Schema(name = "token", description = "JWT token for authentication", required = false)
  public String getToken() {
    return token;
  }

  public void setToken(String token) {
    this.token = token;
  }

  public LoginResponse userId(Integer userId) {
    this.userId = userId;
    return this;
  }

  /**
   * ID of the authenticated user
   * @return userId
  */
  
  @Schema(name = "userId", description = "ID of the authenticated user", required = false)
  public Integer getUserId() {
    return userId;
  }

  public void setUserId(Integer userId) {
    this.userId = userId;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    LoginResponse loginResponse = (LoginResponse) o;
    return Objects.equals(this.token, loginResponse.token) &&
        Objects.equals(this.userId, loginResponse.userId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(token, userId);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class LoginResponse {\n");
    sb.append("    token: ").append(toIndentedString(token)).append("\n");
    sb.append("    userId: ").append(toIndentedString(userId)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }
}

