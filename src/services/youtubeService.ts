import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import axios from 'axios';

export type YouTubeVideo = {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  youtubeUrl: string;
  durationMinutes?: number;
};

type ApiVideo = {
  videoId: string;
  title: string;
  thumbnails?: { url: string }[];
  author?: { title: string };
  lengthSeconds?: number;
};

const MIN_SECONDS = 120;

const FOCUS_QUERIES: { [key: string]: string } = {
  chest: 'chest workout at home',
  back: 'back workout at home',
  legs: 'leg day workout',
  cardio: 'fat burning cardio workout',
};

const GOAL_QUERIES: { [key: string]: string } = {
  weight_loss: 'weight loss fat burn workout',
  muscle_gain: 'muscle building workout',
  endurance: 'cardio endurance workout',
};

const GENDER_WORDS: { [key: string]: string } = { male: 'men', female: 'women' };

export const youtubeService = {
  async getVideos(
    goal: string,
    level: string,
    focus: string,
    gender: string,
    refresh: boolean,
  ) {
    const key = `videos:${goal}:${level}:${focus}:${gender}`;

    if (!refresh) {
      const saved = await AsyncStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved) as YouTubeVideo[];
      }
    }

    const query = [level, GENDER_WORDS[gender], FOCUS_QUERIES[focus] || GOAL_QUERIES[goal]]
      .filter(Boolean)
      .join(' ');

    try {
      const response = await axios.get(`https://${Config.RAPID_API_HOST}/search`, {
        params: { q: query, hl: 'en', gl: 'US' },
        headers: {
          'x-rapidapi-key': Config.RAPID_API_KEY,
          'x-rapidapi-host': Config.RAPID_API_HOST,
        },
        timeout: 10000,
      });

      const videos: YouTubeVideo[] = (response.data.contents || [])
        .map((item: { video?: ApiVideo }) => item.video)
        .filter(
          (video?: ApiVideo) =>
            video?.videoId &&
            (!video.lengthSeconds || video.lengthSeconds >= MIN_SECONDS),
        )
        .slice(0, 5)
        .map((video: ApiVideo) => ({
          id: video.videoId,
          title: video.title,
          thumbnail: video.thumbnails?.[0]?.url,
          channelTitle: video.author?.title,
          youtubeUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
          durationMinutes: video.lengthSeconds
            ? Math.round(video.lengthSeconds / 60)
            : undefined,
        }));

      if (videos.length > 0) {
        await AsyncStorage.setItem(key, JSON.stringify(videos));
      }
      return videos;
    } catch {
      throw new Error('Could not load videos. Check internet and RapidAPI key.');
    }
  },
};