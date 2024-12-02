package com.conferencer.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "ROLE", uniqueConstraints = {@UniqueConstraint(columnNames = {"email"})})
@Setter
@Getter
@NoArgsConstructor
public class Role extends BaseEntity {

    private String name;
    @ManyToMany(cascade = {
            CascadeType.PERSIST,
            CascadeType.MERGE })
    @JoinTable(name = "ROLE_AUTHORITY",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "authority_id"))
    private Set<Authority> authorities = new HashSet<>();
}
