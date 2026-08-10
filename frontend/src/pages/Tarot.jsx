import { useState } from "react";
import axios from "axios";

function Tarot() {
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState(null);

  const drawCard = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://127.0.0.1:8000/tarot/draw");

      setReading(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to draw tarot card.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white p-10">

      <h1 className="text-4xl font-bold text-center">
        🔮 Tarot Reading
      </h1>

      <p className="text-center text-gray-300 mt-3">
        Click on any card to reveal your destiny.
      </p>

      {/* Show card backs only before drawing */}
      {!reading && !loading && (
        <div className="flex justify-center gap-12 mt-16">

          {[1, 2, 3].map((card) => (
            <div
              key={card}
              onClick={drawCard}
              className="cursor-pointer transition duration-300 hover:scale-110"
            >
              <img
                src="/tarot/card_back.png"
                alt="Tarot Card"
                className="w-56 md:w-64 rounded-2xl shadow-2xl"
              />
            </div>
          ))}

        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center mt-16">

          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto"></div>

          <p className="mt-6 text-xl font-semibold">
            Drawing your card...
          </p>

          <p className="text-gray-400 mt-2">
            Generating AI interpretation...
          </p>

        </div>
      )}

      {/* Reading */}
      {reading && !loading && (
        <div className="mt-14 max-w-4xl mx-auto space-y-8">

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">

            <img
              src={`/tarot/${reading.image}`}
              alt={reading.card}
              className="w-80 md:w-96 mx-auto rounded-2xl shadow-2xl"
            />

            <h2 className="text-3xl font-bold mt-6 text-black">
              {reading.card}
            </h2>

            <p className="text-gray-700 mt-4 text-lg">
              {reading.meaning}
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">

            <h2 className="text-2xl font-bold mb-5 text-black">
              ✨ AI Interpretation
            </h2>

            <div className="whitespace-pre-wrap leading-8 text-gray-700">
              {reading.interpretation}
            </div>

          </div>

          <div className="text-center">
            <button
              onClick={() => setReading(null)}
              className="bg-purple-700 hover:bg-purple-800 px-6 py-3 rounded-xl text-white font-semibold transition"
            >
              Draw Another Card
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

export default Tarot;