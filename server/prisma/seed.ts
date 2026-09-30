import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SHOPS_PER_CITY = 8;

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

/** Deterministic PRNG so re-seeds stay stable but every city/shop differs. */
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length) % arr.length];
}

function intBetween(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

function floatBetween(rng: () => number, min: number, max: number, digits = 1): number {
  const v = min + rng() * (max - min);
  const f = 10 ** digits;
  return Math.round(v * f) / f;
}

type CityDef = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  areas: string[];
  phonePrefix: string;
};

const CITIES: CityDef[] = [
  { id: "mumbai", name: "Mumbai", lat: 19.076, lng: 72.8777, areas: ["Bandra West","Andheri East","Powai","Lower Parel","Dadar","Goregaon","Colaba","Kurla"], phonePrefix: "+91 22 2640" },
  { id: "delhi", name: "Delhi", lat: 28.6139, lng: 77.209, areas: ["Connaught Place","Nehru Place","Karol Bagh","Saket","Lajpat Nagar","Dwarka","Rohini","Laxmi Nagar"], phonePrefix: "+91 11 4050" },
  { id: "bengaluru", name: "Bengaluru", lat: 12.9716, lng: 77.5946, areas: ["MG Road","Indiranagar","Koramangala","Jayanagar","HSR Layout","Whitefield","Malleshwaram","BTM"], phonePrefix: "+91 80 4123" },
  { id: "kolkata", name: "Kolkata", lat: 22.5726, lng: 88.3639, areas: ["Park Street","Salt Lake","Gariahat","New Town","Esplanade","Behala","Ballygunge","Tollygunge"], phonePrefix: "+91 33 4000" },
  { id: "chennai", name: "Chennai", lat: 13.0827, lng: 80.2707, areas: ["T. Nagar","Anna Nagar","Adyar","Velachery","Nungambakkam","OMR","Porur","Tambaram"], phonePrefix: "+91 44 2434" },
  { id: "hyderabad", name: "Hyderabad", lat: 17.385, lng: 78.4867, areas: ["Jubilee Hills","Hitech City","Banjara Hills","Ameerpet","Gachibowli","Secunderabad","Kukatpally","Madhapur"], phonePrefix: "+91 40 4010" },
  { id: "ahmedabad", name: "Ahmedabad", lat: 23.0225, lng: 72.5714, areas: ["C.G. Road","Satellite","Bopal","Navrangpura","Maninagar","Prahlad Nagar","Vastrapur","Thaltej"], phonePrefix: "+91 79 2640" },
  { id: "pune", name: "Pune", lat: 18.5204, lng: 73.8567, areas: ["FC Road","Koregaon Park","Hinjewadi","Kothrud","Baner","Hadapsar","Camp","Wakad"], phonePrefix: "+91 20 2553" },
  { id: "surat", name: "Surat", lat: 21.1702, lng: 72.8311, areas: ["Adajan","Vesu","Varachha","City Light","Athwa","Piplod","Katargam","Pal"], phonePrefix: "+91 261 246" },
  { id: "jaipur", name: "Jaipur", lat: 26.9124, lng: 75.7873, areas: ["MI Road","Vaishali Nagar","Malviya Nagar","C-Scheme","Tonk Road","Raja Park","Sitapura","Mansarovar"], phonePrefix: "+91 141 236" },
  { id: "lucknow", name: "Lucknow", lat: 26.8467, lng: 80.9462, areas: ["Hazratganj","Gomti Nagar","Aliganj","Indira Nagar","Aminabad","Chowk","Alambagh","Rajajipuram"], phonePrefix: "+91 522 400" },
  { id: "kanpur", name: "Kanpur", lat: 26.4499, lng: 80.3319, areas: ["Mall Road","Kakadeo","Swaroop Nagar","Kidwai Nagar","Govind Nagar","Rawatpur","Kalyanpur","Barra"], phonePrefix: "+91 512 230" },
  { id: "nagpur", name: "Nagpur", lat: 21.1458, lng: 79.0882, areas: ["Sitabuldi","Dharampeth","Manish Nagar","Wardhaman Nagar","Sadar","Trimurti Nagar","Pratap Nagar","Hingna"], phonePrefix: "+91 712 254" },
  { id: "indore", name: "Indore", lat: 22.7196, lng: 75.8577, areas: ["Vijay Nagar","Sapna Sangeeta","Palasia","Rajendra Nagar","Bhawarkuan","AB Road","Sudama Nagar","Scheme 78"], phonePrefix: "+91 731 254" },
  { id: "thane", name: "Thane", lat: 19.2183, lng: 72.9781, areas: ["Gokhale Road","Naupada","Kopri","Wagle Estate","Hiranandani Estate","Majiwada","Kolshet","Cadbury Junction"], phonePrefix: "+91 22 2533" },
  { id: "bhopal", name: "Bhopal", lat: 23.2599, lng: 77.4126, areas: ["MP Nagar","Arera Colony","New Market","Kolar Road","Berasia Road","Habibganj","Indrapuri","Bawadia Kalan"], phonePrefix: "+91 755 255" },
  { id: "vizag", name: "Visakhapatnam", lat: 17.6868, lng: 83.2185, areas: ["Dwaraka Nagar","MVP Colony","Gajuwaka","Siripuram","Madhurawada","Seethammadhara","NAD","Rushikonda"], phonePrefix: "+91 891 256" },
  { id: "patna", name: "Patna", lat: 25.5941, lng: 85.1376, areas: ["Boring Road","Fraser Road","Kankarbagh","Patliputra","Rajendra Nagar","Bailey Road","Ashiana","Danapur"], phonePrefix: "+91 612 220" },
  { id: "vadodara", name: "Vadodara", lat: 22.3072, lng: 73.1812, areas: ["Alkapuri","Fatehgunj","Akota","Gotri","Manjalpur","Karelibaug","Sayajigunj","Vasna"], phonePrefix: "+91 265 242" },
  { id: "ghaziabad", name: "Ghaziabad", lat: 28.6692, lng: 77.4538, areas: ["Raj Nagar","Indirapuram","Vaishali","Crossings Republik","Kaushambi","Sahibabad","Vasundhara","NH-24"], phonePrefix: "+91 120 270" },
  { id: "ludhiana", name: "Ludhiana", lat: 30.901, lng: 75.8573, areas: ["Model Town","Sarabha Nagar","Civil Lines","BRS Nagar","Feroze Gandhi Market","Dugri","PAU","Focal Point"], phonePrefix: "+91 161 244" },
  { id: "agra", name: "Agra", lat: 27.1767, lng: 78.0081, areas: ["Sadar Bazaar","Kamla Nagar","Sikandra","Tajganj","Dayal Bagh","Shahganj","Trans Yamuna","Khandari"], phonePrefix: "+91 562 222" },
  { id: "nashik", name: "Nashik", lat: 19.9975, lng: 73.7898, areas: ["College Road","Gangapur Road","Panchavati","Cidco","Satpur","Indira Nagar","Pathardi Phata","Dwarka"], phonePrefix: "+91 253 257" },
  { id: "ranchi", name: "Ranchi", lat: 23.3441, lng: 85.3096, areas: ["Main Road","Lalpur","Doranda","Ashok Nagar","Harmu","Kanke","Hinoo","Morabadi"], phonePrefix: "+91 651 220" },
  { id: "faridabad", name: "Faridabad", lat: 28.4089, lng: 77.3178, areas: ["Sector 15","NIT","Greater Faridabad","Sector 37","Ballabhgarh","Greenfield","Sector 21","Neelam Chowk"], phonePrefix: "+91 129 222" },
  { id: "meerut", name: "Meerut", lat: 28.9845, lng: 77.7064, areas: ["Abu Lane","Shastri Nagar","Civil Lines","Begum Bridge","Pallavpuram","Ganga Nagar","Hapur Road","Partapur"], phonePrefix: "+91 121 264" },
  { id: "rajkot", name: "Rajkot", lat: 22.3039, lng: 70.8022, areas: ["Kalawad Road","Race Course","Gondal Road","Mavdi","150 Feet Ring Road","University Road","Yagnik Road","Kotecha Chowk"], phonePrefix: "+91 281 246" },
  { id: "kalyan", name: "Kalyan-Dombivli", lat: 19.2403, lng: 73.1305, areas: ["Kalyan Station","Dombivli East","Dombivli West","Titwala Road","Bail Bazar","Kopar","Manpada","Shahad"], phonePrefix: "+91 251 220" },
  { id: "vasai", name: "Vasai-Virar", lat: 19.3919, lng: 72.8397, areas: ["Vasai West","Virar West","Nallasopara","Naigaon","Global City","Evershine City","Agashi","Manikpur"], phonePrefix: "+91 250 233" },
  { id: "varanasi", name: "Varanasi", lat: 25.3176, lng: 82.9739, areas: ["Sigra","Lanka","Bhelupur","Godowlia","Mahmoorganj","Cantt","Ashapur","Lanka Gate"], phonePrefix: "+91 542 222" },
  { id: "srinagar", name: "Srinagar", lat: 34.0837, lng: 74.7973, areas: ["Lal Chowk","Residency Road","Rajbagh","Hazratbal","Bemina","Jawahar Nagar","Nowgam","Boulevard"], phonePrefix: "+91 194 245" },
  { id: "aurangabad", name: "Chhatrapati Sambhajinagar", lat: 19.8762, lng: 75.3433, areas: ["Cidco","Osmanpura","Jalna Road","Kranti Chowk","Garkheda","Station Road","Mukundwadi","Gulmandi"], phonePrefix: "+91 240 235" },
  { id: "dhanbad", name: "Dhanbad", lat: 23.7957, lng: 86.4304, areas: ["Bank More","Hirapur","Saraidhela","Bartand","Govindpur","Jharia Road","City Centre","Dhaiya"], phonePrefix: "+91 326 230" },
  { id: "amritsar", name: "Amritsar", lat: 31.634, lng: 74.8723, areas: ["Hall Bazaar","Ranjit Avenue","Lawrence Road","Putlighar","White Avenue","GT Road","Basant Avenue","Mall Road"], phonePrefix: "+91 183 222" },
  { id: "navimumbai", name: "Navi Mumbai", lat: 19.033, lng: 73.0297, areas: ["Vashi","Nerul","Kharghar","Belapur","Airoli","Sanpada","Seawoods","Panvel"], phonePrefix: "+91 22 2770" },
  { id: "prayagraj", name: "Prayagraj", lat: 25.4358, lng: 81.8463, areas: ["Civil Lines","Katra","Colonelganj","Tagore Town","Mumfordganj","Naini","Georgetown","Zero Road"], phonePrefix: "+91 532 242" },
  { id: "howrah", name: "Howrah", lat: 22.5958, lng: 88.2636, areas: ["Howrah Maidan","Shibpur","Golabari","Salkia","Bally","Liluah","Belur","Santragachi"], phonePrefix: "+91 33 2641" },
  { id: "gwalior", name: "Gwalior", lat: 26.2183, lng: 78.1828, areas: ["City Centre","Lashkar","Morar","Thatipur","DD Nagar","Race Course","Phoolbagh","City Center Mall"], phonePrefix: "+91 751 234" },
  { id: "jabalpur", name: "Jabalpur", lat: 23.1815, lng: 79.9864, areas: ["Civic Centre","Wright Town","Napier Town","Gorakhpur","Vijay Nagar","Adhartal","Madan Mahal","Cantt"], phonePrefix: "+91 761 262" },
  { id: "coimbatore", name: "Coimbatore", lat: 11.0168, lng: 76.9558, areas: ["RS Puram","Gandhipuram","Peelamedu","Saibaba Colony","Race Course","Singanallur","Saravanampatti","Ukkadam"], phonePrefix: "+91 422 224" },
  { id: "vijayawada", name: "Vijayawada", lat: 16.5062, lng: 80.648, areas: ["Benz Circle","Governorpet","MG Road","Labbipet","Patamata","Auto Nagar","Gunadala","One Town"], phonePrefix: "+91 866 247" },
  { id: "jodhpur", name: "Jodhpur", lat: 26.2389, lng: 73.0243, areas: ["Sardarpura","Ratanada","Paota","Chopasni","Basni","Shastri Nagar","Circuit House","Masuriya"], phonePrefix: "+91 291 251" },
  { id: "madurai", name: "Madurai", lat: 9.9252, lng: 78.1198, areas: ["Anna Nagar","KK Nagar","Simmakkal","Goripalayam","Tallakulam","SS Colony","Thirunagar","Mattuthavani"], phonePrefix: "+91 452 253" },
  { id: "raipur", name: "Raipur", lat: 21.2514, lng: 81.6296, areas: ["Pandri","Telibandha","Shankar Nagar","Civil Lines","Tatibandh","Amapara","Magneto Mall Road","GE Road"], phonePrefix: "+91 771 242" },
  { id: "chandigarh", name: "Chandigarh", lat: 30.7333, lng: 76.7794, areas: ["Sector 17","Sector 35","Sector 22","Industrial Area","Sector 43","Manimajra","Sector 8","Sector 26"], phonePrefix: "+91 172 500" },
  { id: "guwahati", name: "Guwahati", lat: 26.1445, lng: 91.7362, areas: ["Paltan Bazaar","Zoo Road","Chandmari","Dispur","Beltola","Fancy Bazaar","GS Road","Six Mile"], phonePrefix: "+91 361 254" },
  { id: "solapur", name: "Solapur", lat: 17.6599, lng: 75.9064, areas: ["Railway Lines","Hotgi Road","Park Chowk","Jule Solapur","Akkalkot Road","Budhwar Peth","Sidheshwar","Bijapur Road"], phonePrefix: "+91 217 274" },
  { id: "hubli", name: "Hubballi-Dharwad", lat: 15.3647, lng: 75.124, areas: ["Vidyanagar","Keshwapur","Gokul Road","Deshpande Nagar","CBT","Unkal","Dharwad Market","Navanagar"], phonePrefix: "+91 836 235" },
  { id: "bareilly", name: "Bareilly", lat: 28.367, lng: 79.4304, areas: ["Civil Lines","Rajendra Nagar","DD Puram","Pilibhit Road","Subhash Nagar","Qila","Izatnagar","Phoenix Mall Road"], phonePrefix: "+91 581 251" },
  { id: "moradabad", name: "Moradabad", lat: 28.8386, lng: 78.7733, areas: ["Civil Lines","Budh Bazaar","Kanth Road","Majhola","Prem Nagar","Line Par","Sonakpur","Delhi Road"], phonePrefix: "+91 591 241" },
  { id: "mysuru", name: "Mysuru", lat: 12.2958, lng: 76.6394, areas: ["V V Mohalla","Saraswathipuram","Gokulam","Kuvempunagar","Jayalakshmipuram","Hebbal","Vijayanagar","Nazarbad"], phonePrefix: "+91 821 242" },
  { id: "gurugram", name: "Gurugram", lat: 28.4595, lng: 77.0266, areas: ["Cyber City","Sector 29","MG Road","Sohna Road","DLF Phase 1","Golf Course Road","Sector 56","Sector 14"], phonePrefix: "+91 124 456" },
  { id: "aligarh", name: "Aligarh", lat: 27.8974, lng: 78.088, areas: ["Ramghat Road","Centre Point","Civil Lines","GT Road","Quarsi","Medical Road","Dodhpur","University Area"], phonePrefix: "+91 571 240" },
  { id: "jalandhar", name: "Jalandhar", lat: 31.326, lng: 75.5762, areas: ["Model Town","Nakodar Road","GT Road","Civil Lines","Rama Mandi","Ladowali Road","Phagwara Road","Cantt"], phonePrefix: "+91 181 222" },
  { id: "trichy", name: "Tiruchirappalli", lat: 10.7905, lng: 78.7047, areas: ["Thillai Nagar","Cantonment","Srirangam","Woraiyur","KK Nagar","Puthur","TVS Tolgate","Central Bus Stand"], phonePrefix: "+91 431 241" },
  { id: "bhubaneswar", name: "Bhubaneswar", lat: 20.2961, lng: 85.8245, areas: ["Saheed Nagar","Jayadev Vihar","Patia","Chandrasekharpur","Old Town","Unit 1","Khandagiri","Infocity"], phonePrefix: "+91 674 230" },
  { id: "salem", name: "Salem", lat: 11.6643, lng: 78.146, areas: ["Fairlands","Hasthampatti","Suramangalam","Five Roads","Shevapet","Alagapuram","Kondalampatti","Omalur Road"], phonePrefix: "+91 427 244" },
  { id: "mira", name: "Mira-Bhayandar", lat: 19.2952, lng: 72.8544, areas: ["Mira Road East","Bhayandar West","Bhayandar East","Shanti Nagar","Kashimira","Medtiya Nagar","Maxus Mall Road","Naya Nagar"], phonePrefix: "+91 22 2811" },
  { id: "tvm", name: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366, areas: ["East Fort","Pattom","Technopark","Kowdiar","Kesavadasapuram","Ulloor","Kazhakkoottam","Statue"], phonePrefix: "+91 471 232" },
  { id: "bhiwandi", name: "Bhiwandi", lat: 19.2813, lng: 73.0485, areas: ["Narpoli","Temghar","Kalyan Road","Anjurphata","Bhadwad","Ganesh Nagar","Station Road","Octroi Naka"], phonePrefix: "+91 2522 22" },
  { id: "saharanpur", name: "Saharanpur", lat: 29.968, lng: 77.546, areas: ["Court Road","Mission Compound","Chilkana Road","Railway Road","Hakikat Nagar","Janakpuri","Ambala Road","Clock Tower"], phonePrefix: "+91 132 271" },
  { id: "gorakhpur", name: "Gorakhpur", lat: 26.7606, lng: 83.3732, areas: ["Civil Lines","Golghar","Betiahata","Rustampur","Medical College Road","Basharatpur","Kunraghat","Railway Station Area"], phonePrefix: "+91 551 220" },
  { id: "guntur", name: "Guntur", lat: 16.3067, lng: 80.4365, areas: ["Brodipet","Lakshmipuram","Arundelpet","Kothapet","Nallapadu","Autonagar","Pattabhipuram","Ring Road"], phonePrefix: "+91 863 222" },
  { id: "bikaner", name: "Bikaner", lat: 28.0229, lng: 73.3119, areas: ["Rani Bazar","Station Road","Public Park","JNV Colony","Pawanpuri","Industrial Area","Gangashahar","Samta Nagar"], phonePrefix: "+91 151 220" },
  { id: "amravati", name: "Amravati", lat: 20.9374, lng: 77.7796, areas: ["Rajapeth","Irwin Square","Badnera Road","VMV Road","Camp","Mardi Road","Rathinagar","Frezerpura"], phonePrefix: "+91 721 266" },
  { id: "noida", name: "Noida", lat: 28.5355, lng: 77.391, areas: ["Sector 18","Sector 62","Sector 16","Sector 50","Sector 137","Atta Market","Film City","Sector 63"], phonePrefix: "+91 120 432" },
  { id: "jamshedpur", name: "Jamshedpur", lat: 22.8046, lng: 86.2029, areas: ["Bistupur","Sakchi","Kadma","Sonari","Telco","Golmuri","Mango","Adityapur"], phonePrefix: "+91 657 242" },
  { id: "bhilai", name: "Bhilai", lat: 21.1938, lng: 81.3509, areas: ["Sector 6","Supela","Civic Centre","Nehru Nagar","Power House","Ruabandha","Camp 1","Smriti Nagar"], phonePrefix: "+91 788 222" },
  { id: "cuttack", name: "Cuttack", lat: 20.4625, lng: 85.8828, areas: ["Buxi Bazaar","College Square","Badambadi","CDA","Chauliaganj","Naya Bazaar","Mangalabag","Jobra"], phonePrefix: "+91 671 230" },
  { id: "firozabad", name: "Firozabad", lat: 27.1592, lng: 78.3957, areas: ["Suhag Nagar","Raja Ka Tal","Station Road","Tundla Road","Glass City","Ramgarh","Civil Lines","Agra Gate"], phonePrefix: "+91 5612 24" },
  { id: "kochi", name: "Kochi", lat: 9.9312, lng: 76.2673, areas: ["MG Road","Kakkanad","Edappally","Panampilly Nagar","Fort Kochi","Vyttila","Palarivattom","Ernakulam South"], phonePrefix: "+91 484 235" },
  { id: "nellore", name: "Nellore", lat: 14.4426, lng: 79.9865, areas: ["Trunk Road","AC Nagar","Magunta Layout","Stonehousepet","Vedayapalem","Fatima Nagar","Railway Station Road","Pogathota"], phonePrefix: "+91 861 232" },
  { id: "bhavnagar", name: "Bhavnagar", lat: 21.7645, lng: 72.1519, areas: ["Waghawadi Road","Kalubha Road","Crescent Circle","Takhteshwar","Ghogha Circle","Vidyanagar","Nilambaug","ST Road"], phonePrefix: "+91 278 242" },
  { id: "dehradun", name: "Dehradun", lat: 30.3165, lng: 78.0322, areas: ["Rajpur Road","Paltan Bazaar","Clock Tower","Prem Nagar","Ballupur","Sahastradhara Road","ISBT","Kanwali Road"], phonePrefix: "+91 135 265" },
  { id: "durgapur", name: "Durgapur", lat: 23.5204, lng: 87.3119, areas: ["City Centre","Benachity","Muchipara","Durgapur Station","Bidhannagar","A-Zone","Steel Township","Bengal Ambuja"], phonePrefix: "+91 343 254" },
  { id: "asansol", name: "Asansol", lat: 23.6739, lng: 86.9524, areas: ["Burnpur Road","Hutton Road","Court More","Apcar Garden","Chellidanga","Kalipahari","ISCO More","G.T. Road"], phonePrefix: "+91 341 230" },
  { id: "rourkela", name: "Rourkela", lat: 22.2604, lng: 84.8536, areas: ["Uditnagar","Sector 19","Chhend","Basanti Colony","Koel Nagar","Civil Township","Bisra Road","Fertilizer Township"], phonePrefix: "+91 661 250" },
  { id: "nanded", name: "Nanded", lat: 19.1383, lng: 77.321, areas: ["Vazirabad","Anand Nagar","CIDCO","Taroda","Shivaji Nagar","Station Road","Labour Colony","Gokul Nagar"], phonePrefix: "+91 2462 23" },
  { id: "kolhapur", name: "Kolhapur", lat: 16.705, lng: 74.2433, areas: ["Rajarampuri","Shahupuri","Tarabai Park","Laxmipuri","Kawala Naka","Station Road","Rankala","Nagala Park"], phonePrefix: "+91 231 265" },
  { id: "ajmer", name: "Ajmer", lat: 26.4499, lng: 74.6399, areas: ["Diggi Bazaar","Station Road","Vaishali Nagar","Civil Lines","Ana Sagar","Mayo College Road","Adarsh Nagar","Foy Sagar"], phonePrefix: "+91 145 242" },
  { id: "akola", name: "Akola", lat: 20.7002, lng: 77.0082, areas: ["Ramdaspeth","Old City","Jatharpeth","Gorakshan Road","Civil Lines","Murtizapur Road","Kaulkhed","Railway Station"], phonePrefix: "+91 724 243" },
  { id: "kalaburagi", name: "Kalaburagi", lat: 17.3297, lng: 76.8343, areas: ["Super Market","Station Bazaar","Aiwan-E-Shahi","Sedam Road","Jagat","MSL Layout","Timmapuri","Ring Road"], phonePrefix: "+91 8472 22" },
  { id: "jamnagar", name: "Jamnagar", lat: 22.4707, lng: 70.0577, areas: ["Indira Gandhi Road","Bedeshwar","Digvijay Plot","Patel Colony","Bedi Bunder","Aerodrome Road","Ranjit Sagar Road","City Plaza"], phonePrefix: "+91 288 255" },
  { id: "ujjain", name: "Ujjain", lat: 23.1765, lng: 75.7885, areas: ["Freeganj","Tower Chowk","Dewas Gate","Nanakheda","Mahakal Road","Indore Road","Santwer Road","BD Agarwal Colony"], phonePrefix: "+91 734 255" },
  { id: "loni", name: "Loni", lat: 18.4865, lng: 74.0278, areas: ["Kalbhor Nagar","Station Road","Pune Road","Market Yard","Gaonthan","MIDC Road","School Road","Temple Chowk"], phonePrefix: "+91 2114 22" },
  { id: "siliguri", name: "Siliguri", lat: 26.7271, lng: 88.3953, areas: ["Hill Cart Road","Sevoke Road","Hakimpara","Pradhan Nagar","Bidhan Road","Matigara","Check Post","Burdwan Road"], phonePrefix: "+91 353 243" },
  { id: "jhansi", name: "Jhansi", lat: 25.4484, lng: 78.5685, areas: ["Civil Lines","Sipri Bazaar","Nai Basti","Elite Crossing","Medical College Road","Kanpur Road","Railway Colony","Gwalior Road"], phonePrefix: "+91 510 233" },
  { id: "ulhasnagar", name: "Ulhasnagar", lat: 19.2215, lng: 73.1645, areas: ["Camp 1","Camp 2","Camp 3","Camp 4","Camp 5","Shahad Road","Vithalwadi","Netaji Chowk"], phonePrefix: "+91 251 256" },
  { id: "sangli", name: "Sangli", lat: 16.8524, lng: 74.5815, areas: ["Vishrambag","Gaonbhag","College Corner","Miraj Road","Kupwad","Station Road","Market Yard","Wood House"], phonePrefix: "+91 233 237" },
  { id: "mangaluru", name: "Mangaluru", lat: 12.9141, lng: 74.856, areas: ["Hampankatta","Balmatta","Kadri","Bejai","Kankanady","Surathkal","Pumpwell","Lalbagh"], phonePrefix: "+91 824 242" },
  { id: "erode", name: "Erode", lat: 11.341, lng: 77.7172, areas: ["Brough Road","Gandhiji Road","Perundurai Road","Sathy Road","Surampatti","Moolapalayam","Solar","Collectorate"], phonePrefix: "+91 424 226" },
  { id: "belagavi", name: "Belagavi", lat: 15.8497, lng: 74.4977, areas: ["Khade Bazaar","Tilakwadi","Congress Road","Shahapur","Goaves","Auto Nagar","Fort","Railway Station"], phonePrefix: "+91 831 242" },
  { id: "ambattur", name: "Ambattur", lat: 13.1143, lng: 80.1548, areas: ["OT Bus Stand","Mogappair","Menambedu","Industrial Estate","Red Hills Road","Padi","Kallikuppam","Oragadam"], phonePrefix: "+91 44 2657" },
  { id: "tirunelveli", name: "Tirunelveli", lat: 8.7139, lng: 77.7567, areas: ["Town","Junction","Palayamkottai","High Ground","Vannarpettai","Melapalayam","Sankar Nagar","Bharathi Nagar"], phonePrefix: "+91 462 233" },
  { id: "malegaon", name: "Malegaon", lat: 20.5579, lng: 74.5287, areas: ["Camp","Soygaon","Satana Naka","Dyane","Chhawani","Market Yard","Station Road","Agra Road"], phonePrefix: "+91 2554 23" },
  { id: "gaya", name: "Gaya", lat: 24.7914, lng: 85.0002, areas: ["Station Road","Civil Lines","AP Colony","Rampur","Tekari Road","Cathedral Road","Collectorate","Bodh Gaya Road"], phonePrefix: "+91 631 222" },
  { id: "jalgaon", name: "Jalgaon", lat: 21.0077, lng: 75.5626, areas: ["Station Road","MJ College Road","Ring Road","Mehrun","Ramdas Colony","Gandhi Chowk","MIDC","Akashwani"], phonePrefix: "+91 257 222" },
  { id: "udaipur", name: "Udaipur", lat: 24.5854, lng: 73.7125, areas: ["Hathi Pol","Suraj Pole","Fatehpura","Sector 11","Hiran Magri","Chetak Circle","University Road","Ashok Nagar"], phonePrefix: "+91 294 241" },
  { id: "maheshtala", name: "Maheshtala", lat: 22.5086, lng: 88.2532, areas: ["Batanagar","Santoshpur","Nungi","Akra","Chakmir","Fatepur","Ashuti","Joka Road"], phonePrefix: "+91 33 2490" },
];

/** Unique brand stems — sized for 99×8 shops. */
const BRANDS = [
  "Aarav",
  "ByteForge",
  "CircuitBay",
  "DigiNest",
  "ElectroFix",
  "FastBoard",
  "GadgetGrove",
  "HardReset",
  "iRepairDesk",
  "JouleLab",
  "KeyCap",
  "LogicLane",
  "MegaPixel",
  "NovaChip",
  "OrbitTech",
  "PixelForge",
  "QuickBoard",
  "RepairRoot",
  "SiliconStreet",
  "TrackPad",
  "UltraLogic",
  "VoltBench",
  "WireWorks",
  "XenonFix",
  "YottaSoft",
  "ZenBoard",
  "AlphaPort",
  "BoardBuddy",
  "CoreClinic",
  "DeltaDrive",
  "EagleChip",
  "FlashFrame",
  "GridGate",
  "HelixPC",
  "IronPixel",
  "JadeLogic",
  "KiteRepair",
  "LumenLab",
  "MicroMend",
  "NimbusFix",
  "OptiBoard",
  "PulsePort",
  "QuarkFix",
  "RelayDesk",
  "SparkShelf",
  "TurboTrace",
  "UnitFix",
  "VectorLab",
  "WalnutTech",
  "YellowChip",
  "ZapNest",
  "AmberPort",
  "BlueLogic",
  "CopperCore",
  "DoveFix",
  "EmberChip",
  "ForgePort",
  "GlintLab",
  "HarborFix",
  "IvoryBoard",
  "JetMend",
  "KeenChip",
  "LatticePC",
  "MossTech",
  "NorthPort",
  "OxideLab",
  "PrismFix",
  "QuartzDesk",
  "RidgeChip",
  "SablePort",
  "TideLogic",
  "UmbraFix",
  "ValeBoard",
  "WispTech",
  "AxiomMend",
  "BeaconChip",
  "CedarPort",
  "DriftLab",
  "EchoFix",
  "FlintBoard",
  "GroveTech",
  "HaloMend",
  "IngressFix",
  "JuniperPC",
  "KernelDesk",
  "LedgerFix",
  "MaplePort",
  "NestLogic",
  "OakChip",
  "PineBoard",
  "RapidMend",
  "StoneFix",
  "TerraPort",
  "UrbanChip",
  "VistaLab",
  "WillowFix",
  "ZephyrDesk"
];

const SUFFIXES = [
  "Laptop Hub",
  "PC Clinic",
  "Repair Studio",
  "Service Point",
  "Tech Corner",
  "Notebook Works",
  "Mac & PC Care",
  "Laptop Lab",
  "Gadget Centre",
  "Board Doctors",
  "Screen Works",
  "Chip Care",
  "Portable Fix",
  "System Bench",
  "Device Desk",
  "Logic Works",
  "Board Lab",
  "Notebook Desk",
  "Repair Bay",
  "Tech Bench",
  "Chip Studio",
  "Device Works",
  "Port Care",
  "System Hub",
  "Screen Lab",
  "Gadget Bay",
  "Laptop Desk",
  "PC Works",
  "Mend Point",
  "Fix Studio"
];

const AUTHORS = [
  "Ananya R.",
  "Vikram S.",
  "Priya M.",
  "Rahul K.",
  "Sneha P.",
  "Imran H.",
  "Divya G.",
  "Arjun M.",
  "Neha D.",
  "Srinivas K.",
  "Meena R.",
  "Ritwik B.",
  "Aditya P.",
  "Kiran S.",
  "Pooja J.",
  "Harpreet S.",
  "Anjali T.",
  "Lakshmi C.",
  "Farhan Q.",
  "Ishita N.",
  "Kabir L.",
  "Tanvi O.",
  "Yash W.",
  "Zoya F.",
  "Devansh C.",
  "Riya B.",
  "Mohit A.",
  "Sanjana V.",
  "Rohan T.",
  "Aisha N.",
  "Kunal P.",
  "Nisha R.",
  "Varun G.",
  "Diya S.",
  "Manish J.",
  "Kavya M.",
  "Sameer H.",
  "Trisha K.",
  "Nikhil D.",
  "Pallavi S.",
  "Omar F.",
  "Shreya L.",
  "Amit B.",
  "Chitra W.",
  "Deepak N.",
  "Esha P.",
  "Gaurav C.",
  "Hina Q."
];

const CONFIRM_TYPES = [
  "LOCATION_CONFIRMED",
  "BUSINESS_OPEN",
  "ADDRESS_CORRECT",
  "BUSINESS_FOUND",
] as const;

type Tier = "elite" | "strong" | "ok" | "rising" | "stale" | "moved" | "closed" | "conflict";

/** Rotate which shop slot gets which tier so cities don't share the same score pattern. */
function tiersForCity(cityIndex: number): Tier[] {
  const base: Tier[] = ["elite", "strong", "ok", "rising", "stale", "moved", "closed", "conflict"];
  const shift = cityIndex % base.length;
  return [...base.slice(shift), ...base.slice(0, shift)];
}

function offsetLatLng(lat: number, lng: number, dLatKm: number, dLngKm: number) {
  return {
    lat: lat + dLatKm / 111,
    lng: lng + dLngKm / (111 * Math.cos((lat * Math.PI) / 180)),
  };
}

function buildShop(
  city: CityDef,
  cityIndex: number,
  shopIndex: number,
  usedNames: Set<string>
) {
  const rng = mulberry32(hashStr(`${city.id}::${shopIndex}::findsure-v3`));
  const tier = tiersForCity(cityIndex)[shopIndex];
  const area = city.areas[shopIndex % city.areas.length];

  let name: string;
  if (city.id === "bengaluru" && tier === "moved") {
    name = "TechFix Hub";
  } else {
    let attempts = 0;
    const cityTag = city.name.split(/[\s-]/)[0];
    do {
      const brand = BRANDS[(cityIndex * 8 + shopIndex * 17 + attempts * 5) % BRANDS.length];
      const suffix = SUFFIXES[(cityIndex * 7 + shopIndex * 13 + attempts * 3) % SUFFIXES.length];
      const styles = [
        `${brand} ${suffix} - ${cityTag}`,
        `${cityTag} ${brand} ${suffix}`,
        `${brand} ${cityTag} ${suffix}`,
        `${suffix} by ${brand} (${cityTag})`,
      ];
      name = styles[(shopIndex + attempts) % styles.length];
      attempts += 1;
    } while (usedNames.has(name) && attempts < 80);
    if (usedNames.has(name)) {
      name = `${cityTag} Shop #${shopIndex + 1} ${hashStr(city.id + shopIndex).toString(16)}`;
    }
  }
  usedNames.add(name);

  const dLat = floatBetween(rng, -7.5, 7.5, 2);
  const dLng = floatBetween(rng, -7.5, 7.5, 2);
  const pos = offsetLatLng(city.lat, city.lng, dLat, dLng);

  const streetNo = intBetween(rng, 3, 240);
  const phoneTail = intBetween(rng, 1000, 9999);

  let verifications: { days: number; type: string; source: string }[] = [];
  let confirmations: { days: number; type: string }[] = [];
  let reports: { days: number; type: string; description: string }[] = [];
  let openNow = true;
  let rating = floatBetween(rng, 3.2, 4.9, 1);
  let reviewCount = intBetween(rng, 18, 320);

  switch (tier) {
    case "elite": {
      const verifiedDays = intBetween(rng, 1, 18);
      const confCount = intBetween(rng, 4, 8);
      verifications = [
        { days: verifiedDays, type: "LOCATION", source: "field_check" },
        ...(rng() > 0.35
          ? [{ days: intBetween(rng, verifiedDays + 5, 55), type: "OWNER", source: "owner" }]
          : []),
      ];
      confirmations = Array.from({ length: confCount }, (_, i) => ({
        days: intBetween(rng, 1 + i * 3, 12 + i * 9),
        type: CONFIRM_TYPES[(shopIndex + i + cityIndex) % CONFIRM_TYPES.length],
      }));
      rating = floatBetween(rng, 4.5, 4.9, 1);
      reviewCount = intBetween(rng, 90, 340);
      break;
    }
    case "strong": {
      const verifiedDays = intBetween(rng, 5, 28);
      const confCount = intBetween(rng, 3, 6);
      verifications = [{ days: verifiedDays, type: "LOCATION", source: "field_check" }];
      confirmations = Array.from({ length: confCount }, (_, i) => ({
        days: intBetween(rng, 2 + i * 4, 20 + i * 10),
        type: CONFIRM_TYPES[(shopIndex + i * 2) % CONFIRM_TYPES.length],
      }));
      if (rng() > 0.55) {
        reports = [
          {
            days: intBetween(rng, 20, 80),
            type: "WRONG_PHONE",
            description: `Caller said the number for ${name} may be outdated.`,
          },
        ];
      }
      rating = floatBetween(rng, 4.1, 4.7, 1);
      break;
    }
    case "ok": {
      const verifiedDays = intBetween(rng, 15, 55);
      const confCount = intBetween(rng, 1, 4);
      verifications = [{ days: verifiedDays, type: "LOCATION", source: pick(rng, ["import", "field_check"]) }];
      confirmations = Array.from({ length: confCount }, (_, i) => ({
        days: intBetween(rng, 5 + i * 7, 40 + i * 12),
        type: CONFIRM_TYPES[(i + cityIndex) % CONFIRM_TYPES.length],
      }));
      rating = floatBetween(rng, 3.8, 4.5, 1);
      break;
    }
    case "rising": {
      const verifiedDays = intBetween(rng, 8, 35);
      const confCount = intBetween(rng, 2, 5);
      verifications = [{ days: verifiedDays, type: "LOCATION", source: "field_check" }];
      confirmations = Array.from({ length: confCount }, (_, i) => ({
        days: intBetween(rng, 1 + i * 5, 18 + i * 8),
        type: CONFIRM_TYPES[(shopIndex + i + 1) % CONFIRM_TYPES.length],
      }));
      rating = floatBetween(rng, 4.0, 4.6, 1);
      reviewCount = intBetween(rng, 40, 160);
      break;
    }
    case "stale": {
      const verifiedDays = intBetween(rng, 100, 220);
      verifications = [{ days: verifiedDays, type: "LOCATION", source: "import" }];
      confirmations =
        rng() > 0.4
          ? [
              {
                days: intBetween(rng, 95, 160),
                type: pick(rng, [...CONFIRM_TYPES]),
              },
            ]
          : [];
      rating = floatBetween(rng, 3.5, 4.2, 1);
      break;
    }
    case "moved": {
      const verifiedDays = intBetween(rng, 160, 300);
      verifications = [{ days: verifiedDays, type: "LOCATION", source: "import" }];
      confirmations = [
        {
          days: intBetween(rng, 150, 280),
          type: "BUSINESS_FOUND",
        },
      ];
      const moveCount = intBetween(rng, 2, 3);
      reports = Array.from({ length: moveCount }, (_, i) => ({
        days: intBetween(rng, 3 + i * 7, 25 + i * 14),
        type: "MOVED",
        description:
          i === 0
            ? `Visited ${area} — ${name} appears to have relocated.`
            : `Empty unit; locals said ${name} moved.`,
      }));
      rating = floatBetween(rng, 3.2, 4.0, 1);
      break;
    }
    case "closed": {
      const verifiedDays = intBetween(rng, 180, 360);
      verifications = [{ days: verifiedDays, type: "LOCATION", source: "import" }];
      confirmations = [];
      openNow = false;
      reports = [
        {
          days: intBetween(rng, 2, 15),
          type: "CLOSED",
          description: `Shutters down at ${area}; may be permanently closed.`,
        },
        {
          days: intBetween(rng, 16, 40),
          type: "CLOSED",
          description: `Neighbor reported ${name} has shut down.`,
        },
      ];
      rating = floatBetween(rng, 2.8, 3.8, 1);
      reviewCount = intBetween(rng, 12, 80);
      break;
    }
    case "conflict": {
      const verifiedDays = intBetween(rng, 25, 70);
      verifications = [{ days: verifiedDays, type: "LOCATION", source: pick(rng, ["import", "field_check"]) }];
      confirmations = [
        {
          days: intBetween(rng, 2, 14),
          type: "BUSINESS_FOUND",
        },
        {
          days: intBetween(rng, 8, 28),
          type: "BUSINESS_OPEN",
        },
      ];
      reports = [
        {
          days: intBetween(rng, 4, 20),
          type: pick(rng, ["MOVED", "WRONG_ADDRESS"]),
          description: `Mixed signals about whether ${name} is still at ${area}.`,
        },
      ];
      rating = floatBetween(rng, 3.7, 4.4, 1);
      break;
    }
  }

  const reviewDays = intBetween(rng, 2, Math.min(80, Math.max(5, verifications[0]?.days ?? 30)));
  const reviews = [
    {
      days: reviewDays,
      author: AUTHORS[(cityIndex * 8 + shopIndex * 3) % AUTHORS.length],
      rating: Math.max(1, Math.min(5, Math.round(rating + floatBetween(rng, -0.5, 0.5, 1)))),
      text: pick(rng, [
        `Got my laptop fixed near ${area} in ${city.name}.`,
        `${name} was easy to find at ${area}.`,
        `Decent pricing; board-level work looked careful.`,
        `Screen replacement done same day in ${city.name}.`,
        `Staff confirmed they still operate from ${area}.`,
      ]),
    },
  ];
  if (rng() > 0.35) {
    reviews.push({
      days: intBetween(rng, reviewDays + 10, reviewDays + 90),
      author: AUTHORS[(cityIndex * 11 + shopIndex * 5 + 2) % AUTHORS.length],
      rating: intBetween(rng, 2, 5),
      text: pick(rng, [
        `Second visit — still at the same spot.`,
        `Battery swap was fine; wait time varied.`,
        `Would check trust signals before traveling again.`,
        `Technician in ${city.name} explained the issue clearly.`,
      ]),
    });
  }
  if (rng() > 0.65) {
    reviews.push({
      days: intBetween(rng, 3, 45),
      author: AUTHORS[(cityIndex * 13 + shopIndex * 7 + 4) % AUTHORS.length],
      rating: intBetween(rng, 3, 5),
      text: pick(rng, [
        `Walk-in near ${area} — queue was honest.`,
        `Found via FindSure; listing matched the shopfront.`,
        `Keyboard replacement held up well after a week.`,
      ]),
    });
  }

  return {
    name,
    address: `${streetNo} ${area}, ${city.name}, India`,
    latitude: Number(pos.lat.toFixed(5)),
    longitude: Number(pos.lng.toFixed(5)),
    phone: `${city.phonePrefix} ${phoneTail}`,
    website: `https://example.com/${city.id}/${hashStr(name).toString(16)}`,
    rating,
    reviewCount,
    openNow,
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${name} ${area} ${city.name}`
    )}`,
    googlePlaceId: `demo_${city.id}_${shopIndex + 1}_${hashStr(name).toString(16)}`,
    verifications,
    confirmations,
    reports,
    reviews,
  };
}

async function main() {
  await prisma.review.deleteMany();
  await prisma.report.deleteMany();
  await prisma.confirmation.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.business.deleteMany();

  const usedNames = new Set<string>();
  let total = 0;

  for (let ci = 0; ci < CITIES.length; ci++) {
    const city = CITIES[ci];
    for (let si = 0; si < SHOPS_PER_CITY; si++) {
      const b = buildShop(city, ci, si, usedNames);
      await prisma.business.create({
        data: {
          name: b.name,
          category: "laptop_repair",
          address: b.address,
          latitude: b.latitude,
          longitude: b.longitude,
          phone: b.phone,
          website: b.website,
          rating: b.rating,
          reviewCount: b.reviewCount,
          openNow: b.openNow,
          googleMapsUrl: b.googleMapsUrl,
          googlePlaceId: b.googlePlaceId,
          verifications: {
            create: b.verifications.map((v) => ({
              type: v.type,
              source: v.source,
              createdAt: daysAgo(v.days),
            })),
          },
          confirmations: {
            create: b.confirmations.map((c) => ({
              type: c.type,
              source: "demo",
              status: "active",
              createdAt: daysAgo(c.days),
            })),
          },
          reports: {
            create: b.reports.map((r) => ({
              type: r.type,
              description: r.description,
              status: "open",
              createdAt: daysAgo(r.days),
            })),
          },
          reviews: {
            create: b.reviews.map((r) => ({
              author: r.author,
              rating: r.rating,
              text: r.text,
              reviewDate: daysAgo(r.days),
              source: "demo",
            })),
          },
        },
      });
      total += 1;
    }
  }

  console.log(
    `Seeded ${total} unique shops across ${CITIES.length} cities (${usedNames.size} distinct names).`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
