import React, { useState, useEffect } from 'react';
import Video, { VideoRef } from 'react-native-video';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import ProgressBar from './ProgressBar';
import PlayerControls from './PlayerControls';
import { FullscreenClose, FullscreenOpen } from '../../assets/icons';
import Orientation from 'react-native-orientation-locker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const windowHeight = Dimensions.get('window').width * (9 / 16);
const windowWidth = Dimensions.get('window').width*0.9;

const height = Dimensions.get('window').width;
const width = Dimensions.get('window').height;

const VideoPlayer = (video_url) => {
  const videoRef = React.createRef();

  useEffect(() => {
    Orientation.addOrientationListener(handleOrientation);
    return () => {
      Orientation.removeOrientationListener(handleOrientation);
    };
  }, []);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [play, setPlay] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControl, setShowControl] = useState(true);

  const handleOrientation = orientation => {
    if (orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT') {
      setFullscreen(true);
      StatusBar.setHidden(true);
    } else {
      setFullscreen(false);
      StatusBar.setHidden(false);
    }
  };

  const handlePlayPause = () => {
    if (play) {
      setPlay(false);
      setShowControl(true);
      return;
    }
    setTimeout(() => setShowControl(false), 2000);
    setPlay(true);
  };

  const handlePlay = () => {
    setTimeout(() => setShowControl(false), 500);
    setPlay(true);
  };

  const skipBackward = () => {
    videoRef.current.seek(currentTime - 15);
    setCurrentTime(currentTime - 15);
  };

  const skipForward = () => {
    videoRef.current.seek(currentTime + 15);
    setCurrentTime(currentTime + 15);
  };

  const handleControls = () => {
    if (showControl) {
      setShowControl(false);
    } else {
      setShowControl(true);
    }
  };

  const handleFullscreen = () => {
    if (fullscreen) {
      Orientation.unlockAllOrientations();
    } else {
      Orientation.lockToLandscapeLeft();
    }
  };

  const onLoadEnd = data => {
    setDuration(data.duration);
    setCurrentTime(data.currentTime);
  };

  const onProgress = data => {
    setCurrentTime(data.currentTime);
  };

  const onSeek = data => {
    videoRef.current.seek(data.seekTime);
    setCurrentTime(data.seekTime);
  };

  const onEnd = () => {
    setPlay(false);
    videoRef.current.seek(0);
  };


  const uriString = String(video_url);


  // Check if uriString is a valid string
  if (!uriString || typeof uriString !== 'string') {
    return null; // or return a placeholder, show an error, etc.
  }

  return (
    <TouchableOpacity onPress={handleControls}>
      <View style={fullscreen ? styles.fullscreenContainer : styles.container}>


        <Video
          ref={videoRef}
          source={{
            uri:video_url.video_url
          }}
          style={fullscreen ? styles.fullscreenVideo : styles.video}
          controls={false}
          resizeMode={'contain'}
          onLoad={onLoadEnd}
          onProgress={onProgress}
          onEnd={onEnd}
          paused={!play}
          muted={false}
          onError={(error) => console.error('Video error:', error)}
        />

        {showControl && (
          <View style={styles.controlOverlay}>
            <TouchableOpacity
              onPress={handleFullscreen}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.fullscreenButton}>
              {fullscreen ? <Icon
                name="fullscreen-exit"
                size={35}
                color="white"
              /> : <Icon
                name="fullscreen"
                size={35}
                color="white"
              />}
            </TouchableOpacity>

            <PlayerControls
              onPlay={handlePlay}
              onPause={handlePlayPause}
              playing={play}
              skipBackwards={skipBackward}
              skipForwards={skipForward}
            />

            <ProgressBar
              currentTime={currentTime}
              duration={duration > 0 ? duration : 0}
              onSlideStart={handlePlayPause}
              onSlideComplete={handlePlayPause}
              onSlideCapture={onSeek}
            />
          </View>
        )}


      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ebebeb',
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#ebebeb',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
  },
  video: {
    height: windowHeight,
    width: windowWidth,
    backgroundColor: 'black',
  },
  fullscreenVideo: {
    flex: 1,
    height: height,
    width: width,
    backgroundColor: 'black',
  },
  text: {
    marginTop: 30,
    marginHorizontal: 20,
    fontSize: 15,
    textAlign: 'justify',
  },
  fullscreenButton: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    paddingRight: 10,
  },
  controlOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000c4',
    justifyContent: 'space-between',
  },
});

export default VideoPlayer;