/** Major Indian cities for demo location resolution (no Google Geocoding needed). */
export type CityLocation = {
  label: string;
  lat: number;
  lng: number;
  radiusKm: number;
  aliases: string[];
};

export const CITY_SEARCH_RADIUS_KM = 15;

export const INDIA_CENTER = { lat: 22.5937, lng: 78.9629 };

export const INDIA_BOUNDS: [[number, number], [number, number]] = [
  [6.5, 68.0],
  [35.5, 97.5],
];

/**
 * Major metros + Tier-2 cities. Searching any of these returns ≥7 laptop shops
 * within CITY_SEARCH_RADIUS_KM of the city center.
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
    label: "New Delhi / Delhi (NCR)",
    lat: 28.6139,
    lng: 77.209,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: [
      "new delhi",
      "delhi",
      "ncr",
      "national capital",
      "delhi ncr",
    ],
  },
  {
    label: "Mumbai (Maharashtra)",
    lat: 19.076,
    lng: 72.8777,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["mumbai", "bombay", "maharashtra mumbai"],
  },
  {
    label: "Kolkata (West Bengal)",
    lat: 22.5726,
    lng: 88.3639,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["kolkata", "calcutta", "west bengal"],
  },
  {
    label: "Bengaluru (Karnataka)",
    lat: 12.9716,
    lng: 77.5946,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["bengaluru", "bangalore", "blr", "karnataka"],
  },
  {
    label: "Chennai (Tamil Nadu)",
    lat: 13.0827,
    lng: 80.2707,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["chennai", "madras", "tamil nadu"],
  },
  {
    label: "Hyderabad (Telangana)",
    lat: 17.385,
    lng: 78.4867,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["hyderabad", "secunderabad", "telangana"],
  },
  {
    label: "Ahmedabad (Gujarat)",
    lat: 23.0225,
    lng: 72.5714,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["ahmedabad", "amdavad", "gujarat"],
  },
  {
    label: "Surat (Gujarat)",
    lat: 21.1702,
    lng: 72.8311,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["surat"],
  },
  {
    label: "Pune (Maharashtra)",
    lat: 18.5204,
    lng: 73.8567,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["pune", "poona"],
  },
  {
    label: "Jaipur (Rajasthan)",
    lat: 26.9124,
    lng: 75.7873,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["jaipur", "rajasthan"],
  },
  {
    label: "Lucknow (Uttar Pradesh)",
    lat: 26.8467,
    lng: 80.9462,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["lucknow"],
  },
  {
    label: "Kanpur (Uttar Pradesh)",
    lat: 26.4499,
    lng: 80.3319,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["kanpur"],
  },
  {
    label: "Nagpur (Maharashtra)",
    lat: 21.1458,
    lng: 79.0882,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["nagpur"],
  },
  {
    label: "Indore (Madhya Pradesh)",
    lat: 22.7196,
    lng: 75.8577,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["indore"],
  },
  {
    label: "Patna (Bihar)",
    lat: 25.5941,
    lng: 85.1376,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["patna", "bihar"],
  },
  {
    label: "Bhopal (Madhya Pradesh)",
    lat: 23.2599,
    lng: 77.4126,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["bhopal"],
  },
  {
    label: "Visakhapatnam (Andhra Pradesh)",
    lat: 17.6868,
    lng: 83.2185,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["visakhapatnam", "vizag", "vishakhapatnam"],
  },
  {
    label: "Vadodara (Gujarat)",
    lat: 22.3072,
    lng: 73.1812,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["vadodara", "baroda"],
  },
  {
    label: "Ludhiana (Punjab)",
    lat: 30.901,
    lng: 75.8573,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["ludhiana"],
  },
  {
    label: "Agra (Uttar Pradesh)",
    lat: 27.1767,
    lng: 78.0081,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["agra"],
  },
  {
    label: "Nashik (Maharashtra)",
    lat: 19.9975,
    lng: 73.7898,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["nashik", "nasik"],
  },
  {
    label: "Ranchi (Jharkhand)",
    lat: 23.3441,
    lng: 85.3096,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["ranchi", "jharkhand"],
  },
  {
    label: "Faridabad (Haryana)",
    lat: 28.4089,
    lng: 77.3178,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["faridabad"],
  },
  {
    label: "Meerut (Uttar Pradesh)",
    lat: 28.9845,
    lng: 77.7064,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["meerut"],
  },
  {
    label: "Rajkot (Gujarat)",
    lat: 22.3039,
    lng: 70.8022,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["rajkot"],
  },
  {
    label: "Varanasi (Uttar Pradesh)",
    lat: 25.3176,
    lng: 82.9739,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["varanasi", "banaras", "benaras"],
  },
  {
    label: "Srinagar (Jammu and Kashmir)",
    lat: 34.0837,
    lng: 74.7973,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["srinagar", "jammu and kashmir", "kashmir"],
  },
  {
    label: "Chhatrapati Sambhajinagar (Aurangabad)",
    lat: 19.8762,
    lng: 75.3433,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: [
      "aurangabad",
      "chhatrapati sambhajinagar",
      "sambhajinagar",
      "chhatrapati sambhaji nagar",
    ],
  },
  {
    label: "Dhanbad (Jharkhand)",
    lat: 23.7957,
    lng: 86.4304,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["dhanbad"],
  },
  {
    label: "Amritsar (Punjab)",
    lat: 31.634,
    lng: 74.8723,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["amritsar"],
  },
  {
    label: "Navi Mumbai (Maharashtra)",
    lat: 19.033,
    lng: 73.0297,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["navi mumbai", "new mumbai", "nerul", "vashi"],
  },
  {
    label: "Prayagraj (Allahabad)",
    lat: 25.4358,
    lng: 81.8463,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["prayagraj", "allahabad"],
  },
  {
    label: "Howrah (West Bengal)",
    lat: 22.5958,
    lng: 88.2636,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["howrah"],
  },
  {
    label: "Gwalior (Madhya Pradesh)",
    lat: 26.2183,
    lng: 78.1828,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["gwalior"],
  },
  {
    label: "Jabalpur (Madhya Pradesh)",
    lat: 23.1815,
    lng: 79.9864,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["jabalpur"],
  },
  {
    label: "Coimbatore (Tamil Nadu)",
    lat: 11.0168,
    lng: 76.9558,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["coimbatore", "kovai"],
  },
  {
    label: "Vijayawada (Andhra Pradesh)",
    lat: 16.5062,
    lng: 80.648,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["vijayawada", "bezawada"],
  },
  {
    label: "Jodhpur (Rajasthan)",
    lat: 26.2389,
    lng: 73.0243,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["jodhpur"],
  },
  {
    label: "Madurai (Tamil Nadu)",
    lat: 9.9252,
    lng: 78.1198,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["madurai"],
  },
  {
    label: "Raipur (Chhattisgarh)",
    lat: 21.2514,
    lng: 81.6296,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["raipur", "chhattisgarh"],
  },
  {
    label: "Kota (Rajasthan)",
    lat: 25.2138,
    lng: 75.8648,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["kota"],
  },
  {
    label: "Chandigarh (Union Territory)",
    lat: 30.7333,
    lng: 76.7794,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["chandigarh", "mohali"],
  },
  {
    label: "Guwahati (Assam)",
    lat: 26.1445,
    lng: 91.7362,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["guwahati", "assam", "gauhati"],
  },
  {
    label: "Solapur (Maharashtra)",
    lat: 17.6599,
    lng: 75.9064,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["solapur", "sholapur"],
  },
  {
    label: "Hubli-Dharwad (Karnataka)",
    lat: 15.3647,
    lng: 75.124,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["hubli", "dharwad", "hubli-dharwad", "hubballi"],
  },
  {
    label: "Bareilly (Uttar Pradesh)",
    lat: 28.367,
    lng: 79.4304,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["bareilly"],
  },
  {
    label: "Moradabad (Uttar Pradesh)",
    lat: 28.8386,
    lng: 78.7733,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["moradabad"],
  },
  {
    label: "Mysuru (Karnataka)",
    lat: 12.2958,
    lng: 76.6394,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["mysuru", "mysore"],
  },
  {
    label: "Gurugram (Haryana)",
    lat: 28.4595,
    lng: 77.0266,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["gurugram", "gurgaon"],
  },
  {
    label: "Noida (Uttar Pradesh)",
    lat: 28.5355,
    lng: 77.391,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["noida", "greater noida"],
  },
  {
    label: "Kochi (Kerala)",
    lat: 9.9312,
    lng: 76.2673,
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ["kochi", "cochin", "kerala"],
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

  // Exact label / alias match first
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

  // Starts-with / includes — require alias length ≥ 4 to avoid weak matches
  let best: (typeof INDIA_CITIES)[number] | null = null;
  let bestLen = 0;
  for (const city of INDIA_CITIES) {
    const candidates = [city.label.toLowerCase(), ...city.aliases];
    for (const c of candidates) {
      if (c.length < 4) continue;
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
      isIndiaWide: best.label === "India",
    };
  }

  return {
    label: input.trim(),
    lat: INDIA_CENTER.lat,
    lng: INDIA_CENTER.lng,
    radiusKm: 2500,
    isIndiaWide: true,
  };
}
