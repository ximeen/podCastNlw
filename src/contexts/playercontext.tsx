import { 
  createContext, 
  ReactNode, 
  useState, 
  useContext 
} from 'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

type PlayerContextData = {
  episodeList: Array<Episode>;
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLoopping: boolean;
  isShuflling: boolean;
  isMuted: boolean;
  play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  setPlayingState: (state: boolean) => void;
  setMutedState: (state: boolean) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShufle: () => void;
  playNext: () => void;
  playPrevious: () => void;
  clearPlayerState: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoopping, setIsLoopping] = useState(false);
  const [isShuflling, setIsShuflling] = useState(false);
  const [isMuted, setIsMuted] = useState(false)

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number){
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop() {
    setIsLoopping(!isLoopping);
  }

  function toggleShufle(){
    setIsShuflling(!isShuflling);
  }

  function setMutedState(state: boolean){
    setIsMuted(state);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  function clearPlayerState(){
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuflling || (currentEpisodeIndex + 1) < episodeList.length;

  function playNext (){
      if(isShuflling){
        const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
        setCurrentEpisodeIndex(nextRandomEpisodeIndex);
        }else if(hasNext){
          setCurrentEpisodeIndex(currentEpisodeIndex+1);
        }

  }

  function playPrevious(){
    if (hasPrevious){
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        playList,
        playNext,
        playPrevious,
        isPlaying,
        togglePlay,
        toggleShufle,
        setPlayingState,
        setMutedState,
        hasNext,
        hasPrevious,
        toggleLoop,
        isLoopping,
        clearPlayerState,
        isShuflling,
        isMuted,
      }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () =>{
  return useContext(PlayerContext);
}