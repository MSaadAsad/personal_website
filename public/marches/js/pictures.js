'use strict';
// Portraits of the generals: [name pattern, image, caption], from period
// paintings, drawings and photographs in the public domain (Wikimedia Commons,
// the V&A, the British Library and others). Where no likeness of a man is
// known, a portrait of a contemporary of the same rank stands in, and says so.
const GENERAL_PICTURES = [
["Sher Baz", "rep-hill-elder-1866", "Stand-in: an elder of the frontier hills, photographed 1866. No portrait of Sher Baz Khan is known"],
["Luard", "rep-brit-mccosh-1852", "Stand-in: a Bengal Army officer, by John McCosh, 1852. No portrait of Major Luard is known"],
["Ahmad Shah Durrani", "ahmad-shah-durrani", "Ahmad Shah Durrani, Mughal portrait, c. 1757 (Bibliothèque nationale de France)"],
["Qamar-ud-din", "qamar-ud-din-khan", "Qamar-ud-din Khan, the wazir, Mughal portrait, c. 1735 (BnF)"],
["Dost Muhammad", "dost-muhammad-khan", "Dost Muhammad Khan, Company painting, c. 1835 (National Army Museum)"],
["Mohkam Chand", "mohkam-chand", "Diwan Mohkam Chand, Punjab painting, c. 1840 (after his death)"],
["Mahan Singh", "mahan-singh", "Mahan Singh Sukerchakia, painting in the Chandigarh Museum, undated"],
["Jai Singh Kanhaiya", "jai-singh-kanhaiya", "Jai Singh Kanhaiya, Purkhu workshop, c. 1780"],
["Gurbakhsh Singh", "gurbakhsh-singh-kanhaiya", "Gurbakhsh Singh Kanhaiya, Purkhu workshop, c. 1785"],
["Sansar Chand", "sansar-chand", "Raja Sansar Chand of Kangra, c. 1800–10 (Brooklyn Museum)"],
["Jassa Singh Ramgarhia", "jassa-singh-ramgarhia", "Jassa Singh Ramgarhia, Purkhu workshop, c. 1760–80"],
["Shah Zaman", "shah-zaman", "Shah Zaman Durrani, durbar painting, c. 1793–1800"],
["Ranjit Singh Sukerchakia", "ranjit-singh-young", "Ranjit Singh as a young man, from his meeting with Holkar, c. 1805"],
["Fateh Singh Man", "fateh-singh-man", "“Futteh Sing Maun”, after a Lahore painting, 1847 (Smyth)"],
["Mir Mannu|Muin-ul-Mulk", "rep-afghan-bangash", "Stand-in: Nawab Muhammad Khan Bangash, a Mughal noble, c. 1730 (BnF). No portrait of Mir Mannu is known"],
["Jahan Khan", "rep-barakzai-eden-1841-ghani", "Stand-in: Abdul Ghani Khan, an Afghan sardar, drawn by Emily Eden, 1841. No portrait of Jahan Khan is known"],
["Fateh Khan Barakzai", "rep-barakzai-eden-1841-akram", "Stand-in: Muhammad Akram Khan, Fateh Khan’s nephew, drawn by Emily Eden, 1841. No portrait of Fateh Khan is known"],
["Hafiz Ahmad Khan", "rep-afghan-rohilla-1821", "Stand-in: a Pashtun noble of the Barech clan, North India, 1821–22. No portrait of Hafiz Ahmad Khan is known"],
[
"Ranjit Singh",
"ranjit-singh",
"Maharaja Ranjit Singh, from Skinner’s Tazkirat al-Umara, 1830"
],
[
"Hari Singh Nalwa",
"hari-singh-nalwa",
"Hari Singh Nalwa, by Hasan al-Din of Lahore, c. 1845–50"
],
[
"Kanwar Sher Singh",
"kanwar-sher-singh",
"Sher Singh, by August Schoefft, 1841–42"
],
[
"Gulab Singh",
"gulab-singh",
"Raja Gulab Singh, Punjab painting, c. 1846 (V&A)"
],
[
"Lal Singh",
"lal-singh",
"Raja Lal Singh, by Imam Bakhsh Lahori, c. 1846–49"
],
[
"Tej Singh",
"tej-singh",
"Raja Tej Singh, by William Carpenter, c. 1850–57 (V&A)"
],
[
"Mulraj",
"mulraj",
"Diwan Mulraj, drawn in captivity by Colesworthey Grant, 1851"
],
[
"Ranjodh Singh",
"ranjodh-singh-majithia",
"Ranjodh Singh Majithia, after a Lahore painting, 1847 (Smyth)"
],
[
"Attar Singh",
"attar-singh-sandhanwalia-alt-loc",
"“Utter Sing” (very probably Attar Singh Sandhanwalia), after a Lahore painting, 1847 (Smyth)"
],
[
"Diwan Chand",
"misr-diwan-chand",
"Possibly Misr Diwan Chand: a Lahore court portrait, identification uncertain"
],
[
"Muzaffar Khan",
"muzaffar-khan",
"Nawab Muzaffar Khan of Multan, Company painting, c. 1865 (long after his death)"
],
[
"Akbar Khan",
"akbar-khan",
"Muhammad Akbar Khan, after Vincent Eyre, 1842"
],
[
"Charat Singh",
"charat-singh",
"Charat Singh, lithograph from the Umdat-ut-Tawarikh, 1886 (long after his death)"
],
[
"Jhanda Singh",
"jhanda-singh-bhangi",
"Jhanda Singh Bhangi, painting in the Chandigarh Museum, undated"
],
[
"Gough",
"hugh-gough",
"Sir Hugh Gough, daguerreotype, 1850"
],
[
"Harry Smith",
"harry-smith",
"Sir Harry Smith, oil, c. 1850"
],
[
"Nicholson",
"john-nicholson",
"John Nicholson, after J. R. Dicksee, c. 1867 (posthumous)"
],
[
"Edwardes",
"herbert-edwardes",
"Herbert Edwardes, by Henry Moseley, c. 1850"
],
[
"Desa Singh|Bhangi Sardars",
"rep-misl-gujjar-singh",
"Stand-in: Gujjar Singh Bhangi, a fellow Bhangi chief, 18th century. No portrait of Desa Singh is known"
],
[
"Ubaid Khan",
"rep-durrani-shah-wali-khan",
"Stand-in: Shah Wali Khan, Ahmad Shah’s wazir, 1760s. No portrait of Ubaid Khan is known"
],
[
"Zangi Khan",
"rep-afghan-zabita-khan",
"Stand-in: Zabita Khan, by Mihr Chand, c. 1770. No portrait of Zangi Khan is known"
],
[
"Labh Singh",
"rep-dogra-udham-singh",
"Stand-in: Mian Udham Singh, Dogra painting, c. 1835–40. No portrait of Labh Singh is known"
],
[
"Hari Chand",
"rep-dogra-attendant",
"Stand-in: a Dogra officer, Lahore–Jammu painting, c. 1835–40. No portrait of Hari Chand is known"
],
[
"Sher Singh Attariwala",
"rep-sikh-commander-1850",
"Stand-in: a Sikh commander, c. 1850. No portrait of Sher Singh Attariwala is known"
],
[
"Surat Singh",
"rep-sikh-lehna-singh-majithia",
"Stand-in: Lehna Singh Majithia, by Hasan al-Din, c. 1845–50. No portrait of Surat Singh is known"
],
[
"Dildar Baig",
"rep-madras-subadar-1840",
"Stand-in: a subadar of the Company’s sepoys, c. 1840"
],
[
"46th",
"rep-madras-subadar-1840",
"Stand-in: a subadar of the Company’s sepoys, c. 1840"
],
[
"Ellice",
"rep-brit-campbell",
"Stand-in: an officer of the 1850s (Sir John Campbell, by Roger Fenton, 1855)"
],
[
"Elphinstone",
"rep-brit-brydon-1850",
"Stand-in: a Company officer in civilian dress, by John McCosh, 1850"
],
[
"Akbar Shah",
"rep-pathan-afridis-1866",
"Stand-in: an elder of the frontier tribes, photographed 1866"
],
[
"Ahmad Khan",
"rep-sikh-mccosh-sidhi-pagh",
"Stand-in: a Punjabi of the period, photographed by John McCosh, c. 1847–49. No portrait of Ahmad Khan Kharral is known"
]
];
// Stand-ins by army, for a general with no entry above.
const STANDARD_PICTURES = {
"khalsa": [
"rep-misl-karam-singh",
"Stand-in: a Sikh sardar, by Purkhu of Kangra, c. 1780s–90s"
],
"nishan": [
"rep-misl-nahar-singh",
"Stand-in: a Sikh sardar, by Purkhu of Kangra, c. 1780s–90s"
],
"dogra": [
"rep-dogra-smyth-udham",
"Stand-in: a Dogra noble, after a Lahore painting, 1847"
],
"durrani": [
"rep-durrani-shah-wali-khan",
"Stand-in: Shah Wali Khan, Ahmad Shah’s wazir, 1760s"
],
"mughal": [
"rep-durrani-shah-wali-khan",
"Stand-in: a noble of Ahmad Shah’s court, 1760s"
],
"sadozai": [
"muzaffar-khan",
"Stand-in: Nawab Muzaffar Khan of Multan, c. 1865"
],
"tribal": [
"rep-pathan-afridis-1866",
"Stand-in: an elder of the frontier tribes, 1866"
],
"kharal": [
"rep-sikh-mccosh-sidhi-pagh",
"Stand-in: a Punjabi of the period, c. 1847–49"
],
"rebel": [
"rep-madras-subadar-1840",
"Stand-in: a subadar of the Company’s sepoys, c. 1840"
],
"company": [
"rep-brit-hume",
"Stand-in: a British officer, by Roger Fenton, 1855"
],
"punjab": [
"rep-brit-mccosh-1852",
"Stand-in: a Company officer, by John McCosh, 1852"
]
};
