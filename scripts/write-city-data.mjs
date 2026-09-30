/**
 * One-shot generator: rebuilds indiaCities.ts + updates seed CITIES / uniqueness pools.
 * Run: node scripts/write-city-data.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

/** [label, lat, lng, aliases[], seedId, seedName, areas[8], phonePrefix] */
const CITIES = [
  ["Mumbai, Maharashtra", 19.076, 72.8777, ["mumbai", "bombay"], "mumbai", "Mumbai", ["Bandra West", "Andheri East", "Powai", "Lower Parel", "Dadar", "Goregaon", "Colaba", "Kurla"], "+91 22 2640"],
  ["Delhi, National Capital Territory", 28.6139, 77.209, ["delhi", "new delhi", "nct", "national capital territory", "delhi ncr"], "delhi", "Delhi", ["Connaught Place", "Nehru Place", "Karol Bagh", "Saket", "Lajpat Nagar", "Dwarka", "Rohini", "Laxmi Nagar"], "+91 11 4050"],
  ["Bengaluru, Karnataka", 12.9716, 77.5946, ["bengaluru", "bangalore", "blr"], "bengaluru", "Bengaluru", ["MG Road", "Indiranagar", "Koramangala", "Jayanagar", "HSR Layout", "Whitefield", "Malleshwaram", "BTM"], "+91 80 4123"],
  ["Kolkata, West Bengal", 22.5726, 88.3639, ["kolkata", "calcutta"], "kolkata", "Kolkata", ["Park Street", "Salt Lake", "Gariahat", "New Town", "Esplanade", "Behala", "Ballygunge", "Tollygunge"], "+91 33 4000"],
  ["Chennai, Tamil Nadu", 13.0827, 80.2707, ["chennai", "madras"], "chennai", "Chennai", ["T. Nagar", "Anna Nagar", "Adyar", "Velachery", "Nungambakkam", "OMR", "Porur", "Tambaram"], "+91 44 2434"],
  ["Hyderabad, Telangana", 17.385, 78.4867, ["hyderabad", "secunderabad"], "hyderabad", "Hyderabad", ["Jubilee Hills", "Hitech City", "Banjara Hills", "Ameerpet", "Gachibowli", "Secunderabad", "Kukatpally", "Madhapur"], "+91 40 4010"],
  ["Ahmedabad, Gujarat", 23.0225, 72.5714, ["ahmedabad", "amdavad"], "ahmedabad", "Ahmedabad", ["C.G. Road", "Satellite", "Bopal", "Navrangpura", "Maninagar", "Prahlad Nagar", "Vastrapur", "Thaltej"], "+91 79 2640"],
  ["Pune, Maharashtra", 18.5204, 73.8567, ["pune", "poona"], "pune", "Pune", ["FC Road", "Koregaon Park", "Hinjewadi", "Kothrud", "Baner", "Hadapsar", "Camp", "Wakad"], "+91 20 2553"],
  ["Surat, Gujarat", 21.1702, 72.8311, ["surat"], "surat", "Surat", ["Adajan", "Vesu", "Varachha", "City Light", "Athwa", "Piplod", "Katargam", "Pal"], "+91 261 246"],
  ["Jaipur, Rajasthan", 26.9124, 75.7873, ["jaipur"], "jaipur", "Jaipur", ["MI Road", "Vaishali Nagar", "Malviya Nagar", "C-Scheme", "Tonk Road", "Raja Park", "Sitapura", "Mansarovar"], "+91 141 236"],
  ["Lucknow, Uttar Pradesh", 26.8467, 80.9462, ["lucknow"], "lucknow", "Lucknow", ["Hazratganj", "Gomti Nagar", "Aliganj", "Indira Nagar", "Aminabad", "Chowk", "Alambagh", "Rajajipuram"], "+91 522 400"],
  ["Kanpur, Uttar Pradesh", 26.4499, 80.3319, ["kanpur"], "kanpur", "Kanpur", ["Mall Road", "Kakadeo", "Swaroop Nagar", "Kidwai Nagar", "Govind Nagar", "Rawatpur", "Kalyanpur", "Barra"], "+91 512 230"],
  ["Nagpur, Maharashtra", 21.1458, 79.0882, ["nagpur"], "nagpur", "Nagpur", ["Sitabuldi", "Dharampeth", "Manish Nagar", "Wardhaman Nagar", "Sadar", "Trimurti Nagar", "Pratap Nagar", "Hingna"], "+91 712 254"],
  ["Indore, Madhya Pradesh", 22.7196, 75.8577, ["indore"], "indore", "Indore", ["Vijay Nagar", "Sapna Sangeeta", "Palasia", "Rajendra Nagar", "Bhawarkuan", "AB Road", "Sudama Nagar", "Scheme 78"], "+91 731 254"],
  ["Thane, Maharashtra", 19.2183, 72.9781, ["thane"], "thane", "Thane", ["Gokhale Road", "Naupada", "Kopri", "Wagle Estate", "Hiranandani Estate", "Majiwada", "Kolshet", "Cadbury Junction"], "+91 22 2533"],
  ["Bhopal, Madhya Pradesh", 23.2599, 77.4126, ["bhopal"], "bhopal", "Bhopal", ["MP Nagar", "Arera Colony", "New Market", "Kolar Road", "Berasia Road", "Habibganj", "Indrapuri", "Bawadia Kalan"], "+91 755 255"],
  ["Visakhapatnam, Andhra Pradesh", 17.6868, 83.2185, ["visakhapatnam", "vizag", "vishakhapatnam"], "vizag", "Visakhapatnam", ["Dwaraka Nagar", "MVP Colony", "Gajuwaka", "Siripuram", "Madhurawada", "Seethammadhara", "NAD", "Rushikonda"], "+91 891 256"],
  ["Patna, Bihar", 25.5941, 85.1376, ["patna"], "patna", "Patna", ["Boring Road", "Fraser Road", "Kankarbagh", "Patliputra", "Rajendra Nagar", "Bailey Road", "Ashiana", "Danapur"], "+91 612 220"],
  ["Vadodara, Gujarat", 22.3072, 73.1812, ["vadodara", "baroda"], "vadodara", "Vadodara", ["Alkapuri", "Fatehgunj", "Akota", "Gotri", "Manjalpur", "Karelibaug", "Sayajigunj", "Vasna"], "+91 265 242"],
  ["Ghaziabad, Uttar Pradesh", 28.6692, 77.4538, ["ghaziabad"], "ghaziabad", "Ghaziabad", ["Raj Nagar", "Indirapuram", "Vaishali", "Crossings Republik", "Kaushambi", "Sahibabad", "Vasundhara", "NH-24"], "+91 120 270"],
  ["Ludhiana, Punjab", 30.901, 75.8573, ["ludhiana"], "ludhiana", "Ludhiana", ["Model Town", "Sarabha Nagar", "Civil Lines", "BRS Nagar", "Feroze Gandhi Market", "Dugri", "PAU", "Focal Point"], "+91 161 244"],
  ["Agra, Uttar Pradesh", 27.1767, 78.0081, ["agra"], "agra", "Agra", ["Sadar Bazaar", "Kamla Nagar", "Sikandra", "Tajganj", "Dayal Bagh", "Shahganj", "Trans Yamuna", "Khandari"], "+91 562 222"],
  ["Nashik, Maharashtra", 19.9975, 73.7898, ["nashik", "nasik"], "nashik", "Nashik", ["College Road", "Gangapur Road", "Panchavati", "Cidco", "Satpur", "Indira Nagar", "Pathardi Phata", "Dwarka"], "+91 253 257"],
  ["Ranchi, Jharkhand", 23.3441, 85.3096, ["ranchi"], "ranchi", "Ranchi", ["Main Road", "Lalpur", "Doranda", "Ashok Nagar", "Harmu", "Kanke", "Hinoo", "Morabadi"], "+91 651 220"],
  ["Faridabad, Haryana", 28.4089, 77.3178, ["faridabad"], "faridabad", "Faridabad", ["Sector 15", "NIT", "Greater Faridabad", "Sector 37", "Ballabhgarh", "Greenfield", "Sector 21", "Neelam Chowk"], "+91 129 222"],
  ["Meerut, Uttar Pradesh", 28.9845, 77.7064, ["meerut"], "meerut", "Meerut", ["Abu Lane", "Shastri Nagar", "Civil Lines", "Begum Bridge", "Pallavpuram", "Ganga Nagar", "Hapur Road", "Partapur"], "+91 121 264"],
  ["Rajkot, Gujarat", 22.3039, 70.8022, ["rajkot"], "rajkot", "Rajkot", ["Kalawad Road", "Race Course", "Gondal Road", "Mavdi", "150 Feet Ring Road", "University Road", "Yagnik Road", "Kotecha Chowk"], "+91 281 246"],
  ["Kalyan-Dombivli, Maharashtra", 19.2403, 73.1305, ["kalyan", "dombivli", "kalyan-dombivli", "kalyan dombivli"], "kalyan", "Kalyan-Dombivli", ["Kalyan Station", "Dombivli East", "Dombivli West", "Titwala Road", "Bail Bazar", "Kopar", "Manpada", "Shahad"], "+91 251 220"],
  ["Vasai-Virar, Maharashtra", 19.3919, 72.8397, ["vasai", "virar", "vasai-virar", "vasai virar"], "vasai", "Vasai-Virar", ["Vasai West", "Virar West", "Nallasopara", "Naigaon", "Global City", "Evershine City", "Agashi", "Manikpur"], "+91 250 233"],
  ["Varanasi, Uttar Pradesh", 25.3176, 82.9739, ["varanasi", "banaras", "benaras"], "varanasi", "Varanasi", ["Sigra", "Lanka", "Bhelupur", "Godowlia", "Mahmoorganj", "Cantt", "Ashapur", "Lanka Gate"], "+91 542 222"],
  ["Srinagar, Jammu and Kashmir", 34.0837, 74.7973, ["srinagar", "kashmir"], "srinagar", "Srinagar", ["Lal Chowk", "Residency Road", "Rajbagh", "Hazratbal", "Bemina", "Jawahar Nagar", "Nowgam", "Boulevard"], "+91 194 245"],
  ["Aurangabad (Chhatrapati Sambhajinagar), Maharashtra", 19.8762, 75.3433, ["aurangabad", "chhatrapati sambhajinagar", "sambhajinagar"], "aurangabad", "Chhatrapati Sambhajinagar", ["Cidco", "Osmanpura", "Jalna Road", "Kranti Chowk", "Garkheda", "Station Road", "Mukundwadi", "Gulmandi"], "+91 240 235"],
  ["Dhanbad, Jharkhand", 23.7957, 86.4304, ["dhanbad"], "dhanbad", "Dhanbad", ["Bank More", "Hirapur", "Saraidhela", "Bartand", "Govindpur", "Jharia Road", "City Centre", "Dhaiya"], "+91 326 230"],
  ["Amritsar, Punjab", 31.634, 74.8723, ["amritsar"], "amritsar", "Amritsar", ["Hall Bazaar", "Ranjit Avenue", "Lawrence Road", "Putlighar", "White Avenue", "GT Road", "Basant Avenue", "Mall Road"], "+91 183 222"],
  ["Navi Mumbai, Maharashtra", 19.033, 73.0297, ["navi mumbai", "new mumbai", "vashi", "nerul"], "navimumbai", "Navi Mumbai", ["Vashi", "Nerul", "Kharghar", "Belapur", "Airoli", "Sanpada", "Seawoods", "Panvel"], "+91 22 2770"],
  ["Allahabad (Prayagraj), Uttar Pradesh", 25.4358, 81.8463, ["prayagraj", "allahabad"], "prayagraj", "Prayagraj", ["Civil Lines", "Katra", "Colonelganj", "Tagore Town", "Mumfordganj", "Naini", "Georgetown", "Zero Road"], "+91 532 242"],
  ["Howrah, West Bengal", 22.5958, 88.2636, ["howrah"], "howrah", "Howrah", ["Howrah Maidan", "Shibpur", "Golabari", "Salkia", "Bally", "Liluah", "Belur", "Santragachi"], "+91 33 2641"],
  ["Gwalior, Madhya Pradesh", 26.2183, 78.1828, ["gwalior"], "gwalior", "Gwalior", ["City Centre", "Lashkar", "Morar", "Thatipur", "DD Nagar", "Race Course", "Phoolbagh", "City Center Mall"], "+91 751 234"],
  ["Jabalpur, Madhya Pradesh", 23.1815, 79.9864, ["jabalpur"], "jabalpur", "Jabalpur", ["Civic Centre", "Wright Town", "Napier Town", "Gorakhpur", "Vijay Nagar", "Adhartal", "Madan Mahal", "Cantt"], "+91 761 262"],
  ["Coimbatore, Tamil Nadu", 11.0168, 76.9558, ["coimbatore", "kovai"], "coimbatore", "Coimbatore", ["RS Puram", "Gandhipuram", "Peelamedu", "Saibaba Colony", "Race Course", "Singanallur", "Saravanampatti", "Ukkadam"], "+91 422 224"],
  ["Vijayawada, Andhra Pradesh", 16.5062, 80.648, ["vijayawada", "bezawada"], "vijayawada", "Vijayawada", ["Benz Circle", "Governorpet", "MG Road", "Labbipet", "Patamata", "Auto Nagar", "Gunadala", "One Town"], "+91 866 247"],
  ["Jodhpur, Rajasthan", 26.2389, 73.0243, ["jodhpur"], "jodhpur", "Jodhpur", ["Sardarpura", "Ratanada", "Paota", "Chopasni", "Basni", "Shastri Nagar", "Circuit House", "Masuriya"], "+91 291 251"],
  ["Madurai, Tamil Nadu", 9.9252, 78.1198, ["madurai"], "madurai", "Madurai", ["Anna Nagar", "KK Nagar", "Simmakkal", "Goripalayam", "Tallakulam", "SS Colony", "Thirunagar", "Mattuthavani"], "+91 452 253"],
  ["Raipur, Chhattisgarh", 21.2514, 81.6296, ["raipur"], "raipur", "Raipur", ["Pandri", "Telibandha", "Shankar Nagar", "Civil Lines", "Tatibandh", "Amapara", "Magneto Mall Road", "GE Road"], "+91 771 242"],
  ["Chandigarh, Punjab and Haryana", 30.7333, 76.7794, ["chandigarh", "mohali"], "chandigarh", "Chandigarh", ["Sector 17", "Sector 35", "Sector 22", "Industrial Area", "Sector 43", "Manimajra", "Sector 8", "Sector 26"], "+91 172 500"],
  ["Guwahati, Assam", 26.1445, 91.7362, ["guwahati", "gauhati"], "guwahati", "Guwahati", ["Paltan Bazaar", "Zoo Road", "Chandmari", "Dispur", "Beltola", "Fancy Bazaar", "GS Road", "Six Mile"], "+91 361 254"],
  ["Solapur, Maharashtra", 17.6599, 75.9064, ["solapur", "sholapur"], "solapur", "Solapur", ["Railway Lines", "Hotgi Road", "Park Chowk", "Jule Solapur", "Akkalkot Road", "Budhwar Peth", "Sidheshwar", "Bijapur Road"], "+91 217 274"],
  ["Hubballi-Dharwad, Karnataka", 15.3647, 75.124, ["hubli", "dharwad", "hubballi", "hubli-dharwad", "hubballi-dharwad"], "hubli", "Hubballi-Dharwad", ["Vidyanagar", "Keshwapur", "Gokul Road", "Deshpande Nagar", "CBT", "Unkal", "Dharwad Market", "Navanagar"], "+91 836 235"],
  ["Bareilly, Uttar Pradesh", 28.367, 79.4304, ["bareilly"], "bareilly", "Bareilly", ["Civil Lines", "Rajendra Nagar", "DD Puram", "Pilibhit Road", "Subhash Nagar", "Qila", "Izatnagar", "Phoenix Mall Road"], "+91 581 251"],
  ["Moradabad, Uttar Pradesh", 28.8386, 78.7733, ["moradabad"], "moradabad", "Moradabad", ["Civil Lines", "Budh Bazaar", "Kanth Road", "Majhola", "Prem Nagar", "Line Par", "Sonakpur", "Delhi Road"], "+91 591 241"],
  ["Mysuru, Karnataka", 12.2958, 76.6394, ["mysuru", "mysore"], "mysuru", "Mysuru", ["V V Mohalla", "Saraswathipuram", "Gokulam", "Kuvempunagar", "Jayalakshmipuram", "Hebbal", "Vijayanagar", "Nazarbad"], "+91 821 242"],
  ["Gurugram, Haryana", 28.4595, 77.0266, ["gurugram", "gurgaon"], "gurugram", "Gurugram", ["Cyber City", "Sector 29", "MG Road", "Sohna Road", "DLF Phase 1", "Golf Course Road", "Sector 56", "Sector 14"], "+91 124 456"],
  ["Aligarh, Uttar Pradesh", 27.8974, 78.088, ["aligarh"], "aligarh", "Aligarh", ["Ramghat Road", "Centre Point", "Civil Lines", "GT Road", "Quarsi", "Medical Road", "Dodhpur", "University Area"], "+91 571 240"],
  ["Jalandhar, Punjab", 31.326, 75.5762, ["jalandhar"], "jalandhar", "Jalandhar", ["Model Town", "Nakodar Road", "GT Road", "Civil Lines", "Rama Mandi", "Ladowali Road", "Phagwara Road", "Cantt"], "+91 181 222"],
  ["Tiruchirappalli, Tamil Nadu", 10.7905, 78.7047, ["tiruchirappalli", "trichy", "tiruchi"], "trichy", "Tiruchirappalli", ["Thillai Nagar", "Cantonment", "Srirangam", "Woraiyur", "KK Nagar", "Puthur", "TVS Tolgate", "Central Bus Stand"], "+91 431 241"],
  ["Bhubaneswar, Odisha", 20.2961, 85.8245, ["bhubaneswar", "bhubaneshwar"], "bhubaneswar", "Bhubaneswar", ["Saheed Nagar", "Jayadev Vihar", "Patia", "Chandrasekharpur", "Old Town", "Unit 1", "Khandagiri", "Infocity"], "+91 674 230"],
  ["Salem, Tamil Nadu", 11.6643, 78.146, ["salem"], "salem", "Salem", ["Fairlands", "Hasthampatti", "Suramangalam", "Five Roads", "Shevapet", "Alagapuram", "Kondalampatti", "Omalur Road"], "+91 427 244"],
  ["Mira-Bhayandar, Maharashtra", 19.2952, 72.8544, ["mira", "bhayandar", "mira-bhayandar", "mira road"], "mira", "Mira-Bhayandar", ["Mira Road East", "Bhayandar West", "Bhayandar East", "Shanti Nagar", "Kashimira", "Medtiya Nagar", "Maxus Mall Road", "Naya Nagar"], "+91 22 2811"],
  ["Thiruvananthapuram, Kerala", 8.5241, 76.9366, ["thiruvananthapuram", "trivandrum", "tvm"], "tvm", "Thiruvananthapuram", ["East Fort", "Pattom", "Technopark", "Kowdiar", "Kesavadasapuram", "Ulloor", "Kazhakkoottam", "Statue"], "+91 471 232"],
  ["Bhiwandi, Maharashtra", 19.2813, 73.0485, ["bhiwandi"], "bhiwandi", "Bhiwandi", ["Narpoli", "Temghar", "Kalyan Road", "Anjurphata", "Bhadwad", "Ganesh Nagar", "Station Road", "Octroi Naka"], "+91 2522 22"],
  ["Saharanpur, Uttar Pradesh", 29.968, 77.546, ["saharanpur"], "saharanpur", "Saharanpur", ["Court Road", "Mission Compound", "Chilkana Road", "Railway Road", "Hakikat Nagar", "Janakpuri", "Ambala Road", "Clock Tower"], "+91 132 271"],
  ["Gorakhpur, Uttar Pradesh", 26.7606, 83.3732, ["gorakhpur"], "gorakhpur", "Gorakhpur", ["Civil Lines", "Golghar", "Betiahata", "Rustampur", "Medical College Road", "Basharatpur", "Kunraghat", "Railway Station Area"], "+91 551 220"],
  ["Guntur, Andhra Pradesh", 16.3067, 80.4365, ["guntur"], "guntur", "Guntur", ["Brodipet", "Lakshmipuram", "Arundelpet", "Kothapet", "Nallapadu", "Autonagar", "Pattabhipuram", "Ring Road"], "+91 863 222"],
  ["Bikaner, Rajasthan", 28.0229, 73.3119, ["bikaner"], "bikaner", "Bikaner", ["Rani Bazar", "Station Road", "Public Park", "JNV Colony", "Pawanpuri", "Industrial Area", "Gangashahar", "Samta Nagar"], "+91 151 220"],
  ["Amravati, Maharashtra", 20.9374, 77.7796, ["amravati"], "amravati", "Amravati", ["Rajapeth", "Irwin Square", "Badnera Road", "VMV Road", "Camp", "Mardi Road", "Rathinagar", "Frezerpura"], "+91 721 266"],
  ["Noida, Uttar Pradesh", 28.5355, 77.391, ["noida", "greater noida"], "noida", "Noida", ["Sector 18", "Sector 62", "Sector 16", "Sector 50", "Sector 137", "Atta Market", "Film City", "Sector 63"], "+91 120 432"],
  ["Jamshedpur, Jharkhand", 22.8046, 86.2029, ["jamshedpur", "tatanagar"], "jamshedpur", "Jamshedpur", ["Bistupur", "Sakchi", "Kadma", "Sonari", "Telco", "Golmuri", "Mango", "Adityapur"], "+91 657 242"],
  ["Bhilai, Chhattisgarh", 21.1938, 81.3509, ["bhilai"], "bhilai", "Bhilai", ["Sector 6", "Supela", "Civic Centre", "Nehru Nagar", "Power House", "Ruabandha", "Camp 1", "Smriti Nagar"], "+91 788 222"],
  ["Cuttack, Odisha", 20.4625, 85.8828, ["cuttack"], "cuttack", "Cuttack", ["Buxi Bazaar", "College Square", "Badambadi", "CDA", "Chauliaganj", "Naya Bazaar", "Mangalabag", "Jobra"], "+91 671 230"],
  ["Firozabad, Uttar Pradesh", 27.1592, 78.3957, ["firozabad"], "firozabad", "Firozabad", ["Suhag Nagar", "Raja Ka Tal", "Station Road", "Tundla Road", "Glass City", "Ramgarh", "Civil Lines", "Agra Gate"], "+91 5612 24"],
  ["Kochi, Kerala", 9.9312, 76.2673, ["kochi", "cochin"], "kochi", "Kochi", ["MG Road", "Kakkanad", "Edappally", "Panampilly Nagar", "Fort Kochi", "Vyttila", "Palarivattom", "Ernakulam South"], "+91 484 235"],
  ["Nellore, Andhra Pradesh", 14.4426, 79.9865, ["nellore"], "nellore", "Nellore", ["Trunk Road", "AC Nagar", "Magunta Layout", "Stonehousepet", "Vedayapalem", "Fatima Nagar", "Railway Station Road", "Pogathota"], "+91 861 232"],
  ["Bhavnagar, Gujarat", 21.7645, 72.1519, ["bhavnagar"], "bhavnagar", "Bhavnagar", ["Waghawadi Road", "Kalubha Road", "Crescent Circle", "Takhteshwar", "Ghogha Circle", "Vidyanagar", "Nilambaug", "ST Road"], "+91 278 242"],
  ["Dehradun, Uttarakhand", 30.3165, 78.0322, ["dehradun", "dehra dun"], "dehradun", "Dehradun", ["Rajpur Road", "Paltan Bazaar", "Clock Tower", "Prem Nagar", "Ballupur", "Sahastradhara Road", "ISBT", "Kanwali Road"], "+91 135 265"],
  ["Durgapur, West Bengal", 23.5204, 87.3119, ["durgapur"], "durgapur", "Durgapur", ["City Centre", "Benachity", "Muchipara", "Durgapur Station", "Bidhannagar", "A-Zone", "Steel Township", "Bengal Ambuja"], "+91 343 254"],
  ["Asansol, West Bengal", 23.6739, 86.9524, ["asansol"], "asansol", "Asansol", ["Burnpur Road", "Hutton Road", "Court More", "Apcar Garden", "Chellidanga", "Kalipahari", "ISCO More", "G.T. Road"], "+91 341 230"],
  ["Rourkela, Odisha", 22.2604, 84.8536, ["rourkela"], "rourkela", "Rourkela", ["Uditnagar", "Sector 19", "Chhend", "Basanti Colony", "Koel Nagar", "Civil Township", "Bisra Road", "Fertilizer Township"], "+91 661 250"],
  ["Nanded, Maharashtra", 19.1383, 77.321, ["nanded"], "nanded", "Nanded", ["Vazirabad", "Anand Nagar", "CIDCO", "Taroda", "Shivaji Nagar", "Station Road", "Labour Colony", "Gokul Nagar"], "+91 2462 23"],
  ["Kolhapur, Maharashtra", 16.705, 74.2433, ["kolhapur"], "kolhapur", "Kolhapur", ["Rajarampuri", "Shahupuri", "Tarabai Park", "Laxmipuri", "Kawala Naka", "Station Road", "Rankala", "Nagala Park"], "+91 231 265"],
  ["Ajmer, Rajasthan", 26.4499, 74.6399, ["ajmer"], "ajmer", "Ajmer", ["Diggi Bazaar", "Station Road", "Vaishali Nagar", "Civil Lines", "Ana Sagar", "Mayo College Road", "Adarsh Nagar", "Foy Sagar"], "+91 145 242"],
  ["Akola, Maharashtra", 20.7002, 77.0082, ["akola"], "akola", "Akola", ["Ramdaspeth", "Old City", "Jatharpeth", "Gorakshan Road", "Civil Lines", "Murtizapur Road", "Kaulkhed", "Railway Station"], "+91 724 243"],
  ["Gulbarga (Kalaburagi), Karnataka", 17.3297, 76.8343, ["gulbarga", "kalaburagi"], "kalaburagi", "Kalaburagi", ["Super Market", "Station Bazaar", "Aiwan-E-Shahi", "Sedam Road", "Jagat", "MSL Layout", "Timmapuri", "Ring Road"], "+91 8472 22"],
  ["Jamnagar, Gujarat", 22.4707, 70.0577, ["jamnagar"], "jamnagar", "Jamnagar", ["Indira Gandhi Road", "Bedeshwar", "Digvijay Plot", "Patel Colony", "Bedi Bunder", "Aerodrome Road", "Ranjit Sagar Road", "City Plaza"], "+91 288 255"],
  ["Ujjain, Madhya Pradesh", 23.1765, 75.7885, ["ujjain"], "ujjain", "Ujjain", ["Freeganj", "Tower Chowk", "Dewas Gate", "Nanakheda", "Mahakal Road", "Indore Road", "Santwer Road", "BD Agarwal Colony"], "+91 734 255"],
  ["Loni, Maharashtra", 18.4865, 74.0278, ["loni", "loni kalbhor"], "loni", "Loni", ["Kalbhor Nagar", "Station Road", "Pune Road", "Market Yard", "Gaonthan", "MIDC Road", "School Road", "Temple Chowk"], "+91 2114 22"],
  ["Siliguri, West Bengal", 26.7271, 88.3953, ["siliguri"], "siliguri", "Siliguri", ["Hill Cart Road", "Sevoke Road", "Hakimpara", "Pradhan Nagar", "Bidhan Road", "Matigara", "Check Post", "Burdwan Road"], "+91 353 243"],
  ["Jhansi, Uttar Pradesh", 25.4484, 78.5685, ["jhansi"], "jhansi", "Jhansi", ["Civil Lines", "Sipri Bazaar", "Nai Basti", "Elite Crossing", "Medical College Road", "Kanpur Road", "Railway Colony", "Gwalior Road"], "+91 510 233"],
  ["Ulhasnagar, Maharashtra", 19.2215, 73.1645, ["ulhasnagar"], "ulhasnagar", "Ulhasnagar", ["Camp 1", "Camp 2", "Camp 3", "Camp 4", "Camp 5", "Shahad Road", "Vithalwadi", "Netaji Chowk"], "+91 251 256"],
  ["Sangli, Maharashtra", 16.8524, 74.5815, ["sangli", "miraj"], "sangli", "Sangli", ["Vishrambag", "Gaonbhag", "College Corner", "Miraj Road", "Kupwad", "Station Road", "Market Yard", "Wood House"], "+91 233 237"],
  ["Mangaluru, Karnataka", 12.9141, 74.856, ["mangaluru", "mangalore"], "mangaluru", "Mangaluru", ["Hampankatta", "Balmatta", "Kadri", "Bejai", "Kankanady", "Surathkal", "Pumpwell", "Lalbagh"], "+91 824 242"],
  ["Erode, Tamil Nadu", 11.341, 77.7172, ["erode"], "erode", "Erode", ["Brough Road", "Gandhiji Road", "Perundurai Road", "Sathy Road", "Surampatti", "Moolapalayam", "Solar", "Collectorate"], "+91 424 226"],
  ["Belagavi, Karnataka", 15.8497, 74.4977, ["belagavi", "belgaum"], "belagavi", "Belagavi", ["Khade Bazaar", "Tilakwadi", "Congress Road", "Shahapur", "Goaves", "Auto Nagar", "Fort", "Railway Station"], "+91 831 242"],
  ["Ambattur, Tamil Nadu", 13.1143, 80.1548, ["ambattur"], "ambattur", "Ambattur", ["OT Bus Stand", "Mogappair", "Menambedu", "Industrial Estate", "Red Hills Road", "Padi", "Kallikuppam", "Oragadam"], "+91 44 2657"],
  ["Tirunelveli, Tamil Nadu", 8.7139, 77.7567, ["tirunelveli", "nellai"], "tirunelveli", "Tirunelveli", ["Town", "Junction", "Palayamkottai", "High Ground", "Vannarpettai", "Melapalayam", "Sankar Nagar", "Bharathi Nagar"], "+91 462 233"],
  ["Malegaon, Maharashtra", 20.5579, 74.5287, ["malegaon"], "malegaon", "Malegaon", ["Camp", "Soygaon", "Satana Naka", "Dyane", "Chhawani", "Market Yard", "Station Road", "Agra Road"], "+91 2554 23"],
  ["Gaya, Bihar", 24.7914, 85.0002, ["gaya"], "gaya", "Gaya", ["Station Road", "Civil Lines", "AP Colony", "Rampur", "Tekari Road", "Cathedral Road", "Collectorate", "Bodh Gaya Road"], "+91 631 222"],
  ["Jalgaon, Maharashtra", 21.0077, 75.5626, ["jalgaon"], "jalgaon", "Jalgaon", ["Station Road", "MJ College Road", "Ring Road", "Mehrun", "Ramdas Colony", "Gandhi Chowk", "MIDC", "Akashwani"], "+91 257 222"],
  ["Udaipur, Rajasthan", 24.5854, 73.7125, ["udaipur"], "udaipur", "Udaipur", ["Hathi Pol", "Suraj Pole", "Fatehpura", "Sector 11", "Hiran Magri", "Chetak Circle", "University Road", "Ashok Nagar"], "+91 294 241"],
  ["Maheshtala, West Bengal", 22.5086, 88.2532, ["maheshtala"], "maheshtala", "Maheshtala", ["Batanagar", "Santoshpur", "Nungi", "Akra", "Chakmir", "Fatepur", "Ashuti", "Joka Road"], "+91 33 2490"],
];

console.log(`Cities: ${CITIES.length}`);

// --- indiaCities.ts ---
function esc(s) {
  return JSON.stringify(s);
}

let citiesTs = `/** Major Indian cities for demo location resolution (no Google Geocoding needed). */
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
 * Searchable cities for FindSure demo. Each city seeds ≥8 unique laptop-repair shops
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
`;

for (const [label, lat, lng, aliases] of CITIES) {
  citiesTs += `  {
    label: ${esc(label)},
    lat: ${lat},
    lng: ${lng},
    radiusKm: CITY_SEARCH_RADIUS_KM,
    aliases: ${esc(aliases)},
  },
`;
}

citiesTs += `];

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
`;

fs.writeFileSync(path.join(root, "client/src/utils/indiaCities.ts"), citiesTs);

// --- seed cities snippet + full seed rewrite ---
const BRANDS = [
  "Aarav", "ByteForge", "CircuitBay", "DigiNest", "ElectroFix", "FastBoard", "GadgetGrove",
  "HardReset", "iRepairDesk", "JouleLab", "KeyCap", "LogicLane", "MegaPixel", "NovaChip",
  "OrbitTech", "PixelForge", "QuickBoard", "RepairRoot", "SiliconStreet", "TrackPad",
  "UltraLogic", "VoltBench", "WireWorks", "XenonFix", "YottaSoft", "ZenBoard", "AlphaPort",
  "BoardBuddy", "CoreClinic", "DeltaDrive", "EagleChip", "FlashFrame", "GridGate", "HelixPC",
  "IronPixel", "JadeLogic", "KiteRepair", "LumenLab", "MicroMend", "NimbusFix", "OptiBoard",
  "PulsePort", "QuarkFix", "RelayDesk", "SparkShelf", "TurboTrace", "UnitFix", "VectorLab",
  "WalnutTech", "YellowChip", "ZapNest", "AmberPort", "BlueLogic", "CopperCore", "DoveFix",
  "EmberChip", "ForgePort", "GlintLab", "HarborFix", "IvoryBoard", "JetMend", "KeenChip",
  "LatticePC", "MossTech", "NorthPort", "OxideLab", "PrismFix", "QuartzDesk", "RidgeChip",
  "SablePort", "TideLogic", "UmbraFix", "ValeBoard", "WispTech", "AxiomMend", "BeaconChip",
  "CedarPort", "DriftLab", "EchoFix", "FlintBoard", "GroveTech", "HaloMend", "IngressFix",
  "JuniperPC", "KernelDesk", "LedgerFix", "MaplePort", "NestLogic", "OakChip", "PineBoard",
  "RapidMend", "StoneFix", "TerraPort", "UrbanChip", "VistaLab", "WillowFix", "ZephyrDesk",
];

const SUFFIXES = [
  "Laptop Hub", "PC Clinic", "Repair Studio", "Service Point", "Tech Corner",
  "Notebook Works", "Mac & PC Care", "Laptop Lab", "Gadget Centre", "Board Doctors",
  "Screen Works", "Chip Care", "Portable Fix", "System Bench", "Device Desk",
  "Logic Works", "Board Lab", "Notebook Desk", "Repair Bay", "Tech Bench",
  "Chip Studio", "Device Works", "Port Care", "System Hub", "Screen Lab",
  "Gadget Bay", "Laptop Desk", "PC Works", "Mend Point", "Fix Studio",
];

const AUTHORS = [
  "Ananya R.", "Vikram S.", "Priya M.", "Rahul K.", "Sneha P.", "Imran H.", "Divya G.",
  "Arjun M.", "Neha D.", "Srinivas K.", "Meena R.", "Ritwik B.", "Aditya P.", "Kiran S.",
  "Pooja J.", "Harpreet S.", "Anjali T.", "Lakshmi C.", "Farhan Q.", "Ishita N.",
  "Kabir L.", "Tanvi O.", "Yash W.", "Zoya F.", "Devansh C.", "Riya B.", "Mohit A.",
  "Sanjana V.", "Rohan T.", "Aisha N.", "Kunal P.", "Nisha R.", "Varun G.", "Diya S.",
  "Manish J.", "Kavya M.", "Sameer H.", "Trisha K.", "Nikhil D.", "Pallavi S.", "Omar F.",
  "Shreya L.", "Amit B.", "Chitra W.", "Deepak N.", "Esha P.", "Gaurav C.", "Hina Q.",
];

let citiesArr = "const CITIES: CityDef[] = [\n";
for (const [, lat, lng, , id, name, areas, phone] of CITIES) {
  citiesArr += `  { id: ${esc(id)}, name: ${esc(name)}, lat: ${lat}, lng: ${lng}, areas: ${esc(areas)}, phonePrefix: ${esc(phone)} },\n`;
}
citiesArr += "];\n";

const seedTs = `import { PrismaClient } from "@prisma/client";

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

${citiesArr}
/** Unique brand stems — sized for ${CITIES.length}×${8} shops. */
const BRANDS = ${JSON.stringify(BRANDS, null, 2)};

const SUFFIXES = ${JSON.stringify(SUFFIXES, null, 2)};

const AUTHORS = ${JSON.stringify(AUTHORS, null, 2)};

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
  const rng = mulberry32(hashStr(\`\${city.id}::\${shopIndex}::findsure-v3\`));
  const tier = tiersForCity(cityIndex)[shopIndex];
  const area = city.areas[shopIndex % city.areas.length];

  let name: string;
  if (city.id === "bengaluru" && tier === "moved") {
    name = "TechFix Hub";
  } else {
    let attempts = 0;
    const cityTag = city.name.split(/[\\s-]/)[0];
    do {
      const brand = BRANDS[(cityIndex * 8 + shopIndex * 17 + attempts * 5) % BRANDS.length];
      const suffix = SUFFIXES[(cityIndex * 7 + shopIndex * 13 + attempts * 3) % SUFFIXES.length];
      const styles = [
        \`\${brand} \${suffix} - \${cityTag}\`,
        \`\${cityTag} \${brand} \${suffix}\`,
        \`\${brand} \${cityTag} \${suffix}\`,
        \`\${suffix} by \${brand} (\${cityTag})\`,
      ];
      name = styles[(shopIndex + attempts) % styles.length];
      attempts += 1;
    } while (usedNames.has(name) && attempts < 80);
    if (usedNames.has(name)) {
      name = \`\${cityTag} Shop #\${shopIndex + 1} \${hashStr(city.id + shopIndex).toString(16)}\`;
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
            description: \`Caller said the number for \${name} may be outdated.\`,
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
            ? \`Visited \${area} — \${name} appears to have relocated.\`
            : \`Empty unit; locals said \${name} moved.\`,
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
          description: \`Shutters down at \${area}; may be permanently closed.\`,
        },
        {
          days: intBetween(rng, 16, 40),
          type: "CLOSED",
          description: \`Neighbor reported \${name} has shut down.\`,
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
          description: \`Mixed signals about whether \${name} is still at \${area}.\`,
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
        \`Got my laptop fixed near \${area} in \${city.name}.\`,
        \`\${name} was easy to find at \${area}.\`,
        \`Decent pricing; board-level work looked careful.\`,
        \`Screen replacement done same day in \${city.name}.\`,
        \`Staff confirmed they still operate from \${area}.\`,
      ]),
    },
  ];
  if (rng() > 0.35) {
    reviews.push({
      days: intBetween(rng, reviewDays + 10, reviewDays + 90),
      author: AUTHORS[(cityIndex * 11 + shopIndex * 5 + 2) % AUTHORS.length],
      rating: intBetween(rng, 2, 5),
      text: pick(rng, [
        \`Second visit — still at the same spot.\`,
        \`Battery swap was fine; wait time varied.\`,
        \`Would check trust signals before traveling again.\`,
        \`Technician in \${city.name} explained the issue clearly.\`,
      ]),
    });
  }
  if (rng() > 0.65) {
    reviews.push({
      days: intBetween(rng, 3, 45),
      author: AUTHORS[(cityIndex * 13 + shopIndex * 7 + 4) % AUTHORS.length],
      rating: intBetween(rng, 3, 5),
      text: pick(rng, [
        \`Walk-in near \${area} — queue was honest.\`,
        \`Found via FindSure; listing matched the shopfront.\`,
        \`Keyboard replacement held up well after a week.\`,
      ]),
    });
  }

  return {
    name,
    address: \`\${streetNo} \${area}, \${city.name}, India\`,
    latitude: Number(pos.lat.toFixed(5)),
    longitude: Number(pos.lng.toFixed(5)),
    phone: \`\${city.phonePrefix} \${phoneTail}\`,
    website: \`https://example.com/\${city.id}/\${hashStr(name).toString(16)}\`,
    rating,
    reviewCount,
    openNow,
    googleMapsUrl: \`https://www.google.com/maps/search/?api=1&query=\${encodeURIComponent(
      \`\${name} \${area} \${city.name}\`
    )}\`,
    googlePlaceId: \`demo_\${city.id}_\${shopIndex + 1}_\${hashStr(name).toString(16)}\`,
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
    \`Seeded \${total} unique shops across \${CITIES.length} cities (\${usedNames.size} distinct names).\`
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
`;

fs.writeFileSync(path.join(root, "server/prisma/seed.ts"), seedTs);
console.log("Wrote indiaCities.ts and seed.ts");
