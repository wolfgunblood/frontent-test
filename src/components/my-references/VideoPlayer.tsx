"use client";
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Button } from "../ui/button";
import {
  Play,
  Pause,
  ArrowLeftToLine,
  ArrowRightToLine,
  Rewind,
  FastForward,
  History,
} from "lucide-react";
import Timeline from "../Timeline";
import { useVideoStore } from "~/store/useStore";

const VideoPlayer: React.FC = () => {
  const playerRef = useRef<ReactPlayer | null>(null);
  const {
    playing,
    currentTime,
    duration,
    seeking,
    setPlaying,
    setCurrentTime,
    setDuration,
    setSeeking,
  } = useVideoStore();
  // const [playing, setPlaying] = useState<boolean>(false);

  // const [currentTime, setCurrentTime] = useState<number>(0);
  // const [duration, setDuration] = useState<number>(0);
  // const [seeking, setSeeking] = useState<boolean>(false); // State to handle if seeking is active

  const [markerZIndex, setMarkerZIndex] = useState(5);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleJumpStart = () => {
    playerRef.current?.seekTo(0);
    setPlaying(true);
  };

  const handleJumpEnd = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(playerRef.current.getDuration(), "seconds");
      setPlaying(false);
    }
  };

  const handleFastForward = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(
        playerRef.current.getCurrentTime() + 10,
        "seconds",
      );
      setPlaying(true);
    }
  };

  const handleRewind = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(
        Math.max(playerRef.current.getCurrentTime() - 10, 0),
        "seconds",
      );
      setPlaying(true);
    }
  };

  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      const currentDuration = player.getDuration();
      if (currentDuration) {
        setDuration(currentDuration);
      }
    }
  }, [playerRef.current]);

  const onProgress = (data: { playedSeconds: number }) => {
    if (!seeking) {
      setCurrentTime(data.playedSeconds);
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeeking(true);
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    setCurrentTime(newTime);
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false);
    const newTime = (parseFloat(e.currentTarget.value) / 100) * duration;
    playerRef.current?.seekTo(newTime, "seconds");
    setPlaying(true);
  };

  return (
    <div className="flex flex-col items-center gap-5 p-10">
      <ReactPlayer
        ref={playerRef}
        url="https://utfs.io/f/37835069-4b3e-48e8-97b5-da654c1de85b-m0d2yz.mp4"
        controls={true}
        playing={playing}
        onProgress={onProgress}
        progressInterval={500} // Update progress every 500 ms for smoother slider movement
      />
      <div className="flex w-full justify-between py-5">
        <Button
          variant="ghost"
          onClick={handleJumpStart}
          aria-label="Jump to Start"
        >
          <ArrowLeftToLine />
          Jump to start
        </Button>
        <div>
          <Button variant="ghost" onClick={handleRewind} aria-label="Rewind">
            <Rewind />
            Rewind 10s
          </Button>
          <Button
            variant="ghost"
            onClick={handlePlayPause}
            aria-label="Play/Pause"
          >
            {playing ? <Pause /> : <Play />}
          </Button>
          <Button
            variant="ghost"
            onClick={handleFastForward}
            aria-label="Fast Forward"
          >
            <FastForward />
            Fast Forward 10s
          </Button>
        </div>
        <Button
          variant="ghost"
          onClick={handleJumpEnd}
          aria-label="Jump to End"
        >
          <ArrowRightToLine />
          Jump to end
        </Button>
      </div>
      <Timeline
        currentTime={currentTime}
        duration={duration}
        markerZIndex={markerZIndex}
        onSeekChange={handleSeekChange}
        onSeekMouseDown={handleSeekMouseDown}
        onSeekMouseUp={handleSeekMouseUp}
      />
    </div>
  );
};

export default VideoPlayer;
