import { useEffect, useRef, useState } from 'react';
import { PlayerContext, usePlayer } from '../../contexts/playercontext';
import styles from './styles.module.scss';
import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { convertDurationTimeString } from '../../Utils/convertDurationTimeString';

export function Player() {

  const  [volume, setVolume] = useState(.5);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLoopping,
    isShuflling,
    isMuted,
    setPlayingState,
    setMutedState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    toggleLoop,
    toggleShufle,
    clearPlayerState,
    togglePlay } = usePlayer();
    
  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying])

  function setupProgressListener(){
    audioRef.current.currentTime = 0;
    
    audioRef.current.addEventListener('timeupdate', event =>{
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  function handleSeek(amount:number){
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handleEpisodeHanded(){
    if (hasNext){
      playNext()
    }else{
      clearPlayerState()
    }
  }

  function handleVolume(amount: number) {
    amount = amount / 100
    console.log(amount)
    audioRef.current.volume = amount
    setVolume(amount)
  }

  function handleMuted(){
    setMutedState(true)
    audioRef.current.volume = 0
  }

  function handleDismuted(){
    setMutedState(false)
    audioRef.current.volume = volume;
  }

  const episode = episodeList[currentEpisodeIndex]

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Podcast sendo executado" />
        <strong>Tocando agora </strong>
      </header>

      {episode ? (

        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong> {episode.title} </strong>
          <span> {episode.members} </span>
        </div>

      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione para ouvir</strong>
        </div>)}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
        <span>{convertDurationTimeString(progress)}</span>
          {episode ? (
            <Slider
              max = {episode.duration}
              value = {progress}
              onChange = {handleSeek}
              trackStyle={{ backgroundColor: '#04d361' }}
              railStyle={{ backgroundColor: '#9f75ff' }}
              handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
            />
          ) : (
            <div className={styles.slider}>
              <div className={styles.emptySlider} />
            </div>
          )}
          <span>{convertDurationTimeString(episode?.duration ?? 0)}</span>
        </div>

        { episode && (
          <audio
          src={episode.url}
          ref = {audioRef}
          autoPlay
          onEnded={handleEpisodeHanded}
          loop = {isLoopping}
          onPlay = {() => setPlayingState(true)}
          onPause = {() => setPlayingState(false)}
          onLoadedMetadata = {setupProgressListener}
          />
        )}
  
        <div className={styles.buttons}>
          <button 
          type="button" 
          disabled={!episode || episodeList.length == 1}
          onClick = {toggleShufle}
          className = {isShuflling ? styles.isActive : ''}>
            <img src="/shuffle.svg" alt="aleatório" />
          </button>
          <button 
          type="button" 
          onClick={playPrevious} 
          disabled={!episode || !hasPrevious}>
            <img src="/play-previous.svg" alt="tocar anterior" />
          </button>
          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >

            {isPlaying ?
              <img src="/pause.svg" alt="Tocar" />
              :
              <img src="/play.svg" alt="Tocar" />
            }
          </button>
          <button type="button" onClick={playNext} disabled={!episode || !hasNext} >
            <img src="/play-next.svg" alt="tocar próxima" />
          </button>
          <button 
          type="button" 
          disabled={!episode}
          onClick = {toggleLoop}
          className = {isLoopping ? styles.isActive : ''}>
            <img src="/repeat.svg" alt="repetir" />
          </button>
        </div>
        
        <div className={styles.volumeControler}>
          { isMuted
            ? <button 
                type="button" 
                disabled={!episode}
                onClick={handleDismuted}
              >
                <img src="/volume_off.svg" alt="Diminuir Volume"/>
              </button>
            : <button 
                type="button" 
                disabled={!episode}
                onClick={handleMuted}
              >
                <img src="/volume_up.svg" alt="Aumentar Volume"/>
              </button>
          }
          <Slider 
            min={0}
            max={100}
            value={volume * 100}
            onChange={handleVolume}
            trackStyle={{ backgroundColor: '#32CD32' }}
            railStyle={{backgroundColor: 'rgba(145,100,250,0.8)'}}
            handleStyle={{ borderColor: '#32CD32', borderWidth: 4 }}
          />
        </div>
      </footer>
    </div>
  );
}