import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassPanel } from '../components/GlassPanel';
import { colors, radius, spacing } from '../constants/theme';

const INITIAL_REGION = {
  latitude: 28.6139,
  longitude: 77.209,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

const NEARBY_POSTS = [
  {
    "id": "1",
    "name": "Greek Salad",
    "user": "Carlos",
    "city": "Jakarta, ID",
    "calories": 201,
    "carbs": 13,
    "protein": 5,
    "fats": 16,
    "healthScore": 9,
    "latitude": -6.1861,
    "longitude": 106.8411,
    "image": "https://source.unsplash.com/600x400/?greek-salad,food"
  },
  {
    "id": "2",
    "name": "Miso Soup",
    "user": "Aya",
    "city": "Paris, FR",
    "calories": 80,
    "carbs": 8,
    "protein": 5,
    "fats": 3,
    "healthScore": 9,
    "latitude": 48.8566,
    "longitude": 2.3446,
    "image": "https://source.unsplash.com/600x400/?miso-soup,food"
  },
  {
    "id": "3",
    "name": "Falafel Wrap",
    "user": "Ivan",
    "city": "Tokyo, JP",
    "calories": 394,
    "carbs": 45,
    "protein": 12,
    "fats": 18,
    "healthScore": 8,
    "latitude": 35.6611,
    "longitude": 139.6635,
    "image": "https://source.unsplash.com/600x400/?falafel,food"
  },
  {
    "id": "4",
    "name": "Margherita Pizza",
    "user": "Hugo",
    "city": "Marrakech, MA",
    "calories": 537,
    "carbs": 75,
    "protein": 23,
    "fats": 20,
    "healthScore": 5,
    "latitude": 31.6235,
    "longitude": -7.9848,
    "image": "https://source.unsplash.com/600x400/?pizza,food"
  },
  {
    "id": "5",
    "name": "Empanadas",
    "user": "Yara",
    "city": "Abu Dhabi, AE",
    "calories": 459,
    "carbs": 38,
    "protein": 12,
    "fats": 20,
    "healthScore": 4,
    "latitude": 24.4385,
    "longitude": 54.3857,
    "image": "https://source.unsplash.com/600x400/?empanada,food"
  },
  {
    "id": "6",
    "name": "Pancakes",
    "user": "Noah",
    "city": "Addis Ababa, ET",
    "calories": 512,
    "carbs": 63,
    "protein": 11,
    "fats": 18,
    "healthScore": 3,
    "latitude": 9.0115,
    "longitude": 38.7518,
    "image": "https://source.unsplash.com/600x400/?pancakes,food"
  },
  {
    "id": "7",
    "name": "Shawarma",
    "user": "Isla",
    "city": "Hamburg, DE",
    "calories": 517,
    "carbs": 50,
    "protein": 25,
    "fats": 22,
    "healthScore": 6,
    "latitude": 53.5278,
    "longitude": 9.9969,
    "image": "https://source.unsplash.com/600x400/?shawarma,food"
  },
  {
    "id": "8",
    "name": "Waffles",
    "user": "Zoe",
    "city": "Chennai, IN",
    "calories": 506,
    "carbs": 68,
    "protein": 11,
    "fats": 23,
    "healthScore": 2,
    "latitude": 13.0709,
    "longitude": 80.2468,
    "image": "https://source.unsplash.com/600x400/?waffles,food"
  },
  {
    "id": "9",
    "name": "Pancakes",
    "user": "Elif",
    "city": "Taipei, TW",
    "calories": 463,
    "carbs": 64,
    "protein": 9,
    "fats": 20,
    "healthScore": 2,
    "latitude": 25.0248,
    "longitude": 121.5762,
    "image": "https://source.unsplash.com/600x400/?pancakes,food"
  },
  {
    "id": "10",
    "name": "Croque Monsieur",
    "user": "Dmitri",
    "city": "Addis Ababa, ET",
    "calories": 490,
    "carbs": 30,
    "protein": 26,
    "fats": 32,
    "healthScore": 4,
    "latitude": 9.04,
    "longitude": 38.7407,
    "image": "https://source.unsplash.com/600x400/?sandwich,food"
  },
  {
    "id": "11",
    "name": "Dim Sum",
    "user": "Wren",
    "city": "Hanoi, VN",
    "calories": 372,
    "carbs": 40,
    "protein": 15,
    "fats": 11,
    "healthScore": 6,
    "latitude": 21.0527,
    "longitude": 105.8452,
    "image": "https://source.unsplash.com/600x400/?dumplings,food"
  },
  {
    "id": "12",
    "name": "Tom Yum Soup",
    "user": "Zoe",
    "city": "Auckland, NZ",
    "calories": 226,
    "carbs": 18,
    "protein": 16,
    "fats": 9,
    "healthScore": 7,
    "latitude": -36.8188,
    "longitude": 174.7482,
    "image": "https://source.unsplash.com/600x400/?tom-yum,food"
  },
  {
    "id": "13",
    "name": "Hummus Plate",
    "user": "Felix",
    "city": "Taipei, TW",
    "calories": 296,
    "carbs": 26,
    "protein": 10,
    "fats": 14,
    "healthScore": 8,
    "latitude": 25.0209,
    "longitude": 121.5923,
    "image": "https://source.unsplash.com/600x400/?hummus,food"
  },
  {
    "id": "14",
    "name": "Croque Monsieur",
    "user": "Layla",
    "city": "Seoul, KR",
    "calories": 495,
    "carbs": 35,
    "protein": 29,
    "fats": 27,
    "healthScore": 4,
    "latitude": 37.5701,
    "longitude": 126.9927,
    "image": "https://source.unsplash.com/600x400/?sandwich,food"
  },
  {
    "id": "15",
    "name": "Chili",
    "user": "Elif",
    "city": "Chiang Mai, TH",
    "calories": 335,
    "carbs": 38,
    "protein": 30,
    "fats": 14,
    "healthScore": 5,
    "latitude": 18.7609,
    "longitude": 98.9738,
    "image": "https://source.unsplash.com/600x400/?chili,food"
  },
  {
    "id": "16",
    "name": "Pho",
    "user": "Erik",
    "city": "Bucharest, RO",
    "calories": 369,
    "carbs": 42,
    "protein": 23,
    "fats": 8,
    "healthScore": 7,
    "latitude": 44.4531,
    "longitude": 26.1005,
    "image": "https://source.unsplash.com/600x400/?pho,food"
  },
  {
    "id": "17",
    "name": "Butter Chicken",
    "user": "Kai",
    "city": "Sydney, AU",
    "calories": 488,
    "carbs": 26,
    "protein": 36,
    "fats": 25,
    "healthScore": 5,
    "latitude": -33.8877,
    "longitude": 151.1924,
    "image": "https://source.unsplash.com/600x400/?curry,food"
  },
  {
    "id": "18",
    "name": "Tandoori Chicken",
    "user": "Noah",
    "city": "Melbourne, AU",
    "calories": 400,
    "carbs": 7,
    "protein": 38,
    "fats": 19,
    "healthScore": 8,
    "latitude": -37.7952,
    "longitude": 144.9686,
    "image": "https://source.unsplash.com/600x400/?tandoori,food"
  },
  {
    "id": "19",
    "name": "Butter Chicken",
    "user": "Carlos",
    "city": "Riyadh, SA",
    "calories": 514,
    "carbs": 31,
    "protein": 34,
    "fats": 25,
    "healthScore": 6,
    "latitude": 24.7047,
    "longitude": 46.7044,
    "image": "https://source.unsplash.com/600x400/?curry,food"
  },
  {
    "id": "20",
    "name": "Beef Burger",
    "user": "Erik",
    "city": "Ahmedabad, IN",
    "calories": 627,
    "carbs": 44,
    "protein": 35,
    "fats": 31,
    "healthScore": 2,
    "latitude": 23.0051,
    "longitude": 72.5704,
    "image": "https://source.unsplash.com/600x400/?burger,food"
  },
  {
    "id": "21",
    "name": "Chili",
    "user": "Carlos",
    "city": "Moscow, RU",
    "calories": 404,
    "carbs": 38,
    "protein": 28,
    "fats": 16,
    "healthScore": 5,
    "latitude": 55.7628,
    "longitude": 37.6258,
    "image": "https://source.unsplash.com/600x400/?chili,food"
  },
  {
    "id": "22",
    "name": "Beef Burger",
    "user": "Sara",
    "city": "Krakow, PL",
    "calories": 659,
    "carbs": 46,
    "protein": 32,
    "fats": 35,
    "healthScore": 3,
    "latitude": 50.0611,
    "longitude": 19.9454,
    "image": "https://source.unsplash.com/600x400/?burger,food"
  },
  {
    "id": "23",
    "name": "Banh Mi",
    "user": "Leo",
    "city": "Sao Paulo, BR",
    "calories": 384,
    "carbs": 45,
    "protein": 16,
    "fats": 17,
    "healthScore": 7,
    "latitude": -23.542,
    "longitude": -46.6208,
    "image": "https://source.unsplash.com/600x400/?banh-mi,food"
  },
  {
    "id": "24",
    "name": "Burrito",
    "user": "Kai",
    "city": "Vienna, AT",
    "calories": 616,
    "carbs": 67,
    "protein": 24,
    "fats": 25,
    "healthScore": 5,
    "latitude": 48.1883,
    "longitude": 16.3952,
    "image": "https://source.unsplash.com/600x400/?burrito,food"
  },
  {
    "id": "25",
    "name": "Coffee & Cake",
    "user": "Leo",
    "city": "London, GB",
    "calories": 468,
    "carbs": 58,
    "protein": 7,
    "fats": 24,
    "healthScore": 4,
    "latitude": 51.4902,
    "longitude": -0.1421,
    "image": "https://source.unsplash.com/600x400/?cake,food"
  },
  {
    "id": "26",
    "name": "Oatmeal Bowl",
    "user": "Ines",
    "city": "Busan, KR",
    "calories": 226,
    "carbs": 48,
    "protein": 7,
    "fats": 6,
    "healthScore": 9,
    "latitude": 35.2043,
    "longitude": 129.1052,
    "image": "https://source.unsplash.com/600x400/?oatmeal,food"
  },
  {
    "id": "27",
    "name": "Tandoori Chicken",
    "user": "Ines",
    "city": "Auckland, NZ",
    "calories": 382,
    "carbs": 8,
    "protein": 37,
    "fats": 18,
    "healthScore": 9,
    "latitude": -36.8656,
    "longitude": 174.7823,
    "image": "https://source.unsplash.com/600x400/?tandoori,food"
  },
  {
    "id": "28",
    "name": "Tandoori Chicken",
    "user": "Ines",
    "city": "Auckland, NZ",
    "calories": 414,
    "carbs": 8,
    "protein": 41,
    "fats": 19,
    "healthScore": 7,
    "latitude": -36.8377,
    "longitude": 174.7347,
    "image": "https://source.unsplash.com/600x400/?tandoori,food"
  },
  {
    "id": "29",
    "name": "Coffee & Cake",
    "user": "Jack",
    "city": "Belgrade, RS",
    "calories": 514,
    "carbs": 63,
    "protein": 7,
    "fats": 23,
    "healthScore": 3,
    "latitude": 44.7629,
    "longitude": 20.4591,
    "image": "https://source.unsplash.com/600x400/?cake,food"
  },
  {
    "id": "30",
    "name": "Tom Yum Soup",
    "user": "Marco",
    "city": "Kyoto, JP",
    "calories": 202,
    "carbs": 18,
    "protein": 16,
    "fats": 8,
    "healthScore": 8,
    "latitude": 35.0038,
    "longitude": 135.7743,
    "image": "https://source.unsplash.com/600x400/?tom-yum,food"
  },
  {
    "id": "31",
    "name": "Ceviche",
    "user": "Theo",
    "city": "Miami, US",
    "calories": 222,
    "carbs": 17,
    "protein": 23,
    "fats": 7,
    "healthScore": 10,
    "latitude": 25.7326,
    "longitude": -80.1819,
    "image": "https://source.unsplash.com/600x400/?ceviche,food"
  },
  {
    "id": "32",
    "name": "Fruit Smoothie",
    "user": "Arjun",
    "city": "Amman, JO",
    "calories": 193,
    "carbs": 46,
    "protein": 4,
    "fats": 2,
    "healthScore": 8,
    "latitude": 31.9571,
    "longitude": 35.9092,
    "image": "https://source.unsplash.com/600x400/?smoothie,food"
  },
  {
    "id": "33",
    "name": "Sushi",
    "user": "Yusuf",
    "city": "Austin, US",
    "calories": 331,
    "carbs": 53,
    "protein": 25,
    "fats": 9,
    "healthScore": 9,
    "latitude": 30.2534,
    "longitude": -97.7256,
    "image": "https://source.unsplash.com/600x400/?sushi,food"
  },
  {
    "id": "34",
    "name": "Waffles",
    "user": "Arjun",
    "city": "Wellington, NZ",
    "calories": 449,
    "carbs": 67,
    "protein": 11,
    "fats": 24,
    "healthScore": 1,
    "latitude": -41.314,
    "longitude": 174.7714,
    "image": "https://source.unsplash.com/600x400/?waffles,food"
  },
  {
    "id": "35",
    "name": "Grilled Salmon",
    "user": "Priya",
    "city": "Auckland, NZ",
    "calories": 389,
    "carbs": 3,
    "protein": 32,
    "fats": 18,
    "healthScore": 9,
    "latitude": -36.8442,
    "longitude": 174.7365,
    "image": "https://source.unsplash.com/600x400/?salmon,food"
  },
  {
    "id": "36",
    "name": "Quinoa Bowl",
    "user": "Ben",
    "city": "Beijing, CN",
    "calories": 314,
    "carbs": 40,
    "protein": 13,
    "fats": 10,
    "healthScore": 10,
    "latitude": 39.9341,
    "longitude": 116.4243,
    "image": "https://source.unsplash.com/600x400/?quinoa,food"
  },
  {
    "id": "37",
    "name": "Butter Chicken",
    "user": "Amara",
    "city": "Toronto, CA",
    "calories": 481,
    "carbs": 27,
    "protein": 30,
    "fats": 27,
    "healthScore": 4,
    "latitude": 43.6477,
    "longitude": -79.3191,
    "image": "https://source.unsplash.com/600x400/?curry,food"
  },
  {
    "id": "38",
    "name": "Berry Bowl",
    "user": "Chloe",
    "city": "Casablanca, MA",
    "calories": 255,
    "carbs": 38,
    "protein": 8,
    "fats": 6,
    "healthScore": 9,
    "latitude": 33.5679,
    "longitude": -7.6027,
    "image": "https://source.unsplash.com/600x400/?smoothie-bowl,food"
  },
  {
    "id": "39",
    "name": "Croissant",
    "user": "Alessia",
    "city": "Vancouver, CA",
    "calories": 319,
    "carbs": 29,
    "protein": 5,
    "fats": 16,
    "healthScore": 4,
    "latitude": 49.2924,
    "longitude": -123.1073,
    "image": "https://source.unsplash.com/600x400/?croissant,food"
  },
  {
    "id": "40",
    "name": "Oatmeal Bowl",
    "user": "Mia",
    "city": "Amman, JO",
    "calories": 224,
    "carbs": 40,
    "protein": 8,
    "fats": 6,
    "healthScore": 8,
    "latitude": 31.9335,
    "longitude": 35.9521,
    "image": "https://source.unsplash.com/600x400/?oatmeal,food"
  },
  {
    "id": "41",
    "name": "Miso Soup",
    "user": "Chloe",
    "city": "Dubai, AE",
    "calories": 91,
    "carbs": 8,
    "protein": 6,
    "fats": 3,
    "healthScore": 9,
    "latitude": 25.2102,
    "longitude": 55.2519,
    "image": "https://source.unsplash.com/600x400/?miso-soup,food"
  },
  {
    "id": "42",
    "name": "Burrito",
    "user": "Arjun",
    "city": "Osaka, JP",
    "calories": 704,
    "carbs": 61,
    "protein": 26,
    "fats": 21,
    "healthScore": 4,
    "latitude": 34.6749,
    "longitude": 135.4975,
    "image": "https://source.unsplash.com/600x400/?burrito,food"
  },
  {
    "id": "43",
    "name": "Avocado Toast",
    "user": "Emma",
    "city": "Chiang Mai, TH",
    "calories": 350,
    "carbs": 30,
    "protein": 9,
    "fats": 17,
    "healthScore": 9,
    "latitude": 18.7649,
    "longitude": 98.9946,
    "image": "https://source.unsplash.com/600x400/?avocado-toast,food"
  },
  {
    "id": "44",
    "name": "Tacos",
    "user": "Ivan",
    "city": "Kuala Lumpur, MY",
    "calories": 546,
    "carbs": 55,
    "protein": 22,
    "fats": 23,
    "healthScore": 5,
    "latitude": 3.1548,
    "longitude": 101.7038,
    "image": "https://source.unsplash.com/600x400/?tacos,food"
  },
  {
    "id": "45",
    "name": "Falafel Wrap",
    "user": "Kai",
    "city": "Amsterdam, NL",
    "calories": 388,
    "carbs": 52,
    "protein": 14,
    "fats": 17,
    "healthScore": 8,
    "latitude": 52.3489,
    "longitude": 4.9278,
    "image": "https://source.unsplash.com/600x400/?falafel,food"
  },
  {
    "id": "46",
    "name": "Croissant",
    "user": "Rafael",
    "city": "Marrakech, MA",
    "calories": 308,
    "carbs": 28,
    "protein": 5,
    "fats": 16,
    "healthScore": 4,
    "latitude": 31.6022,
    "longitude": -7.9719,
    "image": "https://source.unsplash.com/600x400/?croissant,food"
  },
  {
    "id": "47",
    "name": "Falafel Wrap",
    "user": "Ines",
    "city": "Belgrade, RS",
    "calories": 422,
    "carbs": 49,
    "protein": 12,
    "fats": 14,
    "healthScore": 8,
    "latitude": 44.7766,
    "longitude": 20.4574,
    "image": "https://source.unsplash.com/600x400/?falafel,food"
  },
  {
    "id": "48",
    "name": "Falafel Wrap",
    "user": "Nadia",
    "city": "Kathmandu, NP",
    "calories": 350,
    "carbs": 45,
    "protein": 15,
    "fats": 18,
    "healthScore": 7,
    "latitude": 27.7395,
    "longitude": 85.3325,
    "image": "https://source.unsplash.com/600x400/?falafel,food"
  },
  {
    "id": "49",
    "name": "Chicken Curry",
    "user": "Wren",
    "city": "Paris, FR",
    "calories": 520,
    "carbs": 27,
    "protein": 26,
    "fats": 29,
    "healthScore": 5,
    "latitude": 48.871,
    "longitude": 2.3388,
    "image": "https://source.unsplash.com/600x400/?curry,food"
  },
  {
    "id": "50",
    "name": "Croissant",
    "user": "Mia",
    "city": "Colombo, LK",
    "calories": 252,
    "carbs": 32,
    "protein": 6,
    "fats": 15,
    "healthScore": 4,
    "latitude": 6.9237,
    "longitude": 79.8568,
    "image": "https://source.unsplash.com/600x400/?croissant,food"
  },
  {
    "id": "51",
    "name": "Margherita Pizza",
    "user": "Amara",
    "city": "Toronto, CA",
    "calories": 666,
    "carbs": 76,
    "protein": 26,
    "fats": 18,
    "healthScore": 4,
    "latitude": 43.6222,
    "longitude": -79.3513,
    "image": "https://source.unsplash.com/600x400/?pizza,food"
  },
  {
    "id": "52",
    "name": "Pad Thai",
    "user": "Alessia",
    "city": "Cairo, EG",
    "calories": 476,
    "carbs": 54,
    "protein": 16,
    "fats": 14,
    "healthScore": 6,
    "latitude": 30.0285,
    "longitude": 31.2352,
    "image": "https://source.unsplash.com/600x400/?pad-thai,food"
  },
  {
    "id": "53",
    "name": "Gyoza",
    "user": "Maya",
    "city": "Santiago, CL",
    "calories": 289,
    "carbs": 39,
    "protein": 13,
    "fats": 15,
    "healthScore": 7,
    "latitude": -33.4387,
    "longitude": -70.6555,
    "image": "https://source.unsplash.com/600x400/?gyoza,food"
  },
  {
    "id": "54",
    "name": "Miso Soup",
    "user": "Ines",
    "city": "Nairobi, KE",
    "calories": 79,
    "carbs": 9,
    "protein": 6,
    "fats": 3,
    "healthScore": 8,
    "latitude": -1.321,
    "longitude": 36.8364,
    "image": "https://source.unsplash.com/600x400/?miso-soup,food"
  },
  {
    "id": "55",
    "name": "Pho",
    "user": "Layla",
    "city": "Casablanca, MA",
    "calories": 330,
    "carbs": 43,
    "protein": 27,
    "fats": 8,
    "healthScore": 8,
    "latitude": 33.5947,
    "longitude": -7.5967,
    "image": "https://source.unsplash.com/600x400/?pho,food"
  },
  {
    "id": "56",
    "name": "Vegetable Stir Fry",
    "user": "Erik",
    "city": "Jaipur, IN",
    "calories": 296,
    "carbs": 39,
    "protein": 11,
    "fats": 12,
    "healthScore": 9,
    "latitude": 26.909,
    "longitude": 75.815,
    "image": "https://source.unsplash.com/600x400/?stir-fry,food"
  },
  {
    "id": "57",
    "name": "Berry Bowl",
    "user": "Ines",
    "city": "Dhaka, BD",
    "calories": 229,
    "carbs": 46,
    "protein": 8,
    "fats": 6,
    "healthScore": 8,
    "latitude": 23.8169,
    "longitude": 90.4317,
    "image": "https://source.unsplash.com/600x400/?smoothie-bowl,food"
  },
  {
    "id": "58",
    "name": "Pastrami Sandwich",
    "user": "Maya",
    "city": "Vienna, AT",
    "calories": 531,
    "carbs": 37,
    "protein": 32,
    "fats": 29,
    "healthScore": 3,
    "latitude": 48.1856,
    "longitude": 16.3541,
    "image": "https://source.unsplash.com/600x400/?sandwich,food"
  },
  {
    "id": "59",
    "name": "Kebab Plate",
    "user": "Priya",
    "city": "Toronto, CA",
    "calories": 613,
    "carbs": 39,
    "protein": 37,
    "fats": 28,
    "healthScore": 5,
    "latitude": 43.6433,
    "longitude": -79.3209,
    "image": "https://source.unsplash.com/600x400/?kebab,food"
  },
  {
    "id": "60",
    "name": "Berry Bowl",
    "user": "Sara",
    "city": "Reykjavik, IS",
    "calories": 251,
    "carbs": 38,
    "protein": 8,
    "fats": 6,
    "healthScore": 10,
    "latitude": 64.1565,
    "longitude": -21.9234,
    "image": "https://source.unsplash.com/600x400/?smoothie-bowl,food"
  },
  {
    "id": "61",
    "name": "Pad Thai",
    "user": "Hugo",
    "city": "Colombo, LK",
    "calories": 509,
    "carbs": 59,
    "protein": 17,
    "fats": 13,
    "healthScore": 5,
    "latitude": 6.9442,
    "longitude": 79.8815,
    "image": "https://source.unsplash.com/600x400/?pad-thai,food"
  },
  {
    "id": "62",
    "name": "Waffles",
    "user": "Marco",
    "city": "Kyiv, UA",
    "calories": 504,
    "carbs": 63,
    "protein": 11,
    "fats": 25,
    "healthScore": 2,
    "latitude": 50.4442,
    "longitude": 30.5209,
    "image": "https://source.unsplash.com/600x400/?waffles,food"
  },
  {
    "id": "63",
    "name": "Waffles",
    "user": "Ivan",
    "city": "Singapore, SG",
    "calories": 457,
    "carbs": 69,
    "protein": 11,
    "fats": 20,
    "healthScore": 1,
    "latitude": 1.3278,
    "longitude": 103.7904,
    "image": "https://source.unsplash.com/600x400/?waffles,food"
  },
  {
    "id": "64",
    "name": "Fruit Smoothie",
    "user": "Nora",
    "city": "Reykjavik, IS",
    "calories": 220,
    "carbs": 44,
    "protein": 4,
    "fats": 2,
    "healthScore": 10,
    "latitude": 64.1348,
    "longitude": -21.9673,
    "image": "https://source.unsplash.com/600x400/?smoothie,food"
  },
  {
    "id": "65",
    "name": "Quinoa Bowl",
    "user": "Wren",
    "city": "Tokyo, JP",
    "calories": 347,
    "carbs": 48,
    "protein": 11,
    "fats": 11,
    "healthScore": 8,
    "latitude": 35.7017,
    "longitude": 139.6592,
    "image": "https://source.unsplash.com/600x400/?quinoa,food"
  },
  {
    "id": "66",
    "name": "Tom Yum Soup",
    "user": "Tom",
    "city": "Abu Dhabi, AE",
    "calories": 191,
    "carbs": 20,
    "protein": 15,
    "fats": 8,
    "healthScore": 8,
    "latitude": 24.442,
    "longitude": 54.3744,
    "image": "https://source.unsplash.com/600x400/?tom-yum,food"
  },
  {
    "id": "67",
    "name": "Coffee & Cake",
    "user": "Ines",
    "city": "Cape Town, ZA",
    "calories": 400,
    "carbs": 62,
    "protein": 6,
    "fats": 19,
    "healthScore": 4,
    "latitude": -33.8953,
    "longitude": 18.404,
    "image": "https://source.unsplash.com/600x400/?cake,food"
  },
  {
    "id": "68",
    "name": "Croissant",
    "user": "Nina",
    "city": "Belgrade, RS",
    "calories": 266,
    "carbs": 28,
    "protein": 6,
    "fats": 17,
    "healthScore": 4,
    "latitude": 44.7738,
    "longitude": 20.4499,
    "image": "https://source.unsplash.com/600x400/?croissant,food"
  },
  {
    "id": "69",
    "name": "Margherita Pizza",
    "user": "Rafael",
    "city": "Vienna, AT",
    "calories": 538,
    "carbs": 75,
    "protein": 22,
    "fats": 21,
    "healthScore": 3,
    "latitude": 48.2315,
    "longitude": 16.3955,
    "image": "https://source.unsplash.com/600x400/?pizza,food"
  },
  {
    "id": "70",
    "name": "Dumplings",
    "user": "Leo",
    "city": "Kathmandu, NP",
    "calories": 429,
    "carbs": 46,
    "protein": 13,
    "fats": 12,
    "healthScore": 5,
    "latitude": 27.7391,
    "longitude": 85.2978,
    "image": "https://source.unsplash.com/600x400/?dumplings,food"
  },
  {
    "id": "71",
    "name": "Greek Salad",
    "user": "Ravi",
    "city": "Bangalore, IN",
    "calories": 232,
    "carbs": 16,
    "protein": 6,
    "fats": 18,
    "healthScore": 9,
    "latitude": 12.9919,
    "longitude": 77.575,
    "image": "https://source.unsplash.com/600x400/?greek-salad,food"
  },
  {
    "id": "72",
    "name": "Coffee & Cake",
    "user": "Carlos",
    "city": "Mexico City, MX",
    "calories": 451,
    "carbs": 54,
    "protein": 8,
    "fats": 20,
    "healthScore": 4,
    "latitude": 19.4484,
    "longitude": -99.1059,
    "image": "https://source.unsplash.com/600x400/?cake,food"
  },
  {
    "id": "73",
    "name": "Greek Salad",
    "user": "Ava",
    "city": "Tokyo, JP",
    "calories": 239,
    "carbs": 15,
    "protein": 6,
    "fats": 17,
    "healthScore": 9,
    "latitude": 35.6895,
    "longitude": 139.6219,
    "image": "https://source.unsplash.com/600x400/?greek-salad,food"
  },
  {
    "id": "74",
    "name": "Chicken Curry",
    "user": "Felix",
    "city": "Manila, PH",
    "calories": 422,
    "carbs": 27,
    "protein": 26,
    "fats": 27,
    "healthScore": 5,
    "latitude": 14.5961,
    "longitude": 121.0141,
    "image": "https://source.unsplash.com/600x400/?curry,food"
  },
  {
    "id": "75",
    "name": "Hummus Plate",
    "user": "Maya",
    "city": "Madrid, ES",
    "calories": 338,
    "carbs": 30,
    "protein": 10,
    "fats": 17,
    "healthScore": 8,
    "latitude": 40.4338,
    "longitude": -3.728,
    "image": "https://source.unsplash.com/600x400/?hummus,food"
  },
  {
    "id": "76",
    "name": "Hummus Plate",
    "user": "Omar",
    "city": "Chicago, US",
    "calories": 281,
    "carbs": 32,
    "protein": 10,
    "fats": 17,
    "healthScore": 8,
    "latitude": 41.8518,
    "longitude": -87.6499,
    "image": "https://source.unsplash.com/600x400/?hummus,food"
  },
  {
    "id": "77",
    "name": "Dumplings",
    "user": "Chloe",
    "city": "Cape Town, ZA",
    "calories": 433,
    "carbs": 41,
    "protein": 13,
    "fats": 12,
    "healthScore": 6,
    "latitude": -33.9409,
    "longitude": 18.4185,
    "image": "https://source.unsplash.com/600x400/?dumplings,food"
  },
  {
    "id": "78",
    "name": "Ceviche",
    "user": "Lucia",
    "city": "Edinburgh, GB",
    "calories": 239,
    "carbs": 18,
    "protein": 28,
    "fats": 7,
    "healthScore": 9,
    "latitude": 55.9388,
    "longitude": -3.1617,
    "image": "https://source.unsplash.com/600x400/?ceviche,food"
  },
  {
    "id": "79",
    "name": "Margherita Pizza",
    "user": "Kai",
    "city": "Vancouver, CA",
    "calories": 551,
    "carbs": 87,
    "protein": 21,
    "fats": 22,
    "healthScore": 5,
    "latitude": 49.2783,
    "longitude": -123.0957,
    "image": "https://source.unsplash.com/600x400/?pizza,food"
  },
  {
    "id": "80",
    "name": "Ceviche",
    "user": "Aya",
    "city": "Riyadh, SA",
    "calories": 206,
    "carbs": 16,
    "protein": 30,
    "fats": 6,
    "healthScore": 10,
    "latitude": 24.7046,
    "longitude": 46.7028,
    "image": "https://source.unsplash.com/600x400/?ceviche,food"
  },
  {
    "id": "81",
    "name": "Tom Yum Soup",
    "user": "Hugo",
    "city": "Kyoto, JP",
    "calories": 244,
    "carbs": 20,
    "protein": 15,
    "fats": 9,
    "healthScore": 9,
    "latitude": 34.995,
    "longitude": 135.765,
    "image": "https://source.unsplash.com/600x400/?tom-yum,food"
  },
  {
    "id": "82",
    "name": "Chicken Curry",
    "user": "Rafael",
    "city": "Miami, US",
    "calories": 476,
    "carbs": 22,
    "protein": 26,
    "fats": 26,
    "healthScore": 5,
    "latitude": 25.7881,
    "longitude": -80.1712,
    "image": "https://source.unsplash.com/600x400/?curry,food"
  },
  {
    "id": "83",
    "name": "Fish and Chips",
    "user": "Aya",
    "city": "Phnom Penh, KH",
    "calories": 742,
    "carbs": 60,
    "protein": 30,
    "fats": 35,
    "healthScore": 3,
    "latitude": 11.5458,
    "longitude": 104.9129,
    "image": "https://source.unsplash.com/600x400/?fish-and-chips,food"
  },
  {
    "id": "84",
    "name": "Caprese Salad",
    "user": "Theo",
    "city": "Colombo, LK",
    "calories": 245,
    "carbs": 9,
    "protein": 13,
    "fats": 17,
    "healthScore": 8,
    "latitude": 6.9161,
    "longitude": 79.8803,
    "image": "https://source.unsplash.com/600x400/?caprese,food"
  },
  {
    "id": "85",
    "name": "Margherita Pizza",
    "user": "Emma",
    "city": "Toronto, CA",
    "calories": 609,
    "carbs": 70,
    "protein": 23,
    "fats": 23,
    "healthScore": 5,
    "latitude": 43.6498,
    "longitude": -79.3261,
    "image": "https://source.unsplash.com/600x400/?pizza,food"
  },
  {
    "id": "86",
    "name": "Greek Salad",
    "user": "Aya",
    "city": "Taipei, TW",
    "calories": 193,
    "carbs": 12,
    "protein": 7,
    "fats": 18,
    "healthScore": 8,
    "latitude": 25.0389,
    "longitude": 121.5375,
    "image": "https://source.unsplash.com/600x400/?greek-salad,food"
  },
  {
    "id": "87",
    "name": "Fried Rice",
    "user": "Kenji",
    "city": "Nairobi, KE",
    "calories": 431,
    "carbs": 52,
    "protein": 13,
    "fats": 15,
    "healthScore": 4,
    "latitude": -1.3105,
    "longitude": 36.8242,
    "image": "https://source.unsplash.com/600x400/?fried-rice,food"
  },
  {
    "id": "88",
    "name": "Butter Chicken",
    "user": "Sara",
    "city": "Jakarta, ID",
    "calories": 447,
    "carbs": 34,
    "protein": 38,
    "fats": 31,
    "healthScore": 4,
    "latitude": -6.1807,
    "longitude": 106.8493,
    "image": "https://source.unsplash.com/600x400/?curry,food"
  },
  {
    "id": "89",
    "name": "Vegetable Stir Fry",
    "user": "Kai",
    "city": "Kyoto, JP",
    "calories": 336,
    "carbs": 33,
    "protein": 12,
    "fats": 13,
    "healthScore": 8,
    "latitude": 35.0138,
    "longitude": 135.7789,
    "image": "https://source.unsplash.com/600x400/?stir-fry,food"
  },
  {
    "id": "90",
    "name": "Pancakes",
    "user": "Ava",
    "city": "Doha, QA",
    "calories": 505,
    "carbs": 68,
    "protein": 10,
    "fats": 17,
    "healthScore": 4,
    "latitude": 25.2811,
    "longitude": 51.5192,
    "image": "https://source.unsplash.com/600x400/?pancakes,food"
  },
  {
    "id": "91",
    "name": "Chicken Curry",
    "user": "Felix",
    "city": "Havana, CU",
    "calories": 490,
    "carbs": 24,
    "protein": 27,
    "fats": 24,
    "healthScore": 6,
    "latitude": 23.0891,
    "longitude": -82.376,
    "image": "https://source.unsplash.com/600x400/?curry,food"
  },
  {
    "id": "92",
    "name": "Miso Soup",
    "user": "Dmitri",
    "city": "Casablanca, MA",
    "calories": 87,
    "carbs": 7,
    "protein": 6,
    "fats": 3,
    "healthScore": 9,
    "latitude": 33.587,
    "longitude": -7.5842,
    "image": "https://source.unsplash.com/600x400/?miso-soup,food"
  },
  {
    "id": "93",
    "name": "Fried Rice",
    "user": "Lena",
    "city": "Paris, FR",
    "calories": 441,
    "carbs": 65,
    "protein": 15,
    "fats": 14,
    "healthScore": 6,
    "latitude": 48.8769,
    "longitude": 2.3381,
    "image": "https://source.unsplash.com/600x400/?fried-rice,food"
  },
  {
    "id": "94",
    "name": "Dumplings",
    "user": "Kai",
    "city": "Doha, QA",
    "calories": 413,
    "carbs": 43,
    "protein": 15,
    "fats": 16,
    "healthScore": 6,
    "latitude": 25.2871,
    "longitude": 51.5464,
    "image": "https://source.unsplash.com/600x400/?dumplings,food"
  },
  {
    "id": "95",
    "name": "Vegetable Stir Fry",
    "user": "Diego",
    "city": "Moscow, RU",
    "calories": 295,
    "carbs": 36,
    "protein": 11,
    "fats": 13,
    "healthScore": 8,
    "latitude": 55.7273,
    "longitude": 37.5975,
    "image": "https://source.unsplash.com/600x400/?stir-fry,food"
  },
  {
    "id": "96",
    "name": "Greek Salad",
    "user": "Lena",
    "city": "Hong Kong, HK",
    "calories": 202,
    "carbs": 12,
    "protein": 6,
    "fats": 14,
    "healthScore": 10,
    "latitude": 22.2979,
    "longitude": 114.1949,
    "image": "https://source.unsplash.com/600x400/?greek-salad,food"
  },
  {
    "id": "97",
    "name": "Pastrami Sandwich",
    "user": "Marco",
    "city": "Havana, CU",
    "calories": 592,
    "carbs": 42,
    "protein": 36,
    "fats": 24,
    "healthScore": 5,
    "latitude": 23.1242,
    "longitude": -82.3685,
    "image": "https://source.unsplash.com/600x400/?sandwich,food"
  },
  {
    "id": "98",
    "name": "Greek Salad",
    "user": "Nora",
    "city": "Seattle, US",
    "calories": 227,
    "carbs": 13,
    "protein": 7,
    "fats": 14,
    "healthScore": 9,
    "latitude": 47.6295,
    "longitude": -122.3542,
    "image": "https://source.unsplash.com/600x400/?greek-salad,food"
  },
  {
    "id": "99",
    "name": "Acai Bowl",
    "user": "Kai",
    "city": "Kyoto, JP",
    "calories": 368,
    "carbs": 50,
    "protein": 6,
    "fats": 10,
    "healthScore": 8,
    "latitude": 34.9918,
    "longitude": 135.7921,
    "image": "https://source.unsplash.com/600x400/?acai-bowl,food"
  },
  {
    "id": "100",
    "name": "Ceviche",
    "user": "Ivan",
    "city": "Bucharest, RO",
    "calories": 210,
    "carbs": 17,
    "protein": 26,
    "fats": 5,
    "healthScore": 9,
    "latitude": 44.4519,
    "longitude": 26.1052,
    "image": "https://source.unsplash.com/600x400/?ceviche,food"
  }
];
// gauravburande18_db_user
// 43eE3gQ1e2iF2Kvl

const MAP_TYPES = [
  { id: 'standard', label: 'Standard' },
  { id: 'satellite', label: 'Satellite' },
  { id: 'hybrid', label: 'Hybrid' },
  { id: 'terrain', label: 'Terrain' },
];

function ToggleRow({ label, value, onToggle }) {
  return (
    <TouchableOpacity style={styles.optionRow} onPress={onToggle} activeOpacity={0.75}>
      <Text style={styles.optionLabel}>{label}</Text>
      <View style={[styles.toggleTrack, value && styles.toggleTrackOn]}>
        <View style={[styles.toggleThumb, value && styles.toggleThumbOn]} />
      </View>
    </TouchableOpacity>
  );
}

function PhotoPin({ image }) {
  return (
    <View style={styles.pin}>
      <Image source={{ uri: image }} style={styles.pinImage} />
    </View>
  );
}

export default function MapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mapRef = useRef(null);
  const [region, setRegion] = useState(INITIAL_REGION);
  const [query, setQuery] = useState('');
  const [locating, setLocating] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [mapType, setMapType] = useState('standard');
  const [showTraffic, setShowTraffic] = useState(false);
  const [showPosts, setShowPosts] = useState(true);
  const [showBuildings, setShowBuildings] = useState(true);
  const [pitchEnabled, setPitchEnabled] = useState(true);

  const matches = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    return NEARBY_POSTS.filter(
      (post) =>
        post.name.toLowerCase().includes(trimmed) ||
        post.user.toLowerCase().includes(trimmed),
    );
  }, [query]);

  const openDetails = (post) => {
    router.push({
      pathname: '/scan-result',
      params: {
        imageUri: post.image,
        name: post.name,
        user: post.user,
        calories: String(post.calories),
        carbs: String(post.carbs),
        protein: String(post.protein),
        fats: String(post.fats),
        healthScore: String(post.healthScore),
      },
    });
  };

  const animateTo = (nextRegion) => {
    mapRef.current?.animateToRegion(nextRegion, 280);
    setRegion(nextRegion);
  };

  const goToCoordinate = (latitude, longitude, delta = 0.02) => {
    animateTo({
      latitude,
      longitude,
      latitudeDelta: delta,
      longitudeDelta: delta,
    });
  };

  const zoomBy = (factor) => {
    animateTo({
      ...region,
      latitudeDelta: Math.min(1.6, Math.max(0.002, region.latitudeDelta * factor)),
      longitudeDelta: Math.min(1.6, Math.max(0.002, region.longitudeDelta * factor)),
    });
  };

  const selectPost = (post) => {
    Keyboard.dismiss();
    setQuery(post.name);
    goToCoordinate(post.latitude, post.longitude);
    openDetails(post);
  };

  const handleSearchSubmit = async () => {
    if (matches[0]) {
      selectPost(matches[0]);
      return;
    }

    const place = query.trim();
    if (!place) return;

    try {
      const results = await Location.geocodeAsync(place);
      if (results[0]) {
        Keyboard.dismiss();
        goToCoordinate(results[0].latitude, results[0].longitude, 0.03);
      } else {
        Alert.alert('No results', 'Try a nearby dish or a place name.');
      }
    } catch {
      Alert.alert('Search unavailable', 'Could not look up that place right now.');
    }
  };

  const goToCurrentLocation = async () => {
    setLocating(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Location needed', 'Allow location access to jump to where you are.');
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      goToCoordinate(position.coords.latitude, position.coords.longitude, 0.015);
    } catch {
      Alert.alert('Location unavailable', 'Could not find your current location.');
    } finally {
      setLocating(false);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        mapType={mapType}
        showsUserLocation
        showsMyLocationButton={false}
        showsTraffic={showTraffic}
        showsBuildings={showBuildings}
        showsCompass={false}
        pitchEnabled={pitchEnabled}
        rotateEnabled
        onRegionChangeComplete={setRegion}
      >
        {showPosts && NEARBY_POSTS.map((post) => (
          <Marker
            key={post.id}
            coordinate={{ latitude: post.latitude, longitude: post.longitude }}
            anchor={{ x: 0.5, y: 0.5 }}
            onPress={() => openDetails(post)}
          >
            <PhotoPin image={post.image} />
          </Marker>
        ))}
      </MapView>

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <GlassPanel style={styles.headerGlass}>
          <View style={styles.titleRow}>
            <Text style={styles.headerTitle}>Map</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.headerIcon}
                onPress={() => setShowOptions((open) => !open)}
              >
                <Ionicons
                  name={showOptions ? 'close' : 'options-outline'}
                  size={18}
                  color={colors.dark}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerIcon}
                onPress={goToCurrentLocation}
                disabled={locating}
              >
                <Ionicons
                  name={locating ? 'hourglass-outline' : 'navigate'}
                  size={18}
                  color={colors.dark}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search meals or places"
              placeholderTextColor={colors.textMuted}
              style={styles.searchInput}
              returnKeyType="search"
              onSubmitEditing={handleSearchSubmit}
            />
            {query ? (
              <TouchableOpacity onPress={() => setQuery('')} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            ) : null}
          </View>
        </GlassPanel>

        {showOptions ? (
          <GlassPanel style={styles.optionsPanel}>
            <Text style={styles.optionsTitle}>Map style</Text>
            <View style={styles.typeRow}>
              {MAP_TYPES.map((type) => {
                const selected = mapType === type.id;
                return (
                  <TouchableOpacity
                    key={type.id}
                    style={[styles.typeChip, selected && styles.typeChipSelected]}
                    onPress={() => setMapType(type.id)}
                  >
                    <Text style={[styles.typeChipText, selected && styles.typeChipTextSelected]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.optionDivider} />
            <ToggleRow
              label="Nearby posts"
              value={showPosts}
              onToggle={() => setShowPosts((value) => !value)}
            />
            <ToggleRow
              label="Traffic"
              value={showTraffic}
              onToggle={() => setShowTraffic((value) => !value)}
            />
            <ToggleRow
              label="3D buildings"
              value={showBuildings}
              onToggle={() => setShowBuildings((value) => !value)}
            />
            <ToggleRow
              label="Tilt & rotate"
              value={pitchEnabled}
              onToggle={() => setPitchEnabled((value) => !value)}
            />
          </GlassPanel>
        ) : null}

        {matches.length > 0 ? (
          <GlassPanel style={styles.results}>
            {matches.map((post, index) => (
              <TouchableOpacity
                key={post.id}
                style={[styles.resultRow, index > 0 && styles.resultDivider]}
                onPress={() => selectPost(post)}
              >
                <Image source={{ uri: post.image }} style={styles.resultImage} />
                <View style={styles.resultText}>
                  <Text style={styles.resultName}>{post.name}</Text>
                  <Text style={styles.resultMeta}>
                    {post.calories} kcal · {post.user}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </GlassPanel>
        ) : null}
      </View>

      <View style={[styles.controls, { bottom: Math.max(insets.bottom, 12) + 88 }]}>
        <GlassPanel style={styles.controlGroup}>
          <TouchableOpacity style={styles.controlButton} onPress={() => zoomBy(0.5)}>
            <Ionicons name="add" size={22} color={colors.dark} />
          </TouchableOpacity>
          <View style={styles.controlDivider} />
          <TouchableOpacity style={styles.controlButton} onPress={() => zoomBy(2)}>
            <Ionicons name="remove" size={22} color={colors.dark} />
          </TouchableOpacity>
        </GlassPanel>

        <TouchableOpacity onPress={goToCurrentLocation} disabled={locating} activeOpacity={0.85}>
          <GlassPanel style={styles.locateButton}>
            <Ionicons
              name={locating ? 'hourglass-outline' : 'locate'}
              size={22}
              color={colors.dark}
            />
          </GlassPanel>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const PIN_SIZE = 48;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
  },
  headerGlass: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingTop: 12,
    paddingBottom: 10,
    overflow: 'hidden',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsPanel: {
    marginTop: spacing.sm,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    overflow: 'hidden',
  },
  optionsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  typeChipSelected: {
    backgroundColor: colors.dark,
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  typeChipTextSelected: {
    color: colors.white,
  },
  optionDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginVertical: spacing.sm,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  toggleTrack: {
    width: 40,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.12)',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleTrackOn: {
    backgroundColor: colors.dark,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 12,
  },
  results: {
    marginTop: spacing.sm,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  resultDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  resultImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  resultText: {
    flex: 1,
  },
  resultName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  resultMeta: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  glassFallback: {
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  controls: {
    position: 'absolute',
    right: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
  },
  controlGroup: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  controlButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  locateButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pin: {
    width: PIN_SIZE,
    height: PIN_SIZE,
    borderRadius: PIN_SIZE / 2,
    borderWidth: 3,
    borderColor: colors.white,
    backgroundColor: colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  pinImage: {
    width: '100%',
    height: '100%',
  },
});
