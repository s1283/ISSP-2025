// src/Landing.tsx
import { useEffect, useState, useRef } from "react";
import { auth, db } from "../firebaseConfig";
import { signOut, User } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

const GENRES = [
  "Pop", "Rock", "Jazz", "Hip-Hop", "Classical", "Electronic", "Country", "Reggae", "R&B", "Metal",
  "Indie", "Alternative", "Blues", "Folk", "Punk", "Soul", "Funk", "Latin", "K-Pop", "EDM",
  "House", "Techno", "Trap", "Lo-fi", "Ambient", "Gospel", "World", "Ska", "Disco", "Grunge"
];

interface Song {
  id: number;
  title: string;
  artist: string;
  artwork: string;
  genre: string;
  previewUrl: string;
}

interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

/**
 * Fetch songs from iTunes API by genre.
 * Filters out songs that were already shown and returns 3 random suggestions.
 * Returns song metadata: id, title, artist, artwork, genre, preview URL.
 */
const fetchSongsByGenre = async (genre: string, excludeIds: number[] = []): Promise<Song[]> => {
  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(
        genre
      )}&media=music&limit=50`
    );
    const data = await response.json();
    const filtered = data.results.filter(
      (track: any) => !excludeIds.includes(track.trackId)
    );

    // Shuffle results to make suggestions random
    for (let i = filtered.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
    }

    return filtered.slice(0, 3).map((track: any): Song => ({
      id: track.trackId,
      title: track.trackName,
      artist: track.artistName,
      artwork: track.artworkUrl100.replace("100x100", "300x300"),
      genre: track.primaryGenreName,
      previewUrl: track.previewUrl,
    }));
  } catch (err) {
    console.error("iTunes API error:", err);
    return [];
  }
};

export default function Landing() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [userPreferences, setUserPreferences] = useState<string[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [shownCards, setShownCards] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [shownSongIds, setShownSongIds] = useState<Record<string, number[]>>({});
  const [playingSong, setPlayingSong] = useState<Song | null>(null);
  const [mood, setMood] = useState<string[]>([]);

  // Playlist modal
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  const [songToAdd, setSongToAdd] = useState<Song | null>(null);
  const [newPlaylistNameModal, setNewPlaylistNameModal] = useState("");
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  // Search
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Ref for HTML audio
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playerTime, setPlayerTime] = useState(0);

  // Dropdown menu state
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auth listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) navigate("/");
      else setUser(currentUser);
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch user data
  useEffect(() => {
    if (!user) return;
    const fetchUserData = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(
            `${data.firstName || ""} ${data.lastName || ""}`.trim() || user.email || ""
          );
          if (!data.preferences || data.preferences.length < 3)
            setShowPreferences(true);
          else setUserPreferences(data.preferences);
        } else {
          setName(user.email || "");
          setShowPreferences(true);
        }
      } catch (err) {
        console.error(err);
        setName(user.email || "");
        setShowPreferences(true);
      }
      setLoading(false);
    };
    fetchUserData();
  }, [user]);

  // Fetch playlists
  const fetchUserPlaylists = async () => {
    if (!user) return;
    const playlistRef = collection(db, "users", user.uid, "playlists");
    const snapshot = await getDocs(playlistRef);
    setPlaylists(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Playlist)));
  };

  useEffect(() => {
    fetchUserPlaylists();
  }, [user]);

  // Fetch songs (genre suggestions)
  const fetchAllSongs = async () => {
    if (userPreferences.length === 0) return;

    let allSongs: Song[] = [];
    const newShownIds: Record<string, number[]> = { ...shownSongIds };

    for (let genre of userPreferences) {
      const genreShownIds = newShownIds[genre] || [];
      const genreSongs = await fetchSongsByGenre(genre, genreShownIds);
      newShownIds[genre] = [...genreShownIds, ...genreSongs.map((s) => s.id)];
      allSongs = allSongs.concat(genreSongs);
    }

    setSongs([]);
    setShownCards([]);
    setTimeout(() => {
      setSongs(allSongs);
      allSongs.forEach((_, i) =>
        setTimeout(() => setShownCards((prev) => [...prev, i]), i * 150)
      );
    }, 50);

    setShownSongIds(newShownIds);
  };

  useEffect(() => {
    fetchAllSongs();
  }, [userPreferences]);

  // LIVE ITUNES SEARCH
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setSearchError("");
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setSearchLoading(true);
      setSearchError("");

      try {
        const response = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(
            searchTerm
          )}&media=music&limit=20`
        );
        const data = await response.json();

        if (data.results.length === 0) {
          setSearchResults([]);
          setSearchError("Song/Artist could not be found");
        } else {
          const results: Song[] = data.results.map((track: any): Song => ({
            id: track.trackId,
            title: track.trackName,
            artist: track.artistName,
            artwork: track.artworkUrl100.replace("100x100", "300x300"),
            genre: track.primaryGenreName,
            previewUrl: track.previewUrl,
          }));
          setSearchResults(results);
        }
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
        setSearchError("Error searching iTunes");
      }

      setSearchLoading(false);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // PLAY THE SONG
  const playSong = (song: Song) => {
    setPlayingSong(song);
    setMood([]);
    setPlayerTime(0);
    setShowAddToPlaylistModal(true);
    setSongToAdd(song);
    setNewPlaylistNameModal("");
  };

  // Save mood
  const saveMood = (selectedMood: string) => {
    if (!playingSong) return;
    setMood((prev) =>
      prev ? Array.from(new Set([...prev, selectedMood])) : [selectedMood]
    );
  };

  const handleConfirmMoodSave = async () => {
    if (!playingSong || mood.length === 0 || !user) return;

    try {
      const now = new Date();
      const historyRef = collection(db, "users", user.uid, "moodHistory");
      await addDoc(historyRef, {
        songId: playingSong.id,
        title: playingSong.title,
        artist: playingSong.artist,
        moods: mood,
        timestamp: Math.floor(playerTime),
        listenedAt: now,
        day: now.getDate(),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
      });

      setMood([]);
      setPlayingSong(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Track audio time
  const handleTimeUpdate = () => {
    if (audioRef.current) setPlayerTime(audioRef.current.currentTime);
  };

  // Genre selection
  const handleGenreToggle = (genre: string) => {
    setError("");
    if (selectedGenres.includes(genre))
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    else setSelectedGenres([...selectedGenres, genre]);
  };

  const handleSavePreferences = async () => {
    if (selectedGenres.length < 3) {
      setError("Select at least 3 genres.");
      return;
    }
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { preferences: selectedGenres });
      setUserPreferences(selectedGenres);
      setShowPreferences(false);
    } catch (err) {
      console.error(err);
      setError("Failed to save preferences.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  // Playlists
  const handleConfirmAddToPlaylist = async (playlistId: string) => {
    if (!songToAdd || !user) return;

    try {
      if (playlistId === "new") {
        if (!newPlaylistNameModal.trim()) return;
        const playlistRef = collection(db, "users", user.uid, "playlists");
        await addDoc(playlistRef, {
          name: newPlaylistNameModal.trim(),
          songs: [songToAdd],
        });
      } else {
        const playlistRef = doc(db, "users", user.uid, "playlists", playlistId);
        await updateDoc(playlistRef, { songs: arrayUnion(songToAdd) });
      }

      await fetchUserPlaylists();
      setShowAddToPlaylistModal(false);
      setSongToAdd(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    if (!window.confirm("Delete this playlist?") || !user) return;
    await deleteDoc(doc(db, "users", user.uid, "playlists", playlistId));
    fetchUserPlaylists();
  };

  const handleRemoveSongFromPlaylist = async (playlistId: string, song: Song) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid, "playlists", playlistId), {
      songs: arrayRemove(song),
    });
    fetchUserPlaylists();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="landing-container">
      <h1>Welcome, {name}!</h1>

      {showPreferences ? (
        <>
          <p>What kind of music do you like? (Select at least 3)</p>
          <div className="genre-buttons">
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => handleGenreToggle(g)}
                className={selectedGenres.includes(g) ? "selected" : ""}
              >
                {g}
              </button>
            ))}
          </div>
          <button className="save-preferences" onClick={handleSavePreferences}>
            Save Preferences
          </button>
          {error && <p className="error-msg">{error}</p>}
        </>
      ) : (
        <>
          {/* iTunes Live Search */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search songs or artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchLoading && <p>Searching...</p>}
          {searchError && <p>{searchError}</p>}
          {searchResults.length > 0 && (
            <div className="songs-container">
              {searchResults.map((song) => (
                <div key={song.id} className="song-card">
                  <div
                    className="song-card-clickable"
                    onClick={() => playSong(song)}
                  >
                    <img src={song.artwork} alt={song.title} />
                    <h4>{song.title}</h4>
                    <p>{song.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Genre suggestions */}
          {userPreferences.length > 0 && (
            <>
              <p>
                You like{" "}
                {userPreferences
                  .map((g, i) =>
                    i === userPreferences.length - 1 ? `${g}` : `${g}`
                  )
                  .join(", ")}
                . Here are some suggestions:
              </p>
              <button className="refresh-btn" onClick={fetchAllSongs}>
                🔁Refresh Suggestions🔁
              </button>
              <div className="songs-container">
                {songs.map((song, index) => (
                  <div
                    key={song.id}
                    className={`song-card ${
                      shownCards.includes(index) ? "show" : ""
                    }`}
                  >
                    <div
                      className="song-card-clickable"
                      onClick={() => playSong(song)}
                    >
                      <img src={song.artwork} alt={song.title} />
                      <h4>{song.title}</h4>
                      <p>{song.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Song Modal */}
          {playingSong && (
            <div className="song-modal">
              <div className="song-modal-content">
                <img src={playingSong.artwork} alt={playingSong.title} />
                <audio
                  ref={audioRef}
                  src={playingSong.previewUrl}
                  controls
                  autoPlay
                  style={{ width: "100%" }}
                  onTimeUpdate={handleTimeUpdate}
                />
                <div className="mood-buttons">
                  <p>
                    How are you feeling?{" "}
                    {mood.length > 0 && `Selected: ${mood.join(", ")}`}
                  </p>
                  {["Happy", "Sad", "Excited"].map((m) => (
                    <button
                      key={m}
                      onClick={() => saveMood(m)}
                      className={mood.includes(m) ? "selected-mood" : ""}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <div className="modal-actions">
                  <button
                    className="add-to-playlist-modal-btn"
                    onClick={() => setShowAddToPlaylistModal(true)}
                  >
                    Add to Playlist
                  </button>
                  <button className="save-mood-btn" onClick={handleConfirmMoodSave}>
                    Save Mood
                  </button>
                  <button
                    className="close-modal"
                    onClick={() => setPlayingSong(null)}
                  >
                    ❌
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add to Playlist Modal */}
          {showAddToPlaylistModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>
                  Select a playlist to add "{songToAdd?.title}"
                </h3>
                <div className="existing-playlists">
                  {playlists.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleConfirmAddToPlaylist(p.id)}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
                <div className="new-playlist">
                  <input
                    type="text"
                    placeholder="New playlist name"
                    value={newPlaylistNameModal}
                    onChange={(e) => setNewPlaylistNameModal(e.target.value)}
                  />
                  <button onClick={() => handleConfirmAddToPlaylist("new")}>
                    Create & Add
                  </button>
                </div>
                <button
                  className="close-modal"
                  onClick={() => setShowAddToPlaylistModal(false)}
                >
                  ❌
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
