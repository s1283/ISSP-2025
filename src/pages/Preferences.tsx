import { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { User } from "firebase/auth";
import "./Preferences.css";

const GENRES = [
  "Pop", "Rock", "Jazz", "Hip-Hop", "Classical", "Electronic", "Country", "Reggae", "R&B", "Metal",
  "Indie", "Alternative", "Blues", "Folk", "Punk", "Soul", "Funk", "Latin", "K-Pop", "EDM",
  "House", "Techno", "Trap", "Lo-fi", "Ambient", "Gospel", "World", "Ska", "Disco", "Grunge"
];

export default function Preferences() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) navigate("/");
    else setUser(currentUser);
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchUserPreferences = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSelectedGenres(data.preferences || []);
      }
    };
    fetchUserPreferences();
  }, [user]);

  const handleGenreToggle = (genre: string) => {
    setError("");
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleSavePreferences = async () => {
    if (selectedGenres.length < 3) {
      setError("Select at least 3 genres before saving.");
      return;
    }
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { preferences: selectedGenres });
      navigate("/landing"); // redirect back to landing page after save
    } catch (err) {
      console.error(err);
      setError("Failed to save preferences.");
    }
  };

  const handleGoBack = () => {
    if (selectedGenres.length < 3) {
      setShowWarningModal(true);
    } else {
      navigate("/landing");
    }
  };

  return (
    <div className="preferences-container">
      <h1>Your Music Preferences</h1>
      <p>Select at least 3 genres:</p>

      <div className="genre-grid">
        {GENRES.map((genre) => (
          <button
            key={genre}
            className={`genre-button ${selectedGenres.includes(genre) ? "selected" : ""}`}
            onClick={() => handleGenreToggle(genre)}
          >
            {genre}
          </button>
        ))}
      </div>

      {error && <p className="error-msg">{error}</p>}

      <div style={{ marginTop: "20px" }}>
        <button className="save-preferences" onClick={handleSavePreferences}>Save Preferences</button>
        <button 
          className="save-preferences" 
          style={{marginLeft: '10px', backgroundColor:'#555'}} 
          onClick={handleGoBack}
        >
          Back to Landing
        </button>
      </div>

      {/* Warning Modal */}
      {showWarningModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Warning</h3>
            <p>You must select at least 3 genres before returning to the landing page.</p>
            <button onClick={() => setShowWarningModal(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
