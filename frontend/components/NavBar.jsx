import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <header className="bg-white border-b">
      <nav className="max-w-6xl mx-auto flex gap-4 p-4">
        <Link to="/" className="font-semibold">RedBullJab</Link>
        <Link to="/courts">Courts</Link>
        <Link to="/bookings">Bookings</Link>
        <Link to="/teams">Teams</Link>
        <Link to="/matches">Matches</Link>
        <Link to="/bets">Bets</Link>
      </nav>
    </header>
  );
}

