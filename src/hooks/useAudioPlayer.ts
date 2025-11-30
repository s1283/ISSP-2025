import { useState, useRef, useEffect } from 'react';
import { Song } from '../data/musicLibrary';

interface UseAudioPlayerReturn {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isShuffle: boolean;
  isRepeat: boolean;
  playbackRate: number;
  audioElement: HTMLAudioElement | null;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setPlaybackRate: (rate: number) => void;
  toggleMute: () => void;
  setPlaylist: (songs: Song[]) => void;
}

export const useAudioPlayer = (): UseAudioPlayerReturn => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(0.7);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    const audio = audioRef.current;

    // Event listeners
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };

    const handleError = (e: ErrorEvent) => {
      console.error('Audio playback error:', e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError as any);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError as any);
      audio.pause();
    };
  }, [isRepeat]);

  // Play a specific song
  const playSong = (song: Song) => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    audio.src = song.previewUrl;
    audio.load();
    
    setCurrentSong(song);
    
    audio.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((error) => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error('Error playing audio:', error);
        });
    }
  };

  // Play next song
  const playNext = () => {
    if (playlist.length === 0) return;

    let nextIndex: number;
    
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = (currentIndex + 1) % playlist.length;
    }

    setCurrentIndex(nextIndex);
    playSong(playlist[nextIndex]);
  };

  // Play previous song
  const playPrevious = () => {
    if (playlist.length === 0) return;

    // If more than 3 seconds into the song, restart it
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    playSong(playlist[prevIndex]);
  };

  // Seek to a specific time
  const seekTo = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // Set volume
  const setVolume = (newVolume: number) => {
    if (!audioRef.current) return;
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    audioRef.current.volume = clampedVolume;
    setVolumeState(clampedVolume);
  };

  // Toggle shuffle
  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  // Toggle repeat
  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  // Set playback rate
  const setPlaybackRate = (rate: number) => {
    if (!audioRef.current) return;
    const clampedRate = Math.max(0.25, Math.min(2.0, rate));
    audioRef.current.playbackRate = clampedRate;
    setPlaybackRateState(clampedRate);
  };

  // Toggle mute
  const toggleMute = () => {
    if (!audioRef.current) return;
    
    if (isMuted) {
      // Unmute - restore previous volume
      audioRef.current.volume = previousVolume;
      setVolumeState(previousVolume);
      setIsMuted(false);
    } else {
      // Mute - save current volume and set to 0
      setPreviousVolume(volume);
      audioRef.current.volume = 0;
      setVolumeState(0);
      setIsMuted(true);
    }
  };

  // Set playlist
  const setPlaylistHandler = (songs: Song[]) => {
    setPlaylist(songs);
    if (songs.length > 0 && !currentSong) {
      setCurrentIndex(0);
      setCurrentSong(songs[0]);
    }
  };

  return {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isShuffle,
    isRepeat,
    playbackRate,
    audioElement: audioRef.current,
    playSong,
    togglePlay,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    setPlaybackRate,
    toggleMute,
    setPlaylist: setPlaylistHandler,
  };
};