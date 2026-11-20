import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  AppState,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCopilot } from 'react-native-copilot';
import { useTranslation } from 'react-i18next';
import { showMessage } from 'react-native-flash-message';
import { useNetInfo } from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';
import Clipboard from '@react-native-clipboard/clipboard';
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { fitnessStore } from '../../store/FitnessStore';
import { userStore } from '../../store/UserStore';
import { notificationService } from '../../services/notificationService';
import { youtubeService, YouTubeVideo } from '../../services/youtubeService';
import { GradientBackground, GradientText } from '../../components/Gradient';
import PlayIcon from '../../assets/icons/play.svg';
import CloseIcon from '../../assets/icons/close.svg';
import PlusIcon from '../../assets/icons/plus.svg';
import CopyIcon from '../../assets/icons/copy.svg';
import { colors } from '../../theme';
import {
  getDistanceKm,
  formatClock,
  formatDateISO,
  formatDuration,
  getGreeting,
} from '../../utils/helpers';
import { ACTIVITIES } from '../../utils/activities';
import { StartCard } from './components/StartCard';
import { Filters } from './components/Filters';
import { VideoCard } from './components/VideoCard';
import { ActivitySheet } from './components/ActivitySheet';
import { VideoSheet } from './components/VideoSheet';
import { SessionModal } from './components/SessionModal';
import { WatchModal } from './components/WatchModal';
import { styles } from './styles';

export default observer(function WorkoutsScreen() {
  const { t } = useTranslation();
  const { start, copilotEvents } = useCopilot();
  const netInfo = useNetInfo();
  const isOnline =
    netInfo.isConnected !== false && netInfo.isInternetReachable !== false;
  const prefs = fitnessStore.preferences;
  const username =
    userStore.userProfile?.username || t('greeting.usernameDefault');

  const videoSheetRef = useRef<BottomSheetModal>(null);
  const activitySheetRef = useRef<BottomSheetModal>(null);

  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [focus, setFocus] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [watchUrl, setWatchUrl] = useState('');

  const [activity, setActivity] = useState(ACTIVITIES[0]);
  const [status, setStatus] = useState('idle');
  const [seconds, setSeconds] = useState(0);
  const [pauseLeft, setPauseLeft] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);
  const isPaused = status === 'paused';

  const startRef = useRef(start);
  startRef.current = start;
  const statusRef = useRef(status);
  statusRef.current = status;
  const watchIdRef = useRef<number | null>(null);
  const lastPointRef = useRef<{ latitude: number; longitude: number } | null>(
    null,
  );

  const loadVideos = async (force = false) => {
    if (!prefs) {
      return;
    }
    if (!isOnline) {
      return showMessage({
        message: t('workouts.noConnection'),
        description: t('workouts.connectToLoad'),
        type: 'warning',
      });
    }

    setLoading(true);
    try {
      setVideos(
        await youtubeService.getVideos(
          prefs.goal,
          prefs.level,
          focus,
          prefs.gender,
          force,
        ),
      );
    } catch (error: any) {
      showMessage({
        message: t('common.error'),
        description: error.message,
        type: 'danger',
      });
    }
    setLoading(false);
  };

  const stopGps = () => {
    if (watchIdRef.current !== null) {
      Geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  const startGps = async () => {
    const permission = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    if (permission !== RESULTS.GRANTED) {
      return Alert.alert(
        t('workouts.locationDenied'),
        t('workouts.locationDeniedText'),
      );
    }

    watchIdRef.current = Geolocation.watchPosition(
      position => {
        if (statusRef.current !== 'running') {
          return;
        }
        const { latitude, longitude } = position.coords;
        const last = lastPointRef.current;
        if (!last) {
          lastPointRef.current = { latitude, longitude };
          return;
        }
        const km = getDistanceKm(
          last.latitude,
          last.longitude,
          latitude,
          longitude,
        );
        if (km > 0.005) {
          setDistanceKm(prev => prev + km);
          lastPointRef.current = { latitude, longitude };
        }
      },
      undefined,
      { enableHighAccuracy: true, distanceFilter: 10, interval: 5000 },
    );
  };

  useEffect(() => {
    const tourKey = `tour_done_${userStore.userProfile?.email}`;
    let timer: ReturnType<typeof setTimeout> | undefined;

    AsyncStorage.getItem(tourKey).then(done => {
      if (!done) {
        timer = setTimeout(() => startRef.current(), 1200);
      }
    });

    const onStop = () => AsyncStorage.setItem(tourKey, '1');
    copilotEvents.on('stop', onStop);

    return () => {
      clearTimeout(timer);
      copilotEvents.off('stop', onStop);
    };
  }, []);

  useEffect(() => {
    loadVideos();
  }, [prefs?.goal, prefs?.level, prefs?.gender, focus, isOnline]);

  useEffect(() => {
    if (status === 'idle') {
      return;
    }
    const id = setInterval(() => {
      if (status === 'running') {
        setSeconds(prev => prev + 1);
      } else {
        setPauseLeft(prev => prev - 1);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    if (status === 'paused' && pauseLeft <= 0) {
      setStatus('running');
    }
  }, [status, pauseLeft]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'background' && statusRef.current !== 'idle') {
        notificationService.show(
          t('notify.runningTitle'),
          t('notify.runningText'),
        );
      }
    });

    return () => {
      subscription.remove();
      stopGps();
      if (statusRef.current !== 'idle') {
        notificationService.show(
          t('notify.stoppedTitle'),
          t('notify.stoppedText'),
        );
      }
    };
  }, []);

  const startWorkout = async () => {
    setSeconds(0);
    setDistanceKm(0);
    lastPointRef.current = null;
    if (activity.requiresGps) {
      await startGps();
    }
    setStatus('running');
  };

  const handleStart = async () => {
    if (!activity.requiresGps) {
      return startWorkout();
    }

    const power = await DeviceInfo.getPowerState();
    const battery = power.batteryLevel ?? 1;
    const isLow = battery >= 0 && battery < 0.15;

    if (isLow || power.lowPowerMode) {
      return Alert.alert(
        isLow
          ? t('workouts.lowBattery', { percent: Math.round(battery * 100) })
          : t('workouts.powerSave'),
        isLow ? t('workouts.lowBatteryText') : t('workouts.powerSaveText'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('workouts.startAnyway'), onPress: startWorkout },
        ],
      );
    }
    startWorkout();
  };

  const handlePause = (pauseSeconds: number) => {
    setPauseLeft(pauseSeconds);
    lastPointRef.current = null;
    setStatus('paused');
  };

  const closeSession = () => {
    stopGps();
    setStatus('idle');
  };

  const handleCancel = () => {
    Alert.alert(t('workouts.cancelTitle'), t('workouts.cancelText'), [
      { text: t('workouts.keepGoing'), style: 'cancel' },
      {
        text: t('workouts.discard'),
        style: 'destructive',
        onPress: closeSession,
      },
    ]);
  };

  const handleFinish = async () => {
    closeSession();
    if (seconds < 1) {
      return;
    }

    const now = new Date();
    const duration = formatDuration(seconds);
    await fitnessStore.addHistoryItem({
      date: formatDateISO(now),
      time: formatClock(now),
      title: activity.label,
      duration,
      distance: activity.requiresGps
        ? `${distanceKm.toFixed(2)} ${t('common.km')}`
        : undefined,
    });
    showMessage({
      message: t('workouts.completed'),
      description: t('workouts.completedText'),
      type: 'success',
    });
    notificationService.show(
      t('notify.finishedTitle'),
      t('notify.finishedText', {
        activity: t(`activities.${activity.label}`),
        duration,
      }),
    );
  };

  const openVideo = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    videoSheetRef.current?.present();
  };

  const handleWatch = () => {
    if (isOnline) {
      setWatchUrl(selectedVideo!.youtubeUrl);
    } else {
      showMessage({ message: t('workouts.noConnection'), type: 'warning' });
    }
  };

  const handleCopy = () => {
    Clipboard.setString(selectedVideo!.youtubeUrl);
    showMessage({ message: t('workouts.copied'), type: 'success' });
  };

  const handleSaveVideo = async () => {
    const now = new Date();
    await fitnessStore.addHistoryItem({
      date: formatDateISO(now),
      time: formatClock(now),
      title: selectedVideo!.title,
      duration: selectedVideo!.durationMinutes
        ? `${selectedVideo!.durationMinutes} ${t('common.min')}`
        : '-',
      notes: `YouTube: ${selectedVideo!.channelTitle}`,
    });
    videoSheetRef.current?.dismiss();
    showMessage({
      message: t('common.saved'),
      description: t('workouts.addedToHistory'),
      type: 'success',
    });
  };

  const videoActions = [
    { label: t('workouts.watch'), Icon: PlayIcon, onPress: handleWatch },
    {
      label: t('workouts.completeSave'),
      Icon: PlusIcon,
      onPress: handleSaveVideo,
    },
    { label: t('workouts.copyLink'), Icon: CopyIcon, onPress: handleCopy },
    {
      label: t('common.close'),
      Icon: CloseIcon,
      onPress: () => videoSheetRef.current?.dismiss(),
    },
  ];

  const header = (
    <View>
      <Text style={styles.greetingSmall}>{getGreeting()},</Text>
      <GradientText style={styles.greetingName}>{username}</GradientText>

      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>{t('workouts.offlineBanner')}</Text>
        </View>
      )}

      <StartCard
        activity={activity}
        onPickActivity={() => activitySheetRef.current?.present()}
        onStart={handleStart}
      />

      <Filters focus={focus} onChange={setFocus} />
    </View>
  );

  return (
    <GradientBackground menu tour>
      <FlatList
        data={videos}
        keyExtractor={item => item.id}
        ListHeaderComponent={header}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            enabled={isOnline}
            refreshing={loading}
            onRefresh={() => loadVideos(true)}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          loading ? undefined : (
            <Text style={styles.emptyText}>{t('workouts.none')}</Text>
          )
        }
        renderItem={({ item, index }) => (
          <VideoCard
            video={item}
            index={index}
            onPress={() => openVideo(item)}
          />
        )}
      />

      <ActivitySheet
        sheetRef={activitySheetRef}
        activity={activity}
        onSelect={item => {
          setActivity(item);
          activitySheetRef.current?.dismiss();
        }}
      />

      <VideoSheet
        sheetRef={videoSheetRef}
        video={selectedVideo}
        actions={videoActions}
      />

      <SessionModal
        visible={status !== 'idle'}
        activity={activity}
        isPaused={isPaused}
        seconds={seconds}
        pauseLeft={pauseLeft}
        distanceKm={distanceKm}
        onCancel={handleCancel}
        onPause={handlePause}
        onResume={() => setStatus('running')}
        onFinish={handleFinish}
      />

      <WatchModal
        url={watchUrl}
        title={selectedVideo?.title}
        onClose={() => setWatchUrl('')}
      />
    </GradientBackground>
  );
});
