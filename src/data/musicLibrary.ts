// Music Library - Local songs organized by genre
// Place MP3 files in public/assets/music/

export interface Song {
  id: number; // Changed to number
  title: string;
  artist: string;
  artwork: string; // Changed from albumArt to artwork
  genre: string;
  previewUrl: string; // Changed from audioUrl to previewUrl
  // Removed duration as it's not in the requested properties
}

export interface PlaylistData {
  name: string;
  genres: string[];
  songs: Song[];
}

// Sample songs for each genre
// NOTE: You'll need to add actual MP3 files to public/assets/music/
// For now, these reference placeholder paths
export const musicLibrary: Record<string, Song[]> = {
  'Rock': [
    {
      id: 1, // Changed to number
      title: 'Summer Breeze',
      artist: 'Classic Rock Band',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/rock-1.mp3',
      genre: 'Rock'
    },
    {
      id: 2, // Changed to number
      title: 'Highway Dreams',
      artist: 'The Wanderers',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/rock-2.mp3',
      genre: 'Rock'
    },
    {
      id: 3, // Changed to number
      title: 'Electric Nights',
      artist: 'Voltage',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/rock-3.mp3',
      genre: 'Rock'
    }
  ],
  'Jazz': [
    {
      id: 4, // Changed to number
      title: 'Midnight Blues',
      artist: 'Smooth Quartet',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/jazz-1.mp3',
      genre: 'Jazz'
    },
    {
      id: 5, // Changed to number
      title: 'City Lights',
      artist: 'Urban Jazz Ensemble',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/jazz-2.mp3',
      genre: 'Jazz'
    },
    {
      id: 6, // Changed to number
      title: 'Sunset Serenade',
      artist: 'The Cool Cats',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/jazz-3.mp3',
      genre: 'Jazz'
    }
  ],
  'Classical': [
    {
      id: 7, // Changed to number
      title: 'Morning Sonata',
      artist: 'Symphony Orchestra',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/classical-1.mp3',
      genre: 'Classical'
    },
    {
      id: 8, // Changed to number
      title: 'Piano Concerto',
      artist: 'Royal Philharmonic',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/classical-2.mp3',
      genre: 'Classical'
    },
    {
      id: 9, // Changed to number
      title: 'String Quartet No. 5',
      artist: 'Chamber Music Society',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/classical-3.mp3',
      genre: 'Classical'
    }
  ],
  'Pop': [
    {
      id: 10, // Changed to number
      title: 'Dancing Days',
      artist: 'Pop Stars',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/pop-1.mp3',
      genre: 'Pop'
    },
    {
      id: 11, // Changed to number
      title: 'Summer Love',
      artist: 'The Heartbeats',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/pop-2.mp3',
      genre: 'Pop'
    },
    {
      id: 12, // Changed to number
      title: 'Neon Lights',
      artist: 'City Pop',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/pop-3.mp3',
      genre: 'Pop'
    }
  ],
  'Country': [
    {
      id: 13, // Changed to number
      title: 'Country Roads',
      artist: 'The Travelers',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/country-1.mp3',
      genre: 'Country'
    },
    {
      id: 14, // Changed to number
      title: 'Home Sweet Home',
      artist: 'Nashville Stars',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/country-2.mp3',
      genre: 'Country'
    },
    {
      id: 15, // Changed to number
      title: 'Sunset Ranch',
      artist: 'Wild West Band',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/country-3.mp3',
      genre: 'Country'
    }
  ],
  'Blues': [
    {
      id: 16, // Changed to number
      title: 'Stormy Monday',
      artist: 'Delta Blues Band',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/blues-1.mp3',
      genre: 'Blues'
    },
    {
      id: 17, // Changed to number
      title: 'Sweet Home Chicago',
      artist: 'Blues Brothers',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/blues-2.mp3',
      genre: 'Blues'
    },
    {
      id: 18, // Changed to number
      title: 'Crossroads',
      artist: 'Guitar Legends',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/blues-3.mp3',
      genre: 'Blues'
    }
  ],
  'R&B': [
    {
      id: 19, // Changed to number
      title: 'Soul Sensation',
      artist: 'Smooth Grooves',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/rnb-1.mp3',
      genre: 'R&B'
    },
    {
      id: 20, // Changed to number
      title: 'Velvet Nights',
      artist: 'The Soul Singers',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/rnb-2.mp3',
      genre: 'R&B'
    },
    {
      id: 21, // Changed to number
      title: 'Rhythm & Love',
      artist: 'Urban Soul',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/rnb-3.mp3',
      genre: 'R&B'
    }
  ],
  'Folk': [
    {
      id: 22, // Changed to number
      title: 'Mountain Song',
      artist: 'Acoustic Wanderers',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/folk-1.mp3',
      genre: 'Folk'
    },
    {
      id: 23, // Changed to number
      title: 'River Stories',
      artist: 'The Folk Collective',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/folk-2.mp3',
      genre: 'Folk'
    },
    {
      id: 24, // Changed to number
      title: 'Wildflower',
      artist: 'Country Folk',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/folk-3.mp3',
      genre: 'Folk'
    }
  ],
  'Hip Hop': [
    {
      id: 25, // Changed to number
      title: 'Street Poetry',
      artist: 'Urban Flow',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/hiphop-1.mp3',
      genre: 'Hip Hop'
    },
    {
      id: 26, // Changed to number
      title: 'City Beats',
      artist: 'The MC Collective',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/hiphop-2.mp3',
      genre: 'Hip Hop'
    },
    {
      id: 27, // Changed to number
      title: 'Rhythm & Rhyme',
      artist: 'Beat Masters',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/hiphop-3.mp3',
      genre: 'Hip Hop'
    }
  ],
  'Electronic': [
    {
      id: 28, // Changed to number
      title: 'Digital Dreams',
      artist: 'Synth Wave',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/electronic-1.mp3',
      genre: 'Electronic'
    },
    {
      id: 29, // Changed to number
      title: 'Pulse',
      artist: 'Neon Lights',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/electronic-2.mp3',
      genre: 'Electronic'
    },
    {
      id: 30, // Changed to number
      title: 'Circuit Break',
      artist: 'Digital Fusion',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/electronic-3.mp3',
      genre: 'Electronic'
    }
  ],
  'Reggae': [
    {
      id: 31, // Changed to number
      title: 'Island Vibes',
      artist: 'Tropical Rhythms',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/reggae-1.mp3',
      genre: 'Reggae'
    },
    {
      id: 32, // Changed to number
      title: 'Sunshine Groove',
      artist: 'Caribbean Soul',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/reggae-2.mp3',
      genre: 'Reggae'
    },
    {
      id: 33, // Changed to number
      title: 'One Love',
      artist: 'Unity Band',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/reggae-3.mp3',
      genre: 'Reggae'
    }
  ],
  'Metal': [
    {
      id: 34, // Changed to number
      title: 'Iron Thunder',
      artist: 'Heavy Storm',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/metal-1.mp3',
      genre: 'Metal'
    },
    {
      id: 35, // Changed to number
      title: 'Rage Machine',
      artist: 'Steel Force',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/metal-2.mp3',
      genre: 'Metal'
    },
    {
      id: 36, // Changed to number
      title: 'Dark Abyss',
      artist: 'Shadow Legion',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/metal-3.mp3',
      genre: 'Metal'
    }
  ],
  'Indie': [
    {
      id: 37, // Changed to number
      title: 'Coffee Shop Dreams',
      artist: 'The Wandering Hearts',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/indie-1.mp3',
      genre: 'Indie'
    },
    {
      id: 38, // Changed to number
      title: 'Late Night Drive',
      artist: 'Echo & Fade',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/indie-2.mp3',
      genre: 'Indie'
    },
    {
      id: 39, // Changed to number
      title: 'Vinyl Days',
      artist: 'Retro Souls',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/indie-3.mp3',
      genre: 'Indie'
    }
  ],
  'Soul': [
    {
      id: 40, // Changed to number
      title: 'Smooth Operator',
      artist: 'Velvet Voice',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/soul-1.mp3',
      genre: 'Soul'
    },
    {
      id: 41, // Changed to number
      title: 'Heart & Soul',
      artist: 'Deep Groove',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/soul-2.mp3',
      genre: 'Soul'
    },
    {
      id: 42, // Changed to number
      title: 'Midnight Soul',
      artist: 'Satin Strings',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/soul-3.mp3',
      genre: 'Soul'
    }
  ],
  'Funk': [
    {
      id: 43, // Changed to number
      title: 'Get Down Tonight',
      artist: 'Funky Bunch',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/funk-1.mp3',
      genre: 'Funk'
    },
    {
      id: 44, // Changed to number
      title: 'Bass Line Fever',
      artist: 'Groove Machine',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/funk-2.mp3',
      genre: 'Funk'
    },
    {
      id: 45, // Changed to number
      title: 'Funky Fresh',
      artist: 'The Groove Squad',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/funk-3.mp3',
      genre: 'Funk'
    }
  ],
  'Latin': [
    {
      id: 46, // Changed to number
      title: 'Salsa Caliente',
      artist: 'Los Ritmos',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/latin-1.mp3',
      genre: 'Latin'
    },
    {
      id: 47, // Changed to number
      title: 'Bachata Love',
      artist: 'Tropical Heat',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/latin-2.mp3',
      genre: 'Latin'
    },
    {
      id: 48, // Changed to number
      title: 'Cumbia Nights',
      artist: 'La Banda',
      artwork: '/assets/images/placeholder.jpg',
      previewUrl: '/assets/music/latin-3.mp3',
      genre: 'Latin'
    }
  ]
};

// Get songs for a specific genre
export const getSongsForGenre = (genre: string): Song[] => {
  return musicLibrary[genre] || [];
};

// Get all liked songs (from localStorage)
export const getLikedSongs = (): Song[] => {
  const likedSongIds = JSON.parse(localStorage.getItem('likedSongs') || '[]');
  const allSongs = Object.values(musicLibrary).flat();
  return allSongs.filter(song => likedSongIds.includes(song.id));
};

// Toggle like status for a song
export const toggleSongLike = (songId: number): boolean => { // Changed songId to number
  const likedSongs = JSON.parse(localStorage.getItem('likedSongs') || '[]');
  const index = likedSongs.indexOf(songId);
  
  if (index > -1) {
    likedSongs.splice(index, 1);
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
    return false;
  } else {
    likedSongs.push(songId);
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
    return true;
  }
};

// Check if a song is liked
export const isSongLiked = (songId: number): boolean => { // Changed songId to number
  const likedSongs = JSON.parse(localStorage.getItem('likedSongs') || '[]');
  return likedSongs.includes(songId);
};

// Like all songs in a genre/playlist
export const likeAllSongsInGenre = (genre: string): void => {
  const songs = getSongsForGenre(genre);
  const likedSongs = JSON.parse(localStorage.getItem('likedSongs') || '[]');
  const songIds = songs.map(song => song.id);
  
  // Add all song IDs that aren't already liked
  songIds.forEach(id => {
    if (!likedSongs.includes(id)) {
      likedSongs.push(id);
    }
  });
  
  localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
};

// Unlike all songs in a genre/playlist
export const unlikeAllSongsInGenre = (genre: string): void => {
  const songs = getSongsForGenre(genre);
  const likedSongs = JSON.parse(localStorage.getItem('likedSongs') || '[]');
  const songIds = songs.map(song => song.id);
  
  // Remove all song IDs from liked songs
  const updatedLikedSongs = likedSongs.filter((id: number) => !songIds.includes(id)); // Changed id to number
  
  localStorage.setItem('likedSongs', JSON.stringify(updatedLikedSongs));
};

// Format time in seconds to MM:SS
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};