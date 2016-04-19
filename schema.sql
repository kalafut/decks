DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS decks;
DROP TABLE IF EXISTS deck_card;

CREATE TABLE users (
        id INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        PRIMARY KEY (id)
);
CREATE TABLE students (
        id INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        teacher_id INTEGER NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY(teacher_id) REFERENCES users (id)
);
CREATE TABLE cards (
        id INTEGER NOT NULL,
        front VARCHAR(255) NOT NULL,
        back VARCHAR(255) NOT NULL DEFAULT "",
        owner_id INTEGER NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY(owner_id) REFERENCES users (id)
);
CREATE TABLE decks (
        id INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        student_id INTEGER NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY(student_id) REFERENCES students (id)
);
CREATE TABLE deck_card (
        id INTEGER NOT NULL,
        deck_id INTEGER NOT NULL,
        card_id INTEGER NOT NULL,
        box INTEGER NOT NULL DEFAULT 0,
        status INTEGER NOT NULL DEFAULT 0,
        show_count INTEGER NOT NULL DEFAULT 0,
        last_shown INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (id),
        FOREIGN KEY(deck_id) REFERENCES decks (id),
        FOREIGN KEY(card_id) REFERENCES cards (id)
);

INSERT INTO users(id, name) VALUES(1, "Jim");
INSERT INTO students(id, name, teacher_id) VALUES(1, "Ben", 1);
INSERT INTO cards(id, front, owner_id) VALUES(1, "dog", 1);
INSERT INTO cards(id, front, owner_id) VALUES(2, "cat", 1);
INSERT INTO cards(id, front, owner_id) VALUES(3, "pizza", 1);
INSERT INTO decks(id, name, student_id) VALUES(1, "First Deck", 1);
INSERT INTO deck_card(deck_id, card_id) VALUES(1, 1);
INSERT INTO deck_card(deck_id, card_id) VALUES(1, 2);
INSERT INTO deck_card(deck_id, card_id) VALUES(1, 3);
