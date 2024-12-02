package com.conferencer.model;


import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "USER_TOKEN", uniqueConstraints = {@UniqueConstraint(columnNames = {"email"})})
@Setter
@Getter
@NoArgsConstructor
public class UserToken extends BaseEntity {
    private String token;
}
