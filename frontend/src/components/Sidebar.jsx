import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 bg-purple-800 text-white min-h-screen p-6">

      <h2 className="text-2xl font-bold mb-8">
        Palmistry AI
      </h2>

      <div className="space-y-4">

        <Link to="/dashboard">
          Dashboard
        </Link>

        <br />

        <Link to="/profile">
          Profile
        </Link>

        <br />

        <Link to="/palm">
          Palm Analysis
        </Link>

        <br />

        <Link to="/tarot">
          Tarot Reading
        </Link>

        <br />

        <Link to="/reports">
          Reports
        </Link>

      </div>
    </div>
  );
}

export default Sidebar;