CREATE TABLE IF NOT EXISTS ROLE (
    ID UUID PRIMARY KEY,
    ROLE_NAME VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS USER_TOKEN (
    ID UUID PRIMARY KEY,
    TOKEN VARCHAR(255) UNIQUE NOT NULL,
    EXPIRES_AT TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS CONFERENCE_USER (
    ID UUID PRIMARY KEY,
    EMAIL VARCHAR(255) UNIQUE NOT NULL,
    PASSWORD VARCHAR(255) NOT NULL,
    NAME VARCHAR(255),
    SURNAME VARCHAR(255),
    PHONE VARCHAR(20),
    CREATED_DATE TIMESTAMP NOT NULL,
    UPDATED_DATE TIMESTAMP,
    CREATED_BY VARCHAR(255),
    UPDATED_BY VARCHAR(255),
    ROLE_ID UUID,
    TOKEN_ID UUID,
    FOREIGN KEY (ROLE_ID) REFERENCES ROLE (ID),
    FOREIGN KEY (TOKEN_ID) REFERENCES USER_TOKEN (ID)
);

