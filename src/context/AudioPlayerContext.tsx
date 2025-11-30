import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Song } from '../data/musicLibrary';

export interface AudioPlayerContextValue {
  currentSong: Song | null;
  currentPlaylist: Song[];
  isPlaying: boolean;
  playerTime: number;
  playerDuration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
  playbackRate: number;
  audioRef: HTMLAudioElement | null;
  currentPlaylistSource: string | null;
  playSong: (song: Song, playlist?: Song[], source?: string) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setPlaybackRate: (rate: number) => void;
  toggleMute: () => void;
  setPlaylist: (songs: Song[], source?: string) => void;
  // New properties for AudioContext and AnalyserNode
  audioCtx: AudioContext | null; // Renamed from audioContext to audioCtx to match usage
  analyser: AnalyserNode | null; // Renamed from analyserNode to analyser to match usage
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

export const useAudioPlayerContext = (): AudioPlayerContextValue => {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error('useAudioPlayerContext must be used within AudioPlayerProvider');
  return ctx;
};

export const AudioPlayerProvider: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<Song[]>([]);
  const [currentPlaylistSource, setCurrentPlaylistSource] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerTime, setPlayerTime] = useState(0);
  const [playerDuration, setPlayerDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(0.7);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1.0);

  // New states for AudioContext and AnalyserNode
  const [audioCtx, setAudioContext] = useState<AudioContext | null>(null); // Renamed to audioCtx
  const [analyser, setAnalyserNode] = useState<AnalyserNode | null>(null); // Renamed to analyser

  // Initialize audio element and set up event listeners
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = "anonymous"; // Essential for audio analysis
      audioRef.current.playbackRate = playbackRate;
    }
    const audio = audioRef.current;

    // Initialize AudioContext and AnalyserNode
    let currentAudioContext: AudioContext;
    let currentAnalyserNode: AnalyserNode;

    try {
      currentAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(currentAudioContext);
      currentAnalyserNode = currentAudioContext.createAnalyser();
      setAnalyserNode(currentAnalyserNode);

      const source = currentAudioContext.createMediaElementSource(audio);
      source.connect(currentAnalyserNode);
      currentAnalyserNode.connect(currentAudioContext.destination);
    } catch (e) {
      console.error("Web Audio API not supported or error creating context:", e);
      // Fallback or disable visualizer if Web Audio API not supported
    }

    const handleTimeUpdate = () => setPlayerTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      setPlayerDuration(audio.duration || 0);
      setPlayerTime(audio.currentTime);
    };
    const handleError = (e: Event) => {
      console.error('Audio playback error:', e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);


    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
      audio.pause();
      if (currentAudioContext && currentAudioContext.state !== 'closed') {
        currentAudioContext.close(); // Close AudioContext on unmount
      }
    };
  }, [ playbackRate ]); // Run only once on mount to initialize audio element and context

  // Effect to synchronize audio element volume with state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Effect to synchronize audio element playback rate with state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);


  const playSong = useCallback((songToPlay: Song, playlistOverride?: Song[], sourceOverride?: string) => {
    if (!audioRef.current || !audioCtx) return;

    const audio = audioRef.current;

    // Update playlist if override is provided
    if (playlistOverride) {
      setCurrentPlaylist(playlistOverride);
      setCurrentPlaylistSource(sourceOverride || null);
      const newIndex = playlistOverride.findIndex(s => s.id === songToPlay.id);
      setCurrentIndex(newIndex !== -1 ? newIndex : 0);
    } else {
      // If no override, try to find song in current playlist
      const newIndex = currentPlaylist.findIndex(s => s.id === songToPlay.id);
      setCurrentIndex(newIndex !== -1 ? newIndex : 0);
    }

    // Always set currentSong, src, load, and attempt to play
    setCurrentSong(songToPlay);
    audio.src = songToPlay.previewUrl;
    audio.load(); // Explicitly load the new source

    // Resume AudioContext on user gesture
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().then(() => {
        console.log("AudioContext resumed!");
      }).catch(e => console.error("Error resuming AudioContext:", e));
    }

    audio.play()
      .then(() => setIsPlaying(true))
      .catch(e => {
        console.error("Error playing audio:", e);
        setIsPlaying(false);
        // Handle autoplay policy restrictions:
        // You might want to show a UI element prompting the user to click play
        // if the error indicates an autoplay block.
      });
  }, [currentPlaylist, audioCtx]); // currentSong removed from dependency array


  const playNext = useCallback(() => {
    if (currentPlaylist.length === 0) return;
    let nextIdx = currentIndex;

    if (isShuffle) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * currentPlaylist.length);
      } while (currentPlaylist.length > 1 && randomIndex === currentIndex);
      nextIdx = randomIndex;
    } else {
      nextIdx = (currentIndex + 1) % currentPlaylist.length;
    }

    setCurrentIndex(nextIdx);
    playSong(currentPlaylist[nextIdx], currentPlaylist); // Pass currentPlaylist to playSong
  }, [currentIndex, currentPlaylist, isShuffle, playSong]);

  const playPrevious = useCallback(() => {
    if (currentPlaylist.length === 0) return;
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      audio.play().catch(e => console.error("Error replaying song:", e));
      return;
    }

    let prevIdx = currentIndex;
    if (isShuffle) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * currentPlaylist.length);
      } while (currentPlaylist.length > 1 && randomIndex === currentIndex);
      prevIdx = randomIndex;
    } else {
      prevIdx = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    }

    setCurrentIndex(prevIdx);
    playSong(currentPlaylist[prevIdx], currentPlaylist); // Pass currentPlaylist to playSong
  }, [currentIndex, currentPlaylist, isShuffle, playSong]);


  // Effect for handling song ending
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(() => undefined);
      } else {
        playNext();
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isRepeat, currentPlaylist, currentIndex, isShuffle, playNext]);


  const setPlaylist = useCallback((songs: Song[], source?: string) => {
    const isCurrentlyPlaying = audioRef.current && !audioRef.current.paused;

    setCurrentPlaylist(songs);
    if (source) {
      setCurrentPlaylistSource(source);
    }

    // Only set the first song if nothing is currently playing.
    if (!isCurrentlyPlaying) {
      if (songs.length > 0) {
        setCurrentIndex(0);
        setCurrentSong(songs[0]);
        if (audioRef.current) {
          audioRef.current.src = songs[0].previewUrl;
          audioRef.current.load();
          setIsPlaying(false);
        }
      } else {
        setCurrentIndex(-1);
        setCurrentSong(null);
        if (audioRef.current) {
          audioRef.current.src = '';
          audioRef.current.load();
          setIsPlaying(false);
        }
      }
    }
  }, []);


  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentSong || !audioCtx) return;

    // Resume AudioContext on user gesture
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().then(() => {
        console.log("AudioContext resumed!");
        if (isPlaying) {
          audioRef.current?.pause();
          setIsPlaying(false);
        } else {
          audioRef.current?.play()
            .then(() => setIsPlaying(true))
            .catch(e => {
              console.error("Error playing audio after context resume:", e);
              setIsPlaying(false);
            });
        }
      }).catch(e => console.error("Error resuming AudioContext:", e));
    } else {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(e => {
            console.error("Error playing audio:", e);
            setIsPlaying(false);
          });
      }
    }
  }, [isPlaying, currentSong, audioCtx]); // Added audioCtx to dependency array


  const seekTo = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setPlayerTime(time);
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    if (!audioRef.current) return;
    const clamped = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clamped); // This will trigger the useEffect for volume
    if (clamped > 0 && isMuted) {
      setIsMuted(false); // This will trigger the useEffect for volume
    }
  }, [isMuted]);

  const toggleShuffle = useCallback(() => setIsShuffle((s) => !s), []);
  const toggleRepeat = useCallback(() => setIsRepeat((r) => !r), []);

  const setPlaybackRate = useCallback((rate: number) => {
    if (!audioRef.current) return;
    const clamped = Math.max(0.25, Math.min(2.0, rate));
    setPlaybackRateState(clamped); // This will trigger the useEffect for playbackRate
  }, []);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    if (isMuted) {
      setVolumeState(previousVolume); // This will trigger the useEffect for volume
      setIsMuted(false); // This will trigger the useEffect for volume
    } else {
      setPreviousVolume(volume);
      setVolumeState(0); // This will trigger the useEffect for volume
      setIsMuted(true); // This will trigger the useEffect for volume
    }
  }, [isMuted, previousVolume, volume]);

  const value: AudioPlayerContextValue = {
    currentSong,
    currentPlaylist,
    isPlaying,
    playerTime,
    playerDuration,
    volume,
    isMuted,
    isShuffle,
    isRepeat,
    playbackRate,
    audioRef: audioRef.current,
    currentPlaylistSource,
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
    setPlaylist,
    audioCtx, // Expose AudioContext
    analyser, // Expose AnalyserNode
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export default AudioPlayerContext;