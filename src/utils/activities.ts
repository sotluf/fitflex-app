import RunIcon from '../assets/icons/run.svg';
import WalkIcon from '../assets/icons/walk.svg';
import BikeIcon from '../assets/icons/bike.svg';
import MountainIcon from '../assets/icons/mountain.svg';
import YogaIcon from '../assets/icons/yoga.svg';
import DumbbellIcon from '../assets/icons/dumbbell.svg';
import FlameIcon from '../assets/icons/flame.svg';

export const ACTIVITIES = [
  { id: 'outdoor_run', label: 'Outdoor Run', icon: RunIcon, requiresGps: true },
  { id: 'outdoor_walk', label: 'Outdoor Walk', icon: WalkIcon, requiresGps: true },
  { id: 'outdoor_cycling', label: 'Outdoor Cycling', icon: BikeIcon, requiresGps: true },
  { id: 'hiking', label: 'Hiking', icon: MountainIcon, requiresGps: true },
  { id: 'treadmill', label: 'Treadmill', icon: RunIcon, requiresGps: false },
  { id: 'yoga', label: 'Yoga', icon: YogaIcon, requiresGps: false },
  { id: 'pilates', label: 'Pilates', icon: YogaIcon, requiresGps: false },
  { id: 'stretching', label: 'Stretching', icon: YogaIcon, requiresGps: false },
  { id: 'strength', label: 'Strength Training', icon: DumbbellIcon, requiresGps: false },
  { id: 'hiit', label: 'HIIT', icon: FlameIcon, requiresGps: false },
  { id: 'indoor_cycling', label: 'Indoor Cycling', icon: BikeIcon, requiresGps: false },
];

export type Activity = (typeof ACTIVITIES)[number];
