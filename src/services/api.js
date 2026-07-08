import axios from 'axios';
import { VIDEOS, CHANNELS, COMMENTS } from './mockData';

const RAPIDAPI_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const IS_API_ACTIVE = !!(RAPIDAPI_KEY || GOOGLE_API_KEY);

// Simulated delay helper for mock mode
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to convert ISO 8601 duration (e.g. PT1H30M20S) to standard format (e.g. 1:30:20)
const formatDuration = (ytDuration) => {
  if (!ytDuration) return '10:00';
  const match = ytDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '10:00';
  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);
  
  const parts = [];
  if (hours > 0) {
    parts.push(hours);
    parts.push(minutes.toString().padStart(2, '0'));
  } else {
    parts.push(minutes);
  }
  parts.push(seconds.toString().padStart(2, '0'));
  return parts.join(':');
};

// Main Axios fetch helper that automatically supports Google and RapidAPI keys
const fetchFromAPI = async (url, params = {}) => {
  // 1. Try official Google Cloud YouTube Data API v3
  if (GOOGLE_API_KEY) {
    try {
      const { data } = await axios.get(`https://www.googleapis.com/youtube/v3/${url}`, {
        params: {
          key: GOOGLE_API_KEY,
          maxResults: '50',
          ...params
        }
      });
      return data;
    } catch (error) {
      console.error(`Error fetching from Google YouTube API: ${url}. falling back...`, error);
    }
  }

  // 2. Try RapidAPI YouTube v3 endpoint
  if (RAPIDAPI_KEY) {
    try {
      const { data } = await axios.get(`https://youtube-v31.p.rapidapi.com/${url}`, {
        params: {
          maxResults: '50',
          ...params
        },
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': 'youtube-v31.p.rapidapi.com'
        }
      });
      return data;
    } catch (error) {
      console.error(`Error fetching from RapidAPI YouTube v3: ${url}. falling back...`, error);
    }
  }

  return null;
};

export const fetchVideosByCategory = async (category) => {
  if (IS_API_ACTIVE) {
    const query = category === 'All' ? 'coding reactjs tutorials' : category;
    const data = await fetchFromAPI('search', { q: query, part: 'snippet,id', type: 'video' });
    if (data && data.items) {
      return data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        youtubeId: item.id.videoId,
        thumbnail: item.snippet.thumbnails?.medium?.url || `https://i.ytimg.com/vi/${item.id.videoId}/mqdefault.jpg`,
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        views: '1M',
        uploadTime: item.snippet.publishedAt ? new Date(item.snippet.publishedAt).toLocaleDateString() : 'recently',
        category
      }));
    }
  }

  // Fallback to Mock Data
  await delay(600);
  if (!category || category === 'All') {
    return VIDEOS;
  }
  return VIDEOS.filter(
    (video) => video.category.toLowerCase() === category.toLowerCase()
  );
};

export const fetchVideoDetails = async (id) => {
  if (IS_API_ACTIVE) {
    const data = await fetchFromAPI('videos', { id, part: 'contentDetails,snippet,statistics' });
    if (data && data.items && data.items.length > 0) {
      const item = data.items[0];
      return {
        id: item.id,
        title: item.snippet.title,
        youtubeId: item.id,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        views: parseInt(item.statistics?.viewCount || 0).toLocaleString(),
        likes: parseInt(item.statistics?.likeCount || 0).toLocaleString(),
        uploadTime: item.snippet.publishedAt ? new Date(item.snippet.publishedAt).toLocaleDateString() : 'recently',
        duration: item.contentDetails?.duration ? formatDuration(item.contentDetails.duration) : '10:00',
        description: item.snippet.description || '',
        category: 'All'
      };
    }
  }

  // Fallback to Mock Data
  await delay(400);
  const video = VIDEOS.find((v) => v.id === id);
  if (video) return video;
  
  return {
    id,
    title: 'Custom YouTube Video Playback',
    youtubeId: id,
    thumbnail: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
    channelId: 'youtube_video',
    channelTitle: 'YouTube Video',
    views: '15,200',
    viewsCount: 15200,
    likes: '450',
    likesCount: 450,
    uploadTime: 'Recently',
    duration: '10:00',
    category: 'All',
    description: 'Auto-loaded custom video from search query.'
  };
};

export const fetchChannelDetails = async (channelId) => {
  if (IS_API_ACTIVE) {
    const data = await fetchFromAPI('channels', { id: channelId, part: 'snippet,statistics,brandingSettings' });
    if (data && data.items && data.items.length > 0) {
      const item = data.items[0];
      return {
        id: item.id,
        name: item.snippet.title,
        avatar: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
        banner: item.brandingSettings?.image?.bannerExternalUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
        subscribers: parseInt(item.statistics?.subscriberCount || 0).toLocaleString(),
        subscribersCount: parseInt(item.statistics?.subscriberCount || 0),
        videoCount: item.statistics?.videoCount || '0',
        description: item.snippet.description || ''
      };
    }
  }

  // Fallback to Mock Data
  await delay(500);
  const channel = CHANNELS[channelId];
  if (channel) return channel;
  
  return {
    id: channelId,
    name: channelId.charAt(0).toUpperCase() + channelId.slice(1),
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
    banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
    subscribers: '10K',
    subscribersCount: 10000,
    videoCount: '12',
    description: 'Custom generated channel for interactive navigation.'
  };
};

export const fetchChannelVideos = async (channelId) => {
  if (IS_API_ACTIVE) {
    const data = await fetchFromAPI('search', { channelId, part: 'snippet,id', order: 'date', type: 'video' });
    if (data && data.items) {
      return data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        youtubeId: item.id.videoId,
        thumbnail: item.snippet.thumbnails?.medium?.url || `https://i.ytimg.com/vi/${item.id.videoId}/mqdefault.jpg`,
        channelId,
        channelTitle: item.snippet.channelTitle,
        views: '1M',
        uploadTime: item.snippet.publishedAt ? new Date(item.snippet.publishedAt).toLocaleDateString() : 'recently'
      }));
    }
  }

  // Fallback to Mock Data
  await delay(600);
  return VIDEOS.filter((video) => video.channelId === channelId);
};

export const fetchRelatedVideos = async (videoId) => {
  if (IS_API_ACTIVE) {
    const data = await fetchFromAPI('search', { relatedToVideoId: videoId, part: 'snippet,id', type: 'video' });
    if (data && data.items) {
      return data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        youtubeId: item.id.videoId,
        thumbnail: item.snippet.thumbnails?.medium?.url || `https://i.ytimg.com/vi/${item.id.videoId}/mqdefault.jpg`,
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        views: '100K',
        uploadTime: item.snippet.publishedAt ? new Date(item.snippet.publishedAt).toLocaleDateString() : 'recently'
      }));
    }
  }

  // Fallback to Mock Data
  await delay(500);
  const video = VIDEOS.find((v) => v.id === videoId);
  const category = video ? video.category : 'All';
  
  const sameCategory = VIDEOS.filter((v) => v.id !== videoId && v.category === category);
  const diffCategory = VIDEOS.filter((v) => v.id !== videoId && v.category !== category);
  return [...sameCategory, ...diffCategory].slice(0, 10);
};

export const fetchVideoComments = async (videoId) => {
  if (IS_API_ACTIVE) {
    const data = await fetchFromAPI('commentThreads', { videoId, part: 'snippet' });
    if (data && data.items) {
      return data.items.map(item => {
        const comment = item.snippet.topLevelComment.snippet;
        return {
          id: item.id,
          author: comment.authorDisplayName,
          authorAvatar: comment.authorProfileImageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=faces',
          text: comment.textDisplay,
          likes: comment.likeCount || 0,
          timeAgo: comment.publishedAt ? new Date(comment.publishedAt).toLocaleDateString() : 'recently'
        };
      });
    }
  }

  // Fallback to Mock Data
  await delay(400);
  return COMMENTS[videoId] || COMMENTS['default'];
};

export const searchVideos = async (query) => {
  if (IS_API_ACTIVE) {
    const data = await fetchFromAPI('search', { q: query, part: 'snippet,id' });
    if (data && data.items) {
      return data.items.map(item => {
        const isChannel = item.id.channelId && !item.id.videoId;
        return {
          type: isChannel ? 'channel' : 'video',
          id: isChannel ? item.id.channelId : item.id.videoId,
          channelId: item.snippet.channelId,
          title: item.snippet.title,
          avatar: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
          thumbnail: item.snippet.thumbnails?.medium?.url || `https://i.ytimg.com/vi/${item.id.videoId}/mqdefault.jpg`,
          channelTitle: item.snippet.channelTitle,
          views: '1M',
          uploadTime: item.snippet.publishedAt ? new Date(item.snippet.publishedAt).toLocaleDateString() : 'recently',
          description: item.snippet.description || ''
        };
      });
    }
  }

  // Fallback to Mock Data
  await delay(800);
  if (!query) return VIDEOS;
  
  const lowerQuery = query.toLowerCase();
  
  const matchingChannels = Object.values(CHANNELS).filter(
    (c) => c.name.toLowerCase().includes(lowerQuery) || c.id.toLowerCase().includes(lowerQuery)
  );

  const matchingVideos = VIDEOS.filter(
    (v) =>
      v.title.toLowerCase().includes(lowerQuery) ||
      v.description.toLowerCase().includes(lowerQuery) ||
      v.channelTitle.toLowerCase().includes(lowerQuery) ||
      v.category.toLowerCase().includes(lowerQuery)
  );

  const results = [];
  
  matchingChannels.forEach(c => {
    results.push({
      type: 'channel',
      channelId: c.id,
      title: c.name,
      avatar: c.avatar,
      subscribers: c.subscribers,
      videoCount: c.videoCount,
      description: c.description
    });
  });

  matchingVideos.forEach(v => {
    results.push({
      type: 'video',
      ...v
    });
  });

  return results;
};
