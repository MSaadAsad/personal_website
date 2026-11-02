'use strict';
// What actually happened, in brief, with the works each battle was built
// from; by battle group (SCENARIOS[id].group || id).
const HISTORIES = {
 "khari": {
  "history": [
   "Khari Khariyali is the strip of the Jhelum’s east bank below the Mirpur ridge, running up to Panjeri, with Mangla Fort on its hill in a bend of the river. Its jagirs belonged to Maharani Chand Kaur. When the siege of Lahore ended her regency in January 1841, her estates there passed to the management of Raja Gulab Singh of Jammu, but the Sikh troops holding them under Surat Singh would not give them up.",
   "In 1841 Gulab Singh’s general, Diwan Hari Chand, marched the Dogra army in to take the jagirs by force. He reduced the garrisons one at a time: first Aurangabad (Sarai Alamgir), then Sukhchainpur and Kot Kandhari. Mangla Fort held out longest, and fell only after a siege of fifteen days. The sources used here give no numbers for either side.",
   "Khari Khariyali stayed with the Dogras. Under the Treaty of Amritsar in 1846 Gulab Singh became Maharaja of Jammu and Kashmir, and the country round Mirpur remained part of his state until 1947. Mangla Fort now overlooks the reservoir of the Mangla Dam."
  ],
  "sources": [
   "Saad Asad, “The Battle for Khari, 1840” (Medium, 2025)",
   "Diwan Kirpa Ram, Gulabnama (c. 1876)"
  ]
 },
 "chillianwala": {
  "history": [
   "In 1848 risings at Multan and in Hazara grew into the Second Anglo-Sikh War. Raja Sher Singh Attariwala drew the Khalsa army up on the Jhelum, and his father Chattar Singh was holding Attock. Lord Gough, the Commander-in-Chief, marched up from the Chenab by Helan and Dinga to bring Sher Singh to battle before Chattar Singh’s army could join him.",
   "The Sikh line ran north to south for some five miles, from the low ridges at Rasul through dense jungle to the villages on its right. On 13 January 1849 Gough attacked late in the day, through the jungle. HM 24th Foot lost more than half its strength. Brigadier Pope’s cavalry brigade broke and fell back through the British guns. Some guns and colours were lost, and the fighting ended at dark. Gough had about 12,000 men. Estimates of the Sikh strength range from about 10,000 to 40,000. British losses were about 2,350 killed, wounded and missing.",
   "Both armies claimed the field. Sher Singh held Rasul, and Chattar Singh brought his army down to join him. The losses caused alarm in Britain, and Sir Charles Napier was sent out to replace Gough. Gough fought at Gujrat before Napier arrived."
  ],
  "sources": []
 },
 "gujrat": {
  "history": [
   "After Chillianwala the Sikh army was short of food. Raja Sher Singh and his father Chattar Singh, with Afghan horse under Akram Khan, fell back from Rasul to Gujrat, meaning to cross the Chenab and march on Lahore. Multan had surrendered on 22 January 1849, and Lord Gough moved down towards the Chenab to meet the troops it set free.",
   "Major-General Whish’s division and siege train joined Gough on 18 February, Brigadier Dundas’s Bombay column on the 19th, and Brigadier Markham’s brigade, across the Chenab at Kanokee, on the 20th. On the 21st Gough moved up from Trikur to Shadiwal and attacked from the south. His heavy guns opened a long cannonade before the infantry went forward, and the Sikh line gave way. Gough put the Sikh army at 60,000 men with 59 guns; modern estimates are about 20,000. British losses are given as 96 killed and some 700 wounded.",
   "Gough’s cavalry and a column under Sir Walter Gilbert pursued the beaten army. In mid-March Sher Singh and Chattar Singh laid down their arms near Rawalpindi, and the Afghans withdrew to the Khyber. Lord Dalhousie annexed the Punjab before the end of the spring."
  ],
  "sources": [
   "Lord Gough, despatch of 26 February 1849, London Gazette, no. 20969 (1849)"
  ]
 },
 "multan1818": {
  "history": [
   "Multan was ruled by Nawab Muzaffar Khan Sadozai, nominally under the Afghan kings. From 1802 onwards Ranjit Singh sent several expeditions against it, but each ended with the Nawab paying tribute. In 1818 Ranjit Singh set out to take the city for good. He sent his son Prince Kharak Singh, then about sixteen, with Misr Diwan Chand in actual command.",
   "Khangarh and Muzaffargarh fell first, and the walled city was taken in February. The Nawab held out in the citadel. The great Zamzama gun was dragged down from Lahore and breached the citadel walls near the Khizri Gate. Earlier assaults on the breaches were driven back. Then the Akali Sadhu Singh led his Nihangs through, and Muzaffar Khan was killed in the breach with five of his sons. Most historians date the storm to 2 June 1818; Hari Ram Gupta puts it on 20 June. Estimates of both armies vary widely.",
   "Multan was plundered and became a province of the Lahore kingdom. The Nawab’s surviving sons were taken to Lahore and given an allowance. Diwan Sawan Mal governed the province from 1821, and in 1848 the rising of his son Mulraj brought on a second siege."
  ],
  "sources": []
 },
 "multan1849": {
  "history": [
   "After the First Anglo-Sikh War the Lahore Darbar governed under a British Resident. In April 1848 two British officers, Vans Agnew and Anderson, came to Multan to take over the province from its governor, Diwan Mulraj, and were killed there. Mulraj rose in revolt. Lieutenant Herbert Edwardes, a political officer beyond the Indus, raised Pathan levies against him.",
   "On 17 June Mulraj’s army, 8,000–10,000 men with ten guns under his brother-in-law Rung Ram, lay below Shujabad. The Nawab of Bahawalpur’s 8,500 Daudpotras lay to the south, and Edwardes, with Cortlandt’s 1,500 Sikh regulars and some 5,000 Pathans, was crossing the Chenab. The allies won at Kineyree on 18 June and Saddusam on 1 July, driving Mulraj into Multan. Major-General Whish brought a siege train in August. On 14 September Raja Sher Singh’s Darbar troops went over to Mulraj, and the siege was raised. With a Bombay column the siege was renewed in December, and on the 30th a shell blew up the citadel’s magazine.",
   "Mulraj gave up the citadel on 22 January 1849. He was tried, and his death sentence was commuted. By then Sher Singh had joined his father’s rising, and the revolt had become the Second Anglo-Sikh War."
  ],
  "sources": [
   "Herbert Edwardes, A Year on the Punjab Frontier (1851), vol. II"
  ]
 },
 "lahore": {
  "history": [
   "Maharaja Ranjit Singh died in 1839. In November 1840 his son and successor Kharak Singh died, and so did Kharak Singh’s son Nau Nihal Singh, killed by falling masonry on the day of his father’s funeral. Kharak Singh’s widow, Maharani Chand Kaur, claimed the regency, with Raja Gulab Singh’s Dogras holding the fort. Kanwar Sher Singh, a son of Ranjit Singh, claimed the throne, and most of the army backed him.",
   "In January 1841 Sher Singh marched on Lahore from Amritsar, and the regiments at Mian Mir and the Fauj-i-Khas declared for him. By one account he had 26,000 foot, 8,000 horse and 45 guns, against about 5,000 men for Chand Kaur. His guns bombarded the fort, some of them mounted on the minarets of the Badshahi Mosque. On the evening of 17 January Raja Dhian Singh, Gulab Singh’s brother, arranged a ceasefire. At midnight Gulab Singh marched out with the treasury, and Sher Singh entered the fort on the 20th.",
   "Sher Singh was proclaimed Maharaja. Chand Kaur gave up her claim in return for jagirs, among them Khari Khariyali. She was killed by her servants in June 1842, and Sher Singh was assassinated in September 1843."
  ],
  "sources": []
 },
 "naurangabad": {
  "history": [
   "In September 1843 the Sandhanwalia sardars killed Maharaja Sher Singh and the wazir Dhian Singh. Dhian Singh’s son Hira Singh became wazir for the boy Maharaja Duleep Singh, and Attar Singh Sandhanwalia fled across the Sutlej. Baba Bir Singh of Naurangabad, a revered holy man, had some 1,200 foot, 200–300 horse and two guns. His camp at Harike, where the Beas meets the Sutlej, sheltered Kashmira Singh, a son of Ranjit Singh, and on 2 May 1844 Attar Singh crossed back to join it. Hira Singh told the army that Attar Singh came with British backing.",
   "Hira Singh sent battalions under Mian Labh Singh, who left Lahore on 5 May and arrived on the 7th. Divisions also came from Amritsar under Mahtab Singh Majithia and from Kasur under Gulab Singh Calcutta-wala. At a parley Attar Singh killed Gulab Singh Calcutta-wala, and the guns opened on the camp. Bir Singh was struck by a cannon ball and died that evening. Attar Singh and Kashmira Singh were killed, and many drowned in the river.",
   "The camp was plundered, and the battalions that fired on it were afterwards called gurumar, killers of the guru. Hira Singh was himself killed in December 1844."
  ],
  "sources": [
   "G. Carmichael Smyth, A History of the Reigning Family of Lahore (1847), pp. 113–20",
   "Sohan Lal Suri, Umdat-ut-Tawarikh, IV, pp. 290–94",
   "J. D. Cunningham, A History of the Sikhs (1853), pp. 266–67",
   "Lord Ellenborough, letter to Queen Victoria, 10 June 1844",
   "Bhai Sher Singh, Sri Bir Mrigesh Gur Bilas"
  ]
 },
 "gujranwala": {
  "history": [
   "In 1761, after Ahmad Shah Durrani had gone home from Panipat, the Sikh misls spread their power across the central Punjab. Charat Singh of the Sukerchakia misl built a brick fort at Gujranwala on the high road to Kabul, and beat the Shah’s general Nur-ud-din at Sialkot. Ahmad Shah’s governor of Lahore, Khwaja Ubaid Khan (also called Abed Khan), then marched to take Gujranwala.",
   "In the autumn of 1761 Ubaid Khan set out with nine or ten thousand horse and foot and ten or twelve guns. He entrenched at Eminabad for some days, then before Gujranwala. Charat Singh’s garrison drove the besiegers back into their lines with sallies. The misls gathered and camped about four miles off: Jassa Singh Ahluwalia, Hari Singh, Jhanda Singh and Gujjar Singh of the Bhangis, and Jai Singh Kanhaiya. The 1,400–1,500 Sikhs in Ubaid Khan’s pay were won over, and before the misls could attack he fled after dark, leaving his guns, camels and stores. No numbers are recorded for the misls.",
   "The misls followed Ubaid Khan back to Lahore. In February 1762 Ahmad Shah returned to the Punjab and inflicted a heavy defeat on the Sikhs near Kup."
  ],
  "sources": [
   "Hari Ram Gupta, History of the Sikhs, II, pp. 171–73, and IV, pp. 28–29 and 294–96",
   "Ganda Singh, Ahmad Shah Durrani (1959), ch. XXI",
   "Syad Muhammad Latif, History of the Panjab (1891), p. 282"
  ]
 },
 "jammu": {
  "history": [
   "Raja Ranjit Dev of Jammu meant his younger son, Dalel Singh, to succeed him. The elder son, Brij Raj Dev, rose in revolt and called in two Sikh chiefs, Charat Singh Sukerchakia and Jai Singh Kanhaiya, who camped on the Basantar between the Jammu hills and the Sialkot plain. Ranjit Dev called in his overlord, Jhanda Singh of the Bhangi misl, and the hill rajas of Chamba, Kangra, Nurpur and Basohli.",
   "The skirmishing became a battle near Zafarwal that went on for 23 days without a decision. Then Charat Singh was killed when his own matchlock burst in his hands. Soon afterwards Jhanda Singh Bhangi was shot in his camp by a man of his own service, who is said to have been bribed by Jai Singh. Jhanda Singh’s brother, Ganda Singh, drew the Bhangis off. No numbers are recorded for either side. Most accounts date the battle to 1774, though some put Charat Singh’s death as early as 1770.",
   "Ranjit Dev came to terms. Brij Raj Dev was made his heir, and Jammu paid tribute to the Kanhaiyas. Charat Singh was succeeded by his young son Maha Singh, the father of Ranjit Singh."
  ],
  "sources": [
   "Hari Ram Gupta, History of the Sikhs, IV (1999), p. 215",
   "Hari Ram Gupta, Trans-Sutlej Sikhs (1939), p. 34",
   "J. Hutchison and J. Ph. Vogel, History of the Panjab Hill States, I (1933), p. 89",
   "Bhagat Singh, A History of the Sikh Misals (1993), p. 153"
  ]
 },
 "rohtas": {
  "history": [
   "The Bhangi misl had held the country round Rohtas since 1767 and Multan since 1772. In late 1779 Timur Shah, Ahmad Shah Durrani’s son and successor, marched to take Multan back. When the Bhangi chiefs shot his envoy, Haji Ali Khan, he sent Zangi Khan ahead against their camps between Rohtas and the Jhelum.",
   "Zangi Khan took some 18,000 Yusufzais, Durranis, Mughals and Qizilbash by little-known roads, in secret. He halted about 25 kilometres short of the Sikh camps and seized anyone heading towards them. Then he attacked before daybreak. The Sikhs, whom Gupta reckons at about 5,500, fought but broke. By his account some 3,000 were killed and 500 drowned in the Jhelum, while 2,000 got across to the far bank. The sources do not name the Sikh chiefs.",
   "The defeat cleared the northern road. Timur Shah could not stay in the north, and he was before Multan by January 1780. He took the city back from the Bhangis that year."
  ],
  "sources": [
   "Hari Ram Gupta, Studies in Later Mughal History of the Punjab (2000), pp. 237–41",
   "Hari Ram Gupta, History of the Sikhs, IV (2001), pp. 432–35",
   "Ashiq Muhammad Khan, The Last Phase of Muslim Rule in Multan (1998), p. 157"
  ]
 },
 "nowshera": {
  "history": [
   "Peshawar was held by Yar Muhammad Khan, a Barakzai sardar who paid tribute to Lahore. In 1823 his brother Muhammad Azim Khan, the wazir at Kabul, came down to take the valley back. The Yusufzai and Khattak tribes answered his call to holy war. Ranjit Singh marched to meet them.",
   "Ranjit Singh’s advance guard took Jahangira, and on 13 March the army forded the Indus opposite Hund, carrying its guns on elephants and losing men to the current. The next day the Yusufzai and Khattak ghazis held the Teri hill by Pir Sabaq, north of the Kabul river. Prinsep puts them at 4,000–5,000 and Cunningham at 20,000. Azim Khan’s army lay on the south bank and did not cross. On Ventura’s advice Ranjit attacked late in the day. The Akalis charged and their leader, Phula Singh, was killed. The Gorkha battalion held when others broke, and the hill fell at sunset.",
   "That night Azim Khan, fearing for his family and treasure at Michni, broke up his camp and went back over the passes. He died within two months. Ranjit Singh entered Peshawar on 17 March and left it with Yar Muhammad as a tributary."
  ],
  "sources": [
   "Henry T. Prinsep, Origin of the Sikh Power in the Punjab (1834), pp. 136–40",
   "Sohan Lal Suri, Umdat-ut-Tawarikh, II, pp. 363–68",
   "J. D. Cunningham, A History of the Sikhs (1849), pp. 163–64",
   "Olaf Caroe, The Pathans (1958), pp. 295–97",
   "Charles Masson, Narrative of Various Journeys in Balochistan, Afghanistan and the Panjab, III (1842), pp. 56–61"
  ]
 },
 "jamrud": {
  "history": [
   "Lahore had taken Peshawar under direct rule in 1834, and Amir Dost Muhammad Khan of Kabul wanted it back. Between December 1836 and February 1837 Hari Singh Nalwa, governor of Peshawar, built a fort at Jamrud, at the mouth of the Khyber. In the spring the best of the Sikh troops were called to Lahore for Kanwar Nau Nihal Singh’s wedding.",
   "Dost Muhammad sent his son Muhammad Akbar Khan down the Khyber, with Mirza Sami Khan, Afzal Khan and Shamsuddin Khan. By Gupta’s count they had some 7,000 horse, 2,000 matchlockmen, 9,000 ghazis and eighteen guns, besides many Khyber tribesmen. Haji Khan led levies against Shabqadar at the same time. Mahan Singh held Jamrud with 600–800 men. The Afghans invested it on 23 April, and on the 29th their guns breached the walls. On the 30th Hari Singh came out from Peshawar, broke the assault and took fourteen guns. Then Shamsuddin and Akbar Khan rallied the Afghans, and Hari Singh was killed charging their right.",
   "The Sikhs held the fort and kept Hari Singh’s death secret. When the army from Lahore came up, the Afghans withdrew by night. Both sides claimed the victory. Peshawar remained with Lahore."
  ],
  "sources": [
   "Gazetteer of the Peshawar District (1897–98), ch. II",
   "Hari Ram Gupta, History of the Sikhs, V",
   "Vanit Nalwa, Hari Singh Nalwa (2009)"
  ]
 },
 "jhelum1857": {
  "history": [
   "In May 1857 sepoys rose at Meerut and seized Delhi. In the Punjab, Sir John Lawrence disarmed the Hindustani regiments he did not trust. To stop the 14th Native Infantry carrying the mutiny into the Punjab, he ordered it to be disarmed at Jhelum on 7 July, the same morning that the 58th were disarmed at Rawalpindi.",
   "Lieutenant-Colonel Ellice marched from Rawalpindi with three companies of HM 24th (260 men), three horse-artillery guns and 150 police. Lind’s newly raised Mooltanee levies, some 460 horse and 250 foot, joined him. The 14th, some 500 men once its hundred Sikhs had stepped out, loaded and fell back on its loopholed lines and quarter-guard. The Mooltanee charge was shot down. About eleven the 24th carried the quarter-guard, and Ellice was badly wounded. Some 300 sepoys got away to the village of Samlee and held it all afternoon against the guns.",
   "In the night they slipped away. The bridge of boats was in police hands and the ferry-boats had been taken up. Most who reached the Mangla ford and Kashmir were handed over by the Maharaja’s officials, and the 14th ceased to exist as a regiment."
  ],
  "sources": [
   "John Cave-Browne, The Punjab and Delhi in 1857 (1861), vol. II, pp. 48–58"
  ]
 },
 "gogera": {
  "history": [
   "In September 1857 the Punjab had been stripped of troops for the siege of Delhi. The Lahore–Multan road, the Punjab’s only line to Bombay, ran through the Gogera district along the Ravi. On the night of 16 September the Ravi clan chiefs slipped away from Gogera to rise in their villages. At dawn Rai Ahmad Khan Kharral, across the river at Jhamra, told the British officer Berkeley that he was the King of Delhi’s man.",
   "The clans cut the road for eight days, while Lieutenant Elphinstone, the deputy commissioner, held the tahsil at Gogera. From Lahore the 1st Sikh Cavalry came in on the 19th and Lieutenant-Colonel Paton’s column, with three horse-artillery guns, on the 20th. From Multan, Major Chamberlain rode up with sowars of the 1st Irregular Cavalry and was besieged in the serai at Chichawatni. Ahmad Khan was killed at Gishkori on the 21st. The next day the Fatianas killed Berkeley near Kaure Shah.",
   "After Ahmad Khan’s death the clans fell back on the Jalli jungle, and the road was reopened. Columns from Lahore, Multan and Jhang spent weeks more in the jungle and the Bar before the district was quiet, well after Delhi fell on 20 September."
  ],
  "sources": [
   "N. W. Elphinstone, narrative of the Gugera district, Punjab Government Records, vol. VIII: Mutiny Reports, part II (1911)",
   "Hamilton, narrative of the Multan division, Punjab Government Records, vol. VIII: Mutiny Reports, part II (1911)"
  ]
 },
 "trimmu": {
  "history": [
   "On 9 July 1857 the 46th Native Infantry and the right wing of the 9th Light Cavalry rose at Sialkot. They killed their brigadier and marched east with the station gun and some Rs 35,000. They meant to raise the 2nd Irregular Cavalry at Gurdaspur and go on by Hoshiarpur to Delhi, but made only ten miles the first day.",
   "Brigadier-General John Nicholson’s movable column left Amritsar at 9 p.m. on the 10th. The men of HM 52nd rode in carts and on ponies, and the Punjab infantry on the troop horses of the disarmed 9th. They reached Gurdaspur, 41–44 miles away by different counts, on the afternoon of the 11th. On the 12th Nicholson let the mutineers cross the Ravi at Trimmu Ghat, met them half a mile from the river and broke them in half an hour. The survivors held an island with their gun until Nicholson crossed by boat on the 16th. The mutineers numbered some 1,100 in all.",
   "The Sialkot brigade was destroyed. Those who escaped were hunted down by villagers or handed over by the Jammu authorities. Nicholson marched on to Delhi, where he was mortally wounded in the assault of 14 September 1857."
  ],
  "sources": [
   "John Nicholson, report of 19 July 1857, in John Cave-Browne, The Punjab and Delhi in 1857 (1861), vol. II, pp. 320–25",
   "George Bourchier, Eight Months’ Campaign against the Bengal Sepoy Army (1858), pp. 13–22",
   "Punjab Mutiny Reports: Roberts, paras 72–92, and the Gurdaspur district report",
   "Lionel J. Trotter, The Life of John Nicholson (1897), pp. 277–90"
  ]
 },
 "ferozeshah": {
  "history": [
   "In the years after Ranjit Singh’s death the Khalsa army became the strongest power in Lahore, and the British massed troops along the Sutlej. On 11 December 1845 the Khalsa army crossed the river and invested Ferozepur, where Sir John Littler held the town and its entrenched cantonment. Raja Lal Singh took the main army out to Ferozeshah to meet the British relief force. Tej Singh stayed before Ferozepur.",
   "Sir Hugh Gough came up from Ambala, 150 miles in six days, with the Governor-General, Sir Henry Hardinge, in his camp. On the evening of 18 December he beat off Lal Singh’s attack at Mudki. On the 21st Littler slipped out of Ferozepur and joined Gough on the march, and that afternoon the army attacked the entrenched camp at Ferozeshah. It was taken the next morning, and later that day Tej Singh came up with fresh troops and twice tried to retake it, then drew off. British losses were 694 killed and 1,721 wounded. Many in the Khalsa believed then and since that their commanders had betrayed them.",
   "The Khalsa army fell back over the Sutlej with much of its strength intact, and the war went on at Aliwal and Sobraon."
  ],
  "sources": [
   "Sir Henry Hardinge, Sir Hugh Gough and Sir John Littler, despatches, London Gazette, no. 20576 (23 February 1846)"
  ]
 },
 "aliwal": {
  "history": [
   "After Ferozeshah the main armies faced each other at Sobraon. Further up the river, Sardar Ranjodh Singh Majithia crossed the Sutlej from Phillaur with a large force and the Raja of Ladwa’s men. He threatened Ludhiana, held by three native battalions, and the British supply road through Jagraon, Bassian and Raikot. Sir Harry Smith, who had just taken the grain fort of Dharamkot, was sent to clear the left bank.",
   "Smith marched by Jagraon for Ludhiana, and on 21 January 1846 the Sikh horse took much of his baggage at Budhowal. Ranjodh Singh fell back to the ghat of Talwan, where 4,000 of Avitabile’s regulars, twelve guns and more horse crossed to join him. Brigadier-General Wheeler’s brigade came up to Smith, and the Sirmoor and Nusseree Gurkha battalions came in from Delhi. On 28 January Smith attacked the Sikh line on the ridge from Aliwal to Bhundri and drove it into the river.",
   "The Sikh army lost its guns, and its garrisons left their forts on the left bank. Smith’s division marched back to rejoin Gough before Sobraon."
  ],
  "sources": [
   "Sir Hugh Gough, despatch of 1 February 1846, London Gazette, no. 20588 (1846)",
   "Sir Harry Smith, despatch from the field of Aliwal, London Gazette, no. 20588 (1846)"
  ]
 },
 "sobraon": {
  "history": [
   "After Ferozeshah the Khalsa army went back over the Sutlej. In early January 1846 it bridged the river at the ford of Sobraon, under batteries on the higher north bank. On the British side it dug a half-moon of works some 4,000 yards round, both flanks on the river and the right, on loose sand, the weakest. Tej Singh held the works with perhaps 20,000–30,000 men and 67 guns. Gough would not attack until the siege train had come from Delhi and Smith had come back from Aliwal.",
   "The siege train arrived on 7–8 February; Smith rejoined on the 8th. On the 7th Lal Singh is said to have sent Major Lawrence a plan of the works. On 10 February, after a three-hour cannonade, Dick’s division carried the Sikh right by the river, and Gilbert’s and Smith’s divisions the centre and left. The bridge broke behind the Sikhs, the river had risen, and thousands drowned. Sham Singh Attariwala died in the works.",
   "The British crossed at Ferozepur two days later and occupied Lahore. By the Treaty of Lahore in March 1846 the Darbar gave up the Jullundur Doab. A week later the Treaty of Amritsar transferred Kashmir to Gulab Singh."
  ],
  "sources": [
   "Sir Hugh Gough, despatches of 1 and 13 February 1846, and Sir Henry Hardinge, despatch of 19 February 1846, London Gazette, nos 20588 and 20590 (1846)",
   "J. D. Cunningham, A History of the Sikhs, pp. 301–16",
   "Robert S. Rait, The Life and Campaigns of Hugh, First Viscount Gough, vol. II (1903), pp. 40–66"
  ]
 },
 "lahore1752": {
  "history": [
   "Ahmad Shah Durrani invaded India for the third time in the winter of 1751, demanding the revenue of the four districts that Mir Muin-ul-Mulk (Mir Mannu), the Mughal governor of Lahore and Multan, had promised to Kabul in 1748 and never paid. Mannu entrenched round Lahore and asked Delhi for help; none came, for the Wazir Safdar Jang was his enemy.",
   "The Shah crossed the Ravi at Ghazipur in January 1752 and camped north-east of the Shalamar garden. For six weeks his parties burnt the country for forty kos while Mannu's trenches held the city. Kaura Mall, Mannu's diwan, advised waiting for the hot weather; Adina Beg advised fighting before the grain ran out. A first sortie drove the Shah some twelve kos up the river. On 6 March (1 Jamadi-ul-Awwal 1165) he came down to the plain of Mahmud Buti and Mannu marched out to meet him. The Durranis took the Mughal guns and turned their camel swivels on the centre. Kaura Mall was shot from an elephant, the sources say by a Kasur Afghan at Adina Beg's prompting, Sangat Singh of the Sikh contingent fell, and Adina Beg rode for the city. Darkness saved Mannu's army from a rout. The sources differ on the date: Prinsep and Latif give 12 April, Khushwaqt Rai 19 March.",
   "Mannu shut himself in the fort, then went to the Shah's camp the next day. Ahmad Shah, it is said, admired his answer and kept him as governor in the Durrani name. Lahore and Multan were ceded to the Afghan empire, and the emperor at Delhi sealed the treaty in April."
  ],
  "sources": [
   "Ganda Singh, Ahmad Shah Durrani: Father of Modern Afghanistan (1959), pp. 97–115",
   "Hari Ram Gupta, History of the Sikhs, vol. II",
   "Sohan Lal Suri, Umdat-ut-Tawarikh, daftar I (as quoted by Ganda Singh)"
  ]
 },
 "attock": {
  "history": [
   "In March 1813 Jahandad Khan, the Afghan governor of Attock, sold the fort over the crossing of the Indus to Ranjit Singh for a lakh of rupees and a jagir. Wazir Fateh Khan Barakzai of Kabul, back from Kashmir, came down to the river with his brother Dost Muhammad Khan to take it back, and cut the fort off; by 20 June its grain and powder were spent.",
   "Diwan Mohkam Chand marched from Rawalpindi with some 10,000 horse and foot and several guns, Hari Singh Nalwa and Desa Singh Majithia among his commanders. He lay at Burhan, crossed the rivulet on 8 July and took grain from an Afghan picket, and met the Afghans, said to be 15,000, on the plain of Chhachh near Haidru, about eight kilometres from the fort. Ganda Singh dates the battle 13 July; Gupta has 9 July. Dost Muhammad's vanguard of ghazis and horse broke the Sikh squares and took some guns, and Mian Ghaus Khan would not let the artillery fire. The Diwan mounted a horse and led the reserve, his elephant guns firing, and a hot east wind drove the dust into the Afghans' faces. Fateh Khan, believing his brother killed, drew off to his boats, and many drowned crossing to Khairabad.",
   "The Afghans lost two to three thousand men and seven light guns. Ganda Singh called it the first real Punjabi victory over the Afghans. Attock stayed in Sikh hands, and Fateh Khan's later attempts to recover it failed."
  ],
  "sources": [
   "Hari Ram Gupta, History of the Sikhs V: The Sikh Lion of Lahore (1978), pp. 97–103",
   "Ganda Singh, The Panjab Past and Present 21 (1987), pp. 37–43",
   "Fauja Singh, Military System of the Sikhs, 1799–1849 (1964), pp. 263–64",
   "Khushwant Singh, Ranjit Singh: Maharaja of the Punjab (2003), p. 115"
  ]
 },
 "ramnagar": {
  "history": [
   "In the autumn of 1848 the rising at Multan became a war. Raja Sher Singh Attariwala, sent to help put it down, joined the rebels with his army, marched north and took up a strong position on the Chenab, holding the right bank opposite Ramnagar with posts and horse on the near side. Lord Gough came up from Lahore to bring him to battle.",
   "In the early hours of 22 November Gough sent his cavalry division under Brigadier Charles Cureton, two troops of horse artillery and Colin Campbell's infantry brigade to clear the left bank. At dawn the 3rd Light Dragoons and 8th Bengal Light Cavalry drove the Sikhs back over the fords. Then batteries the British had not seen opened from the far bank; the horse artillery was outgunned and left a six-pounder stuck in the soft sand. Some 3,000 Sikh horsemen came back across the ford. The 14th Light Dragoons and 5th Light Cavalry charged and drove them back, but pursued into the river bed under heavy fire. Lieutenant-Colonel William Havelock led a second charge, apparently without orders, and was cut down with his leading troopers; Cureton, riding up to stop a third, was shot dead.",
   "The British lost 26 killed or missing and 59 wounded; Sikh losses are not recorded. Sher Singh kept the fords and offered terms if the British left Lahore; no notice was taken. On 3 December, after the action at Sadullapur upstream, he drew back from the river."
  ],
  "sources": [
   "Harold E. Raugh Jr. (ed.), The Victorians at War, 1815–1914 (2004), pp. 299–301",
   "Khushwant Singh, The Fall of the Kingdom of the Punjab (2014), ch. 11",
   "Byron Farwell, Queen Victoria’s Little Wars (1973), p. 53",
   "Adrian Greenwood, Victoria’s Scottish Lion: The Life of Colin Campbell (2015), ch. 5"
  ]
 },
 "murree": {
  "history": [
   "By the late summer of 1857 nearly every fit British soldier in the Punjab had been sent to the siege of Delhi. The hill station of Murree held the wives and children of the northern stations from Jhelum to Peshawar, with a few convalescents from the European regiments and two companies of Sikhs sent up from Hazara as a guard. The Dhund clans of the hills round Murree, with men from the Karral and Hazara country, planned a rising; the Mutiny Report says the plot began with headmen of the Rawalpindi side, among them Sher Baz Khan.",
   "At the beginning of September the station was warned by Hakim Khan, one of Lady Lawrence's attendants and himself an influential man of one of the clans. Major Luard of the 55th N.I. and Captain H. C. Johnstone of the 5th N.I. organised the volunteers, gathered the families in the barrack square, set a cordon of sentries and held the three weakest points. When the clansmen came up the hillsides in the night they found the station ready; after some hours of skirmishing they drew off. Major Becher sent every man he could spare from Abbottabad; the column narrowly avoided a Karral ambush on the way.",
   "The plot was found to reach far into Hazara and nearly to Rawalpindi. Two native doctors in the station and several servants were found to have been part of it; the doctors were executed. Sher Baz Khan was later taken and put to death; the accounts of how differ."
  ],
  "sources": [
   "H. Cave-Browne, The Punjab and Delhi in 1857, vol. II (1861), pp. 223–26, quoting the Punjab Mutiny Report"
  ]
 },
 "jammu1845": {
  "history": [
   "In December 1844 the Khalsa army killed the wazir Hira Singh, and power at Lahore passed to Jawahar Singh, brother of the Maharani Jind Kaur. Hira Singh's uncle, Raja Gulab Singh of Jammu, held the treasure of the Dogra brothers. The Darbar sent troops under Lal Singh, Sham Singh Attariwala, Fateh Singh Man and Sultan Muhammad Khan against the Dogra places of Jasrota, Samba and Ramnagar. At Jasrota six horse-artillery guns went over to the Khalsa, Mian Jawahir Singh fell back to Jammu, and the army, some 35,000 strong, took Samba and the country below the hills and was ordered on to Jammu.",
   "Gulab Singh asked for chiefs to come and guarantee his safety; only Fateh Singh Man went. After three days he was sent back with about three lakhs of rupees as an earnest, but a mile and a half from the town his party was ambushed by Dogras and Rohillas and he was killed, on 28 February 1845. The angry army broke through the Dogra outposts to the Tawi, crossed in three divisions, and with Ranjodh Singh Majithia coming down from the hills invested the town. Gulab Singh disclaimed the killing, kept regimental panches with him, showed the soldiers where his family's money lay buried, and promised every man a gold bangle and twenty-five rupees.",
   "Avitabile's, Court's and the Povindea divisions swore to stand by him, but the Raja still had to submit. He rode to Lahore as a hostage inside the army that had come to destroy him, and was allowed back to Jammu only on agreeing to pay a heavy fine: sixty-eight lakhs by the Encyclopaedia of Sikhism, though other accounts give less. Jammu itself was never stormed. Within the year the Khalsa army had killed Jawahar Singh and crossed the Sutlej against the British."
  ],
  "sources": [
   "G. Carmichael Smyth, A History of the Reigning Family of Lahore (1847), ch. IX",
   "B. J. Hasrat, \"Fateh Singh Man\", Encyclopaedia of Sikhism",
   "\"Gulab Singh\", Encyclopaedia of Sikhism"
  ]
 },
 "batala": {
  "history": [
   "By the 1780s Jai Singh Kanhaiya was the most powerful chief in the Punjab. He had driven Jassa Singh Ramgarhia into exile beyond the Sutlej and held the country round Batala. At Diwali 1784 in Amritsar he insulted young Mahan Singh Sukerchakia, Ranjit Singh's father, over the spoils of a raid on Jammu, calling him a dancing boy. Mahan Singh attacked his camp that night and drove him to Majitha.",
   "Mahan Singh then called in Jassa Singh Ramgarhia from Tosham and Raja Sansar Chand of Kangra, who wanted back the hill forts the Kanhaiyas held. Ramgarhia crossed the Beas unopposed; Sansar Chand posted his men at Dinanagar; the allies met near Amritsar, where Amar Singh Bagga, once a Kanhaiya man, came over to them, and marched on Batala. Near Achal, at a village the sources call Randpura, they met the Kanhaiyas. After six hours' fighting Gurbakhsh Singh, Jai Singh's son, was killed by an arrow from one of Guru Sundar Das's men. Jai Singh, broken by his son's death, laid down his arms and was led to safety; Gurbakhsh's widow Sada Kaur escaped barefoot to the fort at Sohian.",
   "Jassa Singh Ramgarhia recovered his country and made Batala his headquarters, and Sansar Chand took back his forts. Within a year Sada Kaur, now the effective head of the Kanhaiyas, betrothed her daughter Mehtab Kaur to Mahan Singh's six-year-old son Ranjit Singh, and the alliance of the two misls carried him to Lahore."
  ],
  "sources": [
   "Bhagat Singh, A History of the Sikh Misals (1993), pp. 119 ff.",
   "J. D. Cunningham, A History of the Sikhs (1849), p. 118",
   "Khushwant Singh, A History of the Sikhs, vol. I"
  ]
 },
 "muzaffarabad": {
  "history": [
   "When Hajji Karimdad Khan, Timur Shah's governor of Kashmir, died in 1783, Kabul confirmed his youngest son, Azad Khan, in his place. Azad Khan drove out his elder brothers, stopped sending the revenue, and took into his pay some three thousand Sikhs and other adventurers. Timur Shah sent about thirty thousand men under the brothers, with Faiz Talab Khan Muhammadzai, Nawaz Jang Bangash and Burhan Khan Popalzai. At the Kishanganga near Muzaffarabad Azad Khan's commander Mulla A'zam Khan was killed and some two thousand of his men drowned or were cut down, but his cousin Pahlawan Khan rallied the army, captured Burhan Khan and drove the Durranis back. Near Baramulla Azad Khan beat them again and took Nawaz Jang prisoner.",
   "Timur Shah left Kabul in December 1785 and camped at Peshawar. Prince Humayun crossed the Indus at Attock with twenty thousand men, Faiz Talab Khan and Karim Beg joined him with ten thousand, and a larger army followed under Madad Khan Durrani and Payandah Khan. The Durrani commanders worked on Azad Khan's supporters with bribes and threats. His officer Shadi Khan tried a night attack, which Madad Khan saw coming and threw back, and the fighting that followed settled nothing; but when Azad Khan found proof that his own commanders were dealing with the enemy, he left the field.",
   "He fled into the hills to his father-in-law, Raja Rustam Khan, who took him in and then, under threat from Madad Khan, disarmed his men and locked him up. When Islam Khan's horsemen came to take him, Azad Khan shot himself, on 11 December 1786. Timur Shah had him buried with honour, sent for his mother from Qandahar with a gift of two lakhs, and Kashmir stayed in Durrani hands until Ranjit Singh took it in 1819. The order of battle here is the game's: Azad Khan's numbers are not recorded, and which of his chiefs went over is not said."
  ],
  "sources": [
   "Hari Ram Gupta, Studies in Later Mughal History of the Panjab, 1707–1793 (1944)",
   "Fayz Muhammad Katib Hazarah, Siraj al-Tawarikh, trans. R. D. McChesney and M. M. Khorrami (2012)",
   "\"Rebellion of Azad Khan\", Wikipedia"
  ]
 }
};
