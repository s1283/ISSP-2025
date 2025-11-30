import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Timeline from './Timeline';
import AudioPlayerContext from '../context/AudioPlayerContext';
import { BrowserRouter } from 'react-router-dom';

const mockAudioPlayerContext = {
  currentSong: {
    id: '1',
    title: 'Test Song',
    artist: 'Test Artist',
    albumArt: 'test.jpg',
    url: '',
    genre: ''
  },
  currentTime: 10,
  duration: 100,
  isPlaying: false,
  volume: 1,
  isMuted: false,
  isShuffle: false,
  isRepeat: false,
  playbackRate: 1,
  play: jest.fn(),
  pause: jest.fn(),
  togglePlay: jest.fn(),
  seekTo: jest.fn(),
  setVolume: jest.fn(),
  toggleMute: jest.fn(),
  playNext: jest.fn(),
  playPrevious: jest.fn(),
  toggleShuffle: jest.fn(),
  toggleRepeat: jest.fn(),
  setPlaybackRate: jest.fn(),
  playlist: [],
  currentSongIndex: 0,
  isLiked: false,
  toggleLike: jest.fn(),
  audioElement: null,
  currentPlaylistSource: null,
  playSong: jest.fn(),
  setPlaylist: jest.fn(),
};

const renderWithContext = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AudioPlayerContext.Provider value={mockAudioPlayerContext as any}>
        {component}
      </AudioPlayerContext.Provider>
    </BrowserRouter>
  );
};

describe('Timeline', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders timeline with no entries', () => {
    renderWithContext(<Timeline />);
    expect(screen.getByText('No timeline entries yet.')).toBeInTheDocument();
  });

  test('color-codes timeline entries based on emoji', () => {
    const entries = [
      { song: { id: '1', title: 'Happy Song', artist: 'Artist', audioUrl: '', albumArt: '' }, emoji: '😊', timestamp: new Date().toISOString(), songTimestamp: 10 },
      { song: { id: '2', title: 'Sad Song', artist: 'Artist', audioUrl: '', albumArt: '' }, emoji: '😢', timestamp: new Date().toISOString(), songTimestamp: 20 },
    ];
    localStorage.setItem('timeline', JSON.stringify(entries));

    renderWithContext(<Timeline />);

    const happyEntry = screen.getByText('Happy Song').closest('.timeline-entry');
    const sadEntry = screen.getByText('Sad Song').closest('.timeline-entry');

    expect(happyEntry).toHaveClass('happy');
    expect(sadEntry).toHaveClass('sad');
  });

  test('formats the timestamp correctly', () => {
    const entry = {
      song: { id: '1', title: 'Test Song', artist: 'Test Artist', audioUrl: '', albumArt: '' },
      emoji: '😊',
      timestamp: '2023-10-27T10:00:00.000Z',
      songTimestamp: 10,
    };
    localStorage.setItem('timeline', JSON.stringify([entry]));

    renderWithContext(<Timeline />);

    const date = new Date(entry.timestamp);
    const expectedTimestamp = date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      });
      
    expect(screen.getByText(expectedTimestamp)).toBeInTheDocument();
  });
});
