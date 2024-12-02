package com.conferencer.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "CONFERENCE_USER", uniqueConstraints = {@UniqueConstraint(columnNames = {"email"})})
@Entity
@Setter
@Getter
@NoArgsConstructor
public class User extends BaseEntity {
    private String password;
    private String email;
    private String name;
    private String surname;
    private String phone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id")
    private Role role;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "token_id")
    private UserToken userToken;
}
