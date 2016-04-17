from api import server
import config

from sqlalchemy import *
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relation, sessionmaker, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    students = relationship("Student")
    cards = relationship("Card")

class Student(Base):
    __tablename__ = 'students'

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    teacher_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    teacher = relationship("User", back_populates="students")
    decks = relationship("Deck")

class Card(Base):
    __tablename__ = 'cards'

    id = Column(Integer, primary_key=True)
    front = Column(String(255), nullable=False)
    back = Column(String(255), nullable=False, default="")
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="cards")

    def __repr__(self):
        return "Card(%r, %r)" % (self.front, self.back)

deck_card_table = Table('deck_card', Base.metadata,
    Column('deck_id', Integer, ForeignKey('decks.id')),
    Column('card_id', Integer, ForeignKey('cards.id')),
    Column('box', Integer, nullable=False, default=0),
    Column('status', Integer, nullable=False, default=0),
    Column('show_count', Integer, nullable=False, default=0),
    Column('last_shown', Integer, nullable=False, default=0),
)

class Deck(Base):
    __tablename__ = 'decks'

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    cards = relationship("Card", secondary=deck_card_table)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    student = relationship("Student", back_populates="decks")


engine = create_engine('sqlite:///test.db')
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

# Init stuff
if session.query(User).count() == 0:
    print "Initializating database"
    u = User(name="Jim")
    s = Student(name="Ben", teacher=u)
    d = Deck(name="First Deck", student=s)
    session.add(d)
    for word in ["dog", "cat", "bear", "shark"]:
        c = Card(front=word, owner=u)
        d.cards.append(c)

    session.commit()

if __name__ == "__main__":
    print "Starting server on port 8888..."
    server.server_start(config, session)
