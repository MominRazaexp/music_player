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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-600/20 via-pink-600/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-600/20 via-purple-600/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
      </div>

      <audio
        ref={audioRef}
        src="/placeholder-audio.mp3"
        onLoadedData={() => setIsPlaying(true)}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        <header className="text-center mb-8 sm:mb-12">
          <div className="inline-block">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2 tracking-tight">
              SoundWave
            </h1>
            <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full"></div>
          </div>
          <p className="text-gray-300 mt-4 text-lg sm:text-xl font-light tracking-wide">Your Ultimate Music Experience</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Player */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-900/20">
              {/* Current Song Info */}
              <div className="flex flex-col xl:flex-row items-center gap-6 xl:gap-8 mb-8">
                <div className="relative group">
                  <img
                    src={currentSong.imageUrl}
                    alt={currentSong.alt}
                    className="w-48 h-48 sm:w-56 sm:h-56 xl:w-72 xl:h-72 rounded-3xl shadow-2xl object-cover transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
                  {isPlaying && (
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 animate-pulse"></div>
                  )}
                </div>
                <div className="text-center xl:text-left xl:flex-1">
                  <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold mb-3 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
                    {currentSong.title}
                  </h2>
                  <p className="text-xl sm:text-2xl text-purple-300 mb-2 font-medium">{currentSong.artist}</p>
                  <p className="text-lg text-gray-400 font-light">{currentSong.album}</p>
                  <div className="mt-4 flex items-center justify-center xl:justify-start gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-400 font-medium">Now Playing</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div
                  ref={progressRef}
                  className="group w-full h-3 bg-white/10 rounded-full cursor-pointer mb-3 relative overflow-hidden"
                  onClick={handleSeek}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-full"></div>
                  <div
                    className="h-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full transition-all duration-300 relative overflow-hidden"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                  </div>
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                       style={{ right: `${100 - (duration ? (currentTime / duration) * 100 : 0)}%` }}>
                  </div>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-purple-300">{formatTime(currentTime)}</span>
                  <span className="text-gray-400">{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 sm:gap-6 mb-8">
                <button
                  onClick={() => setIsShuffled(!isShuffled)}
                  className={`group p-3 sm:p-4 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
                    isShuffled 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25' 
                      : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10'
                  }`}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:rotate-12" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </button>

                <button
                  onClick={handlePrevious}
                  className="group p-3 sm:p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 rounded-2xl transition-all duration-300 transform hover:scale-110"
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:-translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                  </svg>
                </button>

                <button
                  onClick={togglePlay}
                  className={`group p-4 sm:p-6 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-3xl transition-all duration-300 transform hover:scale-110 shadow-xl shadow-purple-500/25 ${
                    isPlaying ? 'animate-pulse' : ''
                  }`}
                >
                  {isPlaying ? (
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 transition-all" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 transition-all group-hover:translate-x-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>

                <button
                  onClick={handleNext}
                  className="group p-3 sm:p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 rounded-2xl transition-all duration-300 transform hover:scale-110"
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                  </svg>
                </button>

                <button
                  onClick={toggleRepeat}
                  className={`group relative p-3 sm:p-4 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
                    repeatMode !== 'none' 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25' 
                      : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10'
                  }`}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:rotate-180" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  {repeatMode === 'one' && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full text-xs flex items-center justify-center font-bold">1</span>
                  )}
                </button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 10c0-1.518-.42-2.94-1.151-4.157a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-.757.929 1 1 0 01-1.415-1.414A3.984 3.984 0 0013 10a3.983 3.983 0 00-.172-.485 1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-400 font-medium hidden sm:block">Volume</span>
                </div>
                <div className="relative flex-1 group">
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-300 relative"
                      style={{ width: `${volume * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="absolute inset-0 w-full h-3 opacity-0 cursor-pointer"
                  />
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                       style={{ right: `${100 - (volume * 100)}%` }}>
                  </div>
                </div>
                <span className="text-sm text-gray-400 font-mono w-8 text-right">{Math.round(volume * 100)}</span>
              </div>
            </div>
          </div>

          {/* Playlist */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-purple-900/20 h-fit">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Playlist</h3>
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">{songs.length}</span>
                </div>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                {songs.map((song, index) => (
                  <div
                    key={song.id}
                    onClick={() => selectSong(index)}
                    className={`group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      index === currentSongIndex
                        ? 'bg-gradient-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/30 shadow-lg shadow-pink-500/10'
                        : 'bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={song.imageUrl}
                        alt={song.alt}
                        className="w-14 h-14 rounded-xl object-cover transition-all group-hover:shadow-lg"
                      />
                      {index === currentSongIndex && isPlaying && (
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-xl animate-pulse"></div>
                      )}
                      {index === currentSongIndex && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold truncate transition-colors ${
                        index === currentSongIndex ? 'text-white' : 'text-gray-200 group-hover:text-white'
                      }`}>
                        {song.title}
                      </p>
                      <p className={`text-sm truncate transition-colors ${
                        index === currentSongIndex ? 'text-purple-300' : 'text-gray-400 group-hover:text-purple-300'
                      }`}>
                        {song.artist}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-mono text-gray-400 bg-white/10 px-2 py-1 rounded-lg">
                        {song.duration}
                      </span>
                      {index === currentSongIndex && (
                        <div className="flex gap-1">
                          <div className="w-1 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                          <div className="w-1 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-1 h-4 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #ec4899, #8b5cf6);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #db2777, #7c3aed);
        }
      `}</style>
    </div>
  );
};

export default App;