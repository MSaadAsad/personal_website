'use strict';
// Scenarios: one per map. Each names the two sides, their generals, the local
// powers, the strongpoints and the opening positions. Place keys refer to the
// map's data file (dist/maps/<id>.js, built by tools/build-map-data.mjs).

const SCENARIOS = {
  // From Saad Asad, "The Battle for Khari, 1840" (Medium, 2025), after the
  // Gulab Nama. After the siege of Lahore (January 1841) Chand Kaur's estates
  // in Khari Khariyali passed to Gulab Singh's management; his general Diwan
  // Hari Chand took them from the Sikh troops under Surat Singh: Aurangabad
  // (Sarai Alamgir), Sukhchainpur, Kot Kandhari, then a 15-day siege of Mangla.
  khari: {
    title: 'The Battle for Khari',
    year: 1841,
    region: 'Khari Khariyali · Mangla',
    blurb: 'After the siege of Lahore, Chand Kaur’s estates in Khari Khariyali, the strip of floodplain between the Mirpur ridge and the Jhelum, pass to Raja Gulab Singh. The Sikh troops holding them under Surat Singh will not give them up. Diwan Hari Chand marches the Dogra army in: Aurangabad, Sukhchainpur, Kot Kandhari, and then Mangla Fort on its hill in the meander of the Jhelum, which even Ranjit Singh could not take.',
    first: 'red',
    standards: { azure: 'khalsa', red: 'dogra' },  // battle standards when a unit's name does not say
    vpTarget: Infinity,
    roundLimit: 16,
    goal: {
      fort: 'manglafort', attacker: 'red', short: 'Take Mangla',
      attackerWins: 'The walls of Mangla are breached and the Sikh garrison marches out. Khari Khariyali passes to the Dogras, who will hold it for 107 years.',
      defenderWins: 'The campaigning season ends with the Khalsa banner still flying over Mangla Fort.',
    },
    sides: {
      azure: { name: 'Khalsa Garrison', short: 'Khalsa', adj: 'Khalsa', pitch: 'Surat Singh’s Sikh troops hold the Khari jagirs east of the Jhelum: Aurangabad, Sukhchainpur, Kot Kandhari, Khari and Mangla Fort. No help will come from across the river. Hold Mangla until the season ends.', tag: 'Moves second · hold Mangla for 16 days' },
      red: { name: 'Dogra Army', short: 'Dogra', adj: 'Dogra', pitch: 'Diwan Hari Chand marches for Raja Gulab Singh with field guns and Dogra swordsmen. You have no supply until you take a town or fort: strike Aurangabad, storm Sukhchainpur, then besiege Mangla.', tag: 'Moves first · no supply until you take a fort' },
    },
    generals: {
      red: { name: 'Diwan Hari Chand', title: 'General of Raja Gulab Singh of Jammu', leads: 'Dogra Swordsmen' },
      azure: { name: 'Surat Singh', title: 'Commander of the Sikh troops in the Khari jagirs', leads: 'Khalsa Musketeers' },
    },
    // Neither side has a base on this map: each lives off the forts and towns
    // it holds. The Khalsa holds only the jagirs east of the Jhelum.
    homeBase: { red: null, azure: null },
    // Mangla's walls had defeated every earlier siege; guns must bring them down.
    walls: { manglafort: 3 },
    // Camp markers are not places a battle would be named after.
    strongpoints: ['sarai', 'sukhchainpur', 'kotkandhari', 'khari', 'manglafort'],
    startOwners: { sarai: 'azure', sukhchainpur: 'azure', kotkandhari: 'azure', khari: 'azure', manglafort: 'azure' },
    startUnits: [
      ['azure', 'Matchlockmen', 'manglafort', 'Khalsa Musketeers'], ['azure', 'Spearmen', 'manglafort', 'Khalsa Spearmen'],
      ['azure', 'Matchlockmen', 'sukhchainpur', 'Sukhchainpur Garrison'], ['azure', 'Spearmen', 'kotkandhari', 'Kandhari Garrison'],
      ['azure', 'Matchlockmen', 'sarai', 'Aurangabad Garrison'], ['azure', 'Light Field Gun', 'khari', 'Sikh Topkhana'],
      ['azure', 'Mounted Matchlocks', 'kotkandhari', 'Khalsa Horse'], ['azure', 'Irregular Sowars', 'khari', 'Sikh Ghorcharas'],
      // Hari Chand's army greatly outnumbers the garrisons it must reduce one by one.
      ['red', 'Dhal & Talwar', [32.868, 73.88], 'Dogra Swordsmen'], ['red', 'Dhal & Talwar', [32.868, 73.88], 'Dogra Swordsmen'],
      ['red', 'Light Field Gun', [32.876, 73.93], 'Dogra Siege Guns'], ['red', 'Light Field Gun', [32.876, 73.93], 'Dogra Guns'],
      ['red', 'Light Field Gun', [32.866, 73.935], 'Dogra Heavy Guns'],
      ['red', 'Matchlockmen', [32.862, 73.90], 'Dogra Musketeers'], ['red', 'Matchlockmen', [32.862, 73.90], 'Dogra Musketeers'],
      ['red', 'Dhal & Talwar', [32.885, 73.915], 'Dogra Swordsmen'], ['red', 'Matchlockmen', [32.885, 73.915], 'Dogra Musketeers'],
      ['red', 'Dhal & Talwar', [32.888, 73.955], 'Dogra Swordsmen'], ['red', 'Matchlockmen', [32.888, 73.955], 'Dogra Musketeers'],
      ['red', 'Spearmen', [32.857, 73.948], 'Dogra Spearmen'], ['red', 'Zamburak', [32.857, 73.948], 'Camel Guns'],
      ['red', 'Irregular Sowars', [32.867, 73.874], 'Dogra Horse'], ['red', 'Irregular Sowars', [32.867, 73.874], 'Dogra Horse'],
    ],
    powers: [
      { id: 'khari', name: 'Khari Khariyali jagirs', chief: 'Surat Singh, for the Lahore Darbar', seat: 'manglafort', npc: false, side: 'azure', color: '#3f7b4c', note: 'Chand Kaur’s estates, held by Sikh troops', extraSeats: ['sukhchainpur', 'kotkandhari', 'sarai', 'panjeri'], limits: [{ beyond: 'panjeri', toward: 'north-east', to: 'bhimber' }] },
      { id: 'lahore', name: 'West of the Jhelum', chief: 'The Lahore Darbar, standing aside', seat: 'jhelum', npc: false, side: null, color: '#6b7280', note: 'Not part of the Khari jagirs: neither side holds it' },
      { id: 'dogra', name: 'Dogra advance', chief: 'Diwan Hari Chand', seat: [32.862, 73.90], npc: false, side: 'red', color: '#94493a', note: 'The road from Jammu' },
      { id: 'bhimber', name: 'Bhimber hills', chief: 'Beyond Khari Khariyali', seat: 'darhal', npc: false, side: null, color: '#7a6a52', note: 'The hill country north-east of Panjeri: not part of the jagirs' },
    ],
    labels: [
      { text: 'KHARI KHARIYALI', lat: 33.03, lon: 73.765, cls: 'region', tier: 1 },
      { text: 'MIRPUR RIDGE', lat: 33.135, lon: 73.775, cls: 'region', tier: 1 },
      { text: 'Jhelum', lat: 33.03, lon: 73.7735, cls: 'water', tier: 1, angle: 70 },
      { text: 'Jhelum', lat: 32.86, lon: 73.68, cls: 'water', tier: 2, angle: -50 },
      { text: 'Jari Nala', lat: 33.07, lon: 73.85, cls: 'water', tier: 2, angle: 80 },
      { text: 'Grand Trunk Road', lat: 32.86, lon: 73.80, cls: 'route', tier: 2, angle: 40 },
    ],
  },

  // Chillianwala, 13 January 1849. Gough marched up from the Chenab by Helan
  // and Dinga to bring Sher Singh to battle before Chattar Singh's army came
  // down from Attock. The Sikh line ran north to south for some five miles,
  // from the low ridges at Rasul through dense jungle to villages on its right;
  // Gough attacked late in the day through the jungle, lost heavily (the 24th
  // Foot, Pope's cavalry) and both armies claimed the field. Round 1 is
  // 10 January. Its own map (tools/maps/chillianwala.mjs). The jungle, long
  // since cleared for canal colonies, is restored here as a scenario patch.
  chillianwala: {
    title: 'The Battle of Chillianwala',
    year: 1849,
    region: 'Chaj Doab · Chillianwala',
    blurb: 'January 1849. Sher Singh has drawn the Khalsa army up on the Jhelum: its left on the low ridges at Rasul, its centre hidden in thick jungle, its right on the villages towards Lakhnawala, with an outpost in Chillianwala. Lord Gough marches up from the Chenab by Helan and Dinga to bring him to battle before Chattar Singh’s army arrives from Attock. Multan still holds out, so no help will come from Whish.',
    first: 'red',
    standards: { azure: 'khalsa', red: 'company' },  // battle standards when a unit's name does not say
    vpTarget: Infinity,
    roundLimit: 12,
    goal: {
      forts: ['rasul', 'lakhnawala', 'mong'], need: 1, attacker: 'red', short: 'Break the Sikh line',
      attackerWins: 'The Sikh line is broken: Sher Singh’s army is driven back over the Jhelum before Chattar Singh can join it.',
      defenderWins: 'As in January 1849, the Khalsa line still stands from Rasul to the villages: Gough has bled his army in the jungle, and Chattar Singh’s army is coming down to join Sher Singh.',
    },
    sides: {
      azure: { name: 'Khalsa Army', short: 'Khalsa', adj: 'Khalsa', pitch: 'Sher Singh’s battalions hold the Rasul ridges and the jungle south of them, with the Jhelum at their backs and Chattar Singh’s army coming on day 8. Keep Rasul, Lakhnawala and Mong until the campaign closes: lose any one at the end of a day and the line is broken.', tag: 'Moves second · hold the line for 12 days' },
      red: { name: 'Army of the Punjab', short: 'British', adj: 'British', pitch: 'Gough’s army marches up from Helan and Dinga. Drive in the Chillianwala outpost, find a way through the jungle, and break the Sikh line: hold Rasul, Lakhnawala or Mong at the end of a day.', tag: 'Moves first · break the line' },
    },
    generals: {
      azure: { name: 'Raja Sher Singh Attariwala', title: 'Commander of the Khalsa army', leads: 'Sher Singh’s Battalions' },
      red: { name: 'Lord Gough', title: 'Commander-in-Chief, India', leads: 'HM 29th Foot' },
    },
    homeBase: { azure: [32.72, 73.47], red: [32.25, 73.80] },
    jungle: [{ lat: 32.643, lon: 73.578, radiusKm: 6, tree: 0.6, shrub: 0.6 }],
    strongpoints: ['rasul', 'mong', 'lakhnawala', 'chillianwala', 'dinga', 'helan', 'ramnagar'],
    startOwners: { rasul: 'azure', mong: 'azure', lakhnawala: 'azure', chillianwala: 'azure', dinga: 'red', helan: 'red', ramnagar: 'red' },
    startUnits: [
      // Sher Singh's left on the Rasul ridges.
      ['azure', 'Khalsa Infantry', 'rasul', 'Sher Singh’s Battalions'], ['azure', 'Light Field Gun', 'rasul', 'Khalsa Topkhana'],
      ['azure', 'Khalsa Infantry', [32.675, 73.562], 'Khalsa Battalions'], ['azure', 'Khalsa Infantry', [32.675, 73.562], 'Khalsa Battalions'],
      ['azure', 'Khalsa Infantry', [32.664, 73.548], 'Khalsa Battalions'], ['azure', 'Light Field Gun', [32.664, 73.548], 'Khalsa Topkhana'],
      ['azure', 'Irregular Sowars', [32.69, 73.585], 'Ghorcharas'],
      // Lal Singh's centre in the jungle.
      ['azure', 'Khalsa Infantry', [32.652, 73.566], 'Lal Singh’s Battalions'], ['azure', 'Khalsa Infantry', [32.652, 73.566], 'Lal Singh’s Battalions'],
      ['azure', 'Khalsa Infantry', [32.64, 73.57], 'Lal Singh’s Battalions'], ['azure', 'Light Field Gun', [32.64, 73.57], 'Khalsa Topkhana'],
      ['azure', 'Khalsa Infantry', [32.658, 73.585], 'Lal Singh’s Battalions'], ['azure', 'Irregular Sowars', [32.70, 73.56], 'Ghorcharas'],
      ['azure', 'Khalsa Infantry', 'jalalpursharif', 'Jalalpur Garrison'],
      // The right: the old Bannu garrison on the villages.
      ['azure', 'Khalsa Infantry', 'lakhnawala', 'Bannu Brigade'], ['azure', 'Light Field Gun', 'lakhnawala', 'Khalsa Topkhana'],
      ['azure', 'Khalsa Infantry', [32.62, 73.54], 'Bannu Brigade'], ['azure', 'Irregular Sowars', [32.62, 73.54], 'Ghorcharas'],
      ['azure', 'Khalsa Infantry', 'chillianwala', 'Chillianwala Outpost'],
      ['azure', 'Irregular Sowars', 'mong', 'Ghorcharas'],
      // Gough's army coming up from the Chenab.
      ['red', 'Line Infantry', [32.50, 73.66], 'HM 29th Foot'], ['red', 'Sepoy Infantry', [32.50, 73.66], '30th Bengal NI'],
      ['red', 'Line Infantry', [32.49, 73.685], '2nd Bengal Europeans'], ['red', 'Sepoy Infantry', [32.49, 73.685], '31st Bengal NI'],
      ['red', 'Line Infantry', [32.51, 73.64], 'HM 24th Foot'], ['red', 'Sepoy Infantry', [32.51, 73.64], '25th Bengal NI'],
      ['red', 'Line Infantry', [32.475, 73.70], 'HM 61st Foot'], ['red', 'Sepoy Infantry', 'phalia', '36th Bengal NI'],
      ['red', 'Sepoy Infantry', 'helan', '45th Bengal NI'], ['red', 'Sepoy Infantry', [32.40, 73.75], '56th Bengal NI'],
      ['red', 'Light Dragoons', [32.52, 73.67], 'HM 14th Light Dragoons'], ['red', 'Lancers', [32.52, 73.67], 'HM 9th Lancers'],
      ['red', 'Light Dragoons', [32.465, 73.66], 'HM 3rd Light Dragoons'], ['red', 'Light Dragoons', [32.465, 73.66], 'Bengal Light Cavalry'],
      ['red', 'Horse Artillery', [32.50, 73.70], 'Bengal Horse Artillery'], ['red', 'Heavy Battery', [32.50, 73.70], 'Heavy Battery (18-pounders)'],
      ['red', 'Sepoy Infantry', 'dinga', '70th Bengal NI'], ['red', 'Sepoy Infantry', 'ramnagar', '69th Bengal NI'],
    ],
    reinforcements: [
      { round: 8, side: 'azure', at: [32.70, 73.50], name: 'Chattar Singh’s army', note: 'came down from Attock and crossed the Jhelum', history: 'Sardar Chattar Singh Attariwala, Sher Singh’s father, had risen in Hazara in August 1848. Attock fell to him and his Afghan allies in January 1849, and after Chillianwala he brought his army down to join his son on the Jhelum.', units: [['Khalsa Infantry', 'Chattar Singh’s Hazara Battalions'], ['Khalsa Infantry', 'Chattar Singh’s Battalions'], ['Irregular Sowars', 'Ghorcharas'], ['Irregular Sowars', 'Ghorcharas']] },
    ],
    powers: [
      { id: 'khalsa', name: 'Khalsa army', chief: 'Raja Sher Singh Attariwala', seat: 'rasul', npc: false, side: 'azure', color: '#3f6f8f', note: 'The Sikh camps and their foraging grounds', extraSeats: ['mong', 'lakhnawala', 'chillianwala'] },
      { id: 'company', name: 'Army of the Punjab', chief: 'Lord Gough', seat: 'dinga', npc: false, side: 'red', color: '#94493a', note: 'Behind the British lines, back to the Chenab', extraSeats: ['helan', 'ramnagar', 'phalia'] },
    ],
    labels: [
      { text: 'CHAJ DOAB', lat: 32.48, lon: 73.62, cls: 'region', tier: 1 },
      { text: 'Jhelum', lat: 32.72, lon: 73.48, cls: 'water', tier: 1, angle: 55 },
      { text: 'Chenab', lat: 32.36, lon: 73.88, cls: 'water', tier: 1, angle: -30 },
    ],
  },

  // Gujrat, 21 February 1849, after Gough's despatch of 26 February (London
  // Gazette, 20969). Short of food after Chillianwala, the Sikh army fell back
  // from Rasul to Gujrat, meaning to cross the Chenab for Lahore. Gough moved
  // down towards the Chenab to meet Whish, who joined on the 18th; Dundas's
  // Bombay column came in on the 19th and Markham's brigade, across the Chenab
  // at Kanokee, on the 20th. Gough moved up from Trikur to Shadiwal and
  // attacked from the south on the 21st. Round 1 is 16 February. Gough put the
  // Sikhs at 60,000 with 59 guns, modern estimates at about 20,000.
  gujrat: {
    title: 'The Battle of Gujrat',
    year: 1849,
    region: 'Chaj Doab · Gujrat',
    blurb: 'February 1849. After Chillianwala, short of food, Raja Sher Singh and his father Chattar Singh have taken the Khalsa army and Akram Khan’s Afghan horse from Rasul to Gujrat, meaning to cross the Chenab and march on Lahore. Their camp nearly encircles the town behind the dry bed of the Dwara and the fortified Kalra villages. Lord Gough has come down to the Chenab south-west of the town; Whish’s division, Dundas’s Bombay column and Markham’s brigade are coming up to join him. Byrne’s sepoys watch the fords at Wazirabad.',
    first: 'azure',
    standards: { azure: 'khalsa', red: 'company' },  // battle standards when a unit's name does not say
    vpTarget: Infinity,
    roundLimit: 6,
    goal: {
      fort: 'gujrat', attacker: 'red', short: 'Take Gujrat',
      attackerWins: 'The Sikh line breaks under the guns and Gujrat falls. Within three weeks Sher Singh and Chattar Singh lay down their arms near Rawalpindi, and the Punjab is annexed.',
      defenderWins: 'The Khalsa army still holds Gujrat as the campaign closes: Gough has not broken it, and the war goes on.',
    },
    sides: {
      azure: { name: 'Khalsa Army', short: 'Khalsa', adj: 'Khalsa', pitch: 'Sher Singh’s battalions and guns hold Gujrat behind the Dwara and the Kalra villages, with Afghan horse on the right and Ghorcharas on the left. Hold Gujrat until the campaign closes, or break Gough before his reinforcements arrive.', tag: 'Moves first · hold Gujrat for 6 days' },
      red: { name: 'Army of the Punjab', short: 'British', adj: 'British', pitch: 'Gough’s army lies on the Chenab south-west of Gujrat. Gather Whish (day 3), Dundas (day 4) and Markham (day 5), move up by Trikha and Shadiwal, and break the Sikh line from the south with the heavy guns.', tag: 'Moves second · take Gujrat' },
    },
    generals: {
      azure: { name: 'Raja Sher Singh Attariwala', title: 'Commander of the Khalsa army', leads: 'Sher Singh’s Battalions' },
      red: { name: 'Lord Gough', title: 'Commander-in-Chief, India', leads: 'HM 29th Foot' },
    },
    // Each army's road home: the Sikhs' back through the Pabbi hills towards
    // Jhelum, the British across the Chenab towards Lahore.
    homeBase: { azure: [32.92, 73.80], red: [32.25, 73.95] },
    walls: { gujrat: 1 },  // the town's mud wall and the Sikh earthworks round it
    strongpoints: ['gujrat', 'kunjah', 'jalalpur', 'kharian', 'wazirabad', 'ramnagar', 'dinga'],
    startOwners: { gujrat: 'azure', kunjah: 'azure', jalalpur: 'azure', kharian: 'azure', wazirabad: 'red', ramnagar: 'red', dinga: 'red' },
    startUnits: [
      // The Khalsa army round Gujrat: regulars south of the town, guns in the centre, horse on the flanks.
      ['azure', 'Khalsa Infantry', 'gujrat', 'Sher Singh’s Battalions'], ['azure', 'Light Field Gun', 'gujrat', 'Khalsa Topkhana'],
      ['azure', 'Khalsa Infantry', [32.565, 74.05], 'Chattar Singh’s Hazara Battalions'], ['azure', 'Khalsa Infantry', [32.565, 74.05], 'Bannu Battalions'],
      ['azure', 'Khalsa Infantry', 'burrakalra', 'Khalsa Battalions'], ['azure', 'Light Field Gun', 'burrakalra', 'Khalsa Topkhana'],
      ['azure', 'Khalsa Infantry', 'chotakalra', 'Khalsa Battalions'], ['azure', 'Light Field Gun', 'chotakalra', 'Khalsa Topkhana'],
      ['azure', 'Khalsa Infantry', [32.553, 74.105], 'Khalsa Battalions'], ['azure', 'Light Field Gun', [32.553, 74.105], 'Khalsa Topkhana'],
      ['azure', 'Khalsa Infantry', [32.578, 74.03], 'Khalsa Battalions'],
      ['azure', 'Khalsa Infantry', 'kunjah', 'Khalsa Battalions'], ['azure', 'Irregular Sowars', [32.556, 73.971], 'Ghorcharas'],
      ['azure', 'Khalsa Infantry', 'jalalpur', 'Khalsa Battalions'], ['azure', 'Irregular Sowars', 'jalalpur', 'Ghorcharas'],
      ['azure', 'Irregular Sowars', 'kharian', 'Ghorcharas'],
      ['azure', 'Khalsa Infantry', [32.501, 74.137], 'Ford Party'], ['azure', 'Irregular Sowars', [32.533, 74.146], 'Ghorcharas'],
      ['azure', 'Irregular Sowars', [32.58, 74.01], 'Afghan Horse'], ['azure', 'Irregular Sowars', [32.565, 73.995], 'Afghan Horse'],
      ['azure', 'Irregular Sowars', [32.57, 74.13], 'Ghorcharas'],
      ['azure', 'Matchlockmen', 'sarai', 'Sarai Alamgir Post', 5, { post: true }], ['azure', 'Irregular Sowars', 'rasul', 'Rasul Post', 5, { post: true }],
      // Gough's army on the Chenab south-west of Gujrat.
      ['red', 'Line Infantry', [32.445, 73.92], 'HM 29th Foot'], ['red', 'Line Infantry', [32.445, 73.92], 'HM 24th Foot'],
      ['red', 'Line Infantry', [32.455, 73.90], 'HM 61st Foot'], ['red', 'Line Infantry', [32.455, 73.90], '2nd Bengal Europeans'],
      ['red', 'Sepoy Infantry', [32.435, 73.94], '31st Bengal NI'], ['red', 'Sepoy Infantry', [32.435, 73.94], '70th Bengal NI'],
      ['red', 'Sepoy Infantry', [32.465, 73.88], '25th Bengal NI'], ['red', 'Sepoy Infantry', 'helan', '45th Bengal NI'],
      ['red', 'Sepoy Infantry', 'chillianwala', '56th Bengal NI'], ['red', 'Sepoy Infantry', 'dinga', '30th Bengal NI'],
      ['red', 'Light Dragoons', [32.47, 73.92], 'HM 14th Light Dragoons'], ['red', 'Lancers', [32.47, 73.92], 'HM 9th Lancers'],
      ['red', 'Light Dragoons', [32.46, 73.95], 'HM 3rd Light Dragoons'], ['red', 'Light Dragoons', [32.46, 73.95], '5th Bengal Light Cavalry'],
      ['red', 'Horse Artillery', [32.45, 73.94], 'Bengal Horse Artillery'], ['red', 'Horse Artillery', [32.45, 73.94], 'Bengal Horse Artillery'],
      ['red', 'Heavy Battery', [32.44, 73.90], 'Heavy Battery (18-pounders)'],
      // Byrne at the Wazirabad fords; a sepoy regiment holds Ramnagar.
      ['red', 'Sepoy Infantry', 'wazirabad', 'Byrne’s Sepoys'], ['red', 'Light Field Gun', 'wazirabad', 'Byrne’s Guns'],
      ['red', 'Irregular Sowars', [32.44, 74.06], 'Irregular Horse'],
      ['red', 'Sepoy Infantry', 'ramnagar', '69th Bengal NI'],
    ],
    reinforcements: [
      { round: 3, side: 'red', at: [32.42, 73.90], name: 'Whish’s division', note: 'came up from Multan with the siege train', history: 'Multan surrendered on 22 January 1849, freeing Major-General Whish’s division and its siege train. Whish marched north and joined Gough on 18 February, bringing the heavy guns Gough had lacked at Chillianwala.', units: [['Line Infantry', 'HM 10th Foot'], ['Line Infantry', 'HM 32nd Foot'], ['Sepoy Infantry', '8th Bengal NI'], ['Heavy Battery', 'Multan Siege Train']] },
      { round: 4, side: 'red', at: [32.42, 73.90], name: 'Dundas’s Bombay column', note: 'arrived by forced marches', history: 'Brigadier Dundas’s column of the Bombay army, which had come up from Sindh for the siege of Multan, followed Whish north and reached Gough by forced marches on 19 February.', units: [['Line Infantry', 'HM 60th Rifles'], ['Line Infantry', '1st Bombay Fusiliers'], ['Irregular Sowars', 'Scinde Horse'], ['Horse Artillery', 'Bombay Horse Artillery']] },
      { round: 5, side: 'red', at: [32.43, 73.99], name: 'Markham’s brigade', note: 'crossed the Chenab at Kanokee in boats sent up from Ramnagar', history: 'Brigadier Markham’s brigade crossed the Chenab at Kanokee in boats sent up from Ramnagar and came in on the 20th, the eve of the battle, closing the river line on the Sikh left.', units: [['Sepoy Infantry', '46th Bengal NI'], ['Sepoy Infantry', '72nd Bengal NI']] },
    ],
    powers: [
      { id: 'khalsa', name: 'Khalsa army', chief: 'Raja Sher Singh Attariwala', seat: 'gujrat', npc: false, side: 'azure', color: '#3f6f8f', note: 'The country the Sikh army forages', extraSeats: ['kunjah', 'jalalpur', 'kharian'] },
      { id: 'company', name: 'Army of the Punjab', chief: 'Lord Gough', seat: 'wazirabad', npc: false, side: 'red', color: '#94493a', note: 'Behind the British lines and across the Chenab', extraSeats: ['ramnagar', 'helan', 'phalia'] },
    ],
    labels: [
      { text: 'CHAJ DOAB', lat: 32.50, lon: 73.78, cls: 'region', tier: 1 },
      { text: 'PABBI HILLS', lat: 32.80, lon: 73.76, cls: 'region', tier: 1 },
      { text: 'Chenab', lat: 32.39, lon: 73.90, cls: 'water', tier: 1, angle: -30 },
      { text: 'Jhelum', lat: 32.78, lon: 73.61, cls: 'water', tier: 1, angle: 55 },
      { text: 'Grand Trunk Road', lat: 32.70, lon: 73.96, cls: 'route', tier: 2, angle: 50 },
    ],
  },
  // Multan, 1818. Ranjit Singh sent Prince Kharak Singh, with Misr Diwan Chand
  // in command, against Nawab Muzaffar Khan Sadozai. Khangarh and Muzaffargarh
  // fell first; the city fell in February and the Nawab held the citadel until
  // the Zamzama gun, dragged from Lahore, breached it near the Khizri Gate. On
  // 2 June 1818 Akali Sadhu Singh's Nihangs went in through the breach and
  // Muzaffar Khan died there with five of his sons. The months of the siege are
  // compressed: a round is a day's march, not a day of the calendar.
  multan1818: {
    map: 'multan',
    title: 'The Siege of Multan',
    year: 1818,
    region: 'Multan',
    blurb: '1818. Ranjit Singh has sent his son Kharak Singh, with Misr Diwan Chand in command, to take Multan from its Afghan governor, Nawab Muzaffar Khan Sadozai. The Nawab holds the walled city and its citadel, with garrisons in Shujabad, Muzaffargarh and Khangarh and levies in the field. The Sikh army comes down the Lahore road; the great Zamzama gun is being dragged after it.',
    first: 'red',
    standards: { azure: 'sadozai', red: 'khalsa', by: [['Pathan', 'sadozai'], ['^Multan', 'sadozai']] },  // battle standards when a unit's name does not say
    vpTarget: Infinity,
    roundLimit: 15,
    goal: {
      fort: 'multanfort', attacker: 'red', short: 'Take the citadel',
      attackerWins: 'The Nihangs storm the breach by the Khizri Gate. Nawab Muzaffar Khan dies there with five of his sons, and Multan passes to the Lahore Darbar.',
      defenderWins: 'The citadel of Multan still stands as the campaign closes: the Sikh army marches home with tribute, as it had before.',
    },
    sides: {
      azure: { name: 'Sadozai Multan', short: 'Sadozai', adj: 'Sadozai', pitch: 'Nawab Muzaffar Khan holds Multan’s walled city and citadel, with forts at Shujabad, Muzaffargarh and Khangarh. Hold the citadel until the campaign closes.', tag: 'Moves second · hold Multan for 15 days' },
      red: { name: 'Khalsa Army', short: 'Khalsa', adj: 'Khalsa', pitch: 'Misr Diwan Chand’s army comes down the Lahore road. Take the outlying forts, invest the city, bring up the Zamzama (day 8) and storm the citadel.', tag: 'Moves first · take Multan' },
    },
    generals: {
      azure: { name: 'Nawab Muzaffar Khan Sadozai', title: 'Nawab of Multan', leads: 'Nawab’s Guard' },
      red: { name: 'Misr Diwan Chand', title: 'Commanding for Prince Kharak Singh', leads: 'Diwan Chand’s Battalions' },
    },
    homeBase: { azure: null, red: [30.395, 71.665] },
    walls: { multan: 2, multanfort: 6 },  // the city walls, then the citadel on its mound
    strongpoints: ['multanfort', 'multan', 'shujabad', 'muzaffargarh', 'khangarh'],
    startOwners: { multanfort: 'azure', multan: 'azure', shujabad: 'azure', muzaffargarh: 'azure', khangarh: 'azure' },
    startUnits: [
      ['azure', 'Matchlockmen', 'multanfort', 'Nawab’s Guard'], ['azure', 'Light Field Gun', 'multanfort', 'Multan Topkhana'],
      ['azure', 'Matchlockmen', 'multan', 'Multan Levies'], ['azure', 'Matchlockmen', [30.205, 71.45], 'Multan Levies'],
      ['azure', 'Irregular Sowars', [30.215, 71.50], 'Pathan Horse'],
      ['azure', 'Spearmen', [30.225, 71.55], 'Pathan Levies'], ['azure', 'Spearmen', [30.24, 71.53], 'Pathan Levies'],
      ['azure', 'Matchlockmen', 'shujabad', 'Shujabad Garrison'], ['azure', 'Jingal', 'shujabad', 'Shujabad Guns'],
      ['azure', 'Matchlockmen', 'muzaffargarh', 'Muzaffargarh Garrison'],
      ['azure', 'Matchlockmen', 'khangarh', 'Khangarh Garrison'],
      ['red', 'Khalsa Infantry', [30.375, 71.625], 'Diwan Chand’s Battalions'], ['red', 'Khalsa Infantry', [30.375, 71.625], 'Khalsa Battalions'],
      ['red', 'Khalsa Infantry', [30.385, 71.60], 'Khalsa Battalions'], ['red', 'Khalsa Infantry', [30.385, 71.60], 'Khalsa Battalions'],
      ['red', 'Dhal & Talwar', [30.365, 71.65], 'Akali Nihangs'], ['red', 'Dhal & Talwar', [30.365, 71.65], 'Dogra Rajputs'],
      ['red', 'Matchlockmen', [30.392, 71.635], 'Ramgarhia Sikhs'], ['red', 'Zamburak', [30.392, 71.635], 'Camel Guns'],
      ['red', 'Light Field Gun', [30.37, 71.665], 'Ilahi Bakhsh’s Topkhana'], ['red', 'Light Field Gun', [30.37, 71.665], 'Ilahi Bakhsh’s Topkhana'],
      ['red', 'Light Field Gun', [30.393, 71.66], 'Ilahi Bakhsh’s Topkhana'],
      ['red', 'Irregular Sowars', [30.355, 71.615], 'Ghorcharas'], ['red', 'Irregular Sowars', [30.355, 71.615], 'Ghorcharas'],
      ['red', 'Irregular Sowars', [30.38, 71.575], 'Hari Singh Nalwa’s Horse'], ['red', 'Irregular Sowars', [30.38, 71.575], 'Ghorcharas'],
    ],
    reinforcements: [
      { round: 8, side: 'red', at: [30.39, 71.66], name: 'The Zamzama', note: 'was dragged down from Lahore', history: 'Cast at Lahore in 1757 for Ahmad Shah Durrani, the great gun was taken by the Bhangi misl and passed to Ranjit Singh. Hauled down to Multan for the siege, it breached the citadel near the Khizri Gate, and on 2 June 1818 Akali Sadhu Singh’s Nihangs stormed through.', units: [['Great Gun', 'Zamzama'], ['Khalsa Infantry', 'Beldars and Escort']] },
    ],
    powers: [
      { id: 'sadozai', name: 'Sadozai Multan', chief: 'Nawab Muzaffar Khan', seat: 'multan', npc: false, side: 'azure', color: '#3f6f8f', note: 'The Nawab’s province', extraSeats: ['shujabad', 'muzaffargarh', 'khangarh'] },
    ],
    labels: [
      { text: 'Chenab', lat: 30.02, lon: 71.25, cls: 'water', tier: 1, angle: 70 },
    ],
  },

  // Multan, 1848-49, from Herbert Edwardes, A Year on the Punjab Frontier
  // (1851), vol. II. Mulraj rose after Vans Agnew and Anderson were killed at
  // Multan in April 1848. On 17 June his army, eight to ten thousand horse and
  // foot with ten guns under his brother-in-law Rung Ram, lay across the Multan
  // road three miles south of Shujabad; the Nawab of Bahawalpur's Daudpotras,
  // about 8,500 with eleven guns and thirty zamburaks under Futteh Muhammad Khan
  // Ghori, were at Goweyn fifteen miles south; and Edwardes, with Cortlandt's
  // 1,500 Sikh regulars and ten guns and some 5,000 Pathan irregulars, was across
  // the Chenab at the Gaggianwalluh ferry with a handful of boats. Rung Ram
  // marched for the Kineyree ferry to beat the Daudpotras before Edwardes
  // could cross; the battle of Kineyree opened on the 18th as Edwardes was on
  // the river. Shujabad and Sikandarabad fell; the allies advanced to
  // Surajkund behind Wali Muhammad's canal, and on 1 July Mulraj, leading in
  // person, was beaten at Saddusam and driven into Multan. Whish came with the
  // Bengal siege train in August; Raja Sher Singh's Darbar troops went over to
  // Mulraj on 14 September and the siege was raised; the Bombay column came in
  // December, the magazine blew up on the 30th, and Mulraj gave up the citadel
  // on 22 January 1849. The months are compressed: round 1 is 17 June, and a
  // round is a day's march, not a day of the calendar.
  multan1849: {
    map: 'shujabad', group: 'multan1849', mode: 'open',
    modeNote: 'the same opening at Kineyree, with no script: evenly matched',
    title: 'The Siege of Multan',
    years: '1848–49',
    year: 1848,
    region: 'Shujabad · Multan',
    blurb: '17 June 1848. Diwan Mulraj’s army under Rung Ram lies across the Multan road below Shujabad. The Nawab of Bahawalpur’s Daudpotras are at Goweyn fifteen miles south, and Herbert Edwardes, with his Pathan levies and Cortlandt’s Sikh regulars, is across the Chenab at the Gaggianwalluh ferry with a handful of boats. Whoever reaches the Kineyree ferry first decides the opening; behind it all stand the walls of Multan.',
    first: 'red',
    standards: { azure: 'khalsa', red: 'company' },  // battle standards when a unit's name does not say
    vpTarget: Infinity,
    roundLimit: 24,
    goal: {
      fort: 'multanfort', attacker: 'red', short: 'Take the citadel',
      attackerWins: 'The breaches are stormed and the citadel, its magazine blown and its walls mined, gives in: Mulraj walks out with his last 550 men.',
      defenderWins: 'Multan still holds as the campaign closes, and the rising spreads across the Punjab.',
    },
    sides: {
      azure: { name: 'Mulraj’s Multan', short: 'Mulraj', adj: 'Multani', pitch: 'Rung Ram’s army lies below Shujabad, between the Daudpotras to the south and Edwardes across the river. Beat one before the other can join it, hold Shujabad and the canal line, and keep the citadel until the campaign closes.', tag: 'Moves second · hold the citadel for 24 days' },
      red: { name: 'Edwardes and the British', short: 'British', adj: 'British', pitch: 'Get Edwardes over the Chenab at Kineyree before Rung Ram falls on the Daudpotras, join hands, take Shujabad and Sikandarabad, and drive Mulraj into Multan. Sheikh Imamuddin joins on day 6, Whish with the Bengal siege train on day 11 and the Bombay column on day 21.', tag: 'Moves first · take the citadel' },
    },
    generals: {
      azure: { name: 'Diwan Mulraj', title: 'Governor of Multan', leads: 'Mulraj’s Guard' },
      red: { name: 'Lieutenant Herbert Edwardes', title: 'Political officer, raising levies beyond the Indus', leads: 'Edwardes’s Pathans' },
    },
    // Edwardes's road back to Dera Ghazi Khan, the Daudpotras' to Bahawalpur,
    // and the Lahore road for the British columns.
    homeBase: { azure: null, red: [[30.07, 70.94], [29.63, 71.15], [30.34, 71.69]] },
    walls: { multan: 5, multanfort: 9 },
    strongpoints: ['multanfort', 'multan', 'shujabad', 'sikandarabad', 'khangarh', 'muzaffargarh'],
    startOwners: { multanfort: 'azure', multan: 'azure', shujabad: 'azure', sikandarabad: 'azure', khangarh: 'red', muzaffargarh: null },
    startUnits: [
      // Rung Ram's army across the Multan road, three miles south of Shujabad.
      ['azure', 'Khalsa Infantry', [29.840, 71.295], 'Rung Ram’s Battalions'], ['azure', 'Light Field Gun', [29.840, 71.295], 'Mulraj’s Topkhana'],
      ['azure', 'Khalsa Infantry', [29.833, 71.310], 'Rung Ram’s Battalions'], ['azure', 'Khalsa Infantry', [29.833, 71.310], 'Multani Battalions'],
      ['azure', 'Irregular Sowars', [29.846, 71.280], 'Multani Horse'], ['azure', 'Irregular Sowars', [29.846, 71.280], 'Multani Horse'],
      ['azure', 'Matchlockmen', [29.828, 71.288], 'Multani Levies'], ['azure', 'Light Field Gun', [29.828, 71.288], 'Mulraj’s Topkhana'],
      // The forts and the city.
      ['azure', 'Matchlockmen', 'shujabad', 'Shujabad Garrison'], ['azure', 'Matchlockmen', 'sikandarabad', 'Sikandarabad Garrison'],
      ['azure', 'Khalsa Infantry', 'multan', 'City Battalions'],
      ['azure', 'Khalsa Infantry', 'multanfort', 'Mulraj’s Guard'], ['azure', 'Light Field Gun', 'multanfort', 'Citadel Guns'],
      // Edwardes across the Chenab at the Gaggianwalluh ferry.
      ['red', 'Matchlockmen', [29.742, 71.170], 'Edwardes’s Pathans'], ['red', 'Matchlockmen', [29.742, 71.170], 'Edwardes’s Pathans'],
      ['red', 'Matchlockmen', [29.752, 71.165], 'Edwardes’s Pathans'], ['red', 'Zamburak', [29.752, 71.165], 'Pathan Zamburaks'],
      ['red', 'Khalsa Infantry', [29.732, 71.165], 'Cortlandt’s Regulars'], ['red', 'Light Field Gun', [29.732, 71.165], 'Cortlandt’s Guns'],
      ['red', 'Irregular Sowars', [29.762, 71.158], 'Pathan Horse'], ['red', 'Irregular Sowars', [29.762, 71.158], 'Pathan Horse'],
      // The Daudpotras at Goweyn.
      ['red', 'Matchlockmen', [29.635, 71.205], 'Daudpotra Infantry'], ['red', 'Matchlockmen', [29.635, 71.205], 'Daudpotra Infantry'],
      ['red', 'Matchlockmen', [29.642, 71.222], 'Daudpotra Infantry'], ['red', 'Zamburak', [29.642, 71.222], 'Daudpotra Zamburaks'],
      ['red', 'Irregular Sowars', [29.628, 71.190], 'Daudpotra Horse'], ['red', 'Irregular Sowars', [29.628, 71.190], 'Daudpotra Horse'],
      ['red', 'Light Field Gun', [29.648, 71.210], 'Bahawalpur Guns'], ['red', 'Matchlockmen', [29.648, 71.210], 'Daudpotra Infantry'],
      ['red', 'Matchlockmen', 'khangarh', 'Khangarh Levies'],
    ],
    reinforcements: [
      { round: 6, side: 'red', at: [29.95, 71.75], name: 'Sheikh Imamuddin’s division', note: 'came in from the east', history: 'Sheikh Imamuddin, once the Darbar’s governor of Kashmir, was sent from Lahore with Darbar troops to join Edwardes and the Daudpotras against Mulraj in the summer of 1848.', units: [['Khalsa Infantry', 'Sheikh Imamuddin’s Division'], ['Light Field Gun', 'Imamuddin’s Guns']] },
      { round: 11, side: 'red', at: [30.335, 71.69], name: 'Whish’s division', note: 'came down from Lahore with the Bengal siege train', history: 'After Edwardes’s victories at Kineyree and Saddusam, the Company sent Major-General Whish with a Bengal division and siege train. He reached Multan in August 1848 and opened the first siege in September.', units: [['Line Infantry', 'HM 10th Foot'], ['Line Infantry', 'HM 32nd Foot'], ['Sepoy Infantry', '49th Bengal NI'], ['Sepoy Infantry', '72nd Bengal NI'], ['Heavy Battery', 'Bengal Siege Train'], ['Horse Artillery', 'Bengal Horse Artillery']] },
      { round: 12, side: 'azure', at: 'multan', name: 'Mulraj’s new levies', note: 'were raised in the city', history: 'Mulraj paid for fresh levies out of the treasury of Multan and kept his garrison up through the months of the siege.', units: [['Matchlockmen', 'Multani Levies'], ['Matchlockmen', 'Multani Levies']] },
      { round: 21, side: 'red', at: [29.635, 71.67], name: 'The Bombay column', note: 'came up from Sindh with its own siege train', history: 'A column of the Bombay army came up the Indus from Sindh with its own siege train in December 1848. With it Whish resumed the siege on 27 December.', units: [['Line Infantry', 'HM 60th Rifles'], ['Line Infantry', '1st Bombay Fusiliers'], ['Sepoy Infantry', '3rd Bombay NI'], ['Heavy Battery', 'Bombay Siege Train'], ['Irregular Sowars', 'Scinde Horse']] },
    ],
    powers: [
      { id: 'mulraj', name: 'Mulraj’s Multan', chief: 'Diwan Mulraj', seat: 'multanfort', npc: false, side: 'azure', color: '#3f6f8f', note: 'The rebel province', extraSeats: ['multan', 'shujabad', 'sikandarabad'] },
      { id: 'beyond', name: 'Beyond the Chenab', chief: 'Lieutenant Edwardes', seat: 'khangarh', npc: false, side: 'red', color: '#94493a', note: 'The right bank, where Edwardes raised his levies', extraSeats: [[30.07, 71.00]] },
      { id: 'bahawalpur', name: 'Bahawalpur', chief: 'Nawab Bahawal Khan', seat: 'goweyn', npc: false, side: 'red', color: '#94493a', note: 'The Daudpotra country to the south' },
    ],
    labels: [
      { text: 'Chenab', lat: 29.90, lon: 71.18, cls: 'water', tier: 1, angle: 60 },
    ],
  },


  // Lahore, January 1841. Maharaja Kharak Singh and his son Nau Nihal Singh
  // were both dead within a day of each other; Kharak Singh's widow, Maharani
  // Chand Kaur, held Lahore as regent with Raja Gulab Singh's Dogras in the
  // fort. Kanwar Sher Singh, with most of the Khalsa army behind him (one
  // account: 26,000 foot, 8,000 horse and 45 guns, against about 5,000 for
  // Chand Kaur), marched on the city and bombarded the fort, mounting light
  // guns on the minarets of the Badshahi Mosque. On the evening of 17 January
  // Dhian Singh arranged a ceasefire; at midnight Gulab Singh marched out with
  // the treasury, and Sher Singh entered the fort on the 20th. Round 1 is
  // 12 January. Out of the settlement came Chand Kaur's jagirs, among them
  // Khari Khariyali (see the Battle for Khari).
  lahore: {
    group: 'lahore', mode: 'open',
    gunRange: 4,  // 250 m hexes: a field gun reaches about a kilometre
    title: 'The Siege of Lahore',
    year: 1841,
    region: 'Lahore',
    blurb: 'January 1841. Maharaja Kharak Singh and his son Nau Nihal Singh are dead, and Kharak Singh’s widow, Maharani Chand Kaur, holds Lahore as regent, with Raja Gulab Singh’s Dogras in the fort. Kanwar Sher Singh, son of Ranjit Singh, comes down the Grand Trunk Road from Amritsar to take the throne, and the regiments at Mian Mir have declared for him. Round 1 is 12 January.',
    first: 'azure',
    standards: { azure: 'dogra', red: 'khalsa', by: [['Chand Kaur', 'khalsa'], ['Fort Topkhana', 'dogra']] },  // battle standards when a unit's name does not say
    vpTarget: Infinity,
    roundLimit: 8,
    goal: {
      fort: 'lahorefort', attacker: 'red', short: 'Take Lahore Fort',
      attackerWins: 'The fort falls to Sher Singh. Chand Kaur gives up her claim for a jagir, Gulab Singh marches out at midnight with the treasury, and Sher Singh is proclaimed Maharaja of the Punjab.',
      defenderWins: 'Lahore Fort still holds for Chand Kaur. Sher Singh must treat with the regent’s party, and the Khalsa army grows restless in the city it has looted.',
    },
    sides: {
      azure: { name: 'Chand Kaur’s Garrison', short: 'Regency', adj: 'Regency', pitch: 'Gulab Singh’s Dogras hold Lahore Fort and the walled city for Maharani Chand Kaur. Hold the gardens and the river crossing as long as you can, then the walls: keep the fort for eight days, until terms can be made.', tag: 'Moves first · hold the fort for 8 days' },
      red: { name: 'Sher Singh’s Army', short: 'Sher Singh', adj: 'Khalsa', pitch: 'Sher Singh’s army comes down the road from Amritsar, and the Mian Mir regiments are with him. Clear the regent’s outposts, force the city gates, bring the guns up to the Badshahi Mosque and the walls, and take Lahore Fort.', tag: 'Moves second · take the fort' },
    },
    generals: {
      azure: { name: 'Raja Gulab Singh', title: 'Holding the fort for Maharani Chand Kaur', leads: 'Gulab Singh’s Dogras' },
      red: { name: 'Kanwar Sher Singh', title: 'Son of Ranjit Singh, claimant to the throne', leads: 'Sher Singh’s Battalions' },
    },
    homeBase: { azure: null, red: [31.596, 74.412] },
    walls: { lahorefort: 6, lahore: 2 },
    sealed: ['lahorefort'],  // the fort spans three hexes: storm the one the garrison holds
    strongpoints: ['lahorefort', 'lahore', 'shalimar', 'shahdara', 'anarkali', 'mianmir'],
    startOwners: { lahorefort: 'azure', lahore: 'azure', shalimar: 'azure', shahdara: 'azure', anarkali: null, mianmir: 'red' },
    startUnits: [
      // Chand Kaur: the fort, the walled city, and outposts at Shalimar and the Shahdara ferry.
      ['azure', 'Dhal & Talwar', [31.589, 74.316], 'Gulab Singh’s Dogras'], ['azure', 'Light Field Gun', 'lahorefort', 'Fort Topkhana'],
      ['azure', 'Matchlockmen', [31.59, 74.319], 'Dogra Musketeers'], ['azure', 'Khalsa Infantry', [31.59, 74.319], 'Chand Kaur’s Guard'],
      ['azure', 'Matchlockmen', [31.606, 74.346], 'River Pickets'], ['azure', 'Irregular Sowars', [31.631, 74.319], 'Dogra Horse'],
      // Sher Singh's army on the road from Amritsar, and the Mian Mir regiments.
      ['red', 'Khalsa Infantry', [31.601, 74.405], 'Sher Singh’s Battalions'], ['red', 'Khalsa Infantry', [31.601, 74.405], 'Khalsa Battalions'],
      ['red', 'Khalsa Infantry', [31.594, 74.400], 'Khalsa Battalions'], ['red', 'Khalsa Infantry', [31.594, 74.400], 'Khalsa Battalions'],
      ['red', 'Khalsa Infantry', [31.608, 74.400], 'Khalsa Battalions'], ['red', 'Khalsa Infantry', [31.608, 74.400], 'Khalsa Battalions'],
      ['red', 'Khalsa Infantry', [31.587, 74.405], 'Khalsa Battalions'], ['red', 'Khalsa Infantry', [31.587, 74.405], 'Khalsa Battalions'],
      ['red', 'Light Field Gun', [31.598, 74.395], 'Khalsa Topkhana'], ['red', 'Light Field Gun', [31.598, 74.395], 'Khalsa Topkhana'],
      ['red', 'Heavy Battery', [31.604, 74.410], 'Sher Singh’s Siege Guns'], ['red', 'Heavy Battery', [31.590, 74.410], 'Sher Singh’s Siege Guns'],
      ['red', 'Irregular Sowars', [31.616, 74.395], 'Ghorcharas'], ['red', 'Irregular Sowars', [31.616, 74.395], 'Ghorcharas'],
      ['red', 'Light Dragoons', [31.577, 74.400], 'Ghorchara Khas'], ['red', 'Irregular Sowars', [31.577, 74.400], 'Ghorcharas'],
      ['red', 'Khalsa Infantry', 'mianmir', 'Mian Mir Battalions'], ['red', 'Khalsa Infantry', 'mianmir', 'Mian Mir Battalions'],
      ['red', 'Light Field Gun', [31.54, 74.37], 'Mian Mir Topkhana'], ['red', 'Khalsa Infantry', [31.54, 74.37], 'Mian Mir Battalions'],
    ],
    reinforcements: [
      { round: 3, side: 'red', at: 'anarkali', name: 'The Fauj-i-Khas', note: 'came over to Sher Singh from Anarkali', history: 'The Fauj-i-Khas, the brigade drilled on the French model by Ventura and Allard, lay round Anarkali. Like most of the Khalsa army it declared for Kanwar Sher Singh against the regent Chand Kaur.', units: [['Khalsa Infantry', 'Fauj-i-Khas'], ['Khalsa Infantry', 'Fauj-i-Khas']] },
    ],
    powers: [
      { id: 'regency', name: 'The regent’s Lahore', chief: 'Maharani Chand Kaur', seat: 'lahorefort', npc: false, side: 'azure', color: '#3f6f8f', note: 'The fort, the walled city and its outposts', extraSeats: ['lahore', 'shalimar', 'shahdara'] },
      { id: 'sher', name: 'Sher Singh’s camp', chief: 'Kanwar Sher Singh', seat: [31.601, 74.405], npc: false, side: 'red', color: '#94493a', note: 'The Khalsa army and the cantonments', extraSeats: ['mianmir', 'anarkali'] },
    ],
    labels: [
      { text: 'Ravi', lat: 31.612, lon: 74.350, cls: 'water', tier: 1, angle: -40 },
      { text: 'Grand Trunk Road', lat: 31.5845, lon: 74.345, cls: 'route', tier: 2, angle: 0 },
    ],
  },

  // Historic mode: the same opening, with the campaign's events as they fell
  // out: Sher Singh's defection, the raising of the first siege, the magazine.
  multan1849h: {
    map: 'shujabad', group: 'multan1849', mode: 'historic',
    modeNote: 'Edwardes’s numbers, and the campaign as it fell out',
    title: 'The Siege of Multan',
    years: '1848–49',
    year: 1848,
    region: 'Shujabad · Multan',
    blurb: '17 June 1848. Diwan Mulraj’s army under Rung Ram lies across the Multan road below Shujabad. The Nawab of Bahawalpur’s Daudpotras are at Goweyn fifteen miles south, and Herbert Edwardes, with his Pathan levies and Cortlandt’s Sikh regulars, is across the Chenab at the Gaggianwalluh ferry with a handful of boats. Whoever reaches the Kineyree ferry first decides the opening; behind it all stand the walls of Multan.',
    first: 'red',
    standards: { azure: 'khalsa', red: 'company' },  // battle standards when a unit's name does not say
    vpTarget: Infinity,
    roundLimit: 24,
    goal: {
      fort: 'multanfort', attacker: 'red', short: 'Take the citadel',
      attackerWins: 'The breaches are stormed and the citadel, its magazine blown and its walls mined, gives in: Mulraj walks out with his last 550 men.',
      defenderWins: 'Multan still holds as the campaign closes, and the rising spreads across the Punjab.',
    },
    sides: {
      azure: { name: 'Mulraj’s Multan', short: 'Mulraj', adj: 'Multani', pitch: 'Rung Ram’s army lies below Shujabad, between the Daudpotras to the south and Edwardes across the river. Beat one before the other can join it, hold Shujabad and the canal line, and keep the citadel until the campaign closes. Raja Sher Singh’s Sikhs, sent against you, may yet come over.', tag: 'Moves second · hold the citadel for 24 days' },
      red: { name: 'Edwardes and the British', short: 'British', adj: 'British', pitch: 'Get Edwardes over the Chenab at Kineyree before Rung Ram falls on the Daudpotras, join hands, take Shujabad and Sikandarabad, and drive Mulraj into Multan. Sheikh Imamuddin joins on day 6, Sher Singh’s Darbar troops on day 9, Whish with the Bengal siege train on day 11 and the Bombay column on day 21.', tag: 'Moves first · take the citadel' },
    },
    generals: {
      azure: { name: 'Diwan Mulraj', title: 'Governor of Multan', leads: 'Mulraj’s Guard' },
      red: { name: 'Lieutenant Herbert Edwardes', title: 'Political officer, raising levies beyond the Indus', leads: 'Edwardes’s Pathans' },
    },
    // Edwardes's road back to Dera Ghazi Khan, the Daudpotras' to Bahawalpur,
    // and the Lahore road for the British columns.
    homeBase: { azure: null, red: [[30.07, 70.94], [29.63, 71.15], [30.34, 71.69]] },
    walls: { multan: 5, multanfort: 9 },
    events: [
      { title: 'Sher Singh goes over to Mulraj', history: 'On 14 September 1848 Raja Sher Singh and the Darbar troops went over to Mulraj. With a third of his besieging force gone, Whish raised the siege and fell back to wait for reinforcements.', round: 15, side: 'azure', text: 'Raja Sher Singh and the Darbar troops went over to Mulraj, and Whish raised the siege', flash: 'SHER SINGH GOES OVER', defect: { names: ['Sher Singh’s Sikhs', 'Sher Singh’s Ghorcharas'], to: 'azure' } },
      { title: 'Sher Singh marches north', history: 'Mulraj never trusted his new ally. In October Sher Singh left Multan to join his father’s rising in the north, and the revolt became the Second Anglo-Sikh War.', round: 18, side: 'azure', text: 'Sher Singh marched north from Multan to join his father’s rising', flash: 'SHER SINGH MARCHES NORTH', depart: ['Sher Singh’s Sikhs', 'Sher Singh’s Ghorcharas'] },
      { title: 'The magazine explodes', history: 'On 30 December 1848 a British shell fell on the great magazine in Multan’s citadel. The explosion killed several hundred of the garrison and destroyed much of Mulraj’s powder; he gave up the citadel on 22 January 1849.', round: 23, side: 'red', text: 'The great magazine in Multan’s citadel blew up', flash: 'THE MAGAZINE EXPLODES', walls: { multanfort: -1 }, hurt: { at: 'multanfort', hp: 2 } },
    ],
    strongpoints: ['multanfort', 'multan', 'shujabad', 'sikandarabad', 'khangarh', 'muzaffargarh'],
    startOwners: { multanfort: 'azure', multan: 'azure', shujabad: 'azure', sikandarabad: 'azure', khangarh: 'red', muzaffargarh: null },
    startUnits: [
      // Rung Ram's army across the Multan road, three miles south of Shujabad.
      ['azure', 'Khalsa Infantry', [29.840, 71.295], 'Rung Ram’s Battalions'], ['azure', 'Light Field Gun', [29.840, 71.295], 'Mulraj’s Topkhana'],
      ['azure', 'Khalsa Infantry', [29.833, 71.310], 'Rung Ram’s Battalions'], ['azure', 'Khalsa Infantry', [29.833, 71.310], 'Multani Battalions'],
      ['azure', 'Irregular Sowars', [29.846, 71.280], 'Multani Horse'], ['azure', 'Irregular Sowars', [29.846, 71.280], 'Multani Horse'],
      ['azure', 'Matchlockmen', [29.828, 71.288], 'Multani Levies'], ['azure', 'Light Field Gun', [29.828, 71.288], 'Mulraj’s Topkhana'],
      // The forts and the city.
      ['azure', 'Matchlockmen', 'shujabad', 'Shujabad Garrison'], ['azure', 'Matchlockmen', 'sikandarabad', 'Sikandarabad Garrison'],
      ['azure', 'Khalsa Infantry', 'multan', 'City Battalions'],
      ['azure', 'Khalsa Infantry', 'multanfort', 'Mulraj’s Guard'], ['azure', 'Light Field Gun', 'multanfort', 'Citadel Guns'],
      // Edwardes across the Chenab at the Gaggianwalluh ferry.
      ['red', 'Matchlockmen', [29.742, 71.170], 'Edwardes’s Pathans'], ['red', 'Matchlockmen', [29.742, 71.170], 'Edwardes’s Pathans'],
      ['red', 'Matchlockmen', [29.752, 71.165], 'Edwardes’s Pathans'], ['red', 'Zamburak', [29.752, 71.165], 'Pathan Zamburaks'],
      ['red', 'Khalsa Infantry', [29.732, 71.165], 'Cortlandt’s Regulars'], ['red', 'Light Field Gun', [29.732, 71.165], 'Cortlandt’s Guns'],
      ['red', 'Irregular Sowars', [29.762, 71.158], 'Pathan Horse'], ['red', 'Irregular Sowars', [29.762, 71.158], 'Pathan Horse'],
      // The Daudpotras at Goweyn.
      ['red', 'Matchlockmen', [29.635, 71.205], 'Daudpotra Infantry'], ['red', 'Matchlockmen', [29.635, 71.205], 'Daudpotra Infantry'],
      ['red', 'Matchlockmen', [29.642, 71.222], 'Daudpotra Infantry'], ['red', 'Zamburak', [29.642, 71.222], 'Daudpotra Zamburaks'],
      ['red', 'Irregular Sowars', [29.628, 71.190], 'Daudpotra Horse'], ['red', 'Irregular Sowars', [29.628, 71.190], 'Daudpotra Horse'],
      ['red', 'Light Field Gun', [29.648, 71.210], 'Bahawalpur Guns'], ['red', 'Matchlockmen', [29.648, 71.210], 'Daudpotra Infantry'],
      ['red', 'Matchlockmen', 'khangarh', 'Khangarh Levies'],
    ],
    reinforcements: [
      { round: 6, side: 'red', at: [29.95, 71.75], name: 'Sheikh Imamuddin’s division', note: 'came in from the east', history: 'Sheikh Imamuddin, once the Darbar’s governor of Kashmir, was sent from Lahore with Darbar troops to join Edwardes and the Daudpotras against Mulraj in the summer of 1848.', units: [['Khalsa Infantry', 'Sheikh Imamuddin’s Division'], ['Light Field Gun', 'Imamuddin’s Guns']] },
      { round: 9, side: 'red', at: [30.335, 71.69], name: 'Raja Sher Singh’s Darbar troops', note: 'came down the Lahore road', history: 'Raja Sher Singh Attariwala was sent down from Lahore with Darbar troops to help the British besiege Multan, though his father Chattar Singh was already moving towards revolt in Hazara.', units: [['Khalsa Infantry', 'Sher Singh’s Sikhs'], ['Khalsa Infantry', 'Sher Singh’s Sikhs'], ['Khalsa Infantry', 'Sher Singh’s Sikhs'], ['Irregular Sowars', 'Sher Singh’s Ghorcharas']] },
      { round: 11, side: 'red', at: [30.335, 71.69], name: 'Whish’s division', note: 'came down from Lahore with the Bengal siege train', history: 'After Edwardes’s victories at Kineyree and Saddusam, the Company sent Major-General Whish with a Bengal division and siege train. He reached Multan in August 1848 and opened the first siege in September.', units: [['Line Infantry', 'HM 10th Foot'], ['Line Infantry', 'HM 32nd Foot'], ['Sepoy Infantry', '49th Bengal NI'], ['Sepoy Infantry', '72nd Bengal NI'], ['Heavy Battery', 'Bengal Siege Train'], ['Horse Artillery', 'Bengal Horse Artillery']] },
      { round: 12, side: 'azure', at: 'multan', name: 'Mulraj’s new levies', note: 'were raised in the city', history: 'Mulraj paid for fresh levies out of the treasury of Multan and kept his garrison up through the months of the siege.', units: [['Matchlockmen', 'Multani Levies'], ['Matchlockmen', 'Multani Levies']] },
      { round: 21, side: 'red', at: [29.635, 71.67], name: 'The Bombay column', note: 'came up from Sindh with its own siege train', history: 'A column of the Bombay army came up the Indus from Sindh with its own siege train in December 1848. With it Whish resumed the siege on 27 December.', units: [['Line Infantry', 'HM 60th Rifles'], ['Line Infantry', '1st Bombay Fusiliers'], ['Sepoy Infantry', '3rd Bombay NI'], ['Heavy Battery', 'Bombay Siege Train'], ['Irregular Sowars', 'Scinde Horse']] },
    ],
    powers: [
      { id: 'mulraj', name: 'Mulraj’s Multan', chief: 'Diwan Mulraj', seat: 'multanfort', npc: false, side: 'azure', color: '#3f6f8f', note: 'The rebel province', extraSeats: ['multan', 'shujabad', 'sikandarabad'] },
      { id: 'beyond', name: 'Beyond the Chenab', chief: 'Lieutenant Edwardes', seat: 'khangarh', npc: false, side: 'red', color: '#94493a', note: 'The right bank, where Edwardes raised his levies', extraSeats: [[30.07, 71.00]] },
      { id: 'bahawalpur', name: 'Bahawalpur', chief: 'Nawab Bahawal Khan', seat: 'goweyn', npc: false, side: 'red', color: '#94493a', note: 'The Daudpotra country to the south' },
    ],
    labels: [
      { text: 'Chenab', lat: 29.90, lon: 71.18, cls: 'water', tier: 1, angle: 60 },
    ],
  },

  // Historic mode: the siege of Lahore from 13 January, Sher Singh's army
  // already round the city and the guns on the minarets.
  lahoreh: {
    map: 'lahore', group: 'lahore', mode: 'historic',
    gunRange: 4,  // 250 m hexes: a field gun reaches about a kilometre
    title: 'The Siege of Lahore',
    year: 1841,
    region: 'Lahore',
    blurb: 'January 1841. Sher Singh’s Khalsa army, some 26,000 foot, 8,000 horse and 45 guns, has come down the Amritsar road and camped at Budhu ka Awa, and the regiments at Mian Mir and the Fauj-i-Khas at Anarkali have declared for him. Raja Gulab Singh’s 5,000 Dogras and guards hold Lahore Fort and the walled city for Maharani Chand Kaur. Round 1 is 13 January, with Sher Singh’s army drawn up outside the city; on the evening of the 17th Dhian Singh arranged a ceasefire.',
    first: 'azure',
    standards: { azure: 'dogra', red: 'khalsa', by: [['Chand Kaur', 'khalsa'], ['Fort Topkhana', 'dogra']] },  // battle standards when a unit's name does not say
    vpTarget: Infinity,
    roundLimit: 7,
    goal: {
      fort: 'lahorefort', attacker: 'red', short: 'Take Lahore Fort',
      attackerWins: 'The fort falls to Sher Singh. Chand Kaur gives up her claim for a jagir, Gulab Singh marches out at midnight with the treasury, and Sher Singh is proclaimed Maharaja of the Punjab.',
      defenderWins: 'Lahore Fort still holds for Chand Kaur when the ceasefire comes. Sher Singh must treat with the regent’s party.',
    },
    sides: {
      azure: { name: 'Chand Kaur’s Garrison', short: 'Regency', adj: 'Regency', pitch: 'Gulab Singh’s Dogras hold Lahore Fort and the walled city for Maharani Chand Kaur. You are outnumbered six to one: hold the fort for seven days, until terms can be made.', tag: 'Moves first · hold the fort for 7 days' },
      red: { name: 'Sher Singh’s Army', short: 'Sher Singh', adj: 'Khalsa', pitch: 'The Khalsa army has come over to Sher Singh. Force the city gates, bring the guns up to the Badshahi Mosque and the walls, and take Lahore Fort.', tag: 'Moves second · take the fort' },
    },
    generals: {
      azure: { name: 'Raja Gulab Singh', title: 'Holding the fort for Maharani Chand Kaur', leads: 'Gulab Singh’s Dogras' },
      red: { name: 'Kanwar Sher Singh', title: 'Son of Ranjit Singh, claimant to the throne', leads: 'Sher Singh’s Battalions' },
    },
    homeBase: { azure: null, red: [31.596, 74.412] },
    walls: { lahorefort: 6, lahore: 2 },
    sealed: ['lahorefort'],
    strongpoints: ['lahorefort', 'lahore', 'shalimar', 'shahdara', 'anarkali', 'mianmir'],
    startOwners: { lahorefort: 'azure', lahore: 'azure', shalimar: 'red', shahdara: null, anarkali: null, mianmir: 'red' },
    startUnits: [
      ['azure', 'Dhal & Talwar', 'lahorefort', 'Gulab Singh’s Dogras'], ['azure', 'Light Field Gun', 'lahorefort', 'Fort Topkhana'],
      ['azure', 'Matchlockmen', 'lahore', 'Dogra Musketeers'], ['azure', 'Khalsa Infantry', 'lahore', 'Chand Kaur’s Guard'],
      ['azure', 'Irregular Sowars', [31.592, 74.322], 'Dogra Horse', 5, { post: true }], ['azure', 'Matchlockmen', [31.578, 74.328], 'Dogra Musketeers'],
      ['red', 'Khalsa Infantry', [31.6073, 74.3667], 'Khalsa Battalions'], ['red', 'Khalsa Infantry', [31.6073, 74.3667], 'Khalsa Battalions'],
      ['red', 'Khalsa Infantry', [31.5598, 74.3758], 'Khalsa Battalions'], ['red', 'Khalsa Infantry', [31.5598, 74.3758], 'Khalsa Battalions'],
      ['red', 'Khalsa Infantry', [31.5576, 74.3804], 'Khalsa Battalions'], ['red', 'Khalsa Infantry', [31.5576, 74.3804], 'Khalsa Battalions'],
      ['red', 'Irregular Sowars', [31.62, 74.36], 'Ghorcharas'], ['red', 'Irregular Sowars', [31.62, 74.36], 'Ghorcharas'],
      ['red', 'Khalsa Infantry', [31.5949, 74.4101], 'Sher Singh’s Battalions'], ['red', 'Khalsa Infantry', [31.5949, 74.4101], 'Khalsa Battalions'],
      ['red', 'Khalsa Infantry', [31.5779, 74.3987], 'Khalsa Battalions'], ['red', 'Khalsa Infantry', [31.5779, 74.3987], 'Khalsa Battalions'],
      ['red', 'Khalsa Infantry', [31.6017, 74.3872], 'Khalsa Battalions'], ['red', 'Khalsa Infantry', [31.6017, 74.3872], 'Khalsa Battalions'],
      ['red', 'Khalsa Infantry', [31.561, 74.3781], 'Khalsa Battalions'], ['red', 'Khalsa Infantry', [31.561, 74.3781], 'Khalsa Battalions'],
      ['red', 'Khalsa Infantry', [31.5587, 74.3781], 'Mian Mir Battalions'], ['red', 'Khalsa Infantry', [31.5587, 74.3781], 'Mian Mir Battalions'],
      ['red', 'Khalsa Infantry', [31.5451, 74.2913], 'Fauj-i-Khas'], ['red', 'Khalsa Infantry', [31.5451, 74.2913], 'Fauj-i-Khas'],
      ['red', 'Khalsa Infantry', [31.6051, 74.3713], 'Khalsa Battalions'], ['red', 'Khalsa Infantry', [31.6051, 74.3713], 'Khalsa Battalions'],
      ['red', 'Light Field Gun', [31.5757, 74.3987], 'Khalsa Topkhana'], ['red', 'Light Field Gun', [31.5757, 74.3987], 'Khalsa Topkhana'],
      ['red', 'Light Field Gun', [31.5971, 74.3964], 'Khalsa Topkhana'], ['red', 'Heavy Battery', [31.5971, 74.3964], 'Sher Singh’s Siege Guns'],
      ['red', 'Heavy Battery', [31.5632, 74.3827], 'Sher Singh’s Siege Guns'],
      ['red', 'Irregular Sowars', [31.60, 74.40], 'Ghorcharas'], ['red', 'Irregular Sowars', [31.60, 74.40], 'Ghorcharas'],
      ['red', 'Irregular Sowars', [31.5316, 74.3507], 'Ghorcharas'], ['red', 'Light Dragoons', [31.5316, 74.3507], 'Ghorchara Khas'],
      ['red', 'Irregular Sowars', [31.603, 74.378], 'Ghorcharas'],
      ['red', 'Khalsa Infantry', [31.5971, 74.4009], 'Shalimar Camp Guard'], ['red', 'Khalsa Infantry', [31.5553, 74.3804], 'Mian Mir Battalions'],
    ],
    powers: [
      { id: 'regency', name: 'The regent’s Lahore', chief: 'Maharani Chand Kaur', seat: 'lahorefort', npc: false, side: 'azure', color: '#3f6f8f', note: 'The fort and the walled city', extraSeats: ['lahore'] },
      { id: 'sher', name: 'Sher Singh’s camp', chief: 'Kanwar Sher Singh', seat: 'shalimar', npc: false, side: 'red', color: '#94493a', note: 'Where the Khalsa army camps', extraSeats: ['mianmir', 'anarkali', 'shahdara', 'baghbanpura'] },
    ],
    labels: [
      { text: 'Ravi', lat: 31.612, lon: 74.350, cls: 'water', tier: 1, angle: -40 },
      { text: 'Grand Trunk Road', lat: 31.5845, lon: 74.345, cls: 'route', tier: 2, angle: 0 },
    ],
  },

  // Naurangabad, May 1844, after Smyth, A History of the Reigning Family of
  // Lahore (1847), pp. 113-20, the Umdat-ut-Tawarikh IV, pp. 290-94,
  // Cunningham (1853), pp. 266-67, Ellenborough to the Queen, 10 June 1844,
  // and Bhai Sher Singh, Sri Bir Mrigesh Gur Bilas. Baba Bir Singh of
  // Naurangabad kept some 1,200 foot, 200-300 horse and two guns, and his
  // camp sheltered Kashmira Singh, the son of Ranjit Singh, and Attar Singh
  // Sandhanwalia, who had crossed the Sutlej on 2 May: some 3,000 men and
  // three guns. The camp then lay at Hari-ke-Pattan, where the Beas meets the
  // Sutlej. Hira Singh told the army that Attar Singh came with British
  // backing, and sent battalions from Lahore under Mian Labh Singh, with
  // Mahtab Singh Majithia's division from Amritsar and Gulab Singh
  // Calcutta-wala's from Kasur, and Sheikh Imamuddin's irregulars and Jawahar
  // Mal's Gorchars from the Jullundur Doab. Labh Singh left Lahore on the 5th,
  // halted once, and arrived on the 7th. At a parley Attar Singh killed
  // Gulab Singh, the guns opened on the camp, Bir Singh was struck by a
  // cannon ball, and Attar Singh and Kashmira Singh fell; many were drowned
  // in the river. Rounds are six hours, from dawn on 6 May.
  naurangabad: {
    title: 'The Battle of Naurangabad',
    year: 1844,
    region: 'Sutlej · Harike',
    blurb: 'May 1844. The wazir Hira Singh rules Lahore for the boy Maharaja Duleep Singh. Baba Bir Singh, the holy man of Naurangabad, has moved his camp to Harike, where the Beas meets the Sutlej, and given shelter to Prince Kashmira Singh and to Attar Singh Sandhanwalia, who has just come back over the Sutlej. Hira Singh has told the army that Attar Singh comes with British support, and the Darbar’s columns are closing on the camp.',
    first: 'azure',
    standards: { azure: 'khalsa', red: 'nishan' },  // battle standards when a unit's name does not say
    vpTarget: Infinity,
    roundLimit: 8,
    menPerFormation: 500,
    clock: { day: 6, month: 'May', from: 6, hours: 6 },
    goal: {
      forts: ['dera'], attacker: 'azure', general: true, short: 'Take the camp, or Attar Singh',
      generalWins: 'Attar Singh Sandhanwalia is dead, and with him the last Sandhanwalia claim to Lahore. Hira Singh is master of the Darbar, though the army will not soon forgive him the Baba’s blood.',
      attackerWins: 'Bir Singh’s camp is broken and plundered. Attar Singh and Kashmira Singh are dead, and the Baba, his leg shattered by a cannon ball, asks that his body be given to the river. The battalions that did it are called gurumar, killers of the guru, for the rest of their days.',
      defenderWins: 'The Darbar’s columns draw off from the camp at Harike. The army will not fire on the Baba, Attar Singh is still at large, and Hira Singh’s hold on Lahore is broken.',
    },
    sides: {
      azure: { name: 'Lahore Darbar', short: 'Darbar', adj: 'Darbar', pitch: 'Mian Labh Singh’s battalions are coming down from Lahore by Patti; Mahtab Singh’s division is coming from Amritsar, Gulab Singh Calcutta-wala’s from Kasur, and Sheikh Imamuddin’s irregulars from the Jullundur Doab. Break Bir Singh’s camp at Harike, or take Attar Singh, within two days.', tag: 'Moves first · take the camp or Attar Singh in 2 days' },
      red: { name: 'Bir Singh’s Camp', short: 'Bir Singh', adj: 'Sikh', pitch: 'The Baba’s camp lies where the Beas meets the Sutlej, with Attar Singh’s and Kashmira Singh’s men in it: some three thousand, three guns, and the rivers at your back. Four columns are coming. Keep the camp and keep Attar Singh alive for two days, and the army will not finish it.', tag: 'Moves second · hold the camp for 2 days' },
    },
    generals: {
      azure: { name: 'Mian Labh Singh', title: 'Commanding the Darbar’s columns for the wazir Hira Singh', leads: 'Labh Singh’s Gorchars' },
      red: { name: 'Sardar Attar Singh Sandhanwalia', title: 'The Sandhanwalia claimant, in Bir Singh’s camp', leads: 'Sandhanwalia Sowars' },
    },
    // The roads in from Lahore, Amritsar and Kasur; the camp has no base but
    // the Baba's own stores.
    homeBase: { azure: [[31.305, 74.80], [31.305, 74.95], [31.17, 74.74]], red: null },
    walls: { dera: 1 },  // the camp's carts and breastworks, with the river behind
    strongpoints: ['dera', 'harike', 'patti'],
    startOwners: { dera: 'red', harike: 'red', patti: 'azure' },
    startUnits: [
      // Labh Singh's battalions from Lahore, strung out down the Patti road.
      ['azure', 'Irregular Sowars', [31.295, 74.81], 'Labh Singh’s Gorchars'], ['azure', 'Light Field Gun', [31.2922, 74.8143], 'Lahore Topkhana'],
      ['azure', 'Khalsa Infantry', [31.30, 74.795], 'Lahore Battalions'],
      ['azure', 'Khalsa Infantry', [31.29, 74.79], 'Court’s Battalion'], ['azure', 'Light Field Gun', [31.285, 74.775], 'Lahore Topkhana'],
      // Bir Singh's camp at Harike, with Attar Singh's and Kashmira Singh's men.
      ['red', 'Irregular Sowars', 'dera', 'Sandhanwalia Sowars', 4], ['red', 'Matchlockmen', [31.15, 74.95], 'Bir Singh’s Musketeers'],
      ['red', 'Matchlockmen', [31.158, 74.945], 'Bir Singh’s Musketeers'], ['red', 'Light Field Gun', [31.16, 74.955], 'Bir Singh’s Guns', 3],
      ['red', 'Irregular Sowars', [31.152, 74.962], 'Kashmira Singh’s Sowars', 3], ['red', 'Dhal & Talwar', [31.145, 74.958], 'Akali Nihangs', 4],
      ['red', 'Irregular Sowars', 'harike', 'Bir Singh’s Horse', 3], ['red', 'Matchlockmen', [31.172, 74.952], 'Bir Singh’s Musketeers', 2],
      // The Baba's followers, who had swelled to some thousands, and the
      // villages round the dera that kept his langar.
      ['red', 'Spearmen', [31.165, 74.965], 'Bir Singh’s Followers', 4], ['red', 'Spearmen', [31.158, 74.97], 'Bir Singh’s Followers', 4],
      ['red', 'Spearmen', [31.1984, 74.9325], 'Burj Followers', 1, { post: true }],
      ['red', 'Spearmen', [31.2186, 74.9531], 'Nathupur Followers', 1, { post: true }],
    ],
    reinforcements: [
      { round: 3, side: 'azure', at: [31.30, 74.95], name: 'Mahtab Singh Majithia’s division', note: 'came down from Amritsar by Tarn Taran', history: 'General Mahtab Singh Majithia had been sent ahead to Amritsar with his battalion, on the pretext of a quarrel with the British, to write to Attar Singh in friendship and draw him over the Sutlej. He now marched on the camp.', units: [['Khalsa Infantry', 'Majithia Battalions'], ['Light Field Gun', 'Majithia Topkhana', 3]] },
      { round: 3, side: 'azure', at: [31.17, 74.745], name: 'Gulab Singh Calcutta-wala’s division', note: 'came up the river from Kasur', history: 'General Gulab Singh, called Calcutta-wala from his escort to the Governor-General years before, hated the Sandhanwalias and had forged letters to lure Attar Singh into the Baba’s camp. He marched from Kasur along the river.', units: [['Khalsa Infantry', 'Calcutta-wala’s Battalions'], ['Light Field Gun', 'Kasur Topkhana', 3]] },
      { round: 4, side: 'azure', at: [31.30, 75.05], name: 'Imamuddin and the Gorchars', note: 'came over the Beas from the Jullundur Doab', history: 'Sheikh Imamuddin, governor of the Jullundur Doab, was to have fifteen hundred irregulars near the camp, with Jawahar Mal and some 2,500 of the late Suchet Singh’s Charyari horse to back him, and in the tumult to make sure of the men on Hira Singh’s list.', units: [['Matchlockmen', 'Imamuddin’s Irregulars'], ['Irregular Sowars', 'Charyari Horse'], ['Irregular Sowars', 'Charyari Horse', 3]] },
    ],
    events: [
      { title: 'The parley ends in a shot', history: 'While Labh Singh’s envoys went to and fro, General Gulab Singh Calcutta-wala came to treat with Attar Singh in the camp. When the guns were run out, Attar Singh took it for treachery and killed him with his own hand, and the flight of his guard was the signal for the battalions to close in.', round: 3, side: 'azure', text: 'Attar Singh killed General Gulab Singh at the parley, and the Darbar’s guns opened on the camp', flash: 'THE PARLEY ENDS IN A SHOT' },
      { title: 'Bir Singh is struck', history: 'One of the first shots nearly carried off Baba Bir Singh’s leg as he sat in meditation by the river. He had forbidden his followers to fire on their brothers, and he died that evening, asking that his body be thrown into the Sutlej.', round: 5, side: 'azure', text: 'A cannon ball struck Baba Bir Singh in his camp', flash: 'BIR SINGH IS STRUCK', hurt: { at: 'dera', hp: 1 } },
    ],
    powers: [
      { id: 'lahore', name: 'Lahore Darbar', chief: 'Raja Hira Singh, wazir', seat: 'patti', npc: false, side: 'azure', color: '#3f6f8f', note: 'The Majha, and the roads from Lahore, Amritsar and Kasur', extraSeats: ['sobraon', [31.305, 74.80], [31.305, 74.95], [31.17, 74.74]] },
      { id: 'jullundur', name: 'Jullundur Doab', chief: 'Sheikh Imamuddin', seat: [31.25, 75.035], npc: false, side: 'azure', color: '#4f7d99', note: 'The governor’s country across the Beas', extraSeats: [[31.30, 75.05]] },
      { id: 'dera', name: 'Bir Singh’s Camp', chief: 'Baba Bir Singh', seat: 'dera', npc: false, side: 'red', color: '#94493a', note: 'The Baba’s camp at Hari-ke-Pattan', extraSeats: ['harike'] },
      { id: 'company', name: 'British Territory', chief: 'The Company', seat: 'makhu', npc: false, side: null, color: '#7b6a4c', note: 'Ferozepur district, over the Sutlej', extraSeats: [[31.06, 74.85], [31.04, 74.97]] },
    ],
    labels: [
      { text: 'MAJHA', lat: 31.24, lon: 74.86, cls: 'region', tier: 1 },
      { text: 'JULLUNDUR DOAB', lat: 31.25, lon: 75.02, cls: 'region', tier: 2 },
      { text: 'Sutlej', lat: 31.125, lon: 74.83, cls: 'water', tier: 1, angle: 10 },
      { text: 'Beas', lat: 31.205, lon: 75.03, cls: 'water', tier: 1, angle: 40 },
    ],
  },

  // Gujranwala, 1761, after Hari Ram Gupta, History of the Sikhs II, pp.
  // 171-73, and IV, pp. 28-29 and 294-96, with Ganda Singh, Ahmad Shah
  // Durrani, ch. XXI, and Latif, History of the Panjab, p. 282. In the autumn
  // of 1761, after Charat Singh had beaten Nur-ud-din at Sialkot, Ahmad
  // Shah's governor of Lahore, Khwaja Ubaid (Abed) Khan, marched on
  // Gujranwala with 9-10,000 horse and foot and ten or twelve guns. He
  // entrenched at Eminabad for some days, then before Gujranwala; Charat
  // Singh left a strong garrison in his fort and drove the besiegers back
  // into their lines by sallies. The misls gathered and camped about four
  // miles off: Jassa Singh Ahluwalia, Hari Singh, Jhanda Singh and Gujjar
  // Singh Bhangi, and Jai Singh Kanhaiya. The 1,400-1,500 Sikhs in Ubaid
  // Khan's pay were won over, a night attack was planned, and Ubaid Khan fled
  // after dark without striking a blow, leaving his guns, swivels, camels and
  // stores. No numbers are recorded for the Sikhs. A round is a day.
  gujranwala: {
    title: 'The Siege of Gujranwala',
    year: 1761,
    region: 'Rechna Doab · Gujranwala',
    blurb: '1761. Charat Singh of the Sukerchakias has just beaten Ahmad Shah’s general at Sialkot, and holds his new brick fort at Gujranwala astride the high road to Kabul. Khwaja Ubaid Khan, the Shah’s governor of Lahore, has marched out with nine or ten thousand horse and foot and a train of guns to take it. Among his troops are some fifteen hundred Sikhs in his pay. The misls are gathering.',
    first: 'azure',
    standards: { azure: 'durrani', red: 'nishan', by: [['Sahib Singh|Doaba Sikhs', 'nishan']] },  // battle standards when a unit's name does not say
    vpTarget: Infinity,
    roundLimit: 10,
    goal: {
      forts: ['gujranwala'], attacker: 'azure', short: 'Take Charat Singh’s fort',
      prize: 'eminabad', prizeSide: 'red',
      prizeWins: 'The misls are in Eminabad and the governor’s camp is broken. Ubaid Khan rides for Lahore by night with a few horsemen, leaving his guns, his swivels, his camels and his stores to Charat Singh, who mounts the guns on his walls.',
      attackerWins: 'Gujranwala falls and Charat Singh is a fugitive. The high road from Lahore to the Chenab is the Shah’s again, and the misls ride home with nothing to show for the muster.',
      defenderWins: 'Ubaid Khan’s siege has failed. Gujranwala still stands when he must march back to Lahore, and the misls follow him to its walls.',
    },
    sides: {
      azure: { name: 'Governor of Lahore', short: 'Durrani', adj: 'Durrani', pitch: 'Your army is on the high road below Eminabad, with the guns and fifteen hundred Sikhs in your pay. Charat Singh is shut up in his fort at Gujranwala, and the misls are gathering to the east. Take the fort in ten days, and keep Eminabad behind you. Your hired contingents may not hold once the misls are up: finish the siege quickly.', tag: 'Moves first · take Gujranwala in 10 days' },
      red: { name: 'Charat Singh and the Misls', short: 'Misls', adj: 'Sukerchakia', pitch: 'You hold your fort at Gujranwala with a strong garrison and your own horse. Jassa Singh Ahluwalia, the Bhangis and Jai Singh Kanhaiya are coming. Hold the fort, harry the besiegers, and when the misls are up, break the governor’s camp at Eminabad.', tag: 'Moves second · hold Gujranwala, or take Eminabad' },
    },
    generals: {
      azure: { name: 'Khwaja Ubaid Khan', title: 'Ahmad Shah’s governor of Lahore', leads: 'Ubaid Khan’s Horse' },
      red: { name: 'Sardar Charat Singh', title: 'Chief of the Sukerchakia misl', leads: 'Charat Singh’s Sowars' },
    },
    // The governor's road back to Lahore; the misls' roads from Amritsar and
    // Batala, and Charat Singh's own country up the high road.
    homeBase: { azure: [31.865, 74.25], red: [[31.97, 74.62], [32.27, 74.62], [32.30, 74.15]] },
    walls: { gujranwala: 2, eminabad: 1 },  // Charat Singh's brick fort of 1758; the governor's entrenched camp
    strongpoints: ['gujranwala', 'eminabad'],
    startOwners: { gujranwala: 'red', eminabad: 'azure' },
    startUnits: [
      // Ubaid Khan's army on the high road about Kamoke, a march short of
      // Eminabad, its camps spread over the villages either side.
      ['azure', 'Irregular Sowars', 'kamoke', 'Ubaid Khan’s Horse'], ['azure', 'Light Field Gun', [31.96, 74.235], 'Governor’s Guns', 4],
      ['azure', 'Irregular Sowars', [31.9828, 74.2933], 'Durrani Horse'], ['azure', 'Mounted Matchlocks', [31.9939, 74.1346], 'Mughal Horse'],
      ['azure', 'Matchlockmen', [31.945, 74.215], 'Lahore Barqandazes'], ['azure', 'Matchlockmen', 'sadhoke', 'Lahore Barqandazes'],
      ['azure', 'Dhal & Talwar', [31.935, 74.25], 'Rohilla Swordsmen'], ['azure', 'Light Field Gun', [31.92, 74.23], 'Governor’s Guns', 4],
      ['azure', 'Zamburak', [31.95, 74.19], 'Durrani Zamburaks'], ['azure', 'Irregular Sowars', [31.9207, 74.3133], 'Durrani Horse'],
      // The Sikhs in the governor's pay: Sahib Singh's horse, and the men enrolled in the Jullundur Doab.
      ['azure', 'Irregular Sowars', [31.97, 74.265], 'Sahib Singh’s Sikhs', 3], ['azure', 'Matchlockmen', [31.879, 74.2441], 'Doaba Sikhs', 4],
      // The governor's post in Eminabad, where he would entrench.
      ['azure', 'Matchlockmen', 'eminabad', 'Eminabad Post', 2, { post: true }],
      // Charat Singh's garrison in the fort, his horse in the villages round it,
      // and his posts up the high road.
      ['red', 'Matchlockmen', 'gujranwala', 'Gujranwala Garrison', 5, { post: true }], ['red', 'Irregular Sowars', 'gujranwala', 'Charat Singh’s Sowars'],
      ['red', 'Irregular Sowars', [32.1567, 74.1159], 'Sukerchakia Sowars'], ['red', 'Mounted Matchlocks', [32.1991, 74.2441], 'Sukerchakia Sowars', 4],
      ['red', 'Matchlockmen', [32.2079, 74.1825], 'Sukerchakia Musketeers'], ['red', 'Zamburak', [32.1715, 74.2208], 'Sukerchakia Zamburaks'],
      ['red', 'Matchlockmen', 'qiladidar', 'Qila Didar Singh Post', 2, { post: true }],
      ['red', 'Matchlockmen', 'wazirabad', 'Wazirabad Post', 2, { post: true }],
      ['red', 'Matchlockmen', 'daska', 'Daska Post', 2, { post: true }],
    ],
    reinforcements: [
      { round: 3, side: 'red', at: [31.97, 74.62], name: 'Jassa Singh Ahluwalia', note: 'came up from Amritsar with the Dal Khalsa', history: 'Word of the siege went round the misls, and Jassa Singh Ahluwalia, the leader of the Dal Khalsa, rode for Gujranwala from Amritsar with his own horse and the Nihangs.', units: [['Irregular Sowars', 'Ahluwalia Sowars'], ['Irregular Sowars', 'Ahluwalia Sowars'], ['Dhal & Talwar', 'Akali Nihangs']] },
      { round: 4, side: 'red', at: [32.27, 74.62], name: 'The Bhangis', note: 'came in by Daska', history: 'Hari Singh, Jhanda Singh and Gujjar Singh of the Bhangis brought their horse to the muster, with Lahna Singh and Sobha Singh.', units: [['Irregular Sowars', 'Bhangi Sowars'], ['Mounted Matchlocks', 'Bhangi Sowars'], ['Matchlockmen', 'Bhangi Musketeers']] },
      { round: 5, side: 'red', at: [31.97, 74.62], name: 'Jai Singh Kanhaiya', note: 'came up the Amritsar road', history: 'Jai Singh Kanhaiya came from the Riarki beyond the Ravi to join the misls camped before Gujranwala, leaving the governor, as Gupta has it, besieged in his turn.', units: [['Irregular Sowars', 'Kanhaiya Sowars'], ['Irregular Sowars', 'Kanhaiya Sowars']] },
    ],
    events: [
      { title: 'The Sikhs in the governor’s pay go over', history: 'The Sikhs in Ubaid Khan’s service, Sahib Singh’s four or five hundred and the thousand enrolled in the Jullundur Doab, were won over by their brethren outside. When the misls fell on his camp they turned on him, and Ubaid Khan fled by night without striking a blow.', round: 6, side: 'red', text: 'The Sikhs in Ubaid Khan’s pay went over to the misls', flash: 'THE GOVERNOR’S SIKHS GO OVER', defect: { names: ['Sahib Singh’s Sikhs', 'Doaba Sikhs'], to: 'red' } },
    ],
    powers: [
      { id: 'lahore', name: 'Lahore', chief: 'Khwaja Ubaid Khan', seat: 'eminabad', npc: false, side: 'azure', color: '#3f6f8f', note: 'The governor’s country down the high road to Lahore', extraSeats: ['kamoke', 'sadhoke', [31.865, 74.25], [31.95, 73.95]] },
      { id: 'sukerchakia', name: 'The Sukerchakias', chief: 'Sardar Charat Singh', seat: 'gujranwala', npc: false, side: 'red', color: '#94493a', note: 'Charat Singh’s country from Gujranwala to the Chenab', extraSeats: ['ghakhar', 'wazirabad', 'sodhra', 'qiladidar', [32.12, 73.88]] },
      { id: 'misls', name: 'The Misls', chief: 'Sardar Jassa Singh Ahluwalia', seat: 'daska', npc: false, side: 'red', color: '#a5604a', note: 'Sialkot and the roads in from Amritsar', extraSeats: ['sialkot', [31.97, 74.62], [32.27, 74.62]] },
    ],
    labels: [
      { text: 'RECHNA DOAB', lat: 32.06, lon: 74.47, cls: 'region', tier: 1 },
      { text: 'Chenab', lat: 32.40, lon: 73.98, cls: 'water', tier: 1, angle: 35 },
      { text: 'Aik', lat: 32.33, lon: 74.30, cls: 'water', tier: 2, angle: 30 },
      { text: 'Deg', lat: 31.98, lon: 74.47, cls: 'water', tier: 2, angle: 40 },
    ],
  },

  // The Jammu succession war, 1774, after Hari Ram Gupta, History of the Sikhs
  // IV (1999), p. 215, and Trans-Sutlej Sikhs (1939), p. 34; Hutchison and
  // Vogel, History of the Panjab Hill States I, p. 89; and Bhagat Singh, A
  // History of the Sikh Misals (1993), p. 153. Raja Ranjit Dev of Jammu meant
  // his younger son Dalel Singh to succeed him; the elder, Brij Raj Dev, rose
  // and called in Charat Singh Sukerchakia and Jai Singh Kanhaiya, who camped
  // on the Basantar at the edge of Jammu and the Sialkot country. Ranjit Dev
  // called in Jhanda Singh Bhangi, whose vassal he was, and the hill rajas of
  // Chamba, Kangra, Nurpur and Basohli. The skirmishing became a battle near
  // Zafarwal that went on for 23 days without a decision. Then Charat Singh
  // was killed when his own matchlock burst, and Jhanda Singh was shot in his
  // camp by a man said to have been bribed by Jai Singh. His brother Ganda
  // Singh drew the Bhangis off, and Ranjit Dev came to terms: Brij Raj Dev was
  // his heir, and Jammu paid the Kanhaiyas tribute. No numbers are recorded.
  // The 23 days are compressed into twelve: Charat Singh falls on day 10 and
  // Jhanda Singh on day 11.
  jammu: {
    title: 'The Battle of Jammu',
    year: 1774,
    region: 'Jammu · Basantar',
    blurb: '1774. Raja Ranjit Dev of Jammu means his younger son to rule after him. The elder, Brij Raj Dev, has risen and called in Charat Singh of the Sukerchakias and Jai Singh of the Kanhaiyas, who are camped on the Basantar below Zafarwal. Ranjit Dev has called in Jhanda Singh Bhangi from Sialkot and the hill rajas of Chamba, Kangra, Nurpur and Basohli.',
    first: 'azure',
    standards: { azure: 'dogra', red: 'nishan' },  // battle standards when a unit's name does not say
    vpTarget: Infinity,
    roundLimit: 12,
    goal: {
      forts: ['basantar'], attacker: 'azure', short: 'Break the camp on the Basantar',
      attackerWins: 'The camp on the Basantar is broken and the misls ride for home. Brij Raj Dev is a fugitive, and Ranjit Dev may leave Jammu to whichever son he likes.',
      defenderWins: 'The camp on the Basantar still stands when the Bhangis go home. Ranjit Dev comes to terms: Brij Raj Dev is his heir, and Jammu pays the Kanhaiyas a lakh and a quarter a year.',
    },
    sides: {
      azure: { name: 'Jammu and the Bhangis', short: 'Jammu', adj: 'Jammu', pitch: 'Jhanda Singh’s Bhangis are at Sialkot and Ranjit Dev’s Dogras at Jammu, and the hill rajas’ levies are coming down the Samba road. Break Charat Singh’s and Jai Singh’s camp on the Basantar. The Bhangis will not stay for ever.', tag: 'Moves first · take the Basantar camp in 12 days' },
      red: { name: 'Brij Raj Dev’s Allies', short: 'Misls', adj: 'Sukerchakia', pitch: 'Charat Singh’s Sukerchakias and Jai Singh’s Kanhaiyas hold the camp on the Basantar and Zafarwal, with Brij Raj Dev’s Dogras. Two armies are coming at you. Hold the camp for twelve days, and the Bhangis will tire of it before you do.', tag: 'Moves second · hold the camp for 12 days' },
    },
    generals: {
      azure: { name: 'Sardar Jhanda Singh', title: 'Chief of the Bhangi misl', leads: 'Jhanda Singh’s Sowars' },
      red: { name: 'Sardar Charat Singh', title: 'Chief of the Sukerchakia misl', leads: 'Charat Singh’s Sowars' },
    },
    // Jammu and Sialkot; the Kanhaiya country over the Ravi, and the Sukerchakias' towards Gujranwala.
    homeBase: { azure: [[32.7186, 74.8581], [32.4945, 74.5416]], red: [[32.18, 75.05], [32.18, 74.62]] },
    strongpoints: ['zafarwal', 'basantar'],
    startOwners: { zafarwal: 'red', basantar: 'red' },
    startUnits: [
      // Jhanda Singh's Bhangis at Sialkot.
      ['azure', 'Irregular Sowars', [32.48, 74.56], 'Jhanda Singh’s Sowars'], ['azure', 'Irregular Sowars', [32.48, 74.56], 'Bhangi Sowars'],
      ['azure', 'Irregular Sowars', [32.47, 74.58], 'Bhangi Sowars'], ['azure', 'Mounted Matchlocks', [32.47, 74.58], 'Bhangi Sowars'],
      ['azure', 'Irregular Sowars', [32.505, 74.575], 'Bhangi Sowars'], ['azure', 'Mounted Matchlocks', [32.505, 74.575], 'Bhangi Sowars'],
      ['azure', 'Matchlockmen', 'sialkot', 'Bhangi Musketeers'], ['azure', 'Zamburak', 'sialkot', 'Bhangi Zamburaks'],
      ['azure', 'Matchlockmen', [32.485, 74.535], 'Bhangi Musketeers'], ['azure', 'Zamburak', [32.485, 74.535], 'Bhangi Zamburaks'],
      // Ranjit Dev's Dogras at Jammu.
      ['azure', 'Matchlockmen', 'jammu', 'Jammu Garrison', 5, { post: true }],
      ['azure', 'Dhal & Talwar', [32.70, 74.86], 'Ranjit Dev’s Dogras'], ['azure', 'Dhal & Talwar', [32.70, 74.86], 'Ranjit Dev’s Dogras'],
      ['azure', 'Matchlockmen', 'samba', 'Samba Garrison', 3, { post: true }],
      ['azure', 'Matchlockmen', [32.705, 74.835], 'Dogra Matchlockmen'], ['azure', 'Irregular Sowars', [32.705, 74.835], 'Dogra Horse'],
      // Charat Singh's and Jai Singh's camp on the Basantar, with Zafarwal held.
      ['red', 'Irregular Sowars', 'basantar', 'Charat Singh’s Sowars'], ['red', 'Dhal & Talwar', 'basantar', 'Akali Nihangs'],
      ['red', 'Irregular Sowars', [32.29, 75.01], 'Sukerchakia Sowars'], ['red', 'Mounted Matchlocks', [32.29, 75.01], 'Sukerchakia Sowars'],
      ['red', 'Irregular Sowars', [32.27, 75.00], 'Sukerchakia Sowars'], ['red', 'Zamburak', [32.27, 75.00], 'Sukerchakia Zamburaks'],
      ['red', 'Irregular Sowars', [32.30, 75.045], 'Jai Singh’s Sowars'], ['red', 'Irregular Sowars', [32.30, 75.045], 'Kanhaiya Sowars'],
      ['red', 'Mounted Matchlocks', [32.265, 75.04], 'Kanhaiya Sowars'], ['red', 'Matchlockmen', [32.265, 75.04], 'Kanhaiya Musketeers'],
      ['red', 'Dhal & Talwar', [32.31, 74.99], 'Brij Raj Dev’s Dogras'], ['red', 'Zamburak', [32.31, 74.99], 'Kanhaiya Zamburaks'],
      ['red', 'Matchlockmen', 'zafarwal', 'Zafarwal Post'],
    ],
    reinforcements: [
      { round: 2, side: 'azure', at: [32.50, 75.21], name: 'The hill rajas’ levies', note: 'came down the Samba road', history: 'Ranjit Dev called on the Pahari states, Chamba, Kangra, Nurpur and Basohli, who sent their levies down out of the hills to fight beside the Bhangis.', units: [['Matchlockmen', 'Chamba Levies'], ['Spearmen', 'Nurpur Levies'], ['Matchlockmen', 'Basohli Levies'], ['Spearmen', 'Kangra Levies']] },
    ],
    events: [
      { title: 'Charat Singh falls', history: 'On the twenty-third day of the fighting Charat Singh’s matchlock burst in his hands and the splinters struck him in the forehead. He died on the field. His young son Maha Singh took his place: he was to be the father of Ranjit Singh.', round: 10, side: 'red', text: 'Charat Singh was killed when his own matchlock burst', flash: 'CHARAT SINGH FALLS', falls: 'red' },
      { title: 'Jhanda Singh is shot', history: 'Soon after, Jhanda Singh Bhangi was shot from behind as he walked alone in his camp, by a Mazhabi Sikh of his own service who is said to have been bribed by Jai Singh Kanhaiya. His brother Ganda Singh lost heart and drew the Bhangis off from Jammu.', round: 11, side: 'azure', text: 'Jhanda Singh Bhangi was shot in his camp, and Ganda Singh drew the Bhangis off', flash: 'JHANDA SINGH IS SHOT', falls: 'azure', depart: ['Jhanda Singh’s Sowars', 'Bhangi Sowars', 'Bhangi Musketeers', 'Bhangi Zamburaks'] },
    ],
    powers: [
      { id: 'jammu', name: 'Jammu', chief: 'Raja Ranjit Dev', seat: 'jammu', npc: false, side: 'azure', color: '#3f6f8f', note: 'The Dogra raj of Jammu and its hills', extraSeats: ['bahu', 'purmandal', 'samba', 'vijaypur', 'bishnah', [32.50, 75.21]] },
      { id: 'bhangi', name: 'The Bhangis', chief: 'Sardar Jhanda Singh', seat: 'sialkot', npc: false, side: 'azure', color: '#4f7d99', note: 'The Bhangi country round Sialkot', extraSeats: ['chaprar', 'pasrur'] },
      { id: 'allies', name: 'Brij Raj Dev’s allies', chief: 'Sardar Jai Singh Kanhaiya', seat: 'basantar', npc: false, side: 'red', color: '#94493a', note: 'The Kanhaiya and Sukerchakia camps', extraSeats: ['zafarwal', 'shakargarh', [32.18, 75.05], [32.18, 74.62]] },
    ],
    labels: [
      { text: 'DUGGAR', lat: 32.76, lon: 75.03, cls: 'region', tier: 1 },
      { text: 'Tawi', lat: 32.69, lon: 74.72, cls: 'water', tier: 2, angle: 10 },
      { text: 'Degh', lat: 32.44, lon: 74.96, cls: 'water', tier: 2, angle: 45 },
      { text: 'Basantar', lat: 32.235, lon: 75.07, cls: 'water', tier: 2, angle: 60 },
    ],
  },

  // Rohtas, December 1779, after Hari Ram Gupta, Studies in Later Mughal
  // History of the Punjab (2000), pp. 237-41, and History of the Sikhs IV
  // (2001), pp. 432-35, with Ashiq Muhammad Khan, The Last Phase of Muslim Rule
  // in Multan (1998), p. 157. The Bhangis had held Multan since 1772 and the
  // country round Rohtas since 1767. In late 1779 Timur Shah marched to take
  // Multan back, and when the Bhangi chiefs shot his envoy Haji Ali Khan he
  // sent Zangi Khan ahead with 18,000 Yusufzais, Durranis, Mughals and
  // Qizilbash by little-known roads, in secret. Zangi Khan halted some 25 km
  // short of the Sikh camps, seized anyone going towards them, and fell on
  // them before daybreak. The Sikhs (Gupta presumes about 5,500) fought but
  // broke: some 3,000 were killed, 500 drowned in the Jhelum and 2,000 got
  // over to the far bank. The Sikh chiefs are not named. Round 1 is the day
  // Zangi Khan comes down the Bakrala pass; Timur Shah could not stay, and was
  // before Multan in January 1780.
  rohtas: {
    map: 'rohtas', group: 'rohtas', mode: 'historic',
    title: 'The Battle of Rohtas',
    year: 1779,
    region: 'Jhelum · Rohtas',
    blurb: 'December 1779. The Bhangi misl holds Multan and the country round Rohtas, and its chiefs have shot Timur Shah’s envoy. Timur Shah is marching on Multan, and he has sent Zangi Khan ahead with 18,000 Yusufzais, Durranis, Mughals and Qizilbash by little-known roads, in secret. The Bhangi camps lie between Rohtas and the Jhelum, and no one in them knows he is coming.',
    first: 'azure',
    standards: { azure: 'durrani', red: 'nishan' },  // battle standards when a unit's name does not say
    vpTarget: Infinity,
    roundLimit: 7,
    goal: {
      forts: ['rohtas', 'jhelum'], need: 1, attacker: 'azure', short: 'Take Rohtas or the Jhelum crossing',
      attackerWins: 'The Bhangis are driven over the Jhelum, leaving their dead on the road and their drowned in the river. Rohtas or the crossing falls to Zangi Khan, and Timur Shah marches on Multan with the north secure behind him.',
      defenderWins: 'The Bhangis still hold Rohtas and the Jhelum when Timur Shah must turn south for Multan. Zangi Khan’s surprise has cost the misl dearly, but not the country.',
    },
    sides: {
      azure: { name: 'Durrani Army', short: 'Durrani', adj: 'Durrani', pitch: 'Zangi Khan’s 18,000 are coming down the Bakrala pass, and the Bhangi camps below do not know it. Fall on them, drive them over the Jhelum, and take Rohtas or the town of Jhelum before Timur Shah must march for Multan.', tag: 'Moves first · take Rohtas or Jhelum in 7 days' },
      red: { name: 'Bhangi Misl', short: 'Bhangis', adj: 'Bhangi', pitch: 'Your camps lie between Rohtas and the Jhelum, with the fort’s garrison behind you and the crossing at your back. An Afghan army is on the road from the pass. Hold both Rohtas and Jhelum for seven days and Timur Shah must go south without them.', tag: 'Moves second · hold Rohtas and Jhelum for 7 days' },
    },
    generals: {
      azure: { name: 'Zangi Khan', title: 'Commander of Timur Shah’s advance army', leads: 'Zangi Khan’s Durranis' },
      red: { name: 'Sardar Desa Singh Bhangi', title: 'Chief of the Bhangi misl (who led in the field is uncertain)', leads: 'The Sardars’ Sowars' },
    },
    // The Afghans' road back over the Bakrala pass; the Sikhs' over the river to Gujrat.
    homeBase: { azure: [33.10, 73.445], red: [32.81, 73.86] },
    walls: { rohtas: 2 },
    strongpoints: ['rohtas', 'jhelum', 'dina', 'sarai'],
    startOwners: { rohtas: 'red', jhelum: 'red', dina: 'red', sarai: 'red' },
    startUnits: [
      // Zangi Khan's army at the head of the pass.
      ['azure', 'Irregular Sowars', [33.098, 73.448], 'Zangi Khan’s Durranis'], ['azure', 'Irregular Sowars', [33.098, 73.448], 'Durrani Horse'],
      ['azure', 'Irregular Sowars', [33.104, 73.462], 'Durrani Horse'], ['azure', 'Irregular Sowars', [33.104, 73.462], 'Durrani Horse'],
      ['azure', 'Irregular Sowars', [33.088, 73.442], 'Mughal Horse'], ['azure', 'Mounted Matchlocks', [33.088, 73.442], 'Qizilbash Horse'],
      ['azure', 'Mounted Matchlocks', [33.106, 73.475], 'Qizilbash Horse'], ['azure', 'Irregular Sowars', [33.106, 73.475], 'Durrani Horse'],
      ['azure', 'Dhal & Talwar', [33.08, 73.44], 'Yusufzai Swordsmen'], ['azure', 'Dhal & Talwar', [33.08, 73.44], 'Yusufzai Swordsmen'],
      ['azure', 'Matchlockmen', [33.094, 73.438], 'Yusufzai Jezailchis'], ['azure', 'Matchlockmen', [33.094, 73.438], 'Yusufzai Jezailchis'],
      ['azure', 'Dhal & Talwar', [33.106, 73.44], 'Yusufzai Swordsmen'], ['azure', 'Zamburak', [33.106, 73.44], 'Durrani Zamburaks'],
      ['azure', 'Matchlockmen', [33.07, 73.438], 'Afghan Jezailchis'], ['azure', 'Zamburak', [33.07, 73.438], 'Durrani Zamburaks'],
      // The Bhangi camps between Rohtas and the river, with the fort and the town held.
      ['red', 'Irregular Sowars', [32.955, 73.655], 'The Sardars’ Sowars'], ['red', 'Mounted Matchlocks', [32.955, 73.655], 'Bhangi Sowars'],
      ['red', 'Irregular Sowars', [32.945, 73.685], 'Bhangi Sowars'], ['red', 'Dhal & Talwar', [32.945, 73.685], 'Akali Nihangs'],
      ['red', 'Matchlockmen', [32.965, 73.70], 'Bhangi Musketeers'], ['red', 'Zamburak', [32.965, 73.70], 'Bhangi Zamburaks'],
      ['red', 'Matchlockmen', 'rohtas', 'Rohtas Garrison', 5, { post: true }], ['red', 'Jingal', 'rohtas', 'Rohtas Wall Guns', 5, { post: true }],
      ['red', 'Matchlockmen', 'jhelum', 'Jhelum Post'],
    ],
    powers: [
      { id: 'durrani', name: 'Timur Shah', chief: 'Timur Shah Durrani', seat: 'bakrala', npc: false, side: 'azure', color: '#3f6f8f', note: 'The road from Peshawar over the Bakrala pass', extraSeats: [[33.10, 73.445]] },
      { id: 'misls', name: 'The Bhangis', chief: 'The Bhangi Sardars', seat: 'rohtas', npc: false, side: 'red', color: '#94493a', note: 'The Bhangi country from Rohtas to Gujrat', extraSeats: ['jhelum', 'dina', 'sarai', 'jatlan', [32.85, 73.84]] },
    ],
    labels: [
      { text: 'Jhelum', lat: 32.86, lon: 73.66, cls: 'water', tier: 1, angle: 50 },
      { text: 'Grand Trunk Road', lat: 33.03, lon: 73.50, cls: 'route', tier: 2, angle: -50 },
    ],
  },

  // Open campaign: the Bhangis have word that Zangi Khan is on the road. Their
  // camps are stronger and on guard, and Gujjar Singh's horse comes up from
  // Gujrat on day 3; Timur Shah gives Zangi Khan longer.
  rohtaso: {
    map: 'rohtas', group: 'rohtas', mode: 'open',
    title: 'The Battle of Rohtas',
    year: 1779,
    region: 'Jhelum · Rohtas',
    blurb: 'December 1779, with the alarm given. The Bhangis have word that an Afghan army is coming down from the pass and are gathering at Rohtas and the Jhelum, and Gujjar Singh is riding up from Gujrat. Zangi Khan must take the fort and the crossing before Timur Shah turns south for Multan.',
    first: 'azure',
    standards: { azure: 'durrani', red: 'nishan' },  // battle standards when a unit's name does not say
    vpTarget: Infinity,
    roundLimit: 10,
    goal: {
      forts: ['rohtas', 'jhelum'], need: 1, attacker: 'azure', short: 'Take Rohtas or the Jhelum crossing',
      attackerWins: 'The Bhangis are driven over the Jhelum. Rohtas or the crossing falls to Zangi Khan, and Timur Shah marches on Multan with the north secure behind him.',
      defenderWins: 'The Bhangis still hold Rohtas and the Jhelum when Timur Shah must turn south for Multan, and the misl keeps the country from the river to the Salt Range.',
    },
    sides: {
      azure: { name: 'Durrani Army', short: 'Durrani', adj: 'Durrani', pitch: 'Zangi Khan’s army is coming down the Bakrala pass, and the Bhangis know it. Beat their camps before Gujjar Singh comes up from Gujrat, and take Rohtas or the town of Jhelum before Timur Shah must march for Multan.', tag: 'Moves first · take Rohtas or Jhelum in 10 days' },
      red: { name: 'Bhangi Misl', short: 'Bhangis', adj: 'Bhangi', pitch: 'An Afghan army is on the road from the pass. Gather your camps, hold the fort and the crossing, and Gujjar Singh’s horse will come up from Gujrat on day 3. Hold both Rohtas and Jhelum for ten days.', tag: 'Moves second · hold Rohtas and Jhelum for 10 days' },
    },
    generals: {
      azure: { name: 'Zangi Khan', title: 'Commander of Timur Shah’s advance army', leads: 'Zangi Khan’s Durranis' },
      red: { name: 'Sardar Desa Singh Bhangi', title: 'Chief of the Bhangi misl (who led in the field is uncertain)', leads: 'The Sardars’ Sowars' },
    },
    homeBase: { azure: [33.10, 73.445], red: [32.81, 73.86] },
    walls: { rohtas: 2 },
    strongpoints: ['rohtas', 'jhelum', 'dina', 'sarai'],
    startOwners: { rohtas: 'red', jhelum: 'red', dina: 'red', sarai: 'red' },
    startUnits: [
      ['azure', 'Irregular Sowars', [33.098, 73.448], 'Zangi Khan’s Durranis'], ['azure', 'Irregular Sowars', [33.098, 73.448], 'Durrani Horse'],
      ['azure', 'Irregular Sowars', [33.104, 73.462], 'Durrani Horse'], ['azure', 'Irregular Sowars', [33.104, 73.462], 'Durrani Horse'],
      ['azure', 'Irregular Sowars', [33.088, 73.442], 'Mughal Horse'], ['azure', 'Mounted Matchlocks', [33.088, 73.442], 'Qizilbash Horse'],
      ['azure', 'Mounted Matchlocks', [33.106, 73.475], 'Qizilbash Horse'], ['azure', 'Irregular Sowars', [33.106, 73.475], 'Durrani Horse'],
      ['azure', 'Dhal & Talwar', [33.08, 73.44], 'Yusufzai Swordsmen'], ['azure', 'Dhal & Talwar', [33.08, 73.44], 'Yusufzai Swordsmen'],
      ['azure', 'Matchlockmen', [33.094, 73.438], 'Yusufzai Jezailchis'], ['azure', 'Matchlockmen', [33.094, 73.438], 'Yusufzai Jezailchis'],
      ['azure', 'Dhal & Talwar', [33.106, 73.44], 'Yusufzai Swordsmen'], ['azure', 'Zamburak', [33.106, 73.44], 'Durrani Zamburaks'],
      ['azure', 'Matchlockmen', [33.07, 73.438], 'Afghan Jezailchis'], ['azure', 'Zamburak', [33.07, 73.438], 'Durrani Zamburaks'],
      ['red', 'Irregular Sowars', [32.955, 73.655], 'The Sardars’ Sowars'], ['red', 'Mounted Matchlocks', [32.955, 73.655], 'Bhangi Sowars'],
      ['red', 'Irregular Sowars', [32.945, 73.685], 'Bhangi Sowars'], ['red', 'Dhal & Talwar', [32.945, 73.685], 'Akali Nihangs'],
      ['red', 'Matchlockmen', [32.965, 73.70], 'Bhangi Musketeers'], ['red', 'Zamburak', [32.965, 73.70], 'Bhangi Zamburaks'],
      ['red', 'Matchlockmen', 'rohtas', 'Rohtas Garrison', 5, { post: true }], ['red', 'Jingal', 'rohtas', 'Rohtas Wall Guns', 5, { post: true }],
      ['red', 'Matchlockmen', 'jhelum', 'Jhelum Post'],
    ],
    reinforcements: [
      { round: 3, side: 'red', at: [32.81, 73.86], name: 'Gujjar Singh’s horse', note: 'came up from Gujrat', history: 'Gujjar Singh Bhangi, who had shared the taking of Rohtas in 1767, held Gujrat across the Jhelum. No source puts him at Rohtas in 1779: in this open campaign the Bhangis have warning, and his horse comes up in time.', units: [['Irregular Sowars', 'Gujjar Singh’s Sowars'], ['Mounted Matchlocks', 'Bhangi Sowars'], ['Zamburak', 'Bhangi Zamburaks']] },
    ],
    powers: [
      { id: 'durrani', name: 'Timur Shah', chief: 'Timur Shah Durrani', seat: 'bakrala', npc: false, side: 'azure', color: '#3f6f8f', note: 'The road from Peshawar over the Bakrala pass', extraSeats: [[33.10, 73.445]] },
      { id: 'misls', name: 'The Bhangis', chief: 'The Bhangi Sardars', seat: 'rohtas', npc: false, side: 'red', color: '#94493a', note: 'The Bhangi country from Rohtas to Gujrat', extraSeats: ['jhelum', 'dina', 'sarai', 'jatlan', [32.85, 73.84]] },
    ],
    labels: [
      { text: 'Jhelum', lat: 32.86, lon: 73.66, cls: 'water', tier: 1, angle: 50 },
      { text: 'Grand Trunk Road', lat: 33.03, lon: 73.50, cls: 'route', tier: 2, angle: -50 },
    ],
  },

  // Nowshera, March 1823, after Prinsep, Origin of the Sikh Power (1834),
  // pp. 136-40, the Umdat-ut-Tawarikh II, pp. 363-68, Cunningham (1849), pp.
  // 163-64, Caroe, The Pathans, pp. 295-97, and Masson, Narrative, III, pp.
  // 56-61. Muhammad Azim Khan came down from Kabul to take Peshawar back from
  // his brother Yar Muhammad, who had paid tribute to Lahore. Ranjit Singh's
  // advance guard took Jahangira; on 13 March the army forded the Indus
  // opposite Hund, the guns on elephants, losing men to the current. Next day
  // the Yusufzai and Khattak ghazis, 4-5,000 by Prinsep's count and 20,000 by
  // Cunningham's, stood on the Teri hill by Pir Sabaq, north of the Kabul
  // river, while Azim Khan's army lay on the south bank and did not cross.
  // Ranjit attacked late in the day on Ventura's advice; the Akalis charged
  // and Phula Singh was killed, the Gorkha battalion stood when the rest
  // broke, and the hill was carried at sunset. That night Azim Khan, fearing
  // for his harem and treasure at Michni, broke up his camp and went back
  // over the passes; Ranjit entered Peshawar on the 17th. A round is a day,
  // from the 13th.
  nowshera: {
    title: 'The Battle of Nowshera',
    year: 1823,
    region: 'Peshawar · Kabul river',
    blurb: 'March 1823. Muhammad Azim Khan, the Barakzai wazir, has come down from Kabul to take Peshawar back for Afghanistan, and the Yusufzai and Khattak tribes have risen at the call to holy war. Ranjit Singh has crossed the Indus with 24,000 of his best troops. The ghazis hold the Teri hill by Pir Sabaq, north of the Kabul river; Azim Khan’s army lies on the south bank by Nowshera.',
    first: 'azure',
    standards: { azure: 'khalsa', red: 'tribal', by: [['Zaman Khan', 'durrani']] },  // battle standards when a unit's name does not say
    vpTarget: Infinity,
    roundLimit: 7,
    clock: { day: 13, month: 'March', from: 6, hours: 24 },
    goal: {
      forts: ['teri', 'nowshera'], need: 1, attacker: 'azure', short: 'Take the Teri hill or Nowshera',
      prize: 'akora', prizeSide: 'red',
      prizeWins: 'Azim Khan has crossed the Kabul river and taken Akora behind the Sikh army. Ranjit’s road back to the Indus is cut, and he must fall back on Attock with Peshawar lost.',
      attackerWins: 'The ghazis are driven from the Teri hill and the Kabul river is in Sikh hands. Azim Khan’s army melts away in the night and goes back over the passes, and Ranjit Singh rides into Peshawar.',
      defenderWins: 'The ghazis still hold the Teri hill when Ranjit must draw back to the Indus. Peshawar stays with the Barakzais.',
    },
    sides: {
      azure: { name: 'Army of Lahore', short: 'Sikhs', adj: 'Sikh', pitch: 'Your army is over the Indus and camped above Jahangira, with Kharak Singh’s and Ventura’s troops coming up the right bank from Attock. The ghazis hold the Teri hill by Pir Sabaq, and Azim Khan’s army lies across the Kabul river from them. Carry the hill or take Nowshera within seven days, and keep Akora behind you.', tag: 'Moves first · take the Teri hill or Nowshera in 7 days' },
      red: { name: 'Azim Khan and the Ghazis', short: 'Afghans', adj: 'Afghan', pitch: 'The Yusufzai and Khattak ghazis hold the Teri hill north of the Kabul river; Azim Khan’s Durranis lie on the south bank by Nowshera. Hold both the hill and Nowshera for seven days, or cross and take Akora behind the Sikhs. Azim Khan will not stay long.', tag: 'Moves second · hold the Teri hill and Nowshera' },
    },
    generals: {
      azure: { name: 'Maharaja Ranjit Singh', title: 'Maharaja of the Punjab', leads: 'Ranjit Singh’s Ghorchara Khas' },
      red: { name: 'Pir Sayyid Akbar Shah', title: 'Leader of the Yusufzai ghazis', leads: 'Yusufzai Ghazis' },
    },
    // The Sikh roads back over the Indus at Hund and Attock; the Afghans' to
    // Peshawar and the Yusufzai country.
    homeBase: { azure: [[34.01, 72.425], [33.89, 72.30]], red: [[34.005, 71.775], [34.12, 71.775], [34.20, 72.03]] },
    walls: { attock: 3, hund: 1, jahangira: 1, akora: 1 },  // Akbar's forts at Attock and Hund; the little forts at Jahangira and Akora
    strongpoints: ['teri', 'nowshera', 'jahangira', 'akora', 'attock'],
    startOwners: { teri: 'red', nowshera: 'red', jahangira: 'azure', akora: 'azure', attock: 'azure' },
    startUnits: [
      // Ranjit Singh's army over the Indus, its camps strung along the Hund
      // road from Tordher back to the ford.
      ['azure', 'Irregular Sowars', [33.985, 72.27], 'Ranjit Singh’s Ghorchara Khas'], ['azure', 'Dhal & Talwar', [34.005, 72.26], 'Phula Singh’s Akali Nihangs'],
      ['azure', 'Khalsa Infantry', [33.97, 72.255], 'Gorkha Battalion'], ['azure', 'Light Field Gun', [33.9909, 72.2879], 'Diwan Chand’s Topkhana'],
      ['azure', 'Khalsa Infantry', [34.02, 72.28], 'Fauj-i-Khas Battalions'], ['azure', 'Zamburak', [34.005, 72.31], 'Zamburkhana'],
      ['azure', 'Irregular Sowars', [34.03, 72.32], 'Ghorcharas'], ['azure', 'Irregular Sowars', [33.9955, 72.359], 'Ghorcharas'],
      ['azure', 'Khalsa Infantry', [33.975, 72.30], 'Fauj-i-Ain Battalions'], ['azure', 'Mounted Matchlocks', [34.0494, 72.3647], 'Ghorcharas'],
      // Kharak Singh, Hari Singh Nalwa and Ventura on the right bank at Attock and Khairabad.
      ['azure', 'Khalsa Infantry', 'khairabad', 'Ventura’s Battalions'], ['azure', 'Light Field Gun', [33.9276, 72.2029], 'Ventura’s Topkhana'],
      ['azure', 'Irregular Sowars', [33.915, 72.19], 'Nalwa’s Sowars'], ['azure', 'Khalsa Infantry', [33.88, 72.235], 'Fauj-i-Ain Battalions'],
      // The posts taken by the advance guard, and the fort over the ford.
      ['azure', 'Matchlockmen', 'jahangira', 'Jahangira Post', 2, { post: true }],
      ['azure', 'Matchlockmen', 'akora', 'Akora Post', 2, { post: true }],
      ['azure', 'Jingal', 'attock', 'Attock Garrison', 3, { post: true }],
      ['azure', 'Matchlockmen', 'hund', 'Hund Post', 2, { post: true }],
      // The ghazis on the Teri hill and in the villages about Pir Sabaq.
      ['red', 'Dhal & Talwar', 'teri', 'Yusufzai Ghazis'], ['red', 'Matchlockmen', 'pirsabaq', 'Yusufzai Jezailchis'],
      ['red', 'Dhal & Talwar', [34.045, 72.03], 'Yusufzai Ghazis'], ['red', 'Matchlockmen', [34.03, 72.0], 'Khattak Jezailchis'],
      ['red', 'Dhal & Talwar', [34.055, 72.005], 'Khattak Ghazis'], ['red', 'Spearmen', 'risalpur', 'Yusufzai Ghazis'],
      ['red', 'Irregular Sowars', [34.06, 72.045], 'Muhammad Zaman Khan’s Horse'], ['red', 'Matchlockmen', [33.9417, 71.973], 'Sadiq Khan’s Khattaks'],
      ['red', 'Matchlockmen', 'nowshera', 'Nowshera Ghazis', 3],
      // Azim Khan's army on the south bank, west of Nowshera.
      ['red', 'Irregular Sowars', [34.005, 71.93], 'Azim Khan’s Durranis'], ['red', 'Irregular Sowars', 'pirpai', 'Durrani Horse'],
      ['red', 'Mounted Matchlocks', [33.9331, 71.8786], 'Qizilbash Horse'], ['red', 'Light Field Gun', [33.995, 71.95], 'Afghan Guns', 3],
      ['red', 'Matchlockmen', [33.985, 71.915], 'Afghan Jezailchis'], ['red', 'Zamburak', [33.99, 71.885], 'Durrani Zamburaks'],
      // The villages of the Yusufzai plain and the Khattak hills, up for the holy war.
      ['red', 'Matchlockmen', [34.1441, 72.095], 'Toru Ghazis', 2, { post: true }],
      ['red', 'Matchlockmen', 'mardan', 'Mardan Ghazis', 2, { post: true }],
      ['red', 'Matchlockmen', 'cherat', 'Cherat Khattaks', 2, { post: true }],
    ],
    events: [
      { title: 'Azim Khan withdraws', history: 'On the night after the battle Azim Khan, told by Yar Muhammad’s letters that the Sikhs meant to seize his harem and treasure at Michni, and distrusting his own brothers, broke up his camp. His army melted away in the dark and he went back over the passes to Jalalabad, where he died within two months.', round: 4, side: 'red', text: 'Azim Khan broke up his camp and went back over the passes', flash: 'AZIM KHAN WITHDRAWS', depart: ['Azim Khan’s Durranis', 'Durrani Horse', 'Qizilbash Horse', 'Afghan Guns', 'Afghan Jezailchis', 'Durrani Zamburaks'] },
    ],
    powers: [
      { id: 'lahore', name: 'Lahore', chief: 'Maharaja Ranjit Singh', seat: 'attock', npc: false, side: 'azure', color: '#3f6f8f', note: 'The Indus crossings, Attock and Khairabad', extraSeats: ['khairabad', 'hund', 'jahangira', 'akora', [33.89, 72.30]] },
      { id: 'yusufzai', name: 'The Yusufzais', chief: 'Pir Sayyid Akbar Shah', seat: 'teri', npc: false, side: 'red', color: '#94493a', note: 'The Yusufzai plain north of the Kabul river', extraSeats: ['nowshera', 'pirsabaq', 'risalpur', 'mardan', [34.12, 72.425], [34.20, 72.03]] },
      { id: 'barakzai', name: 'Peshawar', chief: 'Muhammad Azim Khan', seat: 'pirpai', npc: false, side: 'red', color: '#a5604a', note: 'The Peshawar valley and the Khattak hills', extraSeats: ['pabbi', 'cherat', [34.005, 71.775]] },
    ],
    labels: [
      { text: 'YUSUFZAI', lat: 34.15, lon: 72.12, cls: 'region', tier: 1 },
      { text: 'KHATTAK', lat: 33.82, lon: 72.02, cls: 'region', tier: 1 },
      { text: 'Kabul', lat: 33.995, lon: 72.06, cls: 'water', tier: 1, angle: 5 },
      { text: 'Indus', lat: 33.96, lon: 72.33, cls: 'water', tier: 1, angle: -60 },
    ],
  },

  // Jamrud, April 1837, after the Gazetteer of the Peshawar District (1897-98),
  // ch. II, with the numbers of the Afghan army from Gupta, History of the
  // Sikhs V, and Nalwa, Hari Singh Nalwa (2009). Hari Singh built the fort of
  // Jamrud (Fatehgarh) at the mouth of the Khyber between December 1836 and
  // February 1837. In the spring the best of the Sikh troops were called to
  // Lahore for Kanwar Nau Nihal Singh's wedding, and Dost Muhammad sent his son
  // Muhammad Akbar Khan, with the minister Mirza Sami Khan, Afzal Khan and
  // Shamsuddin Khan, down the Khyber with some 7,000 horse, 2,000 matchlockmen,
  // 9,000 ghazis, eighteen guns and a host of Khyberi tribesmen, while Haji
  // Khan brought levies from Bajaur, Kunar and the Mohmand country into the
  // Doaba against Lehna Singh at Shabqadar. Jamrud, held by Mahan Singh with
  // 600-800 men, was invested on 23 April; on the 29th the Afghan guns laid its
  // walls in ruins, and on the 30th Hari Singh came out from Peshawar, broke the
  // assault and took fourteen guns, until Shamsuddin and Akbar Khan rallied the
  // Afghans and Hari Singh fell charging their right. The Sikhs held the fort,
  // his death was kept secret, and when the reinforcements from Lahore came up
  // the Afghans withdrew by night. Round 1 is 20 April, as the Afghans come down
  // the pass; the relief from Lahore is compressed to arrive in early May.
  jamrud: {
    map: 'jamrud', group: 'jamrud', mode: 'historic',
    title: 'The Battle of Jamrud',
    year: 1837,
    region: 'Peshawar · Khyber',
    blurb: 'April 1837. Hari Singh Nalwa has built a fort at Jamrud, at the very mouth of the Khyber, and the best of the Sikh army has gone to Lahore for Nau Nihal Singh’s wedding. Now Dost Muhammad’s son Akbar Khan is coming down the pass with the Afghan army and its guns, the Afridis rising in the hills on either side, and Haji Khan’s Mohmand levies are descending on Shabqadar. Mahan Singh holds Jamrud with a few hundred men; Hari Singh is at Peshawar with what the wedding left him; the Lahore army is days away.',
    first: 'red',
    standards: { azure: 'khalsa', red: 'durrani' },  // battle standards when a unit's name does not say
    vpTarget: Infinity,
    roundLimit: 14,
    goal: {
      forts: ['jamrud', 'balahisar'], need: 1, attacker: 'red', short: 'Take Jamrud or Peshawar',
      attackerWins: 'The Sikh post at the mouth of the Khyber is gone, and Dost Muhammad can treat for Peshawar from strength.',
      defenderWins: 'Jamrud and Peshawar still hold for the Khalsa. As the army from Lahore comes up, the Afghans withdraw by night through the Khyber, and the frontier stays at the mouth of the pass.',
    },
    sides: {
      azure: { name: 'Khalsa Army', short: 'Khalsa', adj: 'Sikh', pitch: 'The Lahore army is away. Mahan Singh holds the new fort at Jamrud with a few hundred men, Lehna Singh holds Shabqadar, and Hari Singh has what is left at Peshawar. Keep Jamrud and the Bala Hisar until the army from Lahore comes up on day 11.', tag: 'Moves second · hold for 14 days' },
      red: { name: 'Afghan Army', short: 'Afghan', adj: 'Afghan', pitch: 'Akbar Khan’s horse, guns and ghazis come down the Khyber, the Afridis rise in the hills, and Haji Khan’s levies descend on the Doaba. Take Jamrud before the Lahore army can come up, or Peshawar itself.', tag: 'Moves first · take Jamrud or Peshawar' },
    },
    generals: {
      azure: { name: 'Sardar Hari Singh Nalwa', title: 'Governor of Peshawar, commander-in-chief on the frontier', leads: 'Hari Singh’s Battalions' },
      red: { name: 'Sardar Muhammad Akbar Khan', title: 'Son of Amir Dost Muhammad Khan', leads: 'Akbar Khan’s Horse' },
    },
    // The Afghans' road back up the Khyber and over the Mohmand hills; the Sikhs' to Attock.
    homeBase: { azure: [34.005, 71.83], red: [[34.035, 71.235], [34.31, 71.45]] },
    walls: { jamrud: 5, balahisar: 3 },  // Jamrud's walls ten feet thick round a citadel mound; the Sikh fort on the Bala Hisar
    strongpoints: ['jamrud', 'balahisar', 'peshawar', 'shabqadar'],
    startOwners: { jamrud: 'azure', balahisar: 'azure', peshawar: 'azure', shabqadar: 'azure' },
    startUnits: [
      // Mahan Singh's garrison in the new fort.
      ['azure', 'Khalsa Infantry', 'jamrud', 'Mahan Singh’s Garrison'], ['azure', 'Jingal', 'jamrud', 'Jamrud Wall Guns'],
      // Hari Singh at Peshawar with what the wedding left him.
      ['azure', 'Khalsa Infantry', 'balahisar', 'Hari Singh’s Battalions'], ['azure', 'Light Field Gun', 'balahisar', 'Bala Hisar Guns'],
      ['azure', 'Matchlockmen', 'peshawar', 'Peshawar Guard'], ['azure', 'Khalsa Infantry', 'peshawar', 'City Battalion'],
      ['azure', 'Khalsa Infantry', [34.000, 71.548], 'Khalsa Battalions'], ['azure', 'Khalsa Infantry', [34.000, 71.548], 'Khalsa Battalions'],
      ['azure', 'Irregular Sowars', [34.018, 71.540], 'Ghorcharas'], ['azure', 'Light Dragoons', [34.018, 71.540], 'Ghorchara Khas'],
      ['azure', 'Light Field Gun', [33.995, 71.565], 'Khalsa Topkhana'], ['azure', 'Zamburak', [33.995, 71.565], 'Zamburkhana'],
      // Lehna Singh at Shabqadar.
      ['azure', 'Khalsa Infantry', 'shabqadar', 'Lehna Singh’s Garrison'], ['azure', 'Jingal', 'shabqadar', 'Shabqadar Wall Guns'],
      // Akbar Khan's army coming down the Khyber past Ali Masjid.
      ['red', 'Irregular Sowars', [34.034, 71.268], 'Akbar Khan’s Horse'], ['red', 'Irregular Sowars', [34.034, 71.268], 'Durrani Horse'],
      ['red', 'Irregular Sowars', [34.041, 71.244], 'Qizilbash Horse'], ['red', 'Irregular Sowars', [34.041, 71.244], 'Durrani Horse'],
      ['red', 'Irregular Sowars', [34.045, 71.253], 'Shamsuddin Khan’s Horse'], ['red', 'Light Field Gun', [34.028, 71.255], 'Afghan Topkhana'],
      ['red', 'Light Field Gun', [34.020, 71.268], 'Afghan Topkhana'], ['red', 'Light Field Gun', [34.020, 71.268], 'Afghan Topkhana'],
      ['red', 'Matchlockmen', [34.022, 71.3], 'Afzal Khan’s Jezailchis'], ['red', 'Matchlockmen', [34.022, 71.3], 'Jezailchis'],
      ['red', 'Dhal & Talwar', [34.032, 71.310], 'Ghazis'], ['red', 'Dhal & Talwar', [34.032, 71.310], 'Ghazis'],
      ['red', 'Dhal & Talwar', [34.035, 71.275], 'Ghazis'], ['red', 'Zamburak', [34.035, 71.275], 'Afghan Zamburaks'],
      // The Afridis rising in the hills on either side of the mouth of the pass.
      ['red', 'Matchlockmen', [33.975, 71.335], 'Afridi Lashkar'], ['red', 'Matchlockmen', [34.060, 71.330], 'Afridi Lashkar'],
      // Haji Khan's levies coming down from the Mohmand hills.
      ['red', 'Matchlockmen', [34.300, 71.460], 'Bajauri Levies'], ['red', 'Matchlockmen', [34.295, 71.430], 'Mohmand Levies'],
      ['red', 'Irregular Sowars', [34.305, 71.445], 'Haji Khan’s Horse'],
    ],
    reinforcements: [
      { round: 11, side: 'azure', at: [34.005, 71.82], name: 'The army from Lahore', note: 'came up the Attock road by forced marches', history: 'The best of the Sikh troops had gone to Lahore for Kanwar Nau Nihal Singh’s wedding. When word of the siege came they marched back up the Attock road by forced marches, and when they came up the Afghans withdrew by night.', units: [['Khalsa Infantry', 'Fauj-i-Khas'], ['Khalsa Infantry', 'Fauj-i-Khas'], ['Khalsa Infantry', 'Khalsa Battalions'], ['Light Dragoons', 'Ghorchara Khas'], ['Irregular Sowars', 'Ghorcharas'], ['Light Field Gun', 'Topkhana-i-Khas']] },
    ],
    powers: [
      { id: 'khalsa', name: 'Sikh Peshawar', chief: 'Sardar Hari Singh Nalwa', seat: 'balahisar', npc: false, side: 'azure', color: '#3f6f8f', note: 'The Peshawar valley under Sikh rule', extraSeats: ['peshawar', 'jamrud', 'shabqadar'] },
      { id: 'kabul', name: 'Kabul', chief: 'Amir Dost Muhammad Khan', seat: [34.030, 71.240], npc: false, side: 'red', color: '#94493a', note: 'The Khyber and the hills beyond', extraSeats: [[34.30, 71.45]] },
    ],
    labels: [
      { text: 'KHYBER', lat: 33.99, lon: 71.27, cls: 'region', tier: 1 },
      { text: 'DOABA', lat: 34.17, lon: 71.62, cls: 'region', tier: 1 },
      { text: 'Kabul River', lat: 34.12, lon: 71.66, cls: 'water', tier: 1, angle: 10 },
    ],
  },

  // Jhelum, 7 July 1857, after Cave-Browne, The Punjab and Delhi in 1857
  // (1861), vol. II, pp. 48-58, with his sketch of the cantonment. To stop
  // the 14th Native Infantry carrying the mutiny into the Punjab, Sir John
  // Lawrence had it disarmed at Jhelum on the same morning the 58th were
  // disarmed at Rawalpindi. Lt-Col. Ellice marched from Pindi with three
  // companies of HM 24th (260), three horse-artillery guns under Captain
  // Cookes and 150 of Miller's Police Battalion, and Lind's Mooltanee levies
  // (some 460 horse and 250 foot, raw recruits with matchlocks) joined him;
  // at Dina half the Mooltanee horse were sent across the river to hold the
  // far bank. At dawn the guns and the rest of the horse took post between the
  // lines and the town, the 24th came down off the high ground, and the 14th
  // (some 500, once its hundred Sikhs had stepped out) loaded and fell back on
  // its loopholed lines and quarter-guard. The Mooltanee charge was shot to
  // pieces; about eleven the 24th carried the quarter-guard, Ellice falling
  // badly wounded; a shell blew up the 39th's magazine; and some 300 got away
  // to the village of Samlee, which held all afternoon against the guns. In
  // the night they slipped away. The bridge of boats was held by Punjab
  // police, the ferry-boats had long been taken up, and of those who reached
  // the Mangla ford and Kashmir most were given up by the Maharaja's people.
  // The rounds are three-hour watches from five in the morning on the 7th;
  // a formation here is 250 men, so a figure is 50.
  jhelum1857: {
    map: 'jhelum1857', group: 'jhelum1857', mode: 'historic',
    title: 'The Rising at Jhelum',
    year: 1857,
    region: 'Jhelum · Mangla',
    blurb: 'July 1857. Delhi has fallen to the mutineers, and in the Punjab the Company is disarming every Hindustani regiment it does not trust. At dawn on the 7th a column from Rawalpindi, HM 24th, three horse-artillery guns, police and raw Mooltanee levies, closes on the cantonment at Jhelum to take the arms of the 14th Native Infantry. The 14th will not give them up. Their only way out is across the river into the Maharaja of Kashmir’s country, and the bridge of boats is already in the hands of the police.',
    first: 'red',
    standards: { azure: 'rebel', red: 'punjab' },  // battle standards when a unit's name does not say
    vpTarget: Infinity,
    roundLimit: 14,
    menPerFormation: 250,
    clock: { day: 7, month: 'July', from: 5, hours: 3 },
    goal: {
      escape: { side: 'azure', power: 'kashmir', need: 4 }, attacker: 'azure', forts: [], short: 'Get 200 men into Kashmir',
      escapeWins: 'Two hundred of the regiment are over the river and into the Maharaja’s hills, arms in hand. The news runs down the Grand Trunk Road ahead of the dak, and Sialkot rises within the day.',
      attackerWins: '', defenderWins: 'The 14th Native Infantry is destroyed as a regiment. The handful who got away are taken by the villagers or given up by the Kashmir authorities, and the rising does not spread beyond the Jhelum.',
    },
    sides: {
      azure: { name: '14th Native Infantry', short: '14th N.I.', adj: 'sepoy', pitch: 'Some five hundred of the 14th, armed, in their own lines with the quarter-guard and loopholed huts round you. The bridge of boats is held against you and the boats are taken up. Get 200 men across into Kashmir by the Mangla ford, or by boats you seize, before the evening of the 8th.', tag: 'Moves second · reach Kashmir with 200 men' },
      red: { name: 'Rawalpindi Column', short: 'Column', adj: 'Company', pitch: 'HM 24th, Cookes’s guns, Miller’s police and Lind’s Mooltanee horse and foot are closing on the cantonment at first light, with half the Mooltanee horse across the river. The 14th must not get away: keep them from the Mangla ford and the far bank until they are destroyed.', tag: 'Moves first · let fewer than 200 escape' },
    },
    generals: {
      azure: { name: 'Mirza Dildar Baig', title: 'Leader of the mutineers of the 14th', leads: '14th N.I., Right Wing' },
      red: { name: 'Lt-Col. Charles Ellice', title: 'Commanding the column, HM 24th Foot', leads: 'HM 24th Foot' },
    },
    // The column's road back to Rawalpindi; the 14th has nowhere to fall back on.
    homeBase: { red: [33.095, 73.535], azure: null },
    walls: { lines14: 1, samlee: 1 },  // the battlemented quarter-guard and loopholed huts; Samlee's mud walls and houses
    strongpoints: ['jhelum', 'lines14', 'lines39', 'samlee', 'dina'],
    startOwners: { jhelum: 'red', lines14: 'azure', dina: 'red' },
    startUnits: [
      // The 14th in its lines, its Sikhs gone over.
      ['azure', 'Line Infantry', 'lines14', '14th N.I., Right Wing'], ['azure', 'Line Infantry', 'lines14', '14th N.I., Left Wing'],
      // The 24th and the police coming down off the high ground by the fakir's takia,
      // far enough out that the 14th has a move before the first shot.
      ['red', 'Line Infantry', [32.98, 73.704], 'HM 24th Foot'], ['red', 'Matchlockmen', [32.98, 73.704], 'Miller’s Police Battalion', 3],
      ['red', 'Matchlockmen', [32.98, 73.713], 'Mooltanee Foot'], ['red', 'Sepoy Infantry', [32.98, 73.713], 'Sikh Company of the 14th', 2],
      // The guns and half the Mooltanee horse coming up behind them.
      ['red', 'Horse Artillery', [32.996, 73.727], 'Cookes’s Horse Artillery', 4], ['red', 'Irregular Sowars', [32.973, 73.634], 'Lind’s Mooltanee Horse'],
      // The bridge held by police since first light; the other half of the horse across the river.
      ['red', 'Matchlockmen', 'jhelum', 'Punjab Police', 2, { post: true }], ['red', 'Irregular Sowars', 'jhelum', 'Mounted Police', 1, { post: true }],
      ['red', 'Irregular Sowars', [32.937, 73.751], 'Mooltanee Horse, far bank', 4, { post: true }],
      ['red', 'Matchlockmen', 'dina', 'Dina Thana', 1, { post: true }],
      // The Maharaja's post at the Kashmir end of the Mangla ford, which gave up those who came through.
      ['red', 'Matchlockmen', [33.101, 73.673], 'Gulab Singh’s Post at the Ford', 2, { post: true }],
    ],
    events: [
      { title: 'The magazine blows up', history: 'In the fighting for the lines on the morning of 7 July a shell blew up the magazine of the 39th, while the 14th held its quarter-guard and loopholed huts against HM 24th.', round: 3, side: 'red', text: 'A shell blows up the regimental magazine in the lines of the 39th', flash: 'THE MAGAZINE BLOWS UP', hurt: { at: 'lines39', hp: 1 } },
    ],
    powers: [
      { id: 'jhelum', name: 'Jhelum District', chief: 'Major Clement Browne, Deputy Commissioner', seat: 'jhelum', npc: false, side: 'red', color: '#94493a', note: 'The Company’s district on the right bank', extraSeats: ['dina', 'rohtas', 'mangla', 'kalagujran'] },
      { id: 'gujrat', name: 'Gujrat District', chief: 'The Company', seat: 'sarai', npc: false, side: 'red', color: '#8a5a44', note: 'The left bank below the Kashmir frontier', extraSeats: [[32.975, 73.805]] },
      { id: 'kashmir', name: 'Kashmir', chief: 'Maharaja Gulab Singh', seat: 'manglafort', npc: false, side: null, color: '#3f7b4c', note: 'The Maharaja’s country above the Mangla ford: the 14th’s refuge', extraSeats: ['khari', 'kotkandhari'] },
    ],
    labels: [
      { text: 'CANTONMENT', lat: 32.913, lon: 73.718, cls: 'region', tier: 2 },
      { text: 'KASHMIR', lat: 33.07, lon: 73.75, cls: 'region', tier: 1 },
      { text: 'Jhelum', lat: 32.905, lon: 73.722, cls: 'water', tier: 1, angle: 50 },
    ],
  },

  // The same rising from the evening before: Ellice's column has halted at
  // Dina and opened its sealed orders, Lind's horse are riding through the
  // cantonment for the river, and the 14th, still armed, has heard enough to
  // be wary. Round 1 is 5 p.m. on 6 July.
  jhelum1857o: {
    map: 'jhelum1857', group: 'jhelum1857', mode: 'open',
    title: 'The Rising at Jhelum',
    year: 1857,
    region: 'Jhelum · Mangla',
    blurb: 'Evening, 6 July 1857. Colonel Ellice’s column has halted at Dina, a march short of Jhelum, and opened its sealed orders: the 14th Native Infantry is to be disarmed in the morning. Half the Mooltanee horse are riding on through the cantonment to cross the river. The 14th, still armed in its lines, has heard enough to be wary. Strike first, or slip away before the column comes up.',
    first: 'red',
    standards: { azure: 'rebel', red: 'punjab' },  // battle standards when a unit's name does not say
    vpTarget: Infinity,
    roundLimit: 16,
    menPerFormation: 250,
    clock: { day: 6, month: 'July', from: 17, hours: 3 },
    goal: {
      escape: { side: 'azure', power: 'kashmir', need: 5 }, attacker: 'azure', forts: [], short: 'Get 250 men into Kashmir',
      escapeWins: 'Half the regiment is over the river and into the Maharaja’s hills, arms in hand. The news runs down the Grand Trunk Road ahead of the dak, and Sialkot rises within the day.',
      attackerWins: '', defenderWins: 'The 14th Native Infantry is destroyed as a regiment. The handful who got away are taken by the villagers or given up by the Kashmir authorities, and the rising does not spread beyond the Jhelum.',
    },
    sides: {
      azure: { name: '14th Native Infantry', short: '14th N.I.', adj: 'sepoy', pitch: 'The whole regiment, some 600, is armed in its lines, and the column is a march away at Dina. Take the bridge of boats, seize boats, or march for the Mangla ford: get 250 men into Kashmir by the afternoon of the 8th.', tag: 'Moves second · reach Kashmir with 250 men' },
      red: { name: 'Rawalpindi Column', short: 'Column', adj: 'Company', pitch: 'The column lies at Dina with its sealed orders open; half the Mooltanee horse are already on the road through the cantonment for the river. Close the crossings and the Mangla ford, then bring the 14th to bay.', tag: 'Moves first · let fewer than 250 escape' },
    },
    generals: {
      azure: { name: 'Mirza Dildar Baig', title: 'Leader of the mutineers of the 14th', leads: '14th N.I., Right Wing' },
      red: { name: 'Lt-Col. Charles Ellice', title: 'Commanding the column, HM 24th Foot', leads: 'HM 24th Foot' },
    },
    homeBase: { red: [33.095, 73.535], azure: null },
    walls: { lines14: 1, samlee: 1 },
    strongpoints: ['jhelum', 'lines14', 'lines39', 'samlee', 'dina'],
    startOwners: { jhelum: 'red', lines14: 'azure', lines39: 'azure', dina: 'red' },
    startUnits: [
      ['azure', 'Line Infantry', 'lines14', '14th N.I., Right Wing'], ['azure', 'Line Infantry', 'lines14', '14th N.I., Left Wing'],
      ['azure', 'Sepoy Infantry', 'lines39', '14th N.I., Sikh Company', 2],
      // The column at Dina.
      ['red', 'Line Infantry', 'dina', 'HM 24th Foot'], ['red', 'Horse Artillery', 'dina', 'Cookes’s Horse Artillery', 4],
      ['red', 'Matchlockmen', [33.022, 73.612], 'Miller’s Police Battalion', 3], ['red', 'Matchlockmen', [33.022, 73.612], 'Mooltanee Foot'],
      ['red', 'Irregular Sowars', [33.032, 73.625], 'Lind’s Mooltanee Horse'],
      // Half the horse on the road through the cantonment for the river.
      ['red', 'Irregular Sowars', [32.973, 73.634], 'Mooltanee Horse, advance', 4],
      ['red', 'Matchlockmen', 'jhelum', 'Punjab Police', 2, { post: true }], ['red', 'Irregular Sowars', 'jhelum', 'Mounted Police', 1, { post: true }],
      ['red', 'Matchlockmen', [33.101, 73.673], 'Gulab Singh’s Post at the Ford', 2, { post: true }],
    ],
    reinforcements: [
      { round: 11, side: 'red', at: [33.095, 73.535], name: 'Colonel Browne with the 24th', note: 'came down the road from Rawalpindi by forced marches', history: 'The rest of HM 24th Foot lay at Rawalpindi, where the 58th Native Infantry were disarmed the same morning. In this open campaign a second detachment is sent down the Grand Trunk Road after Ellice.', units: [['Line Infantry', 'HM 24th, second detachment', 4]] },
    ],
    powers: [
      { id: 'jhelum', name: 'Jhelum District', chief: 'Major Clement Browne, Deputy Commissioner', seat: 'jhelum', npc: false, side: 'red', color: '#94493a', note: 'The Company’s district on the right bank', extraSeats: ['dina', 'rohtas', 'mangla', 'kalagujran'] },
      { id: 'gujrat', name: 'Gujrat District', chief: 'The Company', seat: 'sarai', npc: false, side: 'red', color: '#8a5a44', note: 'The left bank below the Kashmir frontier', extraSeats: [[32.975, 73.805]] },
      { id: 'kashmir', name: 'Kashmir', chief: 'Maharaja Gulab Singh', seat: 'manglafort', npc: false, side: null, color: '#3f7b4c', note: 'The Maharaja’s country above the Mangla ford: the 14th’s refuge', extraSeats: ['khari', 'kotkandhari'] },
    ],
    labels: [
      { text: 'CANTONMENT', lat: 32.913, lon: 73.718, cls: 'region', tier: 2 },
      { text: 'KASHMIR', lat: 33.07, lon: 73.75, cls: 'region', tier: 1 },
      { text: 'Jhelum', lat: 32.905, lon: 73.722, cls: 'water', tier: 1, angle: 50 },
    ],
  },

  // The Gogera rising, 17–30 September 1857, after the reports in the Punjab
  // Mutiny Reports, vol. VIII, part II: Elphinstone's narrative of the Gugera
  // district and Hamilton's of the Multan division. On the night of the 16th
  // the chiefs of the Ravi clans slipped away from the station to rise in
  // their villages; at dawn Ahmad Khan Kharral, across the river at Jhamra,
  // told Berkeley he was the King of Delhi's man. The Lahore–Multan road, the
  // Punjab's only line to Bombay, was cut for eight days. Lahore sent the 1st
  // Sikh Cavalry and Paton's column (three horse-artillery guns, a company of
  // HM 81st, one of Subhan Khan's regiment, mounted police); Multan sent
  // Chamberlain with 180 sowars of the 1st Irregular Cavalry, who was besieged
  // in the serai at Chichawatni. Ahmad Khan fell at Gishkori on the 21st;
  // Berkeley was killed by the Fatianas near Kaure Shah the next day; the
  // rebels fell back on the Jalli jungle. A round is a day; a formation here is
  // 250 men, so a figure is 50.
  gogera: {
    title: 'The Rising at Gogera',
    year: 1857,
    region: 'Ravi · Gogera',
    blurb: 'September 1857. The Company’s army is before Delhi and the Punjab has been stripped of troops to feed the siege. On the night of the 16th the chiefs of the Ravi clans slip away from Gogera to rise in their villages, and at dawn Rai Ahmad Khan Kharral, across the river at Jhamra, declares for the King of Delhi. The Lahore–Multan road, the Punjab’s only line to Bombay, runs through the district, held by a few police posts and a levy of raw recruits.',
    first: 'azure',
    standards: { azure: 'kharal', red: 'punjab' },  // battle standards when a unit's name does not say
    vpTarget: Infinity,
    roundLimit: 14,
    menPerFormation: 250,
    clock: { day: 17, month: 'September', from: 6, hours: 24 },
    goal: {
      // The Company must have every post on the road back when the days run
      // out; the clans win at once if they hold Gogera at the end of a day.
      forts: ['gogera', 'kaureshah', 'harappa', 'chichawatni'], attacker: 'red', atEnd: true,
      prize: 'gogera', prizeSide: 'azure', short: 'Hold the four posts on the Multan road',
      prizeWins: 'Gogera has fallen: the treasury, the jail and the district records are in the hands of the clans. With the station gone the whole country from Lahore to Tulumba is up, and the Company must reconquer the Ravi from outside.',
      attackerWins: 'The posts on the Multan road are all in the Company’s hands again and the dak runs. The clans have fallen back into the jungle at Jalli; there will be weeks more of burning villages before the Ravi is quiet.',
      defenderWins: 'At the end of September the clans still hold the Multan road. Lahore has no word from Bombay but by camel round through Bahawalpur, and the rising has outlasted the fall of Delhi.',
    },
    sides: {
      azure: { name: 'The Ravi Clans', short: 'Clans', adj: 'Kharral', pitch: 'Ahmad Khan Kharral’s horsemen and matchlocks at Jhamra across the river, and Mohmand Kathia’s men out on the Multan road. Raise the Wattus at Gishkori, the Fatianas at Jalli and the Mardanas at Mohammadpur by riding to them. Take Gogera before the columns come from Lahore, or hold a post on the road until the end of the month.', tag: 'Moves first · take Gogera, or hold a road post on 30 September' },
      red: { name: 'Gugera District', short: 'Company', adj: 'Company', pitch: 'Lieutenant Elphinstone has a levy of raw recruits, a few police and Berkeley’s handful of horse to hold the station. The 1st Sikh Cavalry and Paton’s column come from Lahore on the 19th and 20th, Chamberlain’s sowars from Multan on the 19th and 20th, Hawes from Jhang on the 26th, and more from Lahore and Multan on the 28th. Hold Gogera, and hold every post on the Multan road at the end of the month.', tag: 'Moves second · hold Gogera and all four road posts' },
    },
    generals: {
      azure: { name: 'Rai Ahmad Khan Kharral', title: 'Chief of the Kharrals of Jhamra', leads: 'Ahmad Khan’s Horse' },
      red: { name: 'Lieutenant N. W. Elphinstone', title: 'Officiating Deputy Commissioner, Gugera', leads: 'Gugera Levy' },
    },
    // The Company's roads in from Lahore and Multan; the clans' refuge is the
    // open Sandal Bar behind Jhamra.
    homeBase: { red: [[30.945, 73.455], [30.52, 72.545]], azure: [31.15, 73.12] },
    // No great walls: Elphinstone's defence was the tahsil and the serai it
    // commands, improvised in a night, which is a kacha fort to dig. Unlike
    // walls it does not cover the garrison's flanks, so the clans' numbers count.
    // The clans' villages are not posts to hold: they are won by riding to them.
    strongpoints: ['gogera', 'kaureshah', 'harappa', 'chichawatni', 'kamalia'],
    startOwners: { gogera: 'red', kaureshah: 'red', harappa: 'red', chichawatni: 'red', kamalia: 'red' },
    startUnits: [
      // Ahmad Khan back across the river at Jhamra with the Kharrals.
      ['azure', 'Irregular Sowars', [31.069, 73.281], 'Ahmad Khan’s Horse', 4], ['azure', 'Matchlockmen', [31.055, 73.308], 'Kharral Matchlocks'],
      // The Kathias, who stopped and robbed the mail cart on the Multan road.
      ['azure', 'Mounted Matchlocks', [30.575, 72.78], 'Mohmand Kathia’s Horse', 4], ['azure', 'Matchlockmen', [30.555, 72.80], 'Kathia Matchlocks', 4],
      // The Wattus gathering near Akbar to plunder it, a march from their
      // villages in the Gishkori jungle.
      ['azure', 'Matchlockmen', [30.906, 73.263], 'Bahlak Wattu’s Band', 3],
      // The station: the new levy, a party of the Kuttar Mukhi battalion and
      // police, and Berkeley's horsemen at the ferry where Ahmad Khan crossed.
      ['red', 'Matchlockmen', 'gogera', 'Gugera Levy', 4], ['red', 'Sepoy Infantry', 'gogera', 'Kuttar Mukhi Battalion', 2],
      ['red', 'Irregular Sowars', 'gogerakhas', 'Berkeley’s Horse', 1],
      ['red', 'Matchlockmen', 'harappa', 'Harappa Tahsil', 1, { post: true }],
      // Sarfraz Khan Kharral of Kamalia, who brought the warning, and the
      // fifteen horsemen sent back with him to the thana.
      ['red', 'Matchlockmen', 'kamalia', 'Kamalia Thana', 1, { post: true }], ['red', 'Irregular Sowars', 'kamalia', 'Sarfraz Khan’s Horse', 1],
    ],
    reinforcements: [
      { round: 3, side: 'red', at: [30.945, 73.455], name: 'The 1st Sikh Cavalry', note: 'rode in from Lahore under Lieutenant Chichester, through rain falling in torrents', history: 'Two hundred sowars of the 1st Sikh Cavalry, raised at Lahore that summer for service in Hindustan, were sent the 75 miles to Gogera as soon as the express came in. They rode in on the 19th through torrential rain, the horses too tired to move again that day.', units: [['Irregular Sowars', '1st Sikh Cavalry', 4]] },
      { round: 3, side: 'red', at: [30.52, 72.545], name: 'Captain Fraser', note: 'came up the Multan road by Tulumba with 80 sowars of the 1st Irregular Cavalry', history: 'At the Commissioner’s call the brigadier at Multan sent Captain Fraser with 80 sowars of the 1st Irregular Cavalry, the old Skinner’s Horse, up the road by Tulumba on the 17th.', units: [['Irregular Sowars', '1st Irregular Cavalry, Fraser’s Troop', 2]] },
      { round: 4, side: 'red', at: [30.95, 73.39], name: 'Colonel Paton’s column', note: 'marched in from Lahore, a few miles out on the morning of the 20th', history: 'Lieutenant-Colonel Paton followed the Sikh cavalry from Lahore with three horse-artillery guns, a company of HM 81st carried in native carriages, a company of Subhan Khan’s regiment and mounted police. He reached Gogera at eight on the 20th, as the clans came on through the jowar fields, and his guns drove them off with grape.', units: [['Horse Artillery', 'Paton’s Guns', 3], ['Line Infantry', 'HM 81st, one company', 2], ['Sepoy Infantry', 'Subhan Khan’s Regiment', 2], ['Irregular Sowars', 'Lahore Mounted Police', 1]] },
      { round: 4, side: 'red', at: [30.52, 72.545], name: 'Major Chamberlain', note: 'followed with a hundred more of the 1st Irregular Cavalry', history: 'Major Crawford Chamberlain followed Fraser on the 18th with a hundred more of the 1st Irregular Cavalry. The clans shut him up in the serai at Chichawatni, where he held out until Paton’s column relieved him.', units: [['Irregular Sowars', '1st Irregular Cavalry', 2]] },
      { round: 10, side: 'red', at: [31.05, 72.545], name: 'Captain Hawes', note: 'advanced from Jhang on Kamalia with a wing of the 2nd Irregular Cavalry and levies from Gujranwala', history: 'Captain Hawes, officiating Deputy Commissioner of Jhang, was told to advance on Kamalia with the best force he could muster, a wing of the 2nd Irregular Cavalry and levies from Gujranwala, to shut the clans into their own country.', units: [['Irregular Sowars', '2nd Irregular Cavalry, wing', 4], ['Matchlockmen', 'Gujranwala Levies', 3]] },
      { round: 12, side: 'red', at: [30.52, 72.545], name: 'Captain Dennis', note: 'came up from Multan with two guns manned by European volunteers', history: 'On Chamberlain’s news the brigadier at Multan sent two guns manned by European volunteers, 250 infantry of the 11th Punjab Infantry and 3rd Police Battalion, and a hundred sowars under Captain Dennis. They reached Chichawatni on the 28th.', units: [['Light Field Gun', 'Volunteer Battery', 2], ['Sepoy Infantry', '11th Punjab Infantry and Police', 5], ['Irregular Sowars', '1st Irregular Cavalry, Dennis’s Troop', 2]] },
      { round: 12, side: 'red', at: [30.945, 73.455], name: 'Captains Snow and McAndrew', note: 'came down from Lahore, skirmishing with the Mardanas on the way', history: 'A detachment from Lahore under Captains Snow and McAndrew ran into the Mardanas near Mohammadpur in the night, skirmished, and reached Chichawatni on the 28th.', units: [['Sepoy Infantry', 'Punjab Infantry', 4], ['Irregular Sowars', 'Lahore Light Horse', 2]] },
    ],
    // The clans that rose with Ahmad Khan once he came among them; whoever
    // holds a clan's village takes its levies.
    powers: [
      { id: 'kharral', name: 'The Kharrals of Jhamra', chief: 'Rai Ahmad Khan Kharral', seat: 'jhamra', npc: false, side: 'azure', color: '#3f6f8f', note: 'Ahmad Khan’s country across the Ravi, and the open bar behind it', extraSeats: ['tandlianwala', [31.15, 73.12]] },
      { id: 'gugera', name: 'Gugera District', chief: 'Lieutenant Elphinstone', seat: 'gogera', npc: false, side: 'red', color: '#94493a', note: 'The station and the posts on the Multan road', extraSeats: ['akbar', 'kaureshah', 'harappa', 'chichawatni', [30.945, 73.455], [30.52, 72.545]] },
      { id: 'kamalia', name: 'Kamalia', chief: 'Sarfraz Khan Kharral', seat: 'kamalia', npc: false, side: 'red', color: '#8a5a44', note: 'The Kharral chief who warned the Company, and his walled town' },
      { id: 'wattu', name: 'The Wattus', chief: 'Malik Bahlak Wattu', seat: 'gishkori', npc: true, side: null, color: '#3f7b4c', note: 'The Wattu villages in the jungle below Gogera', levy: { variant: 'Matchlockmen', name: 'Wattu Matchlocks' }, history: 'The Wattus of the Ravi rose with Ahmad Khan. Malik Bahlak Wattu of Khudiya gathered them at Nooray di Dal near Gishkori, the jungle where Ahmad Khan fell on the 21st.' },
      { id: 'fatiana', name: 'The Fatianas', chief: 'Mehr Bahawal Fatiana', seat: 'jalli', npc: true, side: null, color: '#5c7a3a', note: 'The Fatianas and Tarhanas of the Jalli jungle', levy: { variant: 'Irregular Sowars', name: 'Fatiana Horse' }, history: 'Mehr Bahawal Fatiana, the bravest and most influential of the chiefs in Cave-Browne’s account, led the Fatianas, Tarhanas and Mardanas who killed Berkeley near Kaure Shah on the 22nd. Murad Fatiana struck the first blow.' },
      { id: 'mardana', name: 'The Mardanas', chief: 'Walidad Mardana', seat: 'mohammadpur', npc: true, side: null, color: '#6f6a3a', note: 'The Mardana villages on the Multan road', levy: { variant: 'Spearmen', name: 'Mardana Spearmen' }, history: 'Walidad Mardana’s men intercepted Elphinstone’s expresses near Mohammadpur and took the Harappa tahsil, and with the Fatianas held the Lahore–Multan road for eight days.' },
    ],
    // The bar was open grazing and thorn scrub, the Ravi lined with tall
    // grass and tamarisk jungle; the canal colonies have since ploughed both.
    jungle: [
      // The bela along the river, every 4.5 km of its course.
      ...[[31.116, 73.491], [31.099, 73.454], [31.08, 73.437], [31.058, 73.394], [31.038, 73.355], [31.019, 73.309], [30.992, 73.27], [30.977, 73.244],
        [30.94, 73.232], [30.902, 73.236], [30.886, 73.198], [30.895, 73.156], [30.868, 73.137], [30.861, 73.108], [30.841, 73.077], [30.807, 73.073],
        [30.793, 73.031], [30.769, 72.995], [30.757, 72.946], [30.743, 72.907], [30.713, 72.874], [30.724, 72.829], [30.708, 72.799], [30.701, 72.763],
        [30.67, 72.762], [30.642, 72.734], [30.601, 72.728], [30.576, 72.68], [30.57, 72.633], [30.572, 72.581], [30.603, 72.561], [30.609, 72.53]]
        .map(([lat, lon]) => ({ lat, lon, radiusKm: 3, tree: 0.72, shrub: 0.5 })),
      // The jungles at Gishkori and Jalli, and the swamps by Kaure Shah.
      { lat: 30.872, lon: 73.318, radiusKm: 3.5, tree: 0.8, shrub: 0.6 },
      { lat: 30.785, lon: 72.955, radiusKm: 4.5, tree: 0.8, shrub: 0.6 },
      { lat: 30.805, lon: 73.095, radiusKm: 2.5, tree: 0.7, shrub: 0.6 },
      // Thorn scrub and grazing over the whole of both bars: fields only round
      // the wells and villages, which the satellite record still shows.
      ...[30.44, 30.62, 30.80, 30.98, 31.16].flatMap(lat => [72.58, 72.78, 72.98, 73.18, 73.38].map(lon => ({ lat, lon, radiusKm: 15, tree: 0.12, shrub: 0.32 }))),
    ],
    labels: [
      { text: 'SANDAL BAR', lat: 31.10, lon: 72.85, cls: 'region', tier: 1 },
      { text: 'GANJI BAR', lat: 30.47, lon: 73.22, cls: 'region', tier: 1 },
      { text: 'Ravi', lat: 30.925, lon: 73.21, cls: 'water', tier: 1, angle: 80 },
      { text: 'Old Beas', lat: 30.556, lon: 73.215, cls: 'water', tier: 2, angle: -5 },
    ],
  },

  // Trimmu Ghat, July 1857, after Nicholson's report of 19 July (printed in
  // Cave-Browne, The Punjab and Delhi in 1857, II, pp. 320-25), Bourchier,
  // Eight Months' Campaign, pp. 13-22 (he commanded the field battery), the
  // Punjab Mutiny Reports (Roberts, paras 72-92, and the Gurdaspur report)
  // and Trotter, Life of John Nicholson, pp. 277-90. The 46th Native Infantry
  // and the right wing of the 9th Light Cavalry rose at Sialkot on 9 July and
  // marched for Gurdaspur, meaning to raise the 2nd Irregulars there and go
  // on by Nurpur and Hoshiarpur to Delhi; they took the station gun and some
  // Rs 35,000 but made only ten miles the first day, and halted at Nurkot on
  // the 11th. Nicholson's movable column left Amritsar at 9 p.m. on the 10th
  // with the 52nd on ekkas and ponies and the Punjab infantry on the 9th's
  // troop horses, and reached Gurdaspur, 41-44 miles, by the afternoon of the
  // 11th. He let the mutineers cross the Ravi at Trimmu on the 12th, met them
  // half a mile from the river and broke them in half an hour; the survivors
  // held an island with the gun until he crossed by boats on the 16th. Some
  // 1,100 men in all. Rounds are six hours, from 6 p.m. on 11 July, with the
  // column in at Gurdaspur.
  trimmu: {
    title: 'The Battle of Trimmu Ghat',
    year: 1857,
    region: 'Ravi · Gurdaspur',
    blurb: 'July 1857. On the 9th the 46th Native Infantry and the right wing of the 9th Light Cavalry rose at Sialkot, killed their brigadier and marched east with the station gun and the treasury. They mean to cross the Ravi, raise the cavalry at Gurdaspur and go on by Hoshiarpur to Delhi. John Nicholson has heard, and his movable column has marched 44 miles from Amritsar in a day and a night, and is in at Gurdaspur.',
    first: 'azure',
    standards: { azure: 'rebel', red: 'punjab', by: [['^46th|^9th Light Cavalry|Station Gun', 'rebel']] },  // battle standards when a unit's name does not say
    vpTarget: Infinity,
    roundLimit: 16,
    menPerFormation: 250,
    clock: { day: 11, month: 'July', from: 18, hours: 6 },
    goal: {
      escape: { side: 'azure', power: 'doab', need: 7 }, attacker: 'azure', forts: [], short: 'Get 350 men onto the Hoshiarpur road',
      escapeWins: 'Three hundred and fifty of the Sialkot mutineers are over the Ravi and away down the Hoshiarpur road, arms in hand. Nurpur and Jullundur hear of them before the dak does, and the road to Delhi lies open.',
      attackerWins: '', defenderWins: 'The Sialkot brigade is destroyed at the Ravi. Those not killed on the bank or drowned in the river are hunted down by the villagers or given up by the Jammu authorities, and the Punjab is quiet behind Nicholson.',
    },
    sides: {
      azure: { name: 'The Sialkot Mutineers', short: 'Mutineers', adj: 'sepoy', pitch: 'The 46th and the 9th’s right wing are at Nurkot, fifteen miles from the Ravi, with the station gun and a crowd of followers. Cross at Trimmu, get past Gurdaspur and away down the Hoshiarpur road with three hundred and fifty men before Nicholson can stop you.', tag: 'Moves first · get 350 men away to the east' },
      red: { name: 'Nicholson’s Movable Column', short: 'Column', adj: 'Company', pitch: 'Your column has come in to Gurdaspur after a march of 44 miles from Amritsar in under twenty hours: HM 52nd on ekkas, Dawes’s and Bourchier’s guns, the Punjab infantry on borrowed horses and some new police horse. The mutineers are making for the Ravi at Trimmu. Do not let them get away to the east.', tag: 'Moves second · stop the mutineers' },
    },
    generals: {
      azure: { name: 'The Native Officers of the 46th', title: 'Leading the Sialkot mutineers', leads: '46th N.I., Right Wing' },
      red: { name: 'Brigadier-General John Nicholson', title: 'Commanding the Punjab Movable Column', leads: 'HM 52nd Light Infantry' },
    },
    // The column's road back to Amritsar; the mutineers have nowhere to fall back on.
    homeBase: { red: [31.80, 75.10], azure: null },
    walls: { gurdaspur: 1 },  // the tahsil and the jail
    strongpoints: ['gurdaspur', 'trimmu', 'batala'],
    startOwners: { gurdaspur: 'red', batala: 'red' },
    startUnits: [
      // The mutineers halted in the villages about Nurkot.
      ['azure', 'Sepoy Infantry', 'nurkot', '46th N.I., Right Wing'], ['azure', 'Sepoy Infantry', [32.2098, 75.1507], '46th N.I., Left Wing'],
      ['azure', 'Sepoy Infantry', [32.205, 75.125], '46th N.I., Grenadiers'], ['azure', 'Light Field Gun', [32.19, 75.12], 'The Station Gun', 1],
      ['azure', 'Sepoy Infantry', [32.2072, 75.0565], '46th N.I., Light Company', 4], ['azure', 'Light Dragoons', [32.185, 75.09], '9th Light Cavalry, Right Wing', 4],
      // Nicholson's column, come in to Gurdaspur that afternoon and camped
      // about the town, and the civil station.
      ['red', 'Line Infantry', 'gurdaspur', 'HM 52nd Light Infantry'], ['red', 'Matchlockmen', 'gurdaspur', 'Gurdaspur Police', 2, { post: true }],
      ['red', 'Line Infantry', [32.0019, 75.3802], 'HM 52nd, Ekka Companies'], ['red', 'Horse Artillery', [32.05, 75.375], 'Dawes’s Horse Artillery', 4],
      ['red', 'Light Field Gun', [32.03, 75.41], 'Bourchier’s Field Battery', 3], ['red', 'Matchlockmen', [32.02, 75.39], 'Police Battalion Company', 2],
      ['red', 'Mounted Matchlocks', [32.06, 75.42], '3rd and 6th Punjab Infantry', 4], ['red', 'Irregular Sowars', [32.045, 75.43], 'Mounted Police Ressalahs', 3],
      // The district police in the tahsil towns.
      ['red', 'Matchlockmen', 'kalanaur', 'Kalanaur Police', 1, { post: true }],
      ['red', 'Matchlockmen', 'derababananak', 'Dera Baba Nanak Police', 1, { post: true }],
      ['red', 'Matchlockmen', 'batala', 'Batala Police', 1, { post: true }],
    ],
    events: [
      { title: 'Two spies taken', history: 'On the evening of the 11th Nicholson himself saw two men in the camp bazaar at Gurdaspur whom he knew for sepoys of the 46th in disguise. They had been sent ahead to raise the 2nd Irregular Cavalry, and were taken before they could reach it.', round: 1, side: 'red', text: 'Two disguised sepoys of the 46th, sent to raise the cavalry at Gurdaspur, were taken in the camp bazaar', flash: 'TWO SPIES TAKEN' },
    ],
    powers: [
      { id: 'gurdaspur', name: 'Gurdaspur District', chief: 'Captain Adams, Assistant Commissioner', seat: 'gurdaspur', npc: false, side: 'red', color: '#94493a', note: 'The Company’s district on the left bank of the Ravi', extraSeats: ['batala', 'dinanagar', 'kalanaur', 'trimmu', 'derababananak', [31.80, 75.10], [32.16, 75.55], [32.02, 75.55], [31.88, 75.55]] },
      { id: 'sialkot', name: 'Sialkot District', chief: 'The Company', seat: 'shakargarh', npc: false, side: 'red', color: '#8a5a44', note: 'The right bank, by which the mutineers came', extraSeats: ['nurkot', 'kotnaina', [32.27, 74.95]] },
      { id: 'jammu', name: 'Jammu', chief: 'Maharaja Gulab Singh', seat: [32.38, 75.47], npc: false, side: null, color: '#3f7b4c', note: 'The Maharaja’s country above the Ujh, where fugitives fled and were given up', extraSeats: [[32.36, 75.35], [32.39, 75.60], [32.36, 75.645]] },
      { id: 'doab', name: 'The Hoshiarpur Road', chief: 'The road to Nurpur, Jullundur and Delhi', seat: [32.20, 75.645], npc: false, side: null, color: '#7b6a4c', note: 'The mutineers’ way east', extraSeats: [[32.05, 75.645], [31.95, 75.645]] },
    ],
    labels: [
      { text: 'Ravi', lat: 32.10, lon: 75.16, cls: 'water', tier: 1, angle: 15 },
      { text: 'Ujh', lat: 32.30, lon: 75.37, cls: 'water', tier: 2, angle: 70 },
      { text: 'BARI DOAB', lat: 31.93, lon: 75.38, cls: 'region', tier: 1 },
    ],
  },

  // Mudki and Ferozeshah, December 1845, after the despatches of Hardinge,
  // Gough and Littler (London Gazette 20576, 23 February 1846). The Khalsa
  // army crossed the Sutlej on the 11th and invested Ferozepur, where Littler
  // held the town and the entrenched cantonment. Lal Singh took the main army
  // out to Ferozeshah, ten miles from Ferozepur and as far from Mudki, to meet
  // the relief; Tej Singh stayed before Ferozepur, with the Ghorcharas camped
  // by the river. Gough came up from Ambala by Bassian and Charik, 150 miles in
  // six days, and beat off Lal Singh's attack at Mudki on the evening of the
  // 18th; HM 29th and the 1st Europeans joined him there on the 19th. On the
  // 21st Littler slipped out of Ferozepur and joined Gough on the march, and
  // the army stormed the camp at Ferozeshah that afternoon and the next
  // morning, before Tej Singh came up and drew off again. A round is a day,
  // from the 17th.
  ferozeshah: {
    title: 'The Battle of Ferozeshah',
    year: 1845,
    region: 'Sutlej · Ferozepur',
    blurb: 'December 1845. On the 11th the Khalsa army crossed the Sutlej and invested Ferozepur, where Sir John Littler holds the town and the entrenched cantonment with some 7,000 men. Raja Lal Singh has taken the main army out to Ferozeshah, ten miles along the road to Mudki, to meet the relief, while Tej Singh stays before Ferozepur. Sir Hugh Gough is coming up from Ambala by forced marches, 150 miles in six days, with the Governor-General riding in his camp.',
    first: 'azure',
    standards: { azure: 'khalsa', red: 'company' },  // battle standards when a unit's name does not say
    vpTarget: Infinity,
    roundLimit: 12,
    clock: { day: 17, month: 'December', from: 6, hours: 24 },
    goal: {
      forts: ['ferozeshah', 'ferozepur'], attacker: 'red', short: 'Relieve Ferozepur and take Ferozeshah',
      prize: 'ferozepur', prizeSide: 'azure',
      prizeWins: 'Ferozepur falls to the Khalsa: the town, the cantonment, the magazine and Littler’s division are lost, and the road to Ludhiana and Delhi lies open.',
      attackerWins: 'Ferozepur is relieved and the entrenched camp at Ferozeshah is stormed, with its guns, stores and standards. The Khalsa army falls back over the Sutlej, and for the moment the British bank is clear.',
      defenderWins: 'The campaign closes with the Khalsa still entrenched at Ferozeshah and Gough’s worn-out army unable to break it. Ferozepur is still invested, and the British must wait for the reserves from Meerut.',
    },
    sides: {
      azure: { name: 'Khalsa Army', short: 'Khalsa', adj: 'Khalsa', pitch: 'Lal Singh’s battalions and heavy guns hold Ferozeshah, Tej Singh’s army lies before Ferozepur and the Ghorcharas by the river. Gough is coming in from the east, tired out, with more troops behind him. Tej Singh will not stay: on the 22nd he draws off over the Sutlej. Storm Ferozepur before then, or keep Gough out of Ferozeshah until the 28th.', tag: 'Moves first · take Ferozepur, or hold Ferozeshah until 28 December' },
      red: { name: 'Army of the Sutlej', short: 'British', adj: 'British', pitch: 'Gough’s army is at Charik, a long march short of Mudki, and Littler holds Ferozepur with Tej Singh watching him. HM 29th, the 1st Europeans and the heavy guns come up on the 19th. Join the two forces, hold Ferozepur, and take the Sikh camp at Ferozeshah.', tag: 'Moves second · hold Ferozepur, take Ferozeshah' },
    },
    generals: {
      azure: { name: 'Raja Lal Singh', title: 'Wazir of the Lahore Darbar, commanding the Khalsa army', leads: 'Lal Singh’s Battalions' },
      red: { name: 'General Sir Hugh Gough', title: 'Commander-in-Chief, India', leads: 'HM 9th Foot' },
    },
    // The Sikhs' roads home over the Sutlej, by Harike and by the fords below
    // Ferozepur; the British road back to Bassian and Ludhiana.
    homeBase: { azure: [[31.245, 74.93], [31.24, 74.62]], red: [30.70, 75.25] },
    // Ferozepur's old fort and walled town, with Littler's entrenchments round
    // the cantonment; the little fort at Mudki. Ferozeshah had no works until
    // the Sikhs dug them, and here they must dig them too.
    walls: { ferozepur: 3, mudki: 1 },
    strongpoints: ['ferozepur', 'ferozeshah', 'mudki'],
    startOwners: { ferozepur: 'red', mudki: 'red', ferozeshah: 'azure' },
    startUnits: [
      // Lal Singh's army at Ferozeshah, with the Akalis and the heavy guns.
      ['azure', 'Khalsa Infantry', 'ferozeshah', 'Lal Singh’s Battalions'], ['azure', 'Heavy Battery', 'ferozeshah', 'Khalsa Heavy Guns', 4],
      ['azure', 'Khalsa Infantry', [30.885, 74.775], 'Fauj-i-Ain Battalions'], ['azure', 'Light Field Gun', [30.885, 74.775], 'Khalsa Topkhana'],
      ['azure', 'Khalsa Infantry', [30.872, 74.80], 'Fauj-i-Ain Battalions'], ['azure', 'Light Field Gun', [30.872, 74.80], 'Khalsa Topkhana'],
      ['azure', 'Khalsa Infantry', [30.89, 74.795], 'Fauj-i-Khas Battalions'], ['azure', 'Dhal & Talwar', [30.89, 74.795], 'Akali Nihangs', 4],
      ['azure', 'Khalsa Infantry', [30.868, 74.778], 'Fauj-i-Ain Battalions'], ['azure', 'Heavy Battery', [30.868, 74.778], 'Khalsa Heavy Guns', 4],
      ['azure', 'Khalsa Infantry', [30.895, 74.81], 'Fauj-i-Ain Battalions'],
      ['azure', 'Irregular Sowars', [30.91, 74.83], 'Lal Singh’s Ghorcharas'], ['azure', 'Irregular Sowars', [30.91, 74.83], 'Lal Singh’s Ghorcharas', 4],
      // Tej Singh's army before Ferozepur, and the Ghorcharas camped by the river.
      ['azure', 'Khalsa Infantry', [31.005, 74.70], 'Tej Singh’s Battalions'], ['azure', 'Khalsa Infantry', [31.005, 74.70], 'Tej Singh’s Battalions', 4],
      ['azure', 'Khalsa Infantry', [31.015, 74.72], 'Tej Singh’s Battalions', 4], ['azure', 'Heavy Battery', [31.015, 74.72], 'Tej Singh’s Heavy Guns', 3],
      ['azure', 'Khalsa Infantry', [31.02, 74.745], 'Tej Singh’s Battalions', 4], ['azure', 'Light Field Gun', [31.02, 74.745], 'Tej Singh’s Topkhana', 4],
      ['azure', 'Irregular Sowars', [31.07, 74.76], 'Ghorcharas'], ['azure', 'Irregular Sowars', [31.07, 74.76], 'Ghorcharas', 4],
      ['azure', 'Irregular Sowars', [31.08, 74.80], 'Ghorcharas', 4],
      // The guard on the ferry at Harike.
      ['azure', 'Matchlockmen', 'harike', 'Harike Ferry Guard', 3, { post: true }],
      // Littler at Ferozepur: the 27th and the reserve company of artillery
      // in the town and its works, the 63rd in the cantonment, and the field
      // force he took out on the 21st.
      ['red', 'Sepoy Infantry', 'ferozepur', '27th Bengal NI', 4, { post: true }], ['red', 'Heavy Battery', 'ferozepur', 'Reserve Artillery', 3, { post: true }],
      ['red', 'Sepoy Infantry', [30.945, 74.625], '63rd Bengal NI', 4, { post: true }], ['red', 'Line Infantry', [30.945, 74.625], 'HM 62nd Foot', 5],
      ['red', 'Sepoy Infantry', [30.935, 74.63], '12th and 14th Bengal NI', 5],
      ['red', 'Sepoy Infantry', [30.95, 74.635], '33rd and 44th Bengal NI', 5], ['red', 'Sepoy Infantry', [30.95, 74.635], '54th Bengal NI', 3],
      ['red', 'Light Dragoons', [30.94, 74.615], '8th Bengal Light Cavalry', 4], ['red', 'Irregular Sowars', [30.94, 74.615], '3rd Irregular Cavalry', 3],
      ['red', 'Horse Artillery', [30.955, 74.615], 'Littler’s Horse Artillery', 4], ['red', 'Light Field Gun', [30.955, 74.615], 'Ferozepur Field Battery', 3],
      // Gough's army at Charik, a long march short of Mudki: Smith's division, a brigade each
      // of Gilbert's and M'Caskill's, Brooke's guns and the cavalry division.
      ['red', 'Line Infantry', [30.722, 75.155], 'HM 31st Foot', 5], ['red', 'Sepoy Infantry', [30.722, 75.155], '24th and 47th Bengal NI', 5],
      ['red', 'Line Infantry', [30.718, 75.17], 'HM 50th Foot', 5], ['red', 'Sepoy Infantry', [30.718, 75.17], '42nd and 48th Bengal NI', 5],
      ['red', 'Line Infantry', [30.712, 75.185], 'HM 9th Foot', 5], ['red', 'Sepoy Infantry', [30.712, 75.185], '26th and 73rd Bengal NI', 5],
      ['red', 'Line Infantry', [30.706, 75.20], 'HM 80th Foot', 5], ['red', 'Sepoy Infantry', [30.706, 75.20], '2nd, 16th and 45th Bengal NI', 5],
      ['red', 'Light Dragoons', [30.727, 75.14], 'HM 3rd Light Dragoons', 4], ['red', 'Light Dragoons', [30.727, 75.14], 'Bodyguard and 5th Light Cavalry', 4],
      ['red', 'Lancers', [30.737, 75.15], '4th Bengal Lancers', 4], ['red', 'Irregular Sowars', [30.737, 75.15], '9th Irregular Cavalry', 4],
      ['red', 'Horse Artillery', [30.73, 75.165], 'Brooke’s Horse Artillery'], ['red', 'Light Field Gun', [30.73, 75.165], 'Field Batteries', 4],
    ],
    reinforcements: [
      { round: 3, side: 'red', at: [30.70, 75.25], name: 'HM 29th and the 1st Europeans', note: 'came up by forced marches from the hills with the heavy guns', history: 'HM 29th Foot from Kasauli and the Company’s 1st European Light Infantry from Sabathu marched hard to overtake the army, and joined it at Mudki on the night of the 19th with a small division of heavy guns. The Governor-General offered the same evening to serve as Gough’s second in command.', units: [['Line Infantry', 'HM 29th Foot', 5], ['Line Infantry', '1st Bengal European Light Infantry', 5], ['Heavy Battery', 'Heavy Guns', 2]] },
    ],
    // Tej Singh came up on the 22nd, made two attempts on the lost camp, and
    // drew off over the Sutlej with his army intact.
    events: [
      { title: 'Tej Singh draws off', history: 'On the afternoon of the 22nd Tej Singh brought up his fresh battalions, a large artillery and the Ghorcharas from before Ferozepur, drove in the British cavalry and twice tried to retake Ferozeshah. With the British guns out of shot he suddenly ceased fire and drew off, and his army fell back over the Sutlej. Many in the Khalsa believed then, and many have believed since, that their commanders had betrayed them.', round: 6, side: 'red', text: 'Tej Singh drew off his army and fell back over the Sutlej', flash: 'TEJ SINGH DRAWS OFF', depart: ['Tej Singh’s Battalions', 'Tej Singh’s Heavy Guns', 'Tej Singh’s Topkhana', 'Ghorcharas'] },
    ],
    powers: [
      { id: 'lahore', name: 'Lahore Darbar', chief: 'Maharaja Duleep Singh', seat: 'harike', npc: false, side: 'azure', color: '#3f6f8f', note: 'The Majha over the Sutlej, and the Sikh camps on the left bank', extraSeats: ['sobraon', 'khemkaran', [31.20, 74.70], 'ferozeshah', 'arifke', 'mallanwala'] },
      { id: 'company', name: 'Cis-Sutlej States', chief: 'The Company', seat: 'ferozepur', npc: false, side: 'red', color: '#94493a', note: 'Ferozepur and the protected country on the British bank', extraSeats: ['mudki', 'talwandi', 'zira', 'makhu', 'ghall', 'charik', 'baghapurana', [30.70, 75.25]] },
      { id: 'faridkot', name: 'Faridkot', chief: 'Raja Pahar Singh', seat: 'faridkot', npc: true, side: null, color: '#3f7b4c', note: 'The Brar raja’s town and country south of Mudki', levy: { variant: 'Irregular Sowars', name: 'Faridkot Horse' }, history: 'Raja Pahar Singh of Faridkot, a Brar chief under British protection, sent supplies and men to the British army in the campaign, and was rewarded after the war with the lands of Kot Kapura.' },
    ],
    // "A dead flat, covered at short intervals with a low, but in some places
    // thick, jhow jungle, and dotted with sandy hillocks" (Gough, 19 December);
    // tamarisk and tall grass along the river.
    jungle: [
      ...[[31.035, 75.225], [31.059, 75.19], [31.082, 75.147], [31.123, 75.123], [31.134, 75.072], [31.147, 75.031], [31.144, 74.994], [31.138, 74.935],
        [31.147, 74.887], [31.143, 74.84], [31.132, 74.8], [31.124, 74.756], [31.097, 74.722], [31.07, 74.689], [31.074, 74.656], [31.076, 74.63],
        [31.034, 74.635], [31.03, 74.591], [30.991, 74.588], [30.994, 74.541], [31.215, 75.05], [31.194, 75.019], [31.177, 74.979]]
        .map(([lat, lon]) => ({ lat, lon, radiusKm: 2.5, tree: 0.6, shrub: 0.5 })),
      // The thick jhow in front of the Sikh line at Mudki, and before the face
      // of the camp at Ferozeshah that looked towards Ferozepur.
      { lat: 30.79, lon: 74.905, radiusKm: 4.5, tree: 0.2, shrub: 0.65 },
      { lat: 30.872, lon: 74.742, radiusKm: 3.5, tree: 0.2, shrub: 0.65 },
      // Low jhow at short intervals over the whole plain.
      ...[30.66, 30.75, 30.84, 30.93, 31.02].flatMap((lat, i) => [74.56, 74.66, 74.76, 74.86, 74.96, 75.06, 75.16].map(lon => ({ lat, lon: lon + (i % 2) * 0.05, radiusKm: 4, tree: 0.1, shrub: 0.5 }))),
    ],
    labels: [
      { text: 'MALWA', lat: 30.68, lon: 74.98, cls: 'region', tier: 1 },
      { text: 'MAJHA', lat: 31.215, lon: 74.66, cls: 'region', tier: 1 },
      { text: 'Sutlej', lat: 31.10, lon: 74.68, cls: 'water', tier: 1, angle: 40 },
      { text: 'Beas', lat: 31.215, lon: 75.07, cls: 'water', tier: 2, angle: 45 },
    ],
  },

  // The Aliwal campaign, January 1846, after Gough's despatch of 1 February
  // and Sir Harry Smith's from the field of Aliwal (London Gazette 20588).
  // While the main armies faced each other at Sobraon, Sardar Ranjodh Singh
  // Majithia crossed the Sutlej from Phillaur with a large force and the
  // Raja of Ladwa's men, threatening Ludhiana, held by Godby's three native
  // battalions, and the British road at Jagraon, Bassian and Raikot. Smith,
  // who had just taken the grain fort of Dharamkot, marched by Jagraon for
  // Ludhiana and lost much of his baggage to the Sikh horse at Budhowal on the
  // 21st. Ranjodh Singh fell back from Budhowal to the ghat of Talwan, where
  // 4,000 of Avitabile's regulars, twelve guns and more horse crossed to him;
  // Wheeler's brigade came up to Smith. On the 28th Smith attacked the Sikh
  // line on the ridge from Aliwal to Bhundri and drove it into the river.
  // A round is a day, from the 18th.
  aliwal: {
    title: 'The Battle of Aliwal',
    year: 1846,
    region: 'Sutlej · Ludhiana',
    blurb: 'January 1846. While the main armies face each other at Sobraon, Sardar Ranjodh Singh Majithia has crossed the upper Sutlej from Phillaur with a large force and the Raja of Ladwa’s men. He threatens Ludhiana, held by three native battalions, and the British road through Jagraon and Bassian. Sir Harry Smith has just taken the grain fort of Dharamkot, sixty miles to the west, and is ordered to clear the left bank.',
    first: 'red',
    standards: { azure: 'khalsa', red: 'company' },  // battle standards when a unit's name does not say
    vpTarget: Infinity,
    roundLimit: 16,
    goal: {
      forts: ['dharamkot', 'baddowal', 'aliwal'], attacker: 'red', short: 'Clear the Sikh posts on the left bank',
      attackerWins: 'Dharamkot, Budhowal and the bridgehead at Aliwal are all in British hands and the Sikh army is driven over the Sutlej, leaving its guns behind. The Sikh garrisons evacuate the forts on the British bank, and Gough can turn all his strength on Sobraon.',
      defenderWins: 'The campaign closes with Ranjodh Singh still holding ground on the British bank. The road by Jagraon stays under threat, and Gough must look over his shoulder at Sobraon.',
    },
    sides: {
      azure: { name: 'Sikh Army', short: 'Sikhs', adj: 'Sikh', pitch: 'Ranjodh Singh’s battalions, guns and Ghorcharas are over the river from Phillaur, with Ladwa’s men and posts at Dharamkot, Budhowal and the Talwan ghat. Raid the British road and Ludhiana, and keep at least one post on the left bank. Avitabile’s battalions cross at Talwan on day 9.', tag: 'Moves second · keep a post on the left bank for 16 days' },
      red: { name: 'Smith’s Division', short: 'British', adj: 'British', pitch: 'Smith’s brigade and Cureton’s cavalry are on the road to Dharamkot; Godby holds Ludhiana and the 53rd Jagraon, with the Shekhawati brigade at Bassian. The Gurkhas come from Delhi on day 4 and Wheeler on day 9. Take Dharamkot, Budhowal and Aliwal.', tag: 'Moves first · take Dharamkot, Budhowal and Aliwal' },
    },
    generals: {
      azure: { name: 'Sardar Ranjodh Singh Majithia', title: 'Commanding the Sikh army on the upper Sutlej', leads: 'Ranjodh Singh’s Battalions' },
      red: { name: 'Major-General Sir Harry Smith', title: 'Commanding the 1st Division', leads: 'HM 31st Foot' },
    },
    // The Sikhs' road home over the Sutlej into the Jullundur Doab; the British
    // road back to Gough's headquarters by Dharamkot.
    homeBase: { azure: [31.196, 75.66], red: [30.95, 75.158] },
    walls: { dharamkot: 1, baddowal: 1, ludhiana: 2, phillaur: 2 },  // the grain fort; Budhowal's little fort; the forts of Ludhiana and Phillaur
    strongpoints: ['dharamkot', 'baddowal', 'aliwal', 'ludhiana', 'jagraon', 'bassian'],
    startOwners: { dharamkot: 'azure', baddowal: 'azure', aliwal: 'azure', ludhiana: 'red', jagraon: 'red', bassian: 'red' },
    startUnits: [
      // The garrison of Dharamkot: "Mercenaries, Rohillas, Eusufzies and Affghans".
      ['azure', 'Matchlockmen', 'dharamkot', 'Dharamkot Garrison', 3],
      // Ranjodh Singh over the river, between Budhowal and the old bed of the
      // Sutlej: some 7,000 men and 20 guns.
      ['azure', 'Khalsa Infantry', 'baddowal', 'Ranjodh Singh’s Battalions'], ['azure', 'Light Field Gun', 'baddowal', 'Khalsa Topkhana', 4],
      ['azure', 'Khalsa Infantry', [30.955, 75.74], 'Fauj-i-Ain Battalions', 4], ['azure', 'Heavy Battery', [30.955, 75.74], 'Sikh Heavy Guns', 2],
      ['azure', 'Irregular Sowars', [30.935, 75.73], 'Ghorcharas', 4], ['azure', 'Irregular Sowars', [30.885, 75.70], 'Ghorcharas', 3],
      ['azure', 'Matchlockmen', [30.96, 75.72], 'Raja of Ladwa’s Levies', 3], ['azure', 'Irregular Sowars', [30.96, 75.72], 'Raja of Ladwa’s Horse', 3],
      // The guard on the ghat of Talwan, and the fort at Phillaur across the river.
      ['azure', 'Matchlockmen', 'aliwal', 'Najibs at the Ghat', 2],
      ['azure', 'Khalsa Infantry', 'phillaur', 'Phillaur Garrison', 3, { post: true }], ['azure', 'Jingal', 'phillaur', 'Phillaur Wall Guns', 3, { post: true }],
      // Smith on the road to Dharamkot with his first brigade and Cureton's cavalry,
      // a march short of it.
      ['red', 'Line Infantry', [30.899, 75.2], 'HM 31st Foot', 4], ['red', 'Sepoy Infantry', [30.899, 75.2], '24th Bengal NI', 4],
      ['red', 'Sepoy Infantry', [30.904, 75.191], '47th Bengal NI', 4], ['red', 'Light Field Gun', [30.927, 75.181], 'Light Field Battery'],
      ['red', 'Lancers', [30.877, 75.191], 'HM 16th Lancers', 4], ['red', 'Light Dragoons', [30.877, 75.191], '3rd Bengal Light Cavalry', 4],
      ['red', 'Light Dragoons', [30.881, 75.181], 'Governor-General’s Bodyguard', 2], ['red', 'Irregular Sowars', [30.868, 75.172], '4th Irregular Cavalry', 4],
      ['red', 'Horse Artillery', [30.881, 75.181], 'Alexander’s Troop'], ['red', 'Horse Artillery', [30.886, 75.172], 'Turton’s Troop'],
      // Godby at Ludhiana with three native battalions and the fort's howitzers.
      ['red', 'Sepoy Infantry', 'ludhiana', '30th Bengal NI', 4], ['red', 'Sepoy Infantry', 'ludhiana', 'Ludhiana Fort Guard', 2, { post: true }],
      ['red', 'Sepoy Infantry', [30.915, 75.835], '36th Bengal NI', 4], ['red', 'Heavy Battery', [30.915, 75.835], 'Two 8-inch Howitzers', 2],
      // HM 53rd at Jagraon; Forster's Shekhawati brigade at the depot of Bassian.
      ['red', 'Line Infantry', 'jagraon', 'HM 53rd Foot', 4],
      ['red', 'Sepoy Infantry', 'bassian', 'Shekhawati Infantry', 4], ['red', 'Light Field Gun', 'bassian', 'Shekhawati Guns', 2],
      ['red', 'Irregular Sowars', [30.665, 75.53], 'Shekhawati Cavalry', 3],
    ],
    reinforcements: [
      { round: 4, side: 'red', at: [30.90, 75.905], name: 'The brigade from Delhi', note: 'came up the Grand Trunk Road to Ludhiana', history: 'The Sirmoor and Nusseree battalions, Gurkha regiments raised after the Anglo-Nepal War, came up the Grand Trunk Road to Ludhiana and fought under Smith at Aliwal.', units: [['Sepoy Infantry', 'Sirmoor Battalion', 4], ['Sepoy Infantry', 'Nusseree Battalion', 4]] },
      { round: 9, side: 'red', at: [30.95, 75.165], name: 'Wheeler’s brigade', note: 'came up from headquarters by Dharamkot with more cavalry and guns', history: 'Gough sent Brigadier-General Wheeler from headquarters with HM 50th, the 48th Native Infantry, more cavalry and guns. He joined Smith before Aliwal, giving him the strength to attack.', units: [['Line Infantry', 'HM 50th Foot', 4], ['Sepoy Infantry', '48th Bengal NI', 4], ['Light Dragoons', '1st and 5th Bengal Light Cavalry', 4], ['Horse Artillery', 'Lane’s Troop'], ['Light Field Gun', 'Mill’s and Boileau’s Batteries']] },
      { round: 9, side: 'azure', at: [30.99, 75.607], name: 'Avitabile’s battalions', note: 'crossed the Sutlej at the ghat of Talwan with twelve guns and a large force of horse', history: 'Some 4,000 of Avitabile’s regulars, the battalions drilled by the Italian general who had governed Peshawar, crossed to Ranjodh Singh at the ghat of Talwan with twelve guns and more horse before the battle of the 28th.', units: [['Khalsa Infantry', 'Avitabile’s Battalions'], ['Khalsa Infantry', 'Avitabile’s Battalions'], ['Khalsa Infantry', 'Avitabile’s Battalions', 3], ['Light Field Gun', 'Avitabile’s Guns'], ['Irregular Sowars', 'Ghorcharas', 4]] },
    ],
    powers: [
      { id: 'lahore', name: 'Lahore Darbar', chief: 'Maharaja Duleep Singh', seat: 'phillaur', npc: false, side: 'azure', color: '#3f6f8f', note: 'The Jullundur Doab across the Sutlej, with the Sikh posts on the left bank', extraSeats: ['talwan', 'nurmahal', [31.10, 75.40], 'aliwal', 'dharamkot'] },
      { id: 'company', name: 'Cis-Sutlej States', chief: 'The Company', seat: 'ludhiana', npc: false, side: 'red', color: '#94493a', note: 'The British bank of the Sutlej, from Ludhiana to the road for Ferozepur', extraSeats: ['jagraon', 'bassian', 'raikot', 'mullanpur', 'purain', 'sidhwan', [30.80, 75.30], [30.95, 75.665]] },
    ],
    labels: [
      { text: 'JULLUNDUR DOAB', lat: 31.11, lon: 75.62, cls: 'region', tier: 1 },
      { text: 'MALWA', lat: 30.70, lon: 75.35, cls: 'region', tier: 1 },
      { text: 'Sutlej', lat: 31.03, lon: 75.40, cls: 'water', tier: 1, angle: 15 },
      { text: 'Budha Nala', lat: 30.936, lon: 75.765, cls: 'water', tier: 2, angle: 12 },
    ],
  },

  // Sobraon, January-February 1846, after Gough's despatches of 1 and 13
  // February and Hardinge's of the 19th (London Gazette 20588 and 20590),
  // Cunningham, History of the Sikhs, pp. 301-16 (he was there), and Rait,
  // Life of Gough II, pp. 40-66, with the engineers' survey facing p. 62.
  // After Ferozeshah the Khalsa went back over the Sutlej, then from early
  // January bridged it at the ford of Sobraon under batteries on the higher
  // north bank and dug a bridgehead on the British side: a half-moon of works
  // some 4,000 yards round, both flanks on the river, its right on loose sand
  // and weakest. Tej Singh commanded in the works with perhaps 20-30,000 men
  // and 67 guns; Lal Singh's horse lay upstream on the north bank. Gough
  // would not attack without the siege train from Delhi and Smith's division,
  // away at Aliwal (28 January). The train came up on 7-8 February and Smith
  // rejoined on the 8th; on the 7th Lal Singh is said to have sent Lawrence a
  // plan of the works. On the 10th, after a three-hour cannonade, Dick's
  // division carried the Sikh right by the river and Gilbert's and Smith's
  // the centre and left; the bridge broke behind the Sikhs, the river had
  // risen, and thousands were drowned. Sham Singh Attariwala died in the
  // works. The weeks of watching are compressed into ten days, from 1
  // February, with the British army a march back on the Ferozepur road.
  sobraon: {
    title: 'The Battle of Sobraon',
    year: 1846,
    region: 'Sutlej · Sobraon',
    blurb: 'February 1846. The Khalsa army has bridged the Sutlej at the ford of Sobraon and dug a great half-moon of works on the British bank, its guns on the high ground across the river behind it. Gough will not storm it without the siege train coming from Delhi, and Sir Harry Smith’s division is away up the river after Aliwal. Ferozepur lies a march to the west.',
    first: 'azure',
    standards: { azure: 'khalsa', red: 'company' },  // battle standards when a unit's name does not say
    vpTarget: Infinity,
    roundLimit: 10,
    clock: { day: 1, month: 'February', from: 6, hours: 24 },
    goal: {
      forts: ['sobraon'], attacker: 'red', short: 'Storm the works at Sobraon',
      prize: 'ferozepur', prizeSide: 'azure',
      prizeWins: 'Ferozepur falls to the Khalsa: the town, the magazine and the bridge-train are lost, and Gough’s army stands on the Sutlej with its base gone.',
      attackerWins: 'The works at Sobraon are stormed. The bridge breaks behind the Khalsa and the swollen Sutlej takes thousands; Sham Singh Attariwala dies in the works. Two days later the British army crosses at Ferozepur, and the road to Lahore is open.',
      defenderWins: 'The works at Sobraon still stand and the Khalsa still holds the British bank when the campaign closes. Gough must wait for the hot weather, and the Darbar can treat from strength.',
    },
    sides: {
      azure: { name: 'Khalsa Army', short: 'Khalsa', adj: 'Khalsa', pitch: 'Tej Singh holds the works on the British bank at Sobraon, with the bridge behind him and the heavy guns on the north bank covering it; Lal Singh’s horse lie upstream towards Harike. Hold the works for ten days, or strike at Ferozepur while Gough waits for his siege guns.', tag: 'Moves first · hold the works for 10 days, or take Ferozepur' },
      red: { name: 'Army of the Sutlej', short: 'British', adj: 'British', pitch: 'Dick’s and Gilbert’s divisions are on the Ferozepur road, Grey watches the fords at Attari and Littler holds Ferozepur. Smith’s division is coming back from Aliwal and the siege train from Delhi. Take the works at Sobraon, and do not lose Ferozepur.', tag: 'Moves second · take the works at Sobraon' },
    },
    generals: {
      azure: { name: 'Raja Tej Singh', title: 'Commander-in-chief of the Khalsa army', leads: 'Tej Singh’s Battalions' },
      red: { name: 'General Sir Hugh Gough', title: 'Commander-in-Chief, India', leads: 'HM 9th and 62nd Foot' },
    },
    // The Khalsa's roads home to Lahore, by the bridge and Patti and by Kasur;
    // the British road back by Ferozeshah to Mudki, and Ferozepur's.
    homeBase: { azure: [[31.35, 74.80], [31.25, 74.385]], red: [[30.81, 74.79], [31.05, 75.015]] },
    walls: { sobraon: 4, ferozepur: 3 },  // the Sikh works, man-high with deep ditches; Ferozepur's fort and entrenchments
    strongpoints: ['sobraon', 'ferozepur'],
    startOwners: { sobraon: 'azure', ferozepur: 'red' },
    startUnits: [
      // Tej Singh's army in the works.
      ['azure', 'Khalsa Infantry', 'sobraon', 'Tej Singh’s Battalions'], ['azure', 'Heavy Battery', 'sobraon', 'Khalsa Heavy Guns', 4],
      ['azure', 'Khalsa Infantry', [31.14, 74.856], 'Fauj-i-Ain Battalions'], ['azure', 'Zamburak', 'littlesobraon', 'Zamburkhana'],
      ['azure', 'Khalsa Infantry', [31.138, 74.870], 'Sham Singh’s Battalions'], ['azure', 'Light Field Gun', [31.138, 74.854], 'Khalsa Topkhana'],
      ['azure', 'Khalsa Infantry', [31.133, 74.874], 'Fauj-i-Ain Battalions'], ['azure', 'Light Field Gun', [31.133, 74.874], 'Khalsa Topkhana'],
      ['azure', 'Khalsa Infantry', [31.14, 74.878], 'Fauj-i-Ain Battalions'], ['azure', 'Dhal & Talwar', [31.14, 74.878], 'Akali Nihangs', 4],
      ['azure', 'Khalsa Infantry', [31.143, 74.865], 'Fauj-i-Khas Battalions'],
      ['azure', 'Light Field Gun', [31.128, 74.868], 'Khalsa Topkhana'],
      // The heavy guns on the high north bank, and the camps behind the bridge.
      ['azure', 'Heavy Battery', [31.16, 74.853], 'North Bank Guns', 4, { post: true }],
      ['azure', 'Heavy Battery', [31.162, 74.874], 'North Bank Guns', 4, { post: true }],
      ['azure', 'Irregular Sowars', 'sobraonkalan', 'Ghorcharas', 4], ['azure', 'Khalsa Infantry', [31.2086, 74.9043], 'Fauj-i-Ain Battalions', 4],
      // Lal Singh's horse upstream towards Harike and down at the Nagar ford,
      // the ferry guard, and the posts in the Majha behind.
      ['azure', 'Irregular Sowars', [31.175, 74.92], 'Lal Singh’s Ghorcharas'], ['azure', 'Irregular Sowars', [31.19, 74.95], 'Lal Singh’s Ghorcharas'],
      ['azure', 'Irregular Sowars', [31.1606, 74.7954], 'Lal Singh’s Ghorcharas', 4],
      ['azure', 'Matchlockmen', 'harike', 'Harike Ferry Guard', 2, { post: true }],
      ['azure', 'Matchlockmen', 'patti', 'Patti Post', 2, { post: true }],
      ['azure', 'Matchlockmen', 'kasur', 'Kasur Garrison', 2, { post: true }],
      // Dick's and Gilbert's divisions camped in the villages about Arifke.
      ['red', 'Line Infantry', 'arifke', 'HM 10th and 53rd Foot'], ['red', 'Sepoy Infantry', [31.035, 74.76], '43rd and 59th Bengal NI'],
      ['red', 'Line Infantry', [31.025, 74.72], 'HM 80th Foot'], ['red', 'Sepoy Infantry', [31.0051, 74.7396], '33rd and 63rd Bengal NI'],
      ['red', 'Line Infantry', [31.05, 74.715], 'HM 9th and 62nd Foot'], ['red', 'Sepoy Infantry', [31.015, 74.765], '26th Bengal NI', 3],
      ['red', 'Line Infantry', [31.02, 74.79], 'HM 29th Foot'], ['red', 'Sepoy Infantry', [30.971, 74.8234], '41st and 68th Bengal NI'],
      ['red', 'Line Infantry', [30.995, 74.77], '1st Bengal Europeans'], ['red', 'Sepoy Infantry', [30.9567, 74.7694], '16th Grenadiers and Sirmoor Battalion'],
      ['red', 'Light Dragoons', [31.0686, 74.6647], 'HM 3rd Light Dragoons', 4], ['red', 'Lancers', [31.045, 74.69], 'HM 9th Lancers', 4],
      ['red', 'Light Dragoons', [30.99, 74.71], '4th and 5th Bengal Light Cavalry', 4], ['red', 'Irregular Sowars', [30.985, 74.745], '2nd and 9th Irregular Cavalry', 4],
      ['red', 'Horse Artillery', [31.03, 74.70], 'Horse Artillery Troops'], ['red', 'Light Field Gun', [31.0, 74.725], 'Field Batteries', 4],
      // Grey at Attari, watching the Nagar ford; Littler at Ferozepur.
      ['red', 'Sepoy Infantry', 'attari', 'Grey’s Bengal NI', 4], ['red', 'Light Dragoons', [30.9464, 74.6754], '8th Bengal Light Cavalry', 3],
      ['red', 'Sepoy Infantry', 'ferozepur', '27th Bengal NI', 4, { post: true }], ['red', 'Heavy Battery', 'ferozepur', 'Reserve Artillery', 3, { post: true }],
      ['red', 'Matchlockmen', 'zira', 'Zira Police', 1, { post: true }],
      ['red', 'Matchlockmen', 'ferozeshah', 'Ferozeshah Post', 1, { post: true }],
    ],
    reinforcements: [
      { round: 4, side: 'red', at: [31.05, 75.01], name: 'Smith’s division', note: 'came back down the river from Aliwal', history: 'After Aliwal Sir Harry Smith’s division marched back down the left bank, and rejoined the army before Sobraon on 8 February with Cureton’s cavalry and HM 16th Lancers.', units: [['Line Infantry', 'HM 31st Foot'], ['Sepoy Infantry', '47th Bengal NI and Nusseree Battalion'], ['Line Infantry', 'HM 50th Foot'], ['Sepoy Infantry', '42nd Bengal NI', 4], ['Lancers', 'HM 16th Lancers', 4]] },
      { round: 6, side: 'red', at: [30.815, 74.79], name: 'The siege train', note: 'came up the Ferozeshah road from Delhi', history: 'The heavy guns Gough had waited for, eighteen-pounders and eight-inch and five-and-a-half-inch howitzers with mortars and a rocket battery, reached the camp on 7 and 8 February. The engineers had asked for thirty heavy howitzers and five eighteen-pounders.', units: [['Heavy Battery', 'Heavy Battery (18-pounders)'], ['Heavy Battery', 'Howitzers'], ['Heavy Battery', 'Howitzers', 4]] },
    ],
    events: [
      { title: 'A plan of the works', history: 'On the night of 7 February, it is said, Raja Lal Singh sent Major Lawrence a rough sketch of the Sikh works. Whether by that or by their own reconnaissance, the British knew that the Sikh right, on the loose sand by the river, was the weakest part of the line.', round: 7, side: 'red', text: 'A plan of the Sikh works reached the British camp: the right, on the river sand, was weakest', flash: 'A PLAN OF THE WORKS', walls: { sobraon: -1 } },
    ],
    powers: [
      { id: 'lahore', name: 'Lahore Darbar', chief: 'Maharaja Duleep Singh', seat: 'sobraonkalan', npc: false, side: 'azure', color: '#3f6f8f', note: 'The Majha over the Sutlej, and the works on the left bank', extraSeats: ['sobraon', 'patti', 'harike', 'kasur', 'khemkaran', [31.35, 74.80], [31.25, 74.385]] },
      { id: 'company', name: 'Cis-Sutlej States', chief: 'The Company', seat: 'ferozepur', npc: false, side: 'red', color: '#94493a', note: 'Ferozepur and the protected country on the British bank', extraSeats: ['arifke', 'attari', 'rodawala', 'nihalke', 'makhu', 'zira', 'ferozeshah', [30.81, 74.79], [31.05, 75.015]] },
    ],
    // Tamarisk and tall grass along the river, and low jhow over the plain.
    jungle: [
      ...[[31.12, 74.80], [31.10, 74.74], [31.08, 74.68], [31.04, 74.62], [31.0, 74.56], [31.15, 74.95], [31.165, 74.99]]
        .map(([lat, lon]) => ({ lat, lon, radiusKm: 2.5, tree: 0.5, shrub: 0.5 })),
      ...[30.86, 30.95, 31.04].flatMap((lat, i) => [74.62, 74.72, 74.82, 74.92].map(lon => ({ lat, lon: lon + (i % 2) * 0.05, radiusKm: 4, tree: 0.1, shrub: 0.45 }))),
    ],
    labels: [
      { text: 'MAJHA', lat: 31.25, lon: 74.62, cls: 'region', tier: 1 },
      { text: 'MALWA', lat: 30.88, lon: 74.92, cls: 'region', tier: 1 },
      { text: 'Sutlej', lat: 31.07, lon: 74.66, cls: 'water', tier: 1, angle: 30 },
      { text: 'Beas', lat: 31.20, lon: 75.00, cls: 'water', tier: 2, angle: 40 },
    ],
  },

  // Lahore, March 1752, Ahmad Shah's third invasion, after Ganda Singh, Ahmad
  // Shah Durrani: Father of Modern Afghanistan (1959), pp. 97–115 (from the
  // Tarikh-i-Ali, the Tahmas Namah, the Tarikh-i-Ahmad Shahi, the
  // Siyar-ul-Mutakherin and Sohan Lal's Umdat-ut-Tawarikh), with Hari Ram
  // Gupta, History of the Sikhs II. Mir Muin-ul-Mulk (Mir Mannu), governor of
  // Lahore and Multan, had entrenched round the city for some weeks, the Shah
  // having crossed the Ravi at Ghazipur and come round by Niaz Beg to camp
  // north-east of the Shalamar garden. Kaura Mall advised waiting for the hot
  // weather to drive the Afghans home; Adina Beg advised fighting before the
  // provisions failed. A first sortie checked the Shah, who drew off some
  // twelve kos up the Ravi; on 6 March (1 Jamadi-ul-Awwal 1165) he came down
  // to the plains of Mahmud Buti and Mannu came out to meet him from an old
  // brick-kiln north-east of the gardens. The Shah took the Mughal guns, Kaura
  // Mall was shot from his elephant (by a Kasur Afghan, at Adina Beg's
  // prompting, the sources say), Sangat Singh of the Sikh contingent fell,
  // Adina Beg rode for the city, and night alone saved Mannu's army. He shut
  // himself in the fort and submitted to the Shah the next day. Numbers are
  // not given: Mannu still had 10,000 men in the field after the battle, and
  // 900 swivels; the formations here are of 2,000. Rounds are six hours,
  // from dawn on 5 March.
  lahore1752: {
    title: 'The Battle of Lahore',
    year: 1752,
    region: 'Ravi · Mahmud Buti',
    blurb: 'March 1752. Ahmad Shah Durrani has come into India a third time, for the revenue of the four districts that Lahore promised and never paid. Mir Mannu, governor of Lahore and Multan, has dug trenches round the city from the Ravi to Kotli Shah and waited for help from Delhi that has not come. The country for forty kos is burnt, grain is two seers to the rupee, and the Shah has drawn off up the river. Now his drums are heard coming down the bank towards Mahmud Buti.',
    first: 'red',
    standards: { azure: 'mughal', red: 'durrani', by: [['Sikhs', 'nishan'], ['Hill Rajas', 'hills'], ['Kasur|Khattak|Orakzai', 'tribal']] },  // battle standards when a unit's name does not say
    vpTarget: Infinity,
    roundLimit: 11,
    clock: { day: 5, month: 'March', from: 6, hours: 6 },
    goal: {
      forts: ['mannucamp', 'shalimar', 'lahore'], need: 2, attacker: 'red', general: true, short: 'Take two of Mannu’s lines, Shalamar and Lahore, or Mannu himself',
      attackerWins: 'Mannu’s lines are broken and the Durranis are in the gardens. The governor shuts himself in the fort for a night, then rides out to the Shah’s tent. Ahmad Shah calls him his son, leaves him Lahore and Multan as his own governor, and the Punjab is Afghan.',
      generalWins: 'Mir Mannu is in the Shah’s hands. Ahmad Shah asks him what he would have done had he taken the Shah; Mannu answers that he would have cut off his head. The Shah gives him back his sword and makes him governor of Lahore in the Durrani name.',
      defenderWins: 'The Durranis have not broken the lines, and the hot weather is coming on. The Shah takes what the Lahore merchants will pay and turns for the Indus, and Mannu writes to Delhi of a victory.',
    },
    sides: {
      azure: { name: 'The Mughal Army of Lahore', short: 'Lahore', adj: 'Mughal', pitch: 'You hold the trenches round Lahore, the fort and the Shalamar garden, with raw levies, 900 swivels, Kaura Mall’s division and the Sikhs he has brought, Adina Beg’s horse from the Jullundur Doab and the hill rajas’ men. Kaura Mall says wait for the heat; Adina Beg says fight before the grain runs out.', tag: 'Moves second · hold your lines and Shalamar' },
      red: { name: 'The Durrani Army', short: 'Durrani', adj: 'Durrani', pitch: 'Your horse is up the Ravi, rested and fed on the burnt country. Come down the bank to Mahmud Buti, draw the governor out of his trenches, take his guns and break his lines before the heat drives you home.', tag: 'Moves first · take two of the lines, Shalamar and Lahore' },
    },
    generals: {
      azure: { name: 'Mir Muin-ul-Mulk (Mir Mannu)', title: 'Governor of Lahore and Multan', leads: 'Mannu’s Centre' },
      red: { name: 'Ahmad Shah Durrani', title: 'Shah of the Durranis', leads: 'The Shah’s Ghulams' },
    },
    // The Shah's road home up the Ravi; the governor has nowhere but the city.
    homeBase: { red: [31.695, 74.50], azure: null },
    walls: { lahorefort: 3, lahore: 2, mannucamp: 2, shalimar: 1 },  // the fort, the city wall, Mannu's trenches, the garden wall
    strongpoints: ['mannucamp', 'shalimar', 'lahore', 'lahorefort', 'mahmudbuti'],
    startOwners: { mannucamp: 'azure', shalimar: 'azure', lahore: 'azure', lahorefort: 'azure' },
    startUnits: [
      // Mannu's army in its lines.
      ['azure', 'Matchlockmen', 'mannucamp', 'Mannu’s Centre'], ['azure', 'Matchlockmen', [31.5880, 74.3470], 'Mannu’s Guard'], ['azure', 'Light Field Gun', 'mannucamp', 'Lahore Topkhana'], ['azure', 'Light Field Gun', [31.5880, 74.3470], 'Lahore Topkhana'],
      ['azure', 'Zamburak', 'shalimar', 'Swivels of the Centre'], ['azure', 'Zamburak', [31.5830, 74.3790], 'Swivels of the Centre'], ['azure', 'Matchlockmen', 'shalimar', 'Kaura Mall’s Division'], ['azure', 'Matchlockmen', [31.5830, 74.3790], 'Kaura Mall’s Division'],
      ['azure', 'Zamburak', 'begampura', 'Kaura Mall’s Swivels'], ['azure', 'Matchlockmen', [31.5760, 74.3640], 'Kaura Mall’s Division'], ['azure', 'Irregular Sowars', 'baghbanpura', 'Sangat Singh’s Sikhs'], ['azure', 'Irregular Sowars', [31.5750, 74.3720], 'Sangat Singh’s Sikhs'],
      ['azure', 'Irregular Sowars', [31.570, 74.345], 'Adina Beg’s Horse'], ['azure', 'Irregular Sowars', [31.5640, 74.3440], 'Adina Beg’s Horse'], ['azure', 'Zamburak', [31.565, 74.335], 'Adina Beg’s Swivels'], ['azure', 'Matchlockmen', [31.5600, 74.3330], 'Adina Beg’s Jullundur Foot'],
      ['azure', 'Irregular Sowars', 'mianmir', 'Hindustani Horse'], ['azure', 'Irregular Sowars', [31.5440, 74.3560], 'Hindustani Horse'], ['azure', 'Irregular Sowars', [31.560, 74.350], 'Bhikari Khan’s Horse'], ['azure', 'Irregular Sowars', [31.5550, 74.3440], 'Bhikari Khan’s Horse'],
      ['azure', 'Dhal & Talwar', 'kotli', 'Moman Khan’s Kasur Afghans'], ['azure', 'Matchlockmen', [31.5740, 74.3860], 'Moman Khan’s Kasur Afghans'], ['azure', 'Matchlockmen', [31.598, 74.360], 'Lahore Levies'], ['azure', 'Matchlockmen', [31.5960, 74.3420], 'Lahore Levies'],
      ['azure', 'Matchlockmen', [31.5784, 74.3557], 'Lahore Levies'], ['azure', 'Matchlockmen', [31.5730, 74.3520], 'Lahore Levies'], ['azure', 'Matchlockmen', [31.575, 74.330], 'Bundela Infantry'], ['azure', 'Matchlockmen', [31.5700, 74.3250], 'Bundela Infantry'],
      ['azure', 'Matchlockmen', 'mozang', 'Hill Rajas’ Levies'], ['azure', 'Matchlockmen', [31.5550, 74.3200], 'Hill Rajas’ Levies'], ['azure', 'Spearmen', [31.588, 74.332], 'Mahdi Ali Khan’s Troops'], ['azure', 'Matchlockmen', [31.5830, 74.3360], 'Mahdi Ali Khan’s Troops'],
      ['azure', 'Light Field Gun', 'lahore', 'City Guns', 4, { post: true }], ['azure', 'Matchlockmen', 'lahorefort', 'Fort Garrison', 3, { post: true }],
      // The Shah's army, twelve kos up the Ravi on the Lahore bank.
      ['red', 'Lancers', [31.692, 74.495], 'The Shah’s Ghulams'], ['red', 'Irregular Sowars', [31.700, 74.497], 'Ghulam Khana Horse'], ['red', 'Zamburak', [31.692, 74.495], 'Camel Swivels'],
      ['red', 'Irregular Sowars', [31.700, 74.478], 'Jahan Khan’s Horse'], ['red', 'Irregular Sowars', [31.704, 74.478], 'Jahan Khan’s Horse'], ['red', 'Irregular Sowars', [31.690, 74.468], 'Jahan Khan’s Horse'], ['red', 'Irregular Sowars', [31.694, 74.458], 'Jahan Khan’s Horse'],
      ['red', 'Irregular Sowars', [31.682, 74.487], 'Barkhurdar Khan’s Horse'], ['red', 'Irregular Sowars', [31.686, 74.497], 'Barkhurdar Khan’s Horse'], ['red', 'Matchlockmen', [31.682, 74.487], 'Abdus Samad’s Khattak Musketeers'], ['red', 'Matchlockmen', [31.686, 74.497], 'Abdus Samad’s Khattak Musketeers'],
      ['red', 'Lancers', [31.678, 74.472], 'Shah Wali Khan’s Durranis'], ['red', 'Lancers', [31.684, 74.465], 'Shah Wali Khan’s Durranis'], ['red', 'Irregular Sowars', [31.700, 74.462], 'Durrani Horse'], ['red', 'Irregular Sowars', [31.706, 74.462], 'Durrani Horse'],
      ['red', 'Irregular Sowars', [31.672, 74.497], 'Durrani Horse'], ['red', 'Irregular Sowars', [31.676, 74.490], 'Durrani Horse'], ['red', 'Mounted Matchlocks', [31.708, 74.470], 'Qizilbash Horse'], ['red', 'Mounted Matchlocks', [31.710, 74.480], 'Qizilbash Horse'],
      ['red', 'Zamburak', [31.688, 74.482], 'Camel Swivels'], ['red', 'Zamburak', [31.697, 74.488], 'Camel Swivels'],
      ['red', 'Dhal & Talwar', 'ichogil', 'Orakzai Foot'], ['red', 'Dhal & Talwar', [31.696, 74.500], 'Orakzai Foot'], ['red', 'Irregular Sowars', [31.680, 74.500], 'Durrani Horse'], ['red', 'Matchlockmen', [31.676, 74.480], 'Durrani Jezailchis'],
      ['red', 'Irregular Sowars', [31.706, 74.488], 'Durrani Horse'], ['red', 'Matchlockmen', [31.700, 74.485], 'Durrani Jezailchis'],
    ],
    events: [
      { title: 'The drums of war', history: 'Mannu had held a council of war. Kaura Mall warned that the governor’s troops were raw levies, no match in the field for the Shah’s veterans, and that in twenty days the heat would drive the Afghans home; Adina Beg urged a battle before the provisions failed. The young governor took Adina Beg’s advice, and early on Friday, 6 March, ordered the drums of war beaten.', round: 5, side: 'azure', text: 'Mir Mannu ordered the drums of war beaten', flash: 'THE DRUMS OF WAR' },
      { title: 'Adina Beg rides for the city', history: 'When Kaura Mall was shot from the howdah of Ni’mat Khan’s elephant, the sources say by one Bayazid Khan of Kasur at Adina Beg’s prompting, the Durranis carried off his head, and Adina Beg deserted his post and fled to the city, leaving Mannu and Bhikari Khan to bear the brunt.', round: 6, side: 'azure', text: 'Adina Beg left the field and rode for the city', flash: 'ADINA BEG RIDES FOR THE CITY', depart: ['Adina Beg’s Horse', 'Adina Beg’s Swivels'] },
      { title: 'A night without a moon', history: 'It was the third night after the new moon, and so dark that friend could not be told from foe. The Afghans who had got into the city ran back to their camp, and Mannu said his evening prayers on the field.', round: 7, side: 'red', text: 'Night fell, three days after the new moon: friend could not be told from foe', flash: 'A NIGHT WITHOUT A MOON' },
    ],
    powers: [
      { id: 'lahore', name: 'Subah of Lahore', chief: 'Mir Muin-ul-Mulk', seat: 'lahore', npc: false, side: 'azure', color: '#3f6f4f', note: 'The governor’s city, fort, trenches and gardens', extraSeats: ['lahorefort', 'mannucamp', 'shalimar', 'begampura', 'baghbanpura', 'mianmir', 'mozang', 'shahdara'] },
      { id: 'durrani', name: 'The Shah’s Camp', chief: 'Ahmad Shah Durrani', seat: 'ichogil', npc: false, side: 'red', color: '#4a4a4a', note: 'The burnt country up the Ravi', extraSeats: [[31.69, 74.48], [31.70, 74.46], [31.675, 74.49]] },
    ],
    labels: [
      { text: 'Ravi', lat: 31.665, lon: 74.385, cls: 'water', tier: 1, angle: -35 },
      { text: 'MAHMUD BUTI', lat: 31.616, lon: 74.41, cls: 'region', tier: 2 },
    ],
  },

  // Attock, July 1813, after Hari Ram Gupta, History of the Sikhs V (1978),
  // pp. 97–103, Ganda Singh in The Panjab Past and Present 21 (1987),
  // pp. 37–43, and Fauja Singh, Military System of the Sikhs (1964),
  // pp. 263–64. Jahandad Khan sold Attock to Ranjit Singh in March 1813;
  // Wazir Fateh Khan Barakzai, back from Kashmir, came down to the Indus with
  // his brother Dost Muhammad Khan and cut the fort off, and by 20 June its
  // grain and powder were spent. Diwan Mohkam Chand marched from Rawalpindi
  // with some 10,000 horse and foot and several guns, lay at Burhan, crossed
  // the Haro on 8 July and took grain from an Afghan picket, and met the
  // Afghans on the plain of Chhachh near Haidru, five miles from the fort, on
  // 13 July (Ganda Singh; Gupta has 9 July). Dost Muhammad's vanguard broke
  // the Sikh squares and took guns; Mian Ghaus Khan would not let the
  // artillery fire; the Diwan led the reserve on horseback, his elephant guns
  // firing; an east wind blew the dust into the Afghans' faces in the noon
  // heat; Fateh Khan, thinking his brother killed, drew off to the boats, and
  // many drowned crossing to Khairabad. The Afghans lost 2,000–3,000 and seven
  // guns. The Afghan strength is given as 15,000 (Johar). Rounds are days,
  // from 8 July.
  attock: {
    title: 'The Battle of Attock',
    year: 1813,
    region: 'Indus · Chhachh',
    blurb: 'July 1813. Ranjit Singh has bought Attock, the fort over the crossing of the Indus, from its Afghan governor, and Wazir Fateh Khan of Kabul has come down to take it back. His Afghans and the frontier ghazis have cut the fort off, and its grain and powder are all but gone. Diwan Mohkam Chand is at Burhan with ten thousand horse and foot. It is high summer on the plain of Chhachh.',
    first: 'azure',
    standards: { azure: 'khalsa', red: 'durrani', by: [['Mulkia', 'tribal']] },  // battle standards when a unit's name does not say
    vpTarget: Infinity,
    roundLimit: 10,
    clock: { day: 8, month: 'July', from: 6, hours: 24 },
    goal: {
      forts: ['attock'], attacker: 'red', general: true, short: 'Take Attock, or the Diwan',
      attackerWins: 'Attock is Fateh Khan’s. The starving garrison marches out with its arms, the crossing of the Indus is Kabul’s again, and Ranjit Singh’s hold beyond the Jhelum is broken for a generation.',
      generalWins: 'Diwan Mohkam Chand is a prisoner in Fateh Khan’s camp. The relief army melts back to Rawalpindi, and Attock must open its gates.',
      defenderWins: 'The siege of Attock is broken. Fateh Khan’s army goes back over the Indus in the boats, many drowning, and leaves seven guns, its camels and its grain on the plain of Chhachh. It is the first great Punjabi victory over the Afghans, and Attock stays Ranjit Singh’s.',
    },
    sides: {
      azure: { name: 'The Army of Lahore', short: 'Lahore', adj: 'Sikh', pitch: 'You are at Burhan with the Diwan’s relief army: four divisions of horse, a battalion of foot, Ghaus Khan’s guns and the elephant guns. Attock’s garrison is starving. Cross the Haro, find water for your horses, and break the siege before the fort falls.', tag: 'Moves first · hold Attock for 10 days' },
      red: { name: 'The Army of Kabul', short: 'Kabul', adj: 'Afghan', pitch: 'You have the fort cut off and the frontier ghazis at your call. The boats lie ready at Khairabad. Take Attock before the Lahore army can break your lines, or beat the Diwan in the open on the plain.', tag: 'Moves second · take Attock, or the Diwan' },
    },
    generals: {
      azure: { name: 'Diwan Mohkam Chand', title: 'Commanding the Lahore army for Ranjit Singh', leads: 'The Diwan’s Reserve' },
      red: { name: 'Wazir Fateh Khan Barakzai', title: 'Wazir of Kabul', leads: 'Fateh Khan’s Centre' },
    },
    // The road back to Rawalpindi; the boats to Khairabad.
    homeBase: { azure: [33.825, 72.62], red: [33.94, 72.205] },
    walls: { attock: 3 },  // Akbar's fort of 1583
    strongpoints: ['attock', 'haidru', 'hazro'],
    startOwners: { attock: 'azure' },
    startUnits: [
      // The relief army spread over the villages round Burhan, beyond the Haro.
      ['azure', 'Irregular Sowars', 'burhan', 'The Diwan’s Reserve'], ['azure', 'Zamburak', 'burhan', 'The Diwan’s Elephant Guns'],
      ['azure', 'Irregular Sowars', 'qibla', 'Hari Singh Nalwa’s Horse'], ['azure', 'Irregular Sowars', 'dhokemughlan', 'Desa Singh Majithia’s Horse'],
      ['azure', 'Irregular Sowars', [33.8828, 72.6159], 'Ghorcharas'], ['azure', 'Irregular Sowars', [33.7987, 72.5437], 'Ghorcharas'],
      ['azure', 'Irregular Sowars', [33.7228, 72.5774], 'Ghorcharas'], ['azure', 'Irregular Sowars', [33.845, 72.640], 'Ghorcharas'],
      ['azure', 'Matchlockmen', [33.808, 72.612], 'Najib Battalion'], ['azure', 'Matchlockmen', [33.832, 72.660], 'Najib Battalion'],
      ['azure', 'Light Field Gun', [33.808, 72.612], 'Ghaus Khan’s Topkhana'], ['azure', 'Light Field Gun', [33.775, 72.600], 'Ghaus Khan’s Topkhana'],
      // The garrison of Attock, at the end of its grain.
      ['azure', 'Matchlockmen', 'attock', 'Attock Garrison', 4, { post: true, stock: 45 }],
      // Fateh Khan's army round the fort and over the plain to Haidru.
      ['red', 'Matchlockmen', 'mansar', 'Fateh Khan’s Centre'], ['red', 'Light Field Gun', 'mansar', 'Afghan Light Guns'],
      ['red', 'Light Field Gun', 'mullan', 'Afghan Light Guns'], ['red', 'Matchlockmen', [33.872, 72.255], 'Jezailchis'],
      ['red', 'Matchlockmen', [33.9728, 72.3080], 'Jezailchis'], ['red', 'Irregular Sowars', 'haidru', 'Dost Muhammad’s Horse'],
      ['red', 'Dhal & Talwar', [33.9294, 72.3381], 'Ghazis'], ['red', 'Dhal & Talwar', [33.9444, 72.4255], 'Ghazis'],
      ['red', 'Matchlockmen', 'hajishah', 'Mulkia Musalmans'], ['red', 'Irregular Sowars', [33.9029, 72.3352], 'Durrani Horse'],
      ['red', 'Irregular Sowars', [33.7757, 72.3251], 'Durrani Horse'], ['red', 'Irregular Sowars', [33.9926, 72.3469], 'Durrani Horse'],
      ['red', 'Irregular Sowars', [33.9610, 72.4302], 'Barakzai Horse'], ['red', 'Irregular Sowars', [33.9557, 72.4608], 'Barakzai Horse'],
      ['red', 'Matchlockmen', [33.912, 72.210], 'The Camp at Khairabad', 3, { post: true }],
    ],
    events: [
      { title: 'Grain from the Afghan picket', history: 'On 8 July the Diwan’s army crossed the rivulet and fell on an Afghan picket, taking seven quintals of grain. The men watered their horses and bathed in the stream before marching on.', round: 1, side: 'azure', text: 'The Diwan’s army crossed the Haro and took grain from an Afghan picket', flash: 'GRAIN FROM THE PICKET' },
      { title: 'Ghaus Khan will not fire', history: 'When Dost Muhammad’s vanguard broke the Sikh squares, Mian Ghaus Khan, the darogha of the artillery, came up with the guns but would not let his men fire, though the Diwan sent Aziz Khan and Shaikh Budha with orders. A letter of 16 July reported his inaction to the Maharaja; he feigned illness and was not punished.', round: 6, side: 'azure', text: 'Mian Ghaus Khan would not let the artillery fire', flash: 'GHAUS KHAN WILL NOT FIRE', depart: ['Ghaus Khan’s Topkhana'] },
      { title: 'An east wind', history: 'In the noon heat a strong wind from the east blew the dust and smoke into the faces of the Afghans, who had gone without water on the open plain.', round: 6, side: 'red', text: 'A hot east wind blew the dust into the Afghans’ faces', flash: 'AN EAST WIND', hurt: { at: 'haidru', hp: 1 } },
    ],
    powers: [
      { id: 'lahore', name: 'The Lahore Army’s Road', chief: 'Ranjit Singh', seat: 'burhan', npc: false, side: 'azure', color: '#94493a', note: 'The road back to Hasan Abdal and Rawalpindi', extraSeats: ['qibla', 'dhokemughlan', 'pandak', [33.825, 72.62]] },
      { id: 'attock', name: 'Attock Fort', chief: 'The Lahore garrison', seat: 'attock', npc: false, side: 'azure', color: '#a85a3a', note: 'Akbar’s fort over the crossing' },
      { id: 'kabul', name: 'Kabul’s Camp', chief: 'Wazir Fateh Khan', seat: 'khairabad', npc: false, side: 'red', color: '#4a4a4a', note: 'Khairabad and the boats on the Indus', extraSeats: ['mansar', 'hajishah', [33.94, 72.205]] },
    ],
    labels: [
      { text: 'Indus', lat: 33.80, lon: 72.235, cls: 'water', tier: 1, angle: 80 },
      { text: 'CHHACHH', lat: 33.955, lon: 72.43, cls: 'region', tier: 1 },
    ],
  },

  // Ramnagar, 22 November 1848, after Harold Raugh (ed.), The Victorians at
  // War (2004), pp. 299–301, Khushwant Singh, The Fall of the Kingdom of the
  // Punjab (2014), ch. 11, Byron Farwell, Queen Victoria's Little Wars
  // (1973), p. 53, and Adrian Greenwood, Victoria's Scottish Lion (2015),
  // ch. 5. Raja Sher Singh Attariwala held the right bank of the Chenab
  // opposite Ramnagar, with an outpost and horse on the left bank and heavy
  // guns concealed beyond the river. Gough sent his cavalry division under
  // Brigadier Cureton, the horse artillery and Campbell's infantry brigade
  // up in the night to clear the left bank. At dawn the 3rd Light Dragoons
  // and 8th Bengal Light Cavalry drove the Sikhs over the fords; the hidden
  // batteries opened, the horse artillery was outgunned and left a gun in the
  // sand; some 3,000 Sikh horse came back over the ford, and the 14th Light
  // Dragoons and 5th Light Cavalry charged into the soft bed of the river.
  // Lieutenant-Colonel William Havelock led a second charge and was cut down
  // with his leading troopers; Cureton, riding up to stop a third, was shot.
  // British losses 26 killed or missing and 59 wounded (Raugh); the Sikhs
  // kept the fords. Formations here are of 600, as the cavalry regiments
  // were; the strengths are the game's, the sources giving none. 1 km hexes. Rounds are
  // three hours, from 3 a.m.
  ramnagar: {
    title: 'The Battle of Ramnagar',
    year: 1848,
    region: 'Chenab · Ramnagar',
    blurb: 'November 1848. The Multan rising has become a war. Raja Sher Singh Attariwala has brought the Khalsa army to the Chenab and holds the far bank opposite Ramnagar, with an outpost and horse on the near side. Lord Gough has come up from Lahore, and in the small hours he sends his cavalry, the horse guns and one brigade of foot to drive the Sikhs off the near bank before dawn.',
    first: 'red',
    standards: { azure: 'khalsa', red: 'company', by: [['Ghorcharas|Sowars', 'nishan']] },  // battle standards when a unit's name does not say
    vpTarget: Infinity,
    roundLimit: 6,
    menPerFormation: 600,
    clock: { day: 22, month: 'November', from: 3, hours: 3 },
    goal: {
      forts: ['ramnagar', 'fordhead'], attacker: 'red', short: 'Clear the left bank: Ramnagar and the ford',
      attackerWins: 'The left bank is clear to the water’s edge, and the Sikh outposts are back over the Chenab. Gough holds the ford of Ramnagar, and the way is open to turn Sher Singh’s line upstream.',
      defenderWins: 'The Sikhs still hold the ford. Cureton and Havelock are dead in the sand of the Chenab, a British gun lies in the river bed, and Sher Singh sends Gough a note offering terms if the British leave Lahore. No notice is taken of it.',
    },
    sides: {
      azure: { name: 'The Khalsa Army', short: 'Khalsa', adj: 'Sikh', pitch: 'Your army holds the right bank of the Chenab, with heavy guns hidden among the trees and the island, an outpost in Ramnagar and horse on the near bank. The river bed is soft sand. Let the British come down into it, and keep the ford.', tag: 'Moves second · keep the ford or Ramnagar' },
      red: { name: 'Gough’s Cavalry Division', short: 'British', adj: 'British', pitch: 'You have Cureton’s cavalry, two troops of horse artillery and Campbell’s brigade, and you marched in the night. Drive the Sikh outpost from Ramnagar and their horse from the near bank, and take the ford, without losing yourself in the sand under their guns.', tag: 'Moves first · take Ramnagar and the ford' },
    },
    generals: {
      azure: { name: 'Raja Sher Singh Attariwala', title: 'Commanding the Khalsa army', leads: 'Sher Singh’s Battalions' },
      red: { name: 'General Sir Hugh Gough', title: 'Commander-in-Chief, India', leads: 'Horse Artillery' },
    },
    // The road back to Gough's camp; the Sikh camp's roads to Rasul and the north.
    homeBase: { red: [32.215, 73.915], azure: [32.40, 73.72] },
    strongpoints: ['ramnagar', 'fordhead', 'sikhcamp'],
    startOwners: { ramnagar: 'azure', fordhead: 'azure', sikhcamp: 'azure' },
    startUnits: [
      // Gough's column, come up in the night from the south-east.
      ['red', 'Light Dragoons', 'wazirke', 'HM 3rd Light Dragoons'], ['red', 'Light Dragoons', [32.180, 73.930], '8th Bengal Light Cavalry'],
      ['red', 'Light Dragoons', [32.198, 73.948], 'HM 14th Light Dragoons'], ['red', 'Light Dragoons', [32.176, 73.885], '5th Bengal Light Cavalry'],
      ['red', 'Horse Artillery', [32.205, 73.925], 'Horse Artillery'], ['red', 'Horse Artillery', [32.188, 73.912], 'Horse Artillery'],
      ['red', 'Line Infantry', [32.215, 73.950], 'Campbell’s Brigade, HM Foot'], ['red', 'Sepoy Infantry', [32.176, 73.952], 'Campbell’s Brigade, Bengal NI'],
      ['red', 'Sepoy Infantry', [32.192, 73.870], 'Campbell’s Brigade, Bengal NI'],
      // The Sikh outposts on the left bank.
      ['azure', 'Matchlockmen', 'ramnagar', 'Ramnagar Outpost', 4, { post: true }], ['azure', 'Irregular Sowars', 'fordhead', 'Ghorcharas'],
      ['azure', 'Irregular Sowars', 'rasulpur', 'Ghorcharas'],
      // Sher Singh's army on the right bank, its batteries hidden by the water.
      ['azure', 'Heavy Battery', [32.353, 73.776], 'Sikh Heavy Guns'], ['azure', 'Light Field Gun', [32.358, 73.752], 'Sikh Topkhana'],
      ['azure', 'Khalsa Infantry', 'sikhcamp', 'Sher Singh’s Battalions'], ['azure', 'Khalsa Infantry', [32.365, 73.800], 'Khalsa Battalions'],
      ['azure', 'Khalsa Infantry', 'ranmal', 'Khalsa Battalions'], ['azure', 'Irregular Sowars', 'chhani', 'Ghorcharas'],
      ['azure', 'Irregular Sowars', [32.390, 73.785], 'Ghorcharas'], ['azure', 'Irregular Sowars', 'pindi', 'Ghorcharas'],
      ['azure', 'Irregular Sowars', 'ghanian', 'Ghorcharas'], ['azure', 'Dhal & Talwar', [32.405, 73.760], 'Akali Nihangs'],
    ],
    events: [
      { title: 'The hidden batteries', history: 'When the British cavalry had driven the Sikh outposts back over the fords, batteries the British had not seen opened on them from the far bank, and the horse artillery, outgunned, drew off and left a six-pounder stuck in the sand. Campbell wanted to send infantry to bring it in; Gough would not.', round: 3, side: 'azure', text: 'The Sikh batteries hidden beyond the river opened on the British cavalry', flash: 'THE HIDDEN BATTERIES' },
      { title: 'Havelock’s charge', history: 'Lieutenant-Colonel William Havelock of the 14th Light Dragoons, by most accounts without orders, led a second charge after the Sikh horse into the river bed. He and his leading troopers were surrounded and cut down. Brigadier Cureton, riding up to stop a third charge, was killed by a musket ball.', round: 4, side: 'red', text: 'Havelock led the 14th Light Dragoons into the sand of the river bed', flash: 'HAVELOCK’S CHARGE' },
    ],
    powers: [
      { id: 'khalsa', name: 'Sher Singh’s Camp', chief: 'Raja Sher Singh Attariwala', seat: 'sikhcamp', npc: false, side: 'azure', color: '#94493a', note: 'The right bank of the Chenab', extraSeats: ['ranmal', [32.40, 73.72], [32.385, 73.80]] },
      { id: 'company', name: 'Gough’s Camp', chief: 'Lord Gough', seat: [32.215, 73.915], npc: false, side: 'red', color: '#4a5a7a', note: 'The road back to Gujranwala and Lahore', extraSeats: ['verpal', 'alikot'] },
    ],
    labels: [
      { text: 'Chenab', lat: 32.349, lon: 73.745, cls: 'water', tier: 1, angle: 12 },
    ],
  },

  // Manupur, March 1748, Ahmad Shah's first invasion, after Ganda Singh,
  // Ahmad Shah Durrani (1959), pp. 54–72, Jadunath Sarkar, Fall of the Mughal
  // Empire I (1964), pp. 212–19, and Hari Ram Gupta, History of the Sikhs II
  // (1978), pp. 83–91. The Mughal army under the wazir Qamar-ud-din Khan, with
  // Prince Ahmad, Safdar Jang, Muin-ul-Mulk and Raja Ishwari Singh of Jaipur,
  // left its baggage in Sirhind and turned north for the ford at Machhiwara;
  // Ahmad Shah crossed the Sutlej at Ludhiana on 1 March and took Sirhind,
  // baggage and all, on the 2nd. On 3 March the Mughals camped at Manupur,
  // short of water; the Shah dug lines some five miles out from Sirhind,
  // with one heavy gun and seven light ones against several hundred Mughal
  // guns, but some 700 camel swivels. A week of skirmishing followed, Ala
  // Singh of Patiala and Rai Kalha raiding the Afghan convoys. On 9 March the
  // Shah mounted his heavy gun on a hillock over the Mughal camp; on the
  // 11th a cannon ball struck the wazir at his prayers. His son Muin-ul-Mulk
  // hid his death and led the attack; Ishwari Singh's Rajputs broke, Safdar
  // Jang's musketeers took the swivels on the right, and the rockets the
  // Afghans had taken at Lahore caught fire and blew up their own powder,
  // burning about a thousand men. The Shah fell back to a mud fort, then to
  // Sirhind, and in the night drew off for the Sutlej. The Mughal army is
  // given as 60,000–70,000 fighting men; the Afghans as at most 12,000
  // (Sarkar) or the Shah's 30,000 horse at Lahore (Ganda Singh); here
  // some 57,000 and 26,000. Rounds are days, from 3 March.
  manupur: {
    title: 'The Battle of Manupur',
    year: 1748,
    region: 'Sirhind · Manupur',
    blurb: 'March 1748. Ahmad Shah Durrani, eight months king of the Afghans, has taken Lahore and crossed the Sutlej. He has caught the Mughal army out of position, taken Sirhind with the wazir’s baggage and his household, and dug in on the road to Delhi. The emperor’s army, four or five times his number, is camped at Manupur on dry ground with too few wells. The wazir Qamar-ud-din Khan means to starve the Afghans out with his guns and the local chiefs, and will not give battle.',
    first: 'red',
    standards: { azure: 'mughal', red: 'durrani', by: [['Ala Singh', 'nishan'], ['Rajputs|Kachhwaha', 'dogra'], ['Qizilbash', 'sadozai']] },  // battle standards when a unit's name does not say
    vpTarget: Infinity,
    roundLimit: 11,
    clock: { day: 3, month: 'March', from: 6, hours: 24 },
    goal: {
      forts: ['sirhind'], attacker: 'azure', short: 'Retake Sirhind',
      prize: 'manupur', prizeSide: 'red',
      prizeWins: 'The Afghans are in the Mughal camp at Manupur. The emperor’s army breaks up on the road to Delhi, and Ahmad Shah has done in eight months what Nadir Shah did in a year.',
      attackerWins: 'Sirhind is the emperor’s again. The Shah has drawn off in the night for the Sutlej, with Muin-ul-Mulk’s horse at his heels, and the road to Delhi is shut to him. Muin-ul-Mulk, the hero of Manupur, is made governor of Lahore.',
      defenderWins: 'The Afghans still hold Sirhind and the road to Delhi. The Mughal army, short of water and fodder, cannot stay at Manupur, and the emperor must buy the Shah off.',
    },
    sides: {
      azure: { name: 'The Imperial Army', short: 'Mughal', adj: 'Mughal', pitch: 'Your army lies at Manupur, short of water, with hundreds of guns, Mir Mannu’s Turanis, Safdar Jang’s men, the Prince’s centre and Ishwari Singh’s Rajputs. The Afghans hold Sirhind and your baggage. Wear them down, or break their lines and retake Sirhind.', tag: 'Moves second · retake Sirhind in 11 days' },
      red: { name: 'The Durrani Army', short: 'Durrani', adj: 'Durrani', pitch: 'You hold Sirhind and the Mughal baggage, dug in five miles out on the Delhi road, with one heavy gun, a few light ones and seven hundred camel swivels. Keep your horse loose round their camp, cut their water and fodder, and do not let them reach Sirhind.', tag: 'Moves first · hold Sirhind, or take their camp' },
    },
    generals: {
      azure: { name: 'Qamar-ud-din Khan', title: 'Wazir of the Empire, commanding for Prince Ahmad', leads: 'The Wazir’s Guard' },
      red: { name: 'Ahmad Shah Durrani', title: 'Shah of the Durranis', leads: 'The Shah’s Ghulams' },
    },
    // The road back to Delhi and Ambala; the Shah's road back over the Sutlej at Ludhiana.
    homeBase: { azure: [[30.89, 76.195], [30.78, 76.08]], red: [[30.53, 76.55], [30.53, 76.38]] },
    walls: { sirhindfort: 2, sirhind: 2, durranilines: 2, manupur: 1 },  // the Mughal fort, the town wall, the Shah's lines, the Mughal camp's trench
    strongpoints: ['sirhind', 'sirhindfort', 'durranilines', 'manupur', 'tibba'],
    startOwners: { sirhind: 'red', sirhindfort: 'red', durranilines: 'red', manupur: 'azure' },
    startUnits: [
      // The imperial army drawn up round its camp at Manupur, facing the Afghan
      // lines: Mannu's vanguard ahead, Safdar Jang on the right, Ishwari Singh's
      // Rajputs on the left, the Prince's centre and guns in the camp, Nasir Khan behind.
      ['azure', 'Irregular Sowars', 'manupur', 'The Wazir’s Guard', 5, { stock: 45 }], ['azure', 'Heavy Battery', 'manupur', 'Imperial Heavy Guns', 5, { stock: 45 }],
      ['azure', 'Heavy Battery', [30.7453, 76.2535], 'Imperial Heavy Guns', 5, { stock: 45 }], ['azure', 'Light Field Gun', [30.7453, 76.2535], 'Imperial Topkhana', 5, { stock: 45 }],
      ['azure', 'Light Field Gun', [30.7688, 76.2895], 'Imperial Topkhana', 5, { stock: 45 }], ['azure', 'Light Field Gun', [30.7688, 76.2895], 'Imperial Topkhana', 5, { stock: 45 }],
      ['azure', 'Light Field Gun', [30.7639, 76.2654], 'Imperial Topkhana', 5, { stock: 45 }], ['azure', 'Heavy Battery', [30.7639, 76.2654], 'Imperial Heavy Guns', 5, { stock: 45 }],
      ['azure', 'Matchlockmen', [30.7558, 76.2443], 'Imperial Infantry', 5, { stock: 45 }], ['azure', 'Matchlockmen', [30.7558, 76.2443], 'Imperial Infantry', 5, { stock: 45 }],
      ['azure', 'Matchlockmen', [30.7794, 76.2803], 'Imperial Infantry', 5, { stock: 45 }], ['azure', 'Matchlockmen', [30.7794, 76.2803], 'Imperial Infantry', 5, { stock: 45 }],
      ['azure', 'Matchlockmen', [30.7729, 76.2576], 'Imperial Infantry', 5, { stock: 45 }], ['azure', 'Matchlockmen', [30.7729, 76.2576], 'Imperial Infantry', 5, { stock: 45 }],
      ['azure', 'Irregular Sowars', [30.7627, 76.2289], 'Imperial Horse', 5, { stock: 45 }], ['azure', 'Irregular Sowars', [30.7627, 76.2289], 'Imperial Horse', 5, { stock: 45 }],
      ['azure', 'Irregular Sowars', [30.794, 76.2769], 'Imperial Horse', 5, { stock: 45 }], ['azure', 'Irregular Sowars', [30.794, 76.2769], 'Imperial Horse', 5, { stock: 45 }],
      ['azure', 'Irregular Sowars', [30.7838, 76.2482], 'Imperial Horse', 5, { stock: 45 }], ['azure', 'Irregular Sowars', [30.7838, 76.2482], 'Imperial Horse', 5, { stock: 45 }],
      ['azure', 'Spearmen', [30.7494, 76.2216], 'Imperial Foot', 5, { stock: 45 }], ['azure', 'Spearmen', [30.7494, 76.2216], 'Imperial Foot', 5, { stock: 45 }],
      ['azure', 'Irregular Sowars', [30.7411, 76.2713], 'Mannu’s Turani Horse', 5, { stock: 45 }], ['azure', 'Irregular Sowars', [30.7411, 76.2713], 'Mannu’s Turani Horse', 5, { stock: 45 }],
      ['azure', 'Irregular Sowars', [30.7548, 76.2922], 'Mannu’s Turani Horse', 5, { stock: 45 }], ['azure', 'Irregular Sowars', [30.7548, 76.2922], 'Mannu’s Turani Horse', 5, { stock: 45 }],
      ['azure', 'Matchlockmen', [30.7522, 76.2779], 'Mannu’s Musketeers', 5, { stock: 45 }], ['azure', 'Matchlockmen', [30.7522, 76.2779], 'Mannu’s Musketeers', 5, { stock: 45 }],
      ['azure', 'Irregular Sowars', [30.7262, 76.2277], 'Safdar Jang’s Horse', 5, { stock: 45 }], ['azure', 'Irregular Sowars', [30.7262, 76.2277], 'Safdar Jang’s Horse', 5, { stock: 45 }],
      ['azure', 'Irregular Sowars', [30.7286, 76.2114], 'Safdar Jang’s Horse', 5, { stock: 45 }], ['azure', 'Irregular Sowars', [30.7286, 76.2114], 'Safdar Jang’s Horse', 5, { stock: 45 }],
      ['azure', 'Matchlockmen', [30.7311, 76.2422], 'Safdar Jang’s Musketeers', 5, { stock: 45 }], ['azure', 'Irregular Sowars', [30.7311, 76.2422], 'Safdar Jang’s Horse', 5, { stock: 45 }],
      ['azure', 'Matchlockmen', [30.7366, 76.228], 'Safdar Jang’s Musketeers', 5, { stock: 45 }], ['azure', 'Matchlockmen', [30.7366, 76.228], 'Safdar Jang’s Musketeers', 5, { stock: 45 }],
      ['azure', 'Irregular Sowars', [30.7851, 76.3177], 'Ishwari Singh’s Rajputs', 5, { stock: 45 }], ['azure', 'Irregular Sowars', [30.7851, 76.3177], 'Ishwari Singh’s Rajputs', 5, { stock: 45 }],
      ['azure', 'Irregular Sowars', [30.7991, 76.3194], 'Ishwari Singh’s Rajputs', 5, { stock: 45 }], ['azure', 'Irregular Sowars', [30.7991, 76.3194], 'Ishwari Singh’s Rajputs', 5, { stock: 45 }],
      ['azure', 'Matchlockmen', [30.7758, 76.307], 'Kachhwaha Foot', 5, { stock: 45 }], ['azure', 'Irregular Sowars', [30.7758, 76.307], 'Ishwari Singh’s Rajputs', 5, { stock: 45 }],
      ['azure', 'Irregular Sowars', [30.7867, 76.2266], 'Nasir Khan’s Rearguard', 5, { stock: 45 }], ['azure', 'Irregular Sowars', [30.7867, 76.2266], 'Nasir Khan’s Rearguard', 5, { stock: 45 }],
      ['azure', 'Irregular Sowars', [30.8044, 76.2536], 'Nasir Khan’s Rearguard', 5, { stock: 45 }], ['azure', 'Irregular Sowars', [30.8044, 76.2536], 'Nasir Khan’s Rearguard', 5, { stock: 45 }],
      ['azure', 'Matchlockmen', [30.7902, 76.2449], 'Rearguard Foot', 5, { stock: 45 }], ['azure', 'Matchlockmen', [30.7902, 76.2449], 'Rearguard Foot', 5, { stock: 45 }],
      ['azure', 'Irregular Sowars', [30.7601, 76.2075], 'Adina Beg’s Horse', 5, { stock: 45 }], ['azure', 'Irregular Sowars', [30.7601, 76.2075], 'Adina Beg’s Horse', 5, { stock: 45 }],
      ['azure', 'Irregular Sowars', [30.7369, 76.1853], 'Ala Singh’s Sikhs', 5, { stock: 45 }], ['azure', 'Irregular Sowars', [30.7369, 76.1853], 'Rai Kalha’s Horse', 5, { stock: 45 }],
      // The Durrani army in its camp in the gardens of Sirhind; Sirhind town
      // and fort are garrisoned.
      ['red', 'Matchlockmen', 'sirhind', 'Sirhind Garrison', 4, { post: true }], ['red', 'Light Field Gun', 'sirhind', 'Afghan Light Guns'],
      ['red', 'Matchlockmen', 'sirhindfort', 'Fort Garrison', 3, { post: true }], ['red', 'Great Gun', 'sirhindfort', 'The Shah’s Heavy Gun'],
      ['red', 'Lancers', 'badshahibagh', 'The Shah’s Ghulams'], ['red', 'Lancers', 'badshahibagh', 'Durrani Lancers'],
      // The lines are dug but not yet manned: the Shah's foot and swivels lie
      // behind them, the horse on either flank of the Sirhind gardens.
      ['red', 'Matchlockmen', [30.6588, 76.3573], 'Taqi Khan’s Jezailchis'], ['red', 'Zamburak', [30.6588, 76.3573], 'Camel Swivels'],
      ['red', 'Matchlockmen', [30.6616, 76.3674], 'Taqi Khan’s Jezailchis'], ['red', 'Zamburak', [30.6616, 76.3674], 'Camel Swivels'],
      ['red', 'Zamburak', [30.6464, 76.3556], 'Camel Swivels'], ['red', 'Zamburak', [30.6464, 76.3556], 'Camel Swivels'],
      ['red', 'Mounted Matchlocks', [30.6618, 76.3774], 'Taqi Khan’s Qizilbash'], ['red', 'Mounted Matchlocks', [30.6618, 76.3774], 'Taqi Khan’s Qizilbash'],
      ['red', 'Irregular Sowars', [30.6292, 76.3454], 'Jahan Khan’s Horse'], ['red', 'Irregular Sowars', [30.6292, 76.3454], 'Jahan Khan’s Horse'],
      ['red', 'Irregular Sowars', [30.621, 76.3525], 'Jahan Khan’s Horse'], ['red', 'Irregular Sowars', [30.621, 76.3525], 'Jahan Khan’s Horse'],
      ['red', 'Irregular Sowars', [30.6695, 76.3922], 'Shah Pasand Khan’s Horse'], ['red', 'Irregular Sowars', [30.6695, 76.3922], 'Shah Pasand Khan’s Horse'],
      ['red', 'Irregular Sowars', [30.6613, 76.3993], 'Shah Pasand Khan’s Horse'], ['red', 'Irregular Sowars', [30.6613, 76.3993], 'Shah Pasand Khan’s Horse'],
      ['red', 'Irregular Sowars', [30.6537, 76.3807], 'Durrani Horse'], ['red', 'Irregular Sowars', [30.6537, 76.3807], 'Durrani Horse'],
      ['red', 'Irregular Sowars', [30.6298, 76.3676], 'Durrani Horse'], ['red', 'Irregular Sowars', [30.6298, 76.3676], 'Durrani Horse'],
    ],
    events: [
      { title: 'The gun on the hillock', history: 'On 9 March Ahmad Shah mounted the only heavy gun he had on a hillock that looked over the Mughal camp. Its shot fell among the tents and the baggage animals, and the wazir could no longer wait for the Afghans to starve.', round: 7, side: 'red', text: 'The Shah mounted his heavy gun on a hillock over the Mughal camp', flash: 'THE GUN ON THE HILLOCK', hurt: { at: 'manupur', hp: 1 } },
      { title: 'The wazir is struck', history: 'On the morning of 11 March, as Qamar-ud-din Khan sat at prayer in his tent, a cannon ball struck him in the waist, and he died of the wound. His son Muin-ul-Mulk hid his death, told only the captains, and led the army out to battle. When Ishwari Singh learned of it, his Rajputs on the left broke and fled.', round: 9, side: 'azure', text: 'A cannon ball struck the wazir at his prayers; Ishwari Singh’s Rajputs fled the field', flash: 'THE WAZIR IS STRUCK', falls: 'azure', depart: ['Ishwari Singh’s Rajputs', 'Kachhwaha Foot'] },
      { title: 'The rockets catch fire', history: 'In the thick of the fighting the rockets the Afghans had taken from the Lahore arsenal caught fire, perhaps through carelessness. Thousands flew up and set off the Afghan powder; about a thousand Afghans and Persians were burnt, and the Shah’s ranks broke into disorder.', round: 9, side: 'red', text: 'The rockets taken at Lahore caught fire and blew up the Afghan powder', flash: 'THE ROCKETS CATCH FIRE', hurt: { at: 'durranilines', hp: 2 } },
    ],
    powers: [
      { id: 'mughal', name: 'The Imperial Camp', chief: 'Qamar-ud-din Khan', seat: 'manupur', npc: false, side: 'azure', color: '#3f6f4f', note: 'Manupur and the villages round the camp', extraSeats: ['samrala', 'khanna', [30.89, 76.195], [30.78, 76.08]] },
      { id: 'durrani', name: 'The Shah’s Lines', chief: 'Ahmad Shah Durrani', seat: 'durranilines', npc: false, side: 'red', color: '#4a4a4a', note: 'Sirhind, its gardens and the Shah’s lines', extraSeats: ['sirhind', 'sirhindfort', 'badshahibagh', [30.53, 76.55], [30.53, 76.38]] },
    ],
    labels: [
      { text: 'MALWA', lat: 30.60, lon: 76.20, cls: 'region', tier: 1 },
    ],
  },

  // Murree, September 1857, after Cave-Browne, The Punjab and Delhi in 1857 II
  // (1861), pp. 223–26, quoting the Punjab Mutiny Report, with the Rawalpindi
  // District Gazetteer on the Dhund rising. The hill station held the wives and
  // children of the northern stations, a few convalescents from the European
  // regiments and two companies of Sikhs sent up from Hazara. At the beginning
  // of September the Dhund clans round Murree, with men from the Karral and
  // Hazara country, planned to rise on every side at night; Hakim Khan, one of
  // Lady Lawrence's attendants and a man of one of the clans, gave warning.
  // Major Luard of the 55th N.I. and Captain H. C. Johnstone of the 5th N.I.
  // organised the volunteers, gathered the families in the barrack square and
  // held the three weakest points; the clans came up the hillsides in the
  // night, found the station ready, skirmished for some hours and drew off.
  // Major Becher sent every man he could spare from Abbottabad, who narrowly
  // missed a Karral ambush on the way. Numbers are not given; formations here
  // are of 100. 500 m hexes. Rounds are three hours, from 9 p.m. on 1 September.
  murree: {
    title: 'The Rising at Murree',
    year: 1857,
    region: 'Murree Hills',
    blurb: 'September 1857. The hill station of Murree holds the wives and children of every station from Jhelum to Peshawar, guarded by a few sick men of the European regiments and two companies of Sikhs. Every fit soldier in the Punjab has gone to Delhi. The Dhund clans of the hills round Murree, with men from the Karral and Hazara country, have agreed to rise on every side in one night.',
    first: 'azure',
    standards: { azure: 'tribal', red: 'punjab', by: [['Convalescents|Volunteers', 'company']] },  // battle standards when a unit's name does not say
    vpTarget: Infinity,
    roundLimit: 8,
    menPerFormation: 100,
    clock: { day: 1, month: 'September', from: 21, hours: 3 },
    goal: {
      forts: ['barracks'], attacker: 'azure', short: 'Take the barrack square',
      attackerWins: 'The clans are in the barrack square and Murree is theirs. The news runs down the Galis road to Hazara and across the river into Kashmir territory, and every hill clan from the Indus to the Jhelum is up.',
      defenderWins: 'The station was waiting. After some hours of skirmishing on the hillsides the clans draw off, and the relief from Abbottabad comes up the Galis road. Murree is safe, and the plot is found to reach far into Hazara and nearly down to Rawalpindi.',
    },
    sides: {
      azure: { name: 'The Dhund Rising', short: 'Dhunds', adj: 'Dhund', pitch: 'Your clans hold the spurs and villages all round the station, and the Karrals are coming down from the north. Climb in the dark, cut the Rawalpindi road, and take the barrack square where the families are gathered, before the relief comes from Abbottabad.', tag: 'Moves first · take the barrack square by night' },
      red: { name: 'The Murree Garrison', short: 'Murree', adj: 'British', pitch: 'You have two companies of Sikhs, a few score convalescents, the police and every man who can carry a musket. Hakim Khan has warned you. Hold the barrack square, Kuldana and the road, and wait for Becher’s men from Abbottabad.', tag: 'Moves second · hold the barrack square' },
    },
    generals: {
      azure: { name: 'Sardar Sher Baz Khan', title: 'A leader of the Dhund rising', leads: 'Sher Baz Khan’s Men' },
      red: { name: 'Major Luard', title: '55th Bengal N.I., commanding the volunteers', leads: 'Murree Volunteers' },
    },
    // The Rawalpindi road; the clans' own villages.
    homeBase: { red: [33.84, 73.31], azure: [[33.83, 73.50], [33.95, 73.50]] },
    walls: { barracks: 1 },  // a cordon of sentries round the square
    strongpoints: ['barracks', 'murree', 'kuldana', 'ghoragali'],
    startOwners: { barracks: 'red', murree: 'red', kuldana: 'red', ghoragali: 'red' },
    startUnits: [
      // The station.
      ['red', 'Line Infantry', 'barracks', 'Murree Volunteers', 4], ['red', 'Line Infantry', 'barracks', 'Convalescents, HM Regiments', 3],
      ['red', 'Khalsa Infantry', 'kuldana', 'Hazara Sikh Company'], ['red', 'Khalsa Infantry', 'murree', 'Hazara Sikh Company'],
      ['red', 'Line Infantry', [33.9257, 73.4416], 'Convalescents, HM Regiments', 3], ['red', 'Matchlockmen', 'bansragali', 'Murree Police', 3],
      ['red', 'Matchlockmen', 'ghoragali', 'Ghora Gali Police Post', 2, { post: true }],
      // The clans, on the spurs and in the villages round the station.
      ['azure', 'Dhal & Talwar', [33.9480, 73.4640], 'Sher Baz Khan’s Men'], ['azure', 'Matchlockmen', [33.9480, 73.4640], 'Dhund Matchlockmen'],
      ['azure', 'Dhal & Talwar', [33.9489, 73.4774], 'Dhund Clansmen'], ['azure', 'Matchlockmen', [33.9489, 73.4774], 'Dhund Matchlockmen'],
      ['azure', 'Dhal & Talwar', [33.9935, 73.4455], 'Dhund Clansmen'], ['azure', 'Matchlockmen', 'phagwari', 'Dhund Matchlockmen'],
      ['azure', 'Dhal & Talwar', 'patriata', 'Dhund Clansmen'], ['azure', 'Matchlockmen', 'patriata', 'Satti Matchlockmen'],
      ['azure', 'Dhal & Talwar', [33.8281, 73.4756], 'Dhund Clansmen'], ['azure', 'Matchlockmen', [33.8650, 73.4400], 'Dhund Matchlockmen'],
      ['azure', 'Dhal & Talwar', [33.9738, 73.3933], 'Karral Clansmen'], ['azure', 'Matchlockmen', [33.9738, 73.3933], 'Karral Matchlockmen'],
      ['azure', 'Dhal & Talwar', 'changla', 'Karral Clansmen'], ['azure', 'Matchlockmen', [34.0154, 73.3936], 'Hazara Clansmen'],
      ['azure', 'Dhal & Talwar', [34.0211, 73.4221], 'Karral Clansmen'], ['azure', 'Dhal & Talwar', [33.8400, 73.3900], 'Dhund Clansmen'],
    ],
    reinforcements: [
      { round: 7, side: 'red', at: [34.03, 73.37], name: 'Becher’s relief from Abbottabad', note: 'came down the Galis road from Abbottabad', history: 'At the urgent request of Mr Thornton, the Commissioner, Major Becher sent from Abbottabad every man he could spare. They crossed difficult country of defiles; the Karrals laid an ambush for them, but the road it covered had been made impassable by the rains, and the column turned off and passed by, learning of its danger only afterwards.', units: [['Khalsa Infantry', 'Becher’s Sikhs'], ['Matchlockmen', 'Hazara Levies']] },
    ],
    events: [
      { title: 'Hakim Khan’s warning', history: 'Hakim Khan, one of Lady Lawrence’s personal attendants and himself an influential man of one of the clans that rose, warned the officers of the plot. The ladies and children were gathered in the barrack square, a cordon of sentries was set round the station, and the three weakest points were held in some force.', round: 1, side: 'red', text: 'Hakim Khan warned the station of the rising', flash: 'HAKIM KHAN’S WARNING' },
      { title: 'Traitors within', history: 'Several of the station’s table-servants were in league with the hillmen, and two Hindustani native doctors practising in Murree were afterwards found guilty of a share in the plot. For some hours the danger was very great.', round: 3, side: 'azure', text: 'Servants in league with the clans opened the way into the station', flash: 'TRAITORS WITHIN', hurt: { at: 'murree', hp: 1 } },
    ],
    powers: [
      { id: 'station', name: 'Murree Station', chief: 'The Commissioner', seat: 'murree', npc: false, side: 'red', color: '#4a5a7a', note: 'The station, the barracks and the Rawalpindi road', extraSeats: ['barracks', 'kuldana', 'bansragali', 'ghoragali', [33.84, 73.31]] },
      { id: 'dhund', name: 'The Dhund Hills', chief: 'The Dhund chiefs', seat: [33.9394, 73.4464], npc: false, side: 'azure', color: '#3f6a3f', note: 'The clans’ villages on the spurs', extraSeats: ['patriata', 'phagwari', 'changla', [33.83, 73.50], [33.95, 73.50]] },
    ],
    labels: [
      { text: 'MURREE HILLS', lat: 33.955, lon: 73.43, cls: 'region', tier: 1 },
    ],
  },

  // Jammu, February–March 1845, after G. Carmichael Smyth, A History of the
  // Reigning Family of Lahore (1847), ch. IX, "The Expedition to Jummoo",
  // with the Encyclopaedia of Sikhism on Fateh Singh Man and Gulab Singh.
  // After the killing of the wazir Hira Singh in December 1844, the Darbar of
  // Jawahar Singh sent troops under Lal Singh, Sham Singh Attariwala, Fateh
  // Singh Man and Sultan Muhammad Khan against the Dogra places: Jasrota,
  // Samba and Ramnagar. At Jasrota six horse-artillery guns, once Raja Dhian
  // Singh's, went over to the Khalsa with their Sikh officer; Mian Jawahir
  // Singh, Hira Singh's brother, fell back to Jammu, and the army, some
  // 35,000 strong, took Samba and the country below the hills and was
  // ordered on to Jammu. Fateh Singh Man went into the town to treat; on his
  // way back to the camp at "Bobliana" his party was shot down at the
  // Soorghur barrier, a mile and a half out, by about 500 Dogras and
  // Rohillas (28 February). The army broke through the Dogra outposts to the
  // Tawi, crossed in three divisions while Ranjodh Singh Majithia came down
  // from the hills on the fourth side, and pressed the town for days. Gulab
  // Singh then won over the regimental panches with a gold bangle and
  // twenty-five rupees a man and went back to Lahore with the army. Smyth
  // gives no dates before the 28th; the opening of the campaign is set two
  // weeks earlier. The Dogra strength is the game's. Rounds are days.
  jammu1845: {
    title: 'The Siege of Jammu',
    year: 1845,
    era: 'civil',
    region: 'Tawi · Jammu',
    blurb: 'February 1845. The wazir Hira Singh is dead, killed by the Khalsa army he ruled through, and his uncle Raja Gulab Singh has carried the treasure of the Dogra brothers to Jammu. The Darbar has sent its army after it: Lal Singh, Sham Singh Attariwala, old Fateh Singh Man and Sultan Muhammad Khan, with Avitabile’s, Court’s and the Povindea divisions behind them. First the Dogra forts below the hills must fall: Jasrota, Samba and Ramnagar.',
    first: 'red',
    standards: { azure: 'khalsa', red: 'dogra', by: [['Ghorcharas|Sultan Muhammad|Fateh Singh Man', 'nishan'], ['Rohillas', 'tribal']] },  // battle standards when a unit's name does not say
    vpTarget: Infinity,
    roundLimit: 21,
    clock: { day: 15, month: 'February', from: 6, hours: 24 },
    goal: {
      // The historic win: the posts below the hills taken and Jammu invested,
      // when the Raja submits. Storming Jammu or taking him wins outright too.
      forts: ['jasrota', 'samba', 'hiranagar', 'ramnagar'], invest: 'jammu', prize: 'jammu', attacker: 'azure', general: true,
      short: 'Take Jasrota, Samba, Hiranagar and Ramnagar and invest Jammu',
      attackerWins: 'Jasrota, Samba, Hiranagar and Ramnagar have fallen and Jammu is invested. Gulab Singh submits. He rides to Lahore as a hostage inside the army that came for him, and is let go only on promising the Darbar a heavy fine.',
      prizeWins: 'Jammu is stormed and sacked, and the treasure of the Dogra brothers is the Khalsa’s. Gulab Singh is a fugitive in the hills, and the Darbar’s writ runs to the mountains.',
      generalWins: 'Raja Gulab Singh is in the army’s hands. He is carried to Lahore under guard to answer for the treasure and for Fateh Singh Man.',
      defenderWins: 'The Raja’s posts below the hills still stand and Jammu was never shut in. The regiments have taken Gulab Singh’s gold instead: every man a bangle and twenty-five rupees. The army marches back to Lahore with nothing to show the Darbar.',
    },
    sides: {
      azure: { name: 'The Khalsa Army', short: 'Khalsa', adj: 'Sikh', pitch: 'Your army is gathering at Sialkot, with Fateh Singh Man’s and Sultan Muhammad Khan’s columns out at Zafarwal, and the great divisions a few days behind. Take Jasrota, Samba, Hiranagar and Ramnagar, then cross the Tawi and close on Jammu from two sides or more, and the Raja must submit. Do it before his gold reaches your panches on the 5th of March.', tag: 'Moves second · take the four posts and invest Jammu by 7 March' },
      red: { name: 'Raja Gulab Singh', short: 'Dogras', adj: 'Dogra', pitch: 'You hold Jammu and Bahu Fort, Mian Jawahir Singh holds Jasrota with Dhian Singh’s horse guns, and your posts hold Samba and Ramnagar. Your men are deserting. Keep one of your posts below the hills, or keep the army from shutting Jammu in, and stay out of its hands: the regiments can be bought.', tag: 'Moves first · keep a post, or keep Jammu open, until 7 March' },
    },
    generals: {
      azure: { name: 'Raja Lal Singh', title: 'Commanding the Darbar’s army against Jammu', leads: 'Lal Singh’s Battalions' },
      red: { name: 'Raja Gulab Singh', title: 'Raja of Jammu', leads: 'Gulab Singh’s Guard' },
    },
    // The roads back to Lahore by Sialkot and Zafarwal; the Raja's hills.
    homeBase: { azure: [[32.42, 74.43], [32.30, 75.12]], red: [[32.92, 74.98], [32.92, 75.22]] },
    walls: { jammu: 3, bahu: 2, samba: 1, jasrota: 2, ramnagar: 1, hiranagar: 1, sialkot: 1 },
    strongpoints: ['jammu', 'bahu', 'samba', 'jasrota', 'hiranagar', 'ramnagar', 'sialkot'],
    startOwners: { jammu: 'red', bahu: 'red', samba: 'red', jasrota: 'red', hiranagar: 'red', ramnagar: 'red', sialkot: 'azure' },
    startUnits: [
      // Jammu and Bahu Fort, and the posts on the roads south.
      ['red', 'Matchlockmen', 'jammu', 'Gulab Singh’s Guard', 5, { post: true }], ['red', 'Light Field Gun', 'jammu', 'Dogra Topkhana'],
      ['red', 'Matchlockmen', 'bahu', 'Bahu Fort Garrison', 4, { post: true }], ['red', 'Light Field Gun', 'bahu', 'Dogra Topkhana'],
      ['red', 'Khalsa Infantry', [32.7400, 74.8550], 'Dogra Regulars'], ['red', 'Matchlockmen', [32.7400, 74.8550], 'Jammu Garrison', 4, { post: true }],
      ['red', 'Khalsa Infantry', [32.7350, 74.8850], 'Dogra Regulars'], ['red', 'Irregular Sowars', [32.7450, 74.8700], 'Gulab Singh’s Horse'],
      ['red', 'Matchlockmen', 'soorghur', 'Rohillas', 4], ['red', 'Khalsa Infantry', [32.6383, 74.9152], 'Dogra Regulars'],
      ['red', 'Matchlockmen', 'bishnah', 'Dogra Outpost', 3], ['red', 'Irregular Sowars', [32.7604, 74.9506], 'Dogra Horse'],
      ['red', 'Dhal & Talwar', [32.7985, 74.7828], 'Hill Levies'], ['red', 'Matchlockmen', 'purmandal', 'Purmandal Post', 3],
      // Mian Jawahir Singh at Jasrota with the horse guns; the posts at Samba and Ramnagar.
      ['red', 'Khalsa Infantry', 'jasrota', 'Mian Jawahir Singh’s Regiment'], ['red', 'Horse Artillery', 'jasrota', 'Dhian Singh’s Horse Guns'],
      ['red', 'Matchlockmen', 'hiranagar', 'Hiranagar Garrison', 4, { post: true }], ['red', 'Matchlockmen', 'samba', 'Samba Garrison', 4, { post: true }],
      ['red', 'Matchlockmen', 'ramnagar', 'Ramnagar Garrison', 3, { post: true }], ['red', 'Dhal & Talwar', [32.8114, 75.3999], 'Hill Levies'],
      // The Darbar's army gathered at Sialkot, with columns out at Zafarwal for Samba and Jasrota.
      ['azure', 'Matchlockmen', 'sialkot', 'Sialkot Garrison', 4, { post: true }], ['azure', 'Khalsa Infantry', 'sialkot', 'Lal Singh’s Battalions'],
      ['azure', 'Light Field Gun', [32.4779, 74.5725], 'Lahore Topkhana'], ['azure', 'Khalsa Infantry', [32.4779, 74.5725], 'Fauj-i-Ain Battalions'],
      ['azure', 'Khalsa Infantry', [32.4615, 74.5949], 'Fauj-i-Ain Battalions'], ['azure', 'Khalsa Infantry', [32.4572, 74.5468], 'Fauj-i-Ain Battalions'],
      ['azure', 'Irregular Sowars', [32.5417, 74.562], 'Sham Singh Attariwala’s Ghorcharas'], ['azure', 'Irregular Sowars', [32.5417, 74.562], 'Sham Singh Attariwala’s Ghorcharas'],
      ['azure', 'Irregular Sowars', [32.5016, 74.4853], 'Ghorcharas'],
      ['azure', 'Irregular Sowars', 'zafarwal', 'Fateh Singh Man’s Horse'], ['azure', 'Khalsa Infantry', 'zafarwal', 'Mewa Singh Majithia’s Battalions'],
      ['azure', 'Khalsa Infantry', [32.3477, 74.8778], 'Mewa Singh Majithia’s Battalions'], ['azure', 'Light Field Gun', [32.3477, 74.8778], 'Lahore Topkhana'],
      ['azure', 'Irregular Sowars', [32.3322, 74.9223], 'Sultan Muhammad Khan’s Horse'], ['azure', 'Irregular Sowars', [32.335, 74.9471], 'Sultan Muhammad Khan’s Horse'],
      ['azure', 'Khalsa Infantry', [32.3274, 74.9718], 'Fauj-i-Ain Battalions'],
    ],
    reinforcements: [
      { round: 4, side: 'azure', at: [32.42, 74.43], name: 'The great divisions', note: 'came up the road from Wazirabad to Sialkot', history: 'Behind the columns came the main body of the Khalsa army: General Avitabile’s four battalions, General Court’s division with its guns, and the Povindea division. All told the army sent against Jammu is put at 35,000 men.', units: [['Khalsa Infantry', 'Avitabile’s Battalions'], ['Khalsa Infantry', 'Avitabile’s Battalions'], ['Khalsa Infantry', 'Avitabile’s Battalions'], ['Khalsa Infantry', 'Avitabile’s Battalions'], ['Khalsa Infantry', 'Court’s Battalions'], ['Khalsa Infantry', 'Court’s Battalions'], ['Light Field Gun', 'Court’s Guns'], ['Khalsa Infantry', 'Povindea Division'], ['Khalsa Infantry', 'Povindea Division'], ['Khalsa Infantry', 'Povindea Division'], ['Heavy Battery', 'Lahore Heavy Guns']] },
      { round: 16, side: 'azure', at: [32.92, 74.98], name: 'Ranjodh Singh Majithia', note: 'came down from the hills on the fourth side of Jammu', history: 'While the three divisions crossed the Tawi and invested the town on three sides, Ranjodh Singh Majithia advanced from the hills and took up a position on the fourth side, so that Jammu was completely surrounded.', units: [['Khalsa Infantry', 'Ranjodh Singh’s Battalions'], ['Khalsa Infantry', 'Ranjodh Singh’s Battalions'], ['Irregular Sowars', 'Ranjodh Singh’s Horse']] },
    ],
    events: [
      { title: 'The horse guns go over', history: 'On the approach of the Darbar’s troops, six horse-artillery guns that had belonged to Raja Dhian Singh, then in the charge of a Sikh officer named Attar Singh, left Jasrota and joined the Khalsa force. Many more of Mian Jawahir Singh’s troops deserted in the following days.', round: 3, side: 'red', text: 'Dhian Singh’s horse guns left Jasrota and went over to the Khalsa', flash: 'THE HORSE GUNS GO OVER', defect: { to: 'azure', names: ['Dhian Singh’s Horse Guns'] } },
      { title: 'The ambush at the Soorghur', history: 'Fateh Singh Man, a brave old chief of Ranjit Singh’s best days, alone of the chiefs went into Jammu to treat, with Wazir Bachna and a munshi. After three days Gulab Singh sent them back with about three lakhs as an earnest and rode with them out of the town. A mile and a half out, at a barrier called the Soorghur at the edge of a hunting jungle, some five hundred Dogras and Rohillas fell on them, and with one volley killed the three envoys and seventeen of their escort. Gulab Singh disclaimed any part in it.', round: 14, side: 'red', text: 'Fateh Singh Man and the envoys were shot down at the Soorghur barrier', flash: 'THE AMBUSH AT THE SOORGHUR' },
      { title: 'The golden hen', history: 'Gulab Singh kept a number of the regimental panches with him in Jammu, sent out his nephew Mian Jawahir Singh, a favourite of the Khalsa, and at last went out among the soldiers himself. He showed them where his family’s treasure lay buried round Jammu, and promised every man a gold bangle and twenty-five rupees. The soldiers called him the golden hen. Avitabile’s four battalions, the Povindea division and Court’s swore to stand by him.', round: 19, side: 'red', text: 'Gulab Singh bought Avitabile’s, Court’s and the Povindea divisions with gold', flash: 'THE GOLDEN HEN', defect: { to: 'red', names: ['Avitabile’s Battalions', 'Povindea Division', 'Court’s Battalions', 'Court’s Guns'] } },
    ],
    powers: [
      { id: 'jammu', name: 'Jammu', chief: 'Raja Gulab Singh', seat: 'jammu', npc: false, side: 'red', color: '#a85a3a', note: 'The Dogra capital, its forts and the hills behind', extraSeats: ['bahu', 'samba', 'jasrota', 'ramnagar', 'purmandal', 'hiranagar', [32.90, 74.98], [32.90, 75.22]] },
      { id: 'lahore', name: 'The Darbar’s Army', chief: 'Raja Lal Singh', seat: [32.385, 74.829], npc: false, side: 'azure', color: '#3f6f8f', note: 'The roads up from Sialkot and Zafarwal', extraSeats: [[32.36, 74.80], [32.36, 75.02], [32.3716, 75.0339]] },
    ],
    labels: [
      { text: 'Tawi', lat: 32.70, lon: 74.83, cls: 'water', tier: 1, angle: -20 },
    ],
  },

  // Batala, 1785, after Bhagat Singh, A History of the Sikh Misals (1993),
  // pp. 119 ff., J. D. Cunningham, A History of the Sikhs (1849), p. 118, and
  // Khushwant Singh, A History of the Sikhs I. Mahan Singh Sukerchakia,
  // insulted by Jai Singh Kanhaiya at Amritsar at Diwali 1784, drove him to
  // Majitha and then called in Jassa Singh Ramgarhia from his exile at
  // Tosham and Raja Sansar Chand of Kangra. Ramgarhia crossed the Beas; Sansar
  // Chand posted his men at Dinanagar; the allies met near Amritsar, where
  // Amar Singh Bagga, once a Kanhaiya associate, came over to them, and
  // marched on Batala. Near Achal, at a village the sources call Randpura,
  // after six hours' fighting Gurbakhsh Singh, Jai Singh's son, was killed by
  // an arrow; Jai Singh, broken, was led away, and Gurbakhsh's widow Sada
  // Kaur escaped barefoot to the fort at Sohian. Ramgarhia made Batala his
  // headquarters. Numbers are not given; the strengths are the game's.
  // Rounds are days.
  batala: {
    title: 'The Battle of Batala',
    year: 1785,
    region: 'Majha · Batala',
    blurb: '1785. At Diwali in Amritsar, Jai Singh Kanhaiya, the most powerful chief in the Punjab, called young Mahan Singh Sukerchakia a dancing boy. Mahan Singh drove him out of Amritsar the same night, and has now called in Jassa Singh Ramgarhia, whom the Kanhaiyas drove into exile, and Raja Sansar Chand of Kangra, who wants his hill forts back. The allies are gathering near Amritsar. Jai Singh’s son Gurbakhsh Singh holds Batala.',
    first: 'red',
    standards: { azure: 'nishan', red: 'akali', by: [['Kangra|Sansar Chand|Katoch', 'hills']] },  // battle standards when a unit's name does not say
    vpTarget: Infinity,
    roundLimit: 10,
    goal: {
      forts: ['batala'], attacker: 'azure', general: true, short: 'Take Batala, or Jai Singh',
      attackerWins: 'Batala is taken. Jassa Singh Ramgarhia makes it his headquarters and recovers all his lost country; Sansar Chand has his hill forts back. Gurbakhsh Singh’s widow, Sada Kaur, will marry her daughter to Mahan Singh’s son Ranjit Singh, and the two misls will be one.',
      generalWins: 'Jai Singh Kanhaiya is taken. The old chief of the Kanhaiyas lays down his arms, and his misl’s power in the Majha is broken.',
      defenderWins: 'Batala holds and the alliance falls apart. Sansar Chand goes back to his hills and Jassa Singh Ramgarhia to his exile beyond the Sutlej, and the Kanhaiyas remain the first misl in the Punjab.',
    },
    sides: {
      azure: { name: 'Mahan Singh and his Allies', short: 'Allies', adj: 'Sukerchakia', pitch: 'Your Sukerchakia horse and Jassa Singh Ramgarhia’s men are together near Amritsar, and Raja Sansar Chand’s hillmen are at Dinanagar. March on Batala from two sides, bring the Kanhaiyas to battle, and take the town or Jai Singh.', tag: 'Moves second · take Batala or Jai Singh in 10 days' },
      red: { name: 'The Kanhaiya Misl', short: 'Kanhaiyas', adj: 'Kanhaiya', pitch: 'Your son Gurbakhsh Singh holds Batala, your posts hold Sohian, Gurdaspur and Fatehgarh, and your horse is the best in the Majha. Keep Batala and keep yourself out of their hands for ten days, and the alliance will fall apart.', tag: 'Moves first · hold Batala for 10 days' },
    },
    generals: {
      azure: { name: 'Sardar Mahan Singh Sukerchakia', title: 'Chief of the Sukerchakia misl', leads: 'Mahan Singh’s Sowars' },
      red: { name: 'Sardar Jai Singh Kanhaiya', title: 'Chief of the Kanhaiya misl', leads: 'Jai Singh’s Sowars' },
    },
    // The allies' roads home: Gujranwala beyond Amritsar, the hills beyond
    // Dinanagar; the Kanhaiyas' own country towards Mukerian.
    homeBase: { azure: [[31.50, 74.78], [31.56, 74.69], [32.17, 75.50]], red: [[31.66, 75.53], [32.12, 75.12]] },
    walls: { batala: 1, sohian: 2, amritsar: 1, gurdaspur: 1 },
    strongpoints: ['batala', 'amritsar', 'majitha', 'sohian', 'gurdaspur', 'dinanagar'],
    startOwners: { batala: 'red', sohian: 'red', gurdaspur: 'red', majitha: 'red', amritsar: 'azure', dinanagar: 'azure' },
    startUnits: [
      // The Kanhaiyas: Batala and the country round it.
      ['red', 'Irregular Sowars', 'batala', 'Jai Singh’s Sowars'], ['red', 'Matchlockmen', 'batala', 'Batala Garrison', 4, { post: true }],
      ['red', 'Irregular Sowars', 'randpura', 'Gurbakhsh Singh’s Horse'], ['red', 'Zamburak', 'randpura', 'Kanhaiya Swivels'],
      ['red', 'Irregular Sowars', 'achal', 'Kanhaiya Sowars'], ['red', 'Matchlockmen', 'achal', 'Kanhaiya Musketeers'],
      ['red', 'Irregular Sowars', 'qadian', 'Kanhaiya Sowars'], ['red', 'Irregular Sowars', [31.8877, 75.2088], 'Kanhaiya Sowars'],
      ['red', 'Irregular Sowars', 'kalanaur', 'Kanhaiya Sowars'], ['red', 'Matchlockmen', 'gurdaspur', 'Gurdaspur Garrison', 3, { post: true }],
      ['red', 'Irregular Sowars', 'fatehgarh', 'Amar Singh Bagga’s Horse'], ['red', 'Matchlockmen', 'majitha', 'Majitha Post', 3, { post: true }],
      ['red', 'Matchlockmen', 'sohian', 'Sada Kaur’s Guard', 3, { post: true }], ['red', 'Irregular Sowars', [31.8131, 74.9374], 'Kanhaiya Sowars'],
      // Mahan Singh and Jassa Singh Ramgarhia, met near Amritsar.
      ['azure', 'Matchlockmen', 'amritsar', 'Amritsar Garrison', 3, { post: true }], ['azure', 'Irregular Sowars', [31.5929, 74.8635], 'Mahan Singh’s Sowars'],
      ['azure', 'Irregular Sowars', [31.5929, 74.8635], 'Sukerchakia Sowars'], ['azure', 'Irregular Sowars', [31.5978, 74.8382], 'Sukerchakia Sowars'],
      ['azure', 'Irregular Sowars', [31.5978, 74.8382], 'Sukerchakia Sowars'], ['azure', 'Matchlockmen', [31.6143, 74.7996], 'Sukerchakia Musketeers'],
      ['azure', 'Zamburak', [31.6143, 74.7996], 'Sukerchakia Swivels'], ['azure', 'Irregular Sowars', [31.5774, 74.9074], 'Jassa Singh Ramgarhia’s Sowars'],
      ['azure', 'Irregular Sowars', [31.5774, 74.9074], 'Ramgarhia Sowars'], ['azure', 'Irregular Sowars', [31.6036, 74.909], 'Ramgarhia Sowars'],
      ['azure', 'Matchlockmen', [31.6036, 74.909], 'Ramgarhia Musketeers'],
      // Raja Sansar Chand's hillmen, posted at Dinanagar.
      ['azure', 'Matchlockmen', 'dinanagar', 'Katoch Matchlockmen'], ['azure', 'Light Field Gun', 'dinanagar', 'Kangra Guns'],
      ['azure', 'Dhal & Talwar', [32.1059, 75.5012], 'Kangra Hillmen'], ['azure', 'Dhal & Talwar', [32.1312, 75.3941], 'Kangra Hillmen'],
      ['azure', 'Irregular Sowars', [32.1059, 75.5012], 'Sansar Chand’s Horse'],
    ],
    events: [
      { title: 'Amar Singh Bagga comes over', history: 'When the allies met near Amritsar, Amar Singh Bagga, once an associate of the Kanhaiyas and an aide of Jai Singh, came over to them with his men.', round: 2, side: 'azure', text: 'Amar Singh Bagga left the Kanhaiyas and joined the allies', flash: 'AMAR SINGH BAGGA COMES OVER', defect: { to: 'azure', names: ['Amar Singh Bagga’s Horse'] } },
      { title: 'Gurbakhsh Singh is killed', history: 'After some six hours of fighting near Achal, Gurbakhsh Singh, Jai Singh’s son and heir, was struck by an arrow and killed. The old chief, broken by it, laid down his arms; two of his officers led him to safety, and Gurbakhsh’s widow, Sada Kaur, escaped barefoot to the fort at Sohian.', round: 5, side: 'red', text: 'Gurbakhsh Singh was killed by an arrow near Achal', flash: 'GURBAKHSH SINGH IS KILLED', depart: ['Gurbakhsh Singh’s Horse'] },
    ],
    powers: [
      { id: 'kanhaiya', name: 'The Kanhaiya Country', chief: 'Jai Singh Kanhaiya', seat: 'batala', npc: false, side: 'red', color: '#25347a', note: 'Batala and the Majha north of Amritsar', extraSeats: ['sohian', 'majitha', 'gurdaspur', 'qadian', 'kalanaur', 'fatehgarh', 'achal', [31.66, 75.53], [32.12, 75.12]] },
      { id: 'sukerchakia', name: 'The Allies’ Camp', chief: 'Mahan Singh', seat: 'amritsar', npc: false, side: 'azure', color: '#c87a1e', note: 'Amritsar and the road from Gujranwala', extraSeats: [[31.50, 74.78], [31.56, 74.69], [31.5929, 74.8635]] },
      { id: 'kangra', name: 'Sansar Chand’s Camp', chief: 'Raja Sansar Chand', seat: 'dinanagar', npc: false, side: 'azure', color: '#a8262f', note: 'Dinanagar and the road to the hills', extraSeats: [[32.17, 75.50]] },
    ],
    labels: [
      { text: 'MAJHA', lat: 31.74, lon: 75.05, cls: 'region', tier: 1 },
    ],
  },
};
