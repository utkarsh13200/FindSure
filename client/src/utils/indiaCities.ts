/** Major Indian cities for demo location resolution (no Google Geocoding needed). */
export type CityLocation = {
  label: string;
  lat: number;
  lng: number;
  radiusKm: number;
  aliases: string[];
};

export const CITY_SEARCH_RADIUS_KM = 10;

export const INDIA_CENTER = { lat: 22.5937, lng: 78.9629 };

export const INDIA_BOUNDS: [[number, number], [number, number]] = [
  [6.5, 68.0],
  [35.5, 97.5],
];

/**
 * Searchable cities for FindSure demo. Each city seeds ≥8 unique laptop-repair shops
 * within CITY_SEARCH_RADIUS_KM (10 km) of the city center.
 */
export const INDIA_CITIES: CityLocation[] = [
  {
    label: "India",
    lat: INDIA_CENTER.lat,
    lng: INDIA_CENTER.lng,
    radiusKm: 2500,
    aliases: ["india", "all india", "pan india", "nationwide"],
  },
  {
    label: "Mumbai, Maharashtra",
    lat: 19.076,
    lng: 72.8777,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["mumbai","bombay"],
  },
  {
    label: "Delhi, National Capital Territory",
    lat: 28.6139,
    lng: 77.209,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["delhi","new delhi","nct","national capital territory","delhi ncr"],
  },
  {
    label: "Bengaluru, Karnataka",
    lat: 12.9716,
    lng: 77.5946,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["bengaluru","bangalore","blr"],
  },
  {
    label: "Kolkata, West Bengal",
    lat: 22.5726,
    lng: 88.3639,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["kolkata","calcutta"],
  },
  {
    label: "Chennai, Tamil Nadu",
    lat: 13.0827,
    lng: 80.2707,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["chennai","madras"],
  },
  {
    label: "Hyderabad, Telangana",
    lat: 17.385,
    lng: 78.4867,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["hyderabad","secunderabad"],
  },
  {
    label: "Ahmedabad, Gujarat",
    lat: 23.0225,
    lng: 72.5714,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["ahmedabad","amdavad"],
  },
  {
    label: "Pune, Maharashtra",
    lat: 18.5204,
    lng: 73.8567,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["pune","poona"],
  },
  {
    label: "Surat, Gujarat",
    lat: 21.1702,
    lng: 72.8311,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["surat"],
  },
  {
    label: "Jaipur, Rajasthan",
    lat: 26.9124,
    lng: 75.7873,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["jaipur"],
  },
  {
    label: "Lucknow, Uttar Pradesh",
    lat: 26.8467,
    lng: 80.9462,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["lucknow"],
  },
  {
    label: "Kanpur, Uttar Pradesh",
    lat: 26.4499,
    lng: 80.3319,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["kanpur"],
  },
  {
    label: "Nagpur, Maharashtra",
    lat: 21.1458,
    lng: 79.0882,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["nagpur"],
  },
  {
    label: "Indore, Madhya Pradesh",
    lat: 22.7196,
    lng: 75.8577,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["indore"],
  },
  {
    label: "Thane, Maharashtra",
    lat: 19.2183,
    lng: 72.9781,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["thane"],
  },
  {
    label: "Bhopal, Madhya Pradesh",
    lat: 23.2599,
    lng: 77.4126,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["bhopal"],
  },
  {
    label: "Visakhapatnam, Andhra Pradesh",
    lat: 17.6868,
    lng: 83.2185,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["visakhapatnam","vizag","vishakhapatnam"],
  },
  {
    label: "Patna, Bihar",
    lat: 25.5941,
    lng: 85.1376,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["patna"],
  },
  {
    label: "Vadodara, Gujarat",
    lat: 22.3072,
    lng: 73.1812,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["vadodara","baroda"],
  },
  {
    label: "Ghaziabad, Uttar Pradesh",
    lat: 28.6692,
    lng: 77.4538,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["ghaziabad"],
  },
  {
    label: "Ludhiana, Punjab",
    lat: 30.901,
    lng: 75.8573,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["ludhiana"],
  },
  {
    label: "Agra, Uttar Pradesh",
    lat: 27.1767,
    lng: 78.0081,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["agra"],
  },
  {
    label: "Nashik, Maharashtra",
    lat: 19.9975,
    lng: 73.7898,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["nashik","nasik"],
  },
  {
    label: "Ranchi, Jharkhand",
    lat: 23.3441,
    lng: 85.3096,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["ranchi"],
  },
  {
    label: "Faridabad, Haryana",
    lat: 28.4089,
    lng: 77.3178,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["faridabad"],
  },
  {
    label: "Meerut, Uttar Pradesh",
    lat: 28.9845,
    lng: 77.7064,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["meerut"],
  },
  {
    label: "Rajkot, Gujarat",
    lat: 22.3039,
    lng: 70.8022,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["rajkot"],
  },
  {
    label: "Kalyan-Dombivli, Maharashtra",
    lat: 19.2403,
    lng: 73.1305,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["kalyan","dombivli","kalyan-dombivli","kalyan dombivli"],
  },
  {
    label: "Vasai-Virar, Maharashtra",
    lat: 19.3919,
    lng: 72.8397,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["vasai","virar","vasai-virar","vasai virar"],
  },
  {
    label: "Varanasi, Uttar Pradesh",
    lat: 25.3176,
    lng: 82.9739,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["varanasi","banaras","benaras"],
  },
  {
    label: "Srinagar, Jammu and Kashmir",
    lat: 34.0837,
    lng: 74.7973,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["srinagar","kashmir"],
  },
  {
    label: "Aurangabad (Chhatrapati Sambhajinagar), Maharashtra",
    lat: 19.8762,
    lng: 75.3433,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["aurangabad","chhatrapati sambhajinagar","sambhajinagar"],
  },
  {
    label: "Dhanbad, Jharkhand",
    lat: 23.7957,
    lng: 86.4304,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["dhanbad"],
  },
  {
    label: "Amritsar, Punjab",
    lat: 31.634,
    lng: 74.8723,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["amritsar"],
  },
  {
    label: "Navi Mumbai, Maharashtra",
    lat: 19.033,
    lng: 73.0297,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["navi mumbai","new mumbai","vashi","nerul"],
  },
  {
    label: "Allahabad (Prayagraj), Uttar Pradesh",
    lat: 25.4358,
    lng: 81.8463,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["prayagraj","allahabad"],
  },
  {
    label: "Howrah, West Bengal",
    lat: 22.5958,
    lng: 88.2636,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["howrah"],
  },
  {
    label: "Gwalior, Madhya Pradesh",
    lat: 26.2183,
    lng: 78.1828,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["gwalior"],
  },
  {
    label: "Jabalpur, Madhya Pradesh",
    lat: 23.1815,
    lng: 79.9864,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["jabalpur"],
  },
  {
    label: "Coimbatore, Tamil Nadu",
    lat: 11.0168,
    lng: 76.9558,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["coimbatore","kovai"],
  },
  {
    label: "Vijayawada, Andhra Pradesh",
    lat: 16.5062,
    lng: 80.648,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["vijayawada","bezawada"],
  },
  {
    label: "Jodhpur, Rajasthan",
    lat: 26.2389,
    lng: 73.0243,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["jodhpur"],
  },
  {
    label: "Madurai, Tamil Nadu",
    lat: 9.9252,
    lng: 78.1198,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["madurai"],
  },
  {
    label: "Raipur, Chhattisgarh",
    lat: 21.2514,
    lng: 81.6296,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["raipur"],
  },
  {
    label: "Chandigarh, Punjab and Haryana",
    lat: 30.7333,
    lng: 76.7794,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["chandigarh","mohali"],
  },
  {
    label: "Guwahati, Assam",
    lat: 26.1445,
    lng: 91.7362,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["guwahati","gauhati"],
  },
  {
    label: "Solapur, Maharashtra",
    lat: 17.6599,
    lng: 75.9064,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["solapur","sholapur"],
  },
  {
    label: "Hubballi-Dharwad, Karnataka",
    lat: 15.3647,
    lng: 75.124,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["hubli","dharwad","hubballi","hubli-dharwad","hubballi-dharwad"],
  },
  {
    label: "Bareilly, Uttar Pradesh",
    lat: 28.367,
    lng: 79.4304,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["bareilly"],
  },
  {
    label: "Moradabad, Uttar Pradesh",
    lat: 28.8386,
    lng: 78.7733,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["moradabad"],
  },
  {
    label: "Mysuru, Karnataka",
    lat: 12.2958,
    lng: 76.6394,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["mysuru","mysore"],
  },
  {
    label: "Gurugram, Haryana",
    lat: 28.4595,
    lng: 77.0266,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["gurugram","gurgaon"],
  },
  {
    label: "Aligarh, Uttar Pradesh",
    lat: 27.8974,
    lng: 78.088,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["aligarh"],
  },
  {
    label: "Jalandhar, Punjab",
    lat: 31.326,
    lng: 75.5762,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["jalandhar"],
  },
  {
    label: "Tiruchirappalli, Tamil Nadu",
    lat: 10.7905,
    lng: 78.7047,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["tiruchirappalli","trichy","tiruchi"],
  },
  {
    label: "Bhubaneswar, Odisha",
    lat: 20.2961,
    lng: 85.8245,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["bhubaneswar","bhubaneshwar"],
  },
  {
    label: "Salem, Tamil Nadu",
    lat: 11.6643,
    lng: 78.146,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["salem"],
  },
  {
    label: "Mira-Bhayandar, Maharashtra",
    lat: 19.2952,
    lng: 72.8544,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["mira","bhayandar","mira-bhayandar","mira road"],
  },
  {
    label: "Thiruvananthapuram, Kerala",
    lat: 8.5241,
    lng: 76.9366,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["thiruvananthapuram","trivandrum","tvm"],
  },
  {
    label: "Bhiwandi, Maharashtra",
    lat: 19.2813,
    lng: 73.0485,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["bhiwandi"],
  },
  {
    label: "Saharanpur, Uttar Pradesh",
    lat: 29.968,
    lng: 77.546,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["saharanpur"],
  },
  {
    label: "Gorakhpur, Uttar Pradesh",
    lat: 26.7606,
    lng: 83.3732,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["gorakhpur"],
  },
  {
    label: "Guntur, Andhra Pradesh",
    lat: 16.3067,
    lng: 80.4365,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["guntur"],
  },
  {
    label: "Bikaner, Rajasthan",
    lat: 28.0229,
    lng: 73.3119,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["bikaner"],
  },
  {
    label: "Amravati, Maharashtra",
    lat: 20.9374,
    lng: 77.7796,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["amravati"],
  },
  {
    label: "Noida, Uttar Pradesh",
    lat: 28.5355,
    lng: 77.391,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["noida","greater noida"],
  },
  {
    label: "Jamshedpur, Jharkhand",
    lat: 22.8046,
    lng: 86.2029,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["jamshedpur","tatanagar"],
  },
  {
    label: "Bhilai, Chhattisgarh",
    lat: 21.1938,
    lng: 81.3509,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["bhilai"],
  },
  {
    label: "Cuttack, Odisha",
    lat: 20.4625,
    lng: 85.8828,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["cuttack"],
  },
  {
    label: "Firozabad, Uttar Pradesh",
    lat: 27.1592,
    lng: 78.3957,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["firozabad"],
  },
  {
    label: "Kochi, Kerala",
    lat: 9.9312,
    lng: 76.2673,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["kochi","cochin"],
  },
  {
    label: "Nellore, Andhra Pradesh",
    lat: 14.4426,
    lng: 79.9865,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["nellore"],
  },
  {
    label: "Bhavnagar, Gujarat",
    lat: 21.7645,
    lng: 72.1519,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["bhavnagar"],
  },
  {
    label: "Dehradun, Uttarakhand",
    lat: 30.3165,
    lng: 78.0322,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["dehradun","dehra dun"],
  },
  {
    label: "Durgapur, West Bengal",
    lat: 23.5204,
    lng: 87.3119,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["durgapur"],
  },
  {
    label: "Asansol, West Bengal",
    lat: 23.6739,
    lng: 86.9524,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["asansol"],
  },
  {
    label: "Rourkela, Odisha",
    lat: 22.2604,
    lng: 84.8536,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["rourkela"],
  },
  {
    label: "Nanded, Maharashtra",
    lat: 19.1383,
    lng: 77.321,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["nanded"],
  },
  {
    label: "Kolhapur, Maharashtra",
    lat: 16.705,
    lng: 74.2433,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["kolhapur"],
  },
  {
    label: "Ajmer, Rajasthan",
    lat: 26.4499,
    lng: 74.6399,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["ajmer"],
  },
  {
    label: "Akola, Maharashtra",
    lat: 20.7002,
    lng: 77.0082,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["akola"],
  },
  {
    label: "Gulbarga (Kalaburagi), Karnataka",
    lat: 17.3297,
    lng: 76.8343,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["gulbarga","kalaburagi"],
  },
  {
    label: "Jamnagar, Gujarat",
    lat: 22.4707,
    lng: 70.0577,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["jamnagar"],
  },
  {
    label: "Ujjain, Madhya Pradesh",
    lat: 23.1765,
    lng: 75.7885,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["ujjain"],
  },
  {
    label: "Loni, Maharashtra",
    lat: 18.4865,
    lng: 74.0278,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["loni","loni kalbhor"],
  },
  {
    label: "Siliguri, West Bengal",
    lat: 26.7271,
    lng: 88.3953,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["siliguri"],
  },
  {
    label: "Jhansi, Uttar Pradesh",
    lat: 25.4484,
    lng: 78.5685,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["jhansi"],
  },
  {
    label: "Ulhasnagar, Maharashtra",
    lat: 19.2215,
    lng: 73.1645,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["ulhasnagar"],
  },
  {
    label: "Sangli, Maharashtra",
    lat: 16.8524,
    lng: 74.5815,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["sangli","miraj"],
  },
  {
    label: "Mangaluru, Karnataka",
    lat: 12.9141,
    lng: 74.856,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["mangaluru","mangalore"],
  },
  {
    label: "Erode, Tamil Nadu",
    lat: 11.341,
    lng: 77.7172,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["erode"],
  },
  {
    label: "Belagavi, Karnataka",
    lat: 15.8497,
    lng: 74.4977,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["belagavi","belgaum"],
  },
  {
    label: "Ambattur, Tamil Nadu",
    lat: 13.1143,
    lng: 80.1548,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["ambattur"],
  },
  {
    label: "Tirunelveli, Tamil Nadu",
    lat: 8.7139,
    lng: 77.7567,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["tirunelveli","nellai"],
  },
  {
    label: "Malegaon, Maharashtra",
    lat: 20.5579,
    lng: 74.5287,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["malegaon"],
  },
  {
    label: "Gaya, Bihar",
    lat: 24.7914,
    lng: 85.0002,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["gaya"],
  },
  {
    label: "Jalgaon, Maharashtra",
    lat: 21.0077,
    lng: 75.5626,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["jalgaon"],
  },
  {
    label: "Udaipur, Rajasthan",
    lat: 24.5854,
    lng: 73.7125,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["udaipur"],
  },
  {
    label: "Maheshtala, West Bengal",
    lat: 22.5086,
    lng: 88.2532,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["maheshtala"],
  },
];

export function resolveIndiaLocation(input: string): {
  label: string;
  lat: number;
  lng: number;
  radiusKm: number;
  isIndiaWide: boolean;
} {
  const raw = input.trim().toLowerCase();
  if (!raw) {
    return {
      label: "India",
      lat: INDIA_CENTER.lat,
      lng: INDIA_CENTER.lng,
      radiusKm: 2500,
      isIndiaWide: true,
    };
  }

  for (const city of INDIA_CITIES) {
    if (city.label.toLowerCase() === raw) {
      return {
        label: city.label,
        lat: city.lat,
        lng: city.lng,
        radiusKm: city.radiusKm,
        isIndiaWide: city.label === "India",
      };
    }
    for (const alias of city.aliases) {
      if (raw === alias) {
        return {
          label: city.label,
          lat: city.lat,
          lng: city.lng,
          radiusKm: city.radiusKm,
          isIndiaWide: city.label === "India",
        };
      }
    }
  }

  let best: (typeof INDIA_CITIES)[number] | null = null;
  let bestLen = 0;
  for (const city of INDIA_CITIES) {
    // Prefer real cities over the pan-India entry during fuzzy match.
    if (city.label === "India") continue;
    const candidates = [city.label.toLowerCase(), ...city.aliases];
    for (const c of candidates) {
      if (c.length < 3) continue;
      if (raw.includes(c) || c.includes(raw)) {
        if (c.length > bestLen) {
          best = city;
          bestLen = c.length;
        }
      }
    }
  }

  if (best) {
    return {
      label: best.label,
      lat: best.lat,
      lng: best.lng,
      radiusKm: best.radiusKm,
      isIndiaWide: false,
    };
  }

  // Unknown place: never fall back to India-wide (that was returning shops 1000+ km away).
  return {
    label: input.trim(),
    lat: INDIA_CENTER.lat,
    lng: INDIA_CENTER.lng,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    isIndiaWide: false,
  };
}

/** Detect a known city name mentioned inside free text (query or location field). */
export function findCityMention(text: string): CityLocation | null {
  const raw = text.trim().toLowerCase();
  if (!raw) return null;

  let best: CityLocation | null = null;
  let bestLen = 0;
  for (const city of INDIA_CITIES) {
    if (city.label === "India") continue;
    const candidates = [
      city.label.toLowerCase(),
      city.label.split(",")[0].trim().toLowerCase(),
      ...city.aliases,
    ];
    for (const c of candidates) {
      if (c.length < 3) continue;
      // Word-boundary-ish match so "surat" does not steal inside longer tokens wrongly
      const re = new RegExp(`(?:^|[^a-z])${c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:$|[^a-z])`, "i");
      if (re.test(raw) || raw === c) {
        if (c.length > bestLen) {
          best = city;
          bestLen = c.length;
        }
      }
    }
  }
  return best;
}
