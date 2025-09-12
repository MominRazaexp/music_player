import React, { useState, useRef, useEffect } from 'react';

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  imageUrl: string;
  alt: string;
}

const App: React.FC = () => {
  const [songs] = useState<Song[]>([
    {
      id: 1,
      title: `Midnight Dreams`,
      artist: `Luna Eclipse`,
      album: `Nocturnal Vibes`,
      duration: `3:45`,
      imageUrl: `https://picsum.photos/300/300?random=1`,
      alt: `Midnight Dreams album cover with dark blue tones`
    },
    {
      id: 2,
      title: `Electric Pulse`,
      artist: `Neon Nights`,
      album: `Digital Symphony`,
      duration: `4:12`,
      imageUrl: `https://picsum.photos/300/300?random=2`,
      alt: `Electric Pulse album cover with neon colors`
    },
    {
      id: 3,
      title: `Ocean Waves`,
      artist: `Serene Sounds`,
      album: `Nature's Call`,
      duration: `5:23`,
      imageUrl: `https://picsum.photos/300/300?random=3`,
      alt: `Ocean Waves album cover with blue ocean imagery`
    },
    {
      id: 4,
      title: `City Lights`,
      artist: `Urban Beat`,
      album: `Metropolitan`,
      duration: `3:58`,
      imageUrl: `https://picsum.photos/300/300?random=4`,
      alt: `City Lights album cover with urban skyline`
    },
    {
      id: 5,
      title: `Mountain High`,
      artist: `Alpine Echo`,
      album: `Peak Experience`,
      duration: `4:35`,
      imageUrl: `https://picsum.photos/300/300?random=5`,
      alt: `Mountain High album cover with mountain peaks`
    }
  ]);

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      const handleEnded = () => handleNext();

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [currentSongIndex]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (repeatMode === 'one') {
      audioRef.current?.play();
      return;
    }

    let nextIndex;
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * songs.length);
    } else {
      nextIndex = (currentSongIndex + 1) % songs.length;
    }

    if (nextIndex === 0 && repeatMode === 'none') {
      setIsPlaying(false);
      return;
    }

    setCurrentSongIndex(nextIndex);
    setCurrentTime(0);
  };

  const handlePrevious = () => {
    if (currentTime > 3) {
      audioRef.current!.currentTime = 0;
      setCurrentTime(0);
    } else {
      const prevIndex = currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
      setCurrentSongIndex(prevIndex);
      setCurrentTime(0);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleRepeat = () => {
    const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const selectSong = (index: number) => {
    setCurrentSongIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <audio
        ref={audioRef}
        src="/placeholder-audio.mp3"
        onLoadedData={() => setIsPlaying(true)}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            SoundWave
          </h1>
          <p className="text-gray-300 mt-2 text-lg">Your Ultimate Music Experience</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Player */}
          <div className="lg:col-span-2">
            <div className="bg-black bg-opacity-30 backdrop-blur-md rounded-3xl p-8 mb-6">
              {/* Current Song Info */}
              <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                <img
                  src={currentSong.imageUrl}
                  alt={currentSong.alt}
                  className="w-48 h-48 md:w-64 md:h-64 rounded-2xl shadow-2xl object-cover"
                />
                <div className="text-center md:text-left">
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">{currentSong.title}</h2>
                  <p className="text-xl text-gray-300 mb-1">{currentSong.artist}</p>
                  <p className="text-lg text-gray-400">{currentSong.album}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div
                  ref={progressRef}
                  className="w-full h-2 bg-gray-700 rounded-full cursor-pointer mb-2"
                  onClick={handleSeek}
                >
                  <div
                    className="h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  onClick={() => setIsShuffled(!isShuffled)}
                  className={`p-3 rounded-full transition-all ${
                    isShuffled ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </button>

                <button
                  onClick={handlePrevious}
                  className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-all"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                  </svg>
                </button>

                <button
                  onClick={togglePlay}
                  className="p-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 rounded-full transition-all transform hover:scale-105"
                >
                  {isPlaying ? (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>

                <button
                  onClick={handleNext}
                  className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-all"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                  </svg>
                </button>

                <button
                  onClick={toggleRepeat}
                  className={`p-3 rounded-full transition-all ${
                    repeatMode !== 'none' ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  {repeatMode === 'one' && <span className="text-xs ml-1">1</span>}
                </button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 10c0-1.518-.42-2.94-1.151-4.157a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-.757.929 1 1 0 01-1.415-1.414A3.984 3.984 0 0013 10a3.983 3.983 0 00-.172-.485 1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #ec4899 0%, #8b5cf6 ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Playlist */}
          <div className="lg:col-span-1">
            <div className="bg-black bg-opacity-30 backdrop-blur-md rounded-3xl p-6">
              <h3 className="text-2xl font-bold mb-6 text-center">Playlist</h3>
              <div className="space-y-3">
                {songs.map((song, index) => (
                  <div
                    key={song.id}
                    onClick={() => selectSong(index)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      index === currentSongIndex
                        ? 'bg-gradient-to-r from-pink-600 to-purple-600'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    <img
                      src={song.imageUrl}
                      alt={song.alt}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{song.title}</p>
                      <p className="text-sm text-gray-300 truncate">{song.artist}</p>
                    </div>
                    <span className="text-sm text-gray-400">{song.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;