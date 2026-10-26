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
    vpTarget: Infinity,
    roundLimit: 19,
    goal: {
      fort: 'manglafort', attacker: 'red', short: 'Take Mangla',
      attackerWins: 'The walls of Mangla are breached and the Sikh garrison marches out. Khari Khariyali passes to the Dogras, who will hold it for 107 years.',
      defenderWins: 'The campaigning season ends with the Khalsa banner still flying over Mangla Fort.',
    },
    sides: {
      azure: { name: 'Khalsa Garrison', short: 'Khalsa', adj: 'Khalsa', pitch: 'Surat Singh’s Sikh troops hold the Khari jagirs east of the Jhelum: Aurangabad, Sukhchainpur, Kot Kandhari, Khari and Mangla Fort. No help will come from across the river. Hold Mangla until the season ends.', tag: 'Moves second · hold Mangla for 19 days' },
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
    walls: { manglafort: 2 },
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
      ['red', 'Irregular Sowars', [32.874, 73.86], 'Dogra Horse'], ['red', 'Irregular Sowars', [32.874, 73.86], 'Dogra Horse'],
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
    vpTarget: Infinity,
    roundLimit: 10,
    goal: {
      forts: ['rasul', 'lakhnawala', 'mong'], need: 2, attacker: 'red', short: 'Break the Sikh line',
      attackerWins: 'The Sikh line is broken: Sher Singh’s army is driven back over the Jhelum before Chattar Singh can join it.',
      defenderWins: 'As in January 1849, the Khalsa line still stands from Rasul to the villages: Gough has bled his army in the jungle, and Chattar Singh’s army is coming down to join Sher Singh.',
    },
    sides: {
      azure: { name: 'Khalsa Army', short: 'Khalsa', adj: 'Khalsa', pitch: 'Sher Singh’s battalions hold the Rasul ridges and the jungle south of them, with the Jhelum at their backs and Chattar Singh’s army coming on day 8. Keep Rasul, Lakhnawala and Mong until the campaign closes: lose two of them at the end of a day and the line is broken.', tag: 'Moves second · hold the line for 10 days' },
      red: { name: 'Army of the Punjab', short: 'British', adj: 'British', pitch: 'Gough’s army marches up from Helan and Dinga. Drive in the Chillianwala outpost, find a way through the jungle, and break the Sikh line: hold two of Rasul, Lakhnawala and Mong at the end of a day.', tag: 'Moves first · break the line' },
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
      { round: 8, side: 'azure', at: [32.70, 73.50], name: 'Chattar Singh’s army', note: 'came down from Attock and crossed the Jhelum', units: [['Khalsa Infantry', 'Chattar Singh’s Hazara Battalions'], ['Khalsa Infantry', 'Chattar Singh’s Battalions'], ['Irregular Sowars', 'Ghorcharas'], ['Irregular Sowars', 'Ghorcharas']] },
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
    vpTarget: Infinity,
    roundLimit: 7,
    goal: {
      fort: 'gujrat', attacker: 'red', short: 'Take Gujrat',
      attackerWins: 'The Sikh line breaks under the guns and Gujrat falls. Within three weeks Sher Singh and Chattar Singh lay down their arms near Rawalpindi, and the Punjab is annexed.',
      defenderWins: 'The Khalsa army still holds Gujrat as the campaign closes: Gough has not broken it, and the war goes on.',
    },
    sides: {
      azure: { name: 'Khalsa Army', short: 'Khalsa', adj: 'Khalsa', pitch: 'Sher Singh’s battalions and guns hold Gujrat behind the Dwara and the Kalra villages, with Afghan horse on the right and Ghorcharas on the left. Hold Gujrat until the campaign closes, or break Gough before his reinforcements arrive.', tag: 'Moves first · hold Gujrat for 7 days' },
      red: { name: 'Army of the Punjab', short: 'British', adj: 'British', pitch: 'Gough’s army lies on the Chenab south-west of Gujrat. Gather Whish (day 3), Dundas (day 4) and Markham (day 5), move up by Trikha and Shadiwal, and break the Sikh line from the south with the heavy guns.', tag: 'Moves second · take Gujrat' },
    },
    generals: {
      azure: { name: 'Raja Sher Singh Attariwala', title: 'Commander of the Khalsa army', leads: 'Sher Singh’s Battalions' },
      red: { name: 'Lord Gough', title: 'Commander-in-Chief, India', leads: 'HM 29th Foot' },
    },
    // Each army's road home: the Sikhs' back through the Pabbi hills towards
    // Jhelum, the British across the Chenab towards Lahore.
    homeBase: { azure: [32.92, 73.80], red: [32.25, 73.95] },
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
      ['azure', 'Khalsa Infantry', 'kunjah', 'Khalsa Battalions'], ['azure', 'Irregular Sowars', 'kunjah', 'Ghorcharas'],
      ['azure', 'Khalsa Infantry', 'jalalpur', 'Khalsa Battalions'], ['azure', 'Irregular Sowars', 'jalalpur', 'Ghorcharas'],
      ['azure', 'Irregular Sowars', 'kharian', 'Ghorcharas'],
      ['azure', 'Khalsa Infantry', [32.48, 74.10], 'Ford Party'], ['azure', 'Irregular Sowars', [32.48, 74.10], 'Ghorcharas'],
      ['azure', 'Irregular Sowars', [32.58, 74.01], 'Afghan Horse'], ['azure', 'Irregular Sowars', [32.565, 73.995], 'Afghan Horse'],
      ['azure', 'Irregular Sowars', [32.57, 74.13], 'Ghorcharas'],
      ['azure', 'Matchlockmen', 'sarai', 'Sarai Alamgir Post'], ['azure', 'Irregular Sowars', 'rasul', 'Rasul Post'],
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
      { round: 3, side: 'red', at: [32.42, 73.90], name: 'Whish’s division', note: 'came up from Multan with the siege train', units: [['Line Infantry', 'HM 10th Foot'], ['Line Infantry', 'HM 32nd Foot'], ['Sepoy Infantry', '8th Bengal NI'], ['Heavy Battery', 'Multan Siege Train']] },
      { round: 4, side: 'red', at: [32.42, 73.90], name: 'Dundas’s Bombay column', note: 'arrived by forced marches', units: [['Line Infantry', 'HM 60th Rifles'], ['Line Infantry', '1st Bombay Fusiliers'], ['Irregular Sowars', 'Scinde Horse'], ['Horse Artillery', 'Bombay Horse Artillery']] },
      { round: 5, side: 'red', at: [32.43, 73.99], name: 'Markham’s brigade', note: 'crossed the Chenab at Kanokee in boats sent up from Ramnagar', units: [['Sepoy Infantry', '46th Bengal NI'], ['Sepoy Infantry', '72nd Bengal NI']] },
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
    title: 'The Siege of Multan, 1818',
    year: 1818,
    region: 'Multan',
    blurb: '1818. Ranjit Singh has sent his son Kharak Singh, with Misr Diwan Chand in command, to take Multan from its Afghan governor, Nawab Muzaffar Khan Sadozai. The Nawab holds the walled city and its citadel, with garrisons in Shujabad, Muzaffargarh and Khangarh and levies in the field. The Sikh army comes down the Lahore road; the great Zamzama gun is being dragged after it.',
    first: 'red',
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
    homeBase: { azure: null, red: [30.32, 71.64] },
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
      ['red', 'Khalsa Infantry', [30.29, 71.61], 'Diwan Chand’s Battalions'], ['red', 'Khalsa Infantry', [30.29, 71.61], 'Khalsa Battalions'],
      ['red', 'Khalsa Infantry', [30.30, 71.585], 'Khalsa Battalions'], ['red', 'Khalsa Infantry', [30.30, 71.585], 'Khalsa Battalions'],
      ['red', 'Dhal & Talwar', [30.28, 71.635], 'Akali Nihangs'], ['red', 'Dhal & Talwar', [30.28, 71.635], 'Dogra Rajputs'],
      ['red', 'Matchlockmen', [30.31, 71.61], 'Ramgarhia Sikhs'], ['red', 'Zamburak', [30.31, 71.61], 'Camel Guns'],
      ['red', 'Light Field Gun', [30.295, 71.635], 'Ilahi Bakhsh’s Topkhana'], ['red', 'Light Field Gun', [30.295, 71.635], 'Ilahi Bakhsh’s Topkhana'],
      ['red', 'Light Field Gun', [30.31, 71.635], 'Ilahi Bakhsh’s Topkhana'],
      ['red', 'Irregular Sowars', [30.27, 71.60], 'Ghorcharas'], ['red', 'Irregular Sowars', [30.27, 71.60], 'Ghorcharas'],
      ['red', 'Irregular Sowars', [30.285, 71.56], 'Hari Singh Nalwa’s Horse'], ['red', 'Irregular Sowars', [30.285, 71.56], 'Ghorcharas'],
    ],
    reinforcements: [
      { round: 8, side: 'red', at: [30.31, 71.63], name: 'The Zamzama', note: 'was dragged down from Lahore', units: [['Great Gun', 'Zamzama'], ['Khalsa Infantry', 'Beldars and Escort']] },
    ],
    powers: [
      { id: 'sadozai', name: 'Sadozai Multan', chief: 'Nawab Muzaffar Khan', seat: 'multan', npc: false, side: 'azure', color: '#3f6f8f', note: 'The Nawab’s province', extraSeats: ['shujabad', 'muzaffargarh', 'khangarh'] },
    ],
    labels: [
      { text: 'Chenab', lat: 30.02, lon: 71.25, cls: 'water', tier: 1, angle: 70 },
    ],
  },

  // Multan, 1848-49. Mulraj, governor of Multan, rose after Vans Agnew and
  // Anderson were killed there in April 1848. Herbert Edwardes raised Pathan
  // levies beyond the Indus and, with Van Cortlandt's regiments and the Nawab
  // of Bahawalpur's army, beat Mulraj's field army at Kineyri (18 June) and
  // Saddusam (early July), took Shujabad and Sikandarabad, and shut him up in
  // Multan. Whish's division came with the Bengal siege train in August; after
  // Sher Singh changed sides in September the siege was raised, and resumed
  // with the Bombay column in December: the magazine blew up on 30 December,
  // the city was stormed on 2 January 1849, and Mulraj surrendered the citadel
  // on the 22nd. The months are compressed: the campaign opens in June and a
  // round is a day's march, not a day of the calendar.
  multan1849: {
    map: 'multan', group: 'multan1849', mode: 'open',
    title: 'The Multan Campaign, 1848–49',
    year: 1848,
    region: 'Multan',
    blurb: 'Summer 1848. Diwan Mulraj, governor of Multan, has risen against the Lahore Darbar and its British residents. His field army holds the Chenab at Kineyri and the forts around the city. Herbert Edwardes comes in from beyond the Indus with Pathan levies and Van Cortlandt’s regiments; the Nawab of Bahawalpur’s army marches up from the south. Behind them, Whish’s division and the siege trains from Bengal and Bombay are on the road.',
    first: 'red',
    vpTarget: Infinity,
    roundLimit: 30,
    goal: {
      fort: 'multanfort', attacker: 'red', short: 'Take the citadel',
      attackerWins: 'The breaches are stormed and the citadel, its magazine blown and its walls mined, gives in: Mulraj walks out with his last 550 men.',
      defenderWins: 'Multan still holds as the campaign closes, and the rising spreads across the Punjab.',
    },
    sides: {
      azure: { name: 'Mulraj’s Multan', short: 'Mulraj', adj: 'Multani', pitch: 'Mulraj’s field army holds the Kineyri ferry and the forts round Multan. Beat Edwardes and the Bahawalpur army in the field before the British siege trains arrive, then hold the citadel until the campaign closes.', tag: 'Moves second · hold the citadel for 30 days' },
      red: { name: 'Edwardes and the British', short: 'British', adj: 'British', pitch: 'Edwardes’s Pathans come over the Chenab from the west, the Bahawalpur army from the south. Beat Mulraj in the field, take the outlying forts, and shut him up in Multan; Whish’s siege train arrives on day 8 and the Bombay column on day 15.', tag: 'Moves first · take the citadel' },
    },
    generals: {
      azure: { name: 'Diwan Mulraj', title: 'Governor of Multan', leads: 'Mulraj’s Guard' },
      red: { name: 'Lieutenant Herbert Edwardes', title: 'Political officer, raising levies beyond the Indus', leads: 'Edwardes’s Pathans' },
    },
    // Edwardes's road from Dera Ghazi Khan in the west; Bahawalpur's from the south.
    homeBase: { azure: null, red: [[30.07, 71.04], [29.85, 71.62]] },
    walls: { multan: 3, multanfort: 6 },  // the city walls, then the citadel on its mound
    events: [
      { round: 26, side: 'red', text: 'The great magazine in Multan’s citadel blew up', flash: 'THE MAGAZINE EXPLODES', walls: { multanfort: -1 }, hurt: { at: 'multanfort', hp: 2 } },
    ],
    strongpoints: ['multanfort', 'multan', 'shujabad', 'muzaffargarh', 'khangarh'],
    startOwners: { multanfort: 'azure', multan: 'azure', shujabad: 'azure', muzaffargarh: 'azure', khangarh: 'azure' },
    startUnits: [
      // Mulraj: the citadel, the city, the field army at the Kineyri ferry, the forts.
      ['azure', 'Khalsa Infantry', 'multanfort', 'Mulraj’s Guard'], ['azure', 'Light Field Gun', 'multanfort', 'Citadel Guns'],
      ['azure', 'Khalsa Infantry', 'multan', 'City Battalions'], ['azure', 'Matchlockmen', 'multan', 'Multani Levies'],
      ['azure', 'Khalsa Infantry', [29.885, 71.255], 'Mulraj’s Field Army'], ['azure', 'Light Field Gun', [29.885, 71.255], 'Field Guns'],
      ['azure', 'Khalsa Infantry', [29.90, 71.27], 'Mulraj’s Field Army'], ['azure', 'Irregular Sowars', [29.90, 71.27], 'Multani Horse'],
      ['azure', 'Matchlockmen', 'shujabad', 'Shujabad Garrison'],
      ['azure', 'Matchlockmen', 'sikandarabad', 'Sikandarabad Garrison'],
      ['azure', 'Matchlockmen', 'muzaffargarh', 'Muzaffargarh Garrison'],
      ['azure', 'Matchlockmen', 'khangarh', 'Khangarh Garrison'],
      ['azure', 'Irregular Sowars', [30.15, 71.40], 'Multani Horse'],
      // Edwardes from the west, the Bahawalpur army from the south.
      ['red', 'Matchlockmen', [30.02, 71.06], 'Edwardes’s Pathans'], ['red', 'Matchlockmen', [30.02, 71.06], 'Edwardes’s Pathans'],
      ['red', 'Matchlockmen', [29.97, 71.07], 'Edwardes’s Pathans'], ['red', 'Irregular Sowars', [29.97, 71.07], 'Pathan Horse'],
      ['red', 'Sepoy Infantry', [30.06, 71.06], 'Van Cortlandt’s Regiments'], ['red', 'Light Field Gun', [30.06, 71.06], 'Van Cortlandt’s Guns'],
      ['red', 'Matchlockmen', [29.86, 71.42], 'Bahawalpur Daudputras'], ['red', 'Matchlockmen', [29.86, 71.42], 'Bahawalpur Daudputras'],
      ['red', 'Irregular Sowars', [29.86, 71.46], 'Bahawalpur Horse'], ['red', 'Light Field Gun', [29.86, 71.46], 'Bahawalpur Guns'],
      ['red', 'Matchlockmen', [29.875, 71.44], 'Bahawalpur Daudputras'], ['red', 'Irregular Sowars', [29.99, 71.08], 'Pathan Horse'],
    ],
    reinforcements: [
      { round: 8, side: 'red', at: [30.38, 71.64], name: 'Whish’s division', note: 'came down from Lahore with the Bengal siege train', units: [['Line Infantry', 'HM 10th Foot'], ['Line Infantry', 'HM 32nd Foot'], ['Sepoy Infantry', '49th Bengal NI'], ['Sepoy Infantry', '72nd Bengal NI'], ['Heavy Battery', 'Bengal Siege Train'], ['Horse Artillery', 'Bengal Horse Artillery']] },
      { round: 15, side: 'red', at: [30.15, 71.46], name: 'The Bombay column', note: 'came up from Sindh and joined the siege camp with its own siege train', units: [['Line Infantry', 'HM 60th Rifles'], ['Line Infantry', '1st Bombay Fusiliers'], ['Sepoy Infantry', '3rd Bombay NI'], ['Heavy Battery', 'Bombay Siege Train'], ['Irregular Sowars', 'Scinde Horse']] },
    ],
    powers: [
      { id: 'mulraj', name: 'Mulraj’s Multan', chief: 'Diwan Mulraj', seat: 'multanfort', npc: false, side: 'azure', color: '#3f6f8f', note: 'The rebel province', extraSeats: ['multan', 'shujabad', 'sikandarabad', 'muzaffargarh', 'khangarh'] },
      { id: 'beyond', name: 'Beyond the Indus', chief: 'Lieutenant Edwardes', seat: [30.10, 71.04], npc: false, side: 'red', color: '#94493a', note: 'Where Edwardes raised his levies', extraSeats: [[29.85, 71.62]] },
    ],
    labels: [
      { text: 'Chenab', lat: 30.02, lon: 71.25, cls: 'water', tier: 1, angle: 70 },
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
    title: 'The Siege of Lahore, 1841',
    year: 1841,
    region: 'Lahore',
    blurb: 'January 1841. Maharaja Kharak Singh and his son Nau Nihal Singh are dead, and Kharak Singh’s widow, Maharani Chand Kaur, holds Lahore as regent, with Raja Gulab Singh’s Dogras in the fort. Kanwar Sher Singh, son of Ranjit Singh, comes down the Grand Trunk Road from Amritsar to take the throne, and the regiments at Mian Mir have declared for him. Round 1 is 12 January.',
    first: 'red',
    vpTarget: Infinity,
    roundLimit: 8,
    goal: {
      fort: 'lahorefort', attacker: 'red', short: 'Take Lahore Fort',
      attackerWins: 'The fort falls to Sher Singh. Chand Kaur gives up her claim for a jagir, Gulab Singh marches out at midnight with the treasury, and Sher Singh is proclaimed Maharaja of the Punjab.',
      defenderWins: 'Lahore Fort still holds for Chand Kaur. Sher Singh must treat with the regent’s party, and the Khalsa army grows restless in the city it has looted.',
    },
    sides: {
      azure: { name: 'Chand Kaur’s Garrison', short: 'Regency', adj: 'Regency', pitch: 'Gulab Singh’s Dogras hold Lahore Fort and the walled city for Maharani Chand Kaur. Hold the gardens and the river crossing as long as you can, then the walls: keep the fort for eight days, until terms can be made.', tag: 'Moves second · hold the fort for 8 days' },
      red: { name: 'Sher Singh’s Army', short: 'Sher Singh', adj: 'Khalsa', pitch: 'Sher Singh’s army comes down the road from Amritsar, and the Mian Mir regiments are with him. Clear the regent’s outposts, force the city gates, bring the guns up to the Badshahi Mosque and the walls, and take Lahore Fort.', tag: 'Moves first · take the fort' },
    },
    generals: {
      azure: { name: 'Raja Gulab Singh', title: 'Holding the fort for Maharani Chand Kaur', leads: 'Gulab Singh’s Dogras' },
      red: { name: 'Kanwar Sher Singh', title: 'Son of Ranjit Singh, claimant to the throne', leads: 'Sher Singh’s Battalions' },
    },
    homeBase: { azure: null, red: [31.59, 74.47] },
    walls: { lahorefort: 5, lahore: 2 },
    strongpoints: ['lahorefort', 'lahore', 'shalimar', 'shahdara', 'anarkali', 'mianmir'],
    startOwners: { lahorefort: 'azure', lahore: 'azure', shalimar: 'azure', shahdara: 'azure', anarkali: null, mianmir: 'red' },
    startUnits: [
      // Chand Kaur: the fort, the walled city, and outposts at Shalimar and the Shahdara ferry.
      ['azure', 'Dhal & Talwar', 'lahorefort', 'Gulab Singh’s Dogras'], ['azure', 'Light Field Gun', 'lahorefort', 'Fort Topkhana'],
      ['azure', 'Matchlockmen', 'lahore', 'Dogra Musketeers'], ['azure', 'Khalsa Infantry', 'lahore', 'Chand Kaur’s Guard'],
      ['azure', 'Matchlockmen', 'shalimar', 'Shalimar Guard'], ['azure', 'Irregular Sowars', 'shahdara', 'Dogra Horse'],
      // Sher Singh's army on the road from Amritsar, and the Mian Mir regiments.
      ['red', 'Khalsa Infantry', [31.605, 74.465], 'Sher Singh’s Battalions'], ['red', 'Khalsa Infantry', [31.605, 74.465], 'Khalsa Battalions'],
      ['red', 'Khalsa Infantry', [31.595, 74.455], 'Khalsa Battalions'], ['red', 'Khalsa Infantry', [31.595, 74.455], 'Khalsa Battalions'],
      ['red', 'Khalsa Infantry', [31.615, 74.455], 'Khalsa Battalions'], ['red', 'Khalsa Infantry', [31.615, 74.455], 'Khalsa Battalions'],
      ['red', 'Khalsa Infantry', [31.585, 74.465], 'Khalsa Battalions'], ['red', 'Khalsa Infantry', [31.585, 74.465], 'Khalsa Battalions'],
      ['red', 'Light Field Gun', [31.60, 74.445], 'Khalsa Topkhana'], ['red', 'Light Field Gun', [31.60, 74.445], 'Khalsa Topkhana'],
      ['red', 'Heavy Battery', [31.61, 74.468], 'Sher Singh’s Siege Guns'], ['red', 'Heavy Battery', [31.59, 74.468], 'Sher Singh’s Siege Guns'],
      ['red', 'Irregular Sowars', [31.625, 74.44], 'Ghorcharas'], ['red', 'Irregular Sowars', [31.625, 74.44], 'Ghorcharas'],
      ['red', 'Light Dragoons', [31.575, 74.45], 'Ghorchara Khas'], ['red', 'Irregular Sowars', [31.575, 74.45], 'Ghorcharas'],
      ['red', 'Khalsa Infantry', 'mianmir', 'Mian Mir Battalions'], ['red', 'Khalsa Infantry', 'mianmir', 'Mian Mir Battalions'],
      ['red', 'Light Field Gun', [31.54, 74.37], 'Mian Mir Topkhana'], ['red', 'Khalsa Infantry', [31.54, 74.37], 'Mian Mir Battalions'],
    ],
    reinforcements: [
      { round: 3, side: 'red', at: 'anarkali', name: 'The Fauj-i-Khas', note: 'came over to Sher Singh from Anarkali', units: [['Khalsa Infantry', 'Fauj-i-Khas'], ['Khalsa Infantry', 'Fauj-i-Khas']] },
    ],
    powers: [
      { id: 'regency', name: 'The regent’s Lahore', chief: 'Maharani Chand Kaur', seat: 'lahorefort', npc: false, side: 'azure', color: '#3f6f8f', note: 'The fort, the walled city and its outposts', extraSeats: ['lahore', 'shalimar', 'shahdara'] },
      { id: 'sher', name: 'Sher Singh’s camp', chief: 'Kanwar Sher Singh', seat: [31.60, 74.465], npc: false, side: 'red', color: '#94493a', note: 'The Khalsa army and the cantonments', extraSeats: ['mianmir', 'anarkali'] },
    ],
    labels: [
      { text: 'Ravi', lat: 31.635, lon: 74.27, cls: 'water', tier: 1, angle: -35 },
      { text: 'Grand Trunk Road', lat: 31.596, lon: 74.43, cls: 'route', tier: 2, angle: -8 },
    ],
  },
  // Historic mode: the second siege of Multan as it stood on 27 December
  // 1848, with Whish's Bengal division and the Bombay column round the city.
  multan1849h: {
    map: 'multan', group: 'multan1849', mode: 'historic',
    title: 'The Multan Campaign, 1848–49',
    year: 1848,
    region: 'Multan',
    blurb: 'December 1848: the siege as it stood. Diwan Mulraj holds the walled city and its citadel with some 12,000 men and over fifty guns. Major-General Whish, rejoined by the Bombay column, closes in with siege trains from Bengal and Bombay, Edwardes’s Pathan irregulars and the Nawab of Bahawalpur’s troops: about 32,000 men and 150 guns. Round 1 is 27 December.',
    first: 'red',
    vpTarget: Infinity,
    roundLimit: 26,
    goal: {
      fort: 'multanfort', attacker: 'red', short: 'Take the citadel',
      attackerWins: 'The breaches are stormed and the citadel, its magazine blown and its walls mined, gives in: Mulraj walks out with his last 550 men.',
      defenderWins: 'Multan still holds as the campaign closes, and Whish’s army is needed on the Chenab.',
    },
    sides: {
      azure: { name: 'Multan Garrison', short: 'Mulraj', adj: 'Multani', pitch: 'Mulraj’s battalions hold the suburbs, the walled city and the citadel. Make every breach cost the British, and hold the citadel until the campaign closes.', tag: 'Moves second · hold the citadel for 26 days' },
      red: { name: 'Multan Field Force', short: 'British', adj: 'British', pitch: 'Whish’s Bengal division, Dundas’s Bombay column, Edwardes’s irregulars and the Bahawalpur troops surround Multan. Clear the suburbs, bring up the siege trains, breach the walls and storm the citadel.', tag: 'Moves first · take the citadel' },
    },
    generals: {
      azure: { name: 'Diwan Mulraj', title: 'Governor of Multan', leads: 'Mulraj’s Guard' },
      red: { name: 'Major-General William Whish', title: 'Commanding the Multan Field Force', leads: 'HM 10th Foot' },
    },
    homeBase: { azure: null, red: [29.85, 71.62] },
    walls: { multan: 4, multanfort: 8 },
    events: [
      { round: 4, side: 'red', text: 'The great magazine in Multan’s citadel blew up', flash: 'THE MAGAZINE EXPLODES', walls: { multanfort: -1 }, hurt: { at: 'multanfort', hp: 2 } },
    ],
    strongpoints: ['multanfort', 'multan', 'shujabad', 'muzaffargarh', 'khangarh'],
    startOwners: { multanfort: 'azure', multan: 'azure', shujabad: 'red', muzaffargarh: 'red', khangarh: 'red' },
    startUnits: [
      ['azure', 'Khalsa Infantry', 'multanfort', 'Mulraj’s Guard'], ['azure', 'Light Field Gun', 'multanfort', 'Citadel Guns'],
      ['azure', 'Khalsa Infantry', 'multan', 'City Battalions'],
      ['azure', 'Khalsa Infantry', [30.207, 71.487], 'Multan Battalions'], ['azure', 'Light Field Gun', [30.207, 71.487], 'Multan Topkhana'],
      ['azure', 'Khalsa Infantry', [30.188, 71.462], 'Multan Battalions'], ['azure', 'Jingal', [30.188, 71.462], 'Wall Guns'],
      ['azure', 'Khalsa Infantry', [30.212, 71.458], 'Multan Battalions'], ['azure', 'Matchlockmen', [30.212, 71.458], 'Multani Levies'],
      ['azure', 'Matchlockmen', [30.185, 71.49], 'Multani Levies'], ['azure', 'Light Field Gun', [30.185, 71.49], 'Mortar Battery'],
      ['azure', 'Irregular Sowars', [30.225, 71.50], 'Multani Horse'],
      ['red', 'Line Infantry', [30.165, 71.50], 'HM 10th Foot'], ['red', 'Line Infantry', [30.165, 71.50], 'HM 32nd Foot'],
      ['red', 'Sepoy Infantry', [30.17, 71.525], '49th Bengal NI'], ['red', 'Sepoy Infantry', [30.17, 71.525], '51st Bengal NI'],
      ['red', 'Sepoy Infantry', [30.155, 71.48], '52nd Bengal NI'], ['red', 'Sepoy Infantry', [30.155, 71.48], '72nd Bengal NI'],
      ['red', 'Heavy Battery', [30.15, 71.505], 'Bengal Siege Train'], ['red', 'Heavy Battery', [30.15, 71.505], 'Bengal Siege Train'],
      ['red', 'Horse Artillery', [30.16, 71.535], 'Bengal Horse Artillery'],
      ['red', 'Line Infantry', [30.16, 71.455], 'HM 60th Rifles'], ['red', 'Line Infantry', [30.16, 71.455], '1st Bombay Fusiliers'],
      ['red', 'Sepoy Infantry', [30.15, 71.44], '3rd Bombay NI'], ['red', 'Sepoy Infantry', [30.15, 71.44], '19th Bombay NI'],
      ['red', 'Heavy Battery', [30.145, 71.465], 'Bombay Siege Train'], ['red', 'Horse Artillery', [30.145, 71.465], 'Bombay Horse Artillery'],
      ['red', 'Irregular Sowars', [30.17, 71.42], 'Scinde Horse'],
      ['red', 'Matchlockmen', [30.20, 71.42], 'Edwardes’s Pathans'], ['red', 'Matchlockmen', [30.20, 71.42], 'Edwardes’s Pathans'],
      ['red', 'Sepoy Infantry', [30.215, 71.43], 'Van Cortlandt’s Regiments'],
      ['red', 'Matchlockmen', [30.18, 71.545], 'Bahawalpur Daudputras'], ['red', 'Irregular Sowars', [30.18, 71.545], 'Bahawalpur Horse'],
      ['red', 'Matchlockmen', [30.215, 71.405], 'Edwardes’s Pathans'], ['red', 'Irregular Sowars', [30.215, 71.405], 'Pathan Horse'],
      ['red', 'Matchlockmen', [30.19, 71.565], 'Bahawalpur Daudputras'], ['red', 'Matchlockmen', [30.19, 71.565], 'Bahawalpur Daudputras'],
    ],
    powers: [
      { id: 'mulraj', name: 'Multan', chief: 'Diwan Mulraj', seat: 'multanfort', npc: false, side: 'azure', color: '#3f6f8f', note: 'The rebel city', extraSeats: ['multan'] },
      { id: 'company', name: 'British and allied ground', chief: 'Major-General Whish', seat: 'shujabad', npc: false, side: 'red', color: '#94493a', note: 'Held by the besiegers and their allies', extraSeats: ['muzaffargarh', 'khangarh', 'sikandarabad'] },
    ],
    labels: [
      { text: 'Chenab', lat: 30.02, lon: 71.25, cls: 'water', tier: 1, angle: 70 },
    ],
  },

  // Historic mode: the siege of Lahore from 13 January, Sher Singh's army
  // already round the city and the guns on the minarets.
  lahoreh: {
    map: 'lahore', group: 'lahore', mode: 'historic',
    title: 'The Siege of Lahore, 1841',
    year: 1841,
    region: 'Lahore',
    blurb: 'January 1841: the siege as it stood. Sher Singh’s Khalsa army, some 26,000 foot, 8,000 horse and 45 guns, is round the city; Raja Gulab Singh’s 5,000 Dogras and guards hold Lahore Fort and the walled city for Maharani Chand Kaur. Round 1 is 13 January; on the evening of the 17th Dhian Singh arranged a ceasefire.',
    first: 'red',
    vpTarget: Infinity,
    roundLimit: 5,
    goal: {
      fort: 'lahorefort', attacker: 'red', short: 'Take Lahore Fort',
      attackerWins: 'The fort falls to Sher Singh. Chand Kaur gives up her claim for a jagir, Gulab Singh marches out at midnight with the treasury, and Sher Singh is proclaimed Maharaja of the Punjab.',
      defenderWins: 'Lahore Fort still holds for Chand Kaur when the ceasefire comes. Sher Singh must treat with the regent’s party.',
    },
    sides: {
      azure: { name: 'Chand Kaur’s Garrison', short: 'Regency', adj: 'Regency', pitch: 'Gulab Singh’s Dogras hold Lahore Fort and the walled city for Maharani Chand Kaur. You are outnumbered six to one: hold the fort for five days, until terms can be made.', tag: 'Moves second · hold the fort for 5 days' },
      red: { name: 'Sher Singh’s Army', short: 'Sher Singh', adj: 'Khalsa', pitch: 'The Khalsa army has come over to Sher Singh. Force the city gates, bring the guns up to the Badshahi Mosque and the walls, and take Lahore Fort.', tag: 'Moves first · take the fort' },
    },
    generals: {
      azure: { name: 'Raja Gulab Singh', title: 'Holding the fort for Maharani Chand Kaur', leads: 'Gulab Singh’s Dogras' },
      red: { name: 'Kanwar Sher Singh', title: 'Son of Ranjit Singh, claimant to the throne', leads: 'Sher Singh’s Battalions' },
    },
    homeBase: { azure: null, red: [31.59, 74.47] },
    walls: { lahorefort: 5, lahore: 2 },
    strongpoints: ['lahorefort', 'lahore', 'shalimar', 'shahdara', 'anarkali', 'mianmir'],
    startOwners: { lahorefort: 'azure', lahore: 'azure', shalimar: 'red', shahdara: null, anarkali: null, mianmir: 'red' },
    startUnits: [
      ['azure', 'Dhal & Talwar', 'lahorefort', 'Gulab Singh’s Dogras'], ['azure', 'Light Field Gun', 'lahorefort', 'Fort Topkhana'],
      ['azure', 'Matchlockmen', 'lahore', 'Dogra Musketeers'], ['azure', 'Khalsa Infantry', 'lahore', 'Chand Kaur’s Guard'],
      ['azure', 'Irregular Sowars', [31.592, 74.322], 'Dogra Horse'], ['azure', 'Matchlockmen', [31.578, 74.328], 'Dogra Musketeers'],
      ['red', 'Khalsa Infantry', [31.605, 74.36], 'Khalsa Battalions'], ['red', 'Khalsa Infantry', [31.605, 74.36], 'Khalsa Battalions'],
      ['red', 'Khalsa Infantry', [31.555, 74.345], 'Khalsa Battalions'], ['red', 'Khalsa Infantry', [31.555, 74.345], 'Khalsa Battalions'],
      ['red', 'Khalsa Infantry', [31.56, 74.315], 'Khalsa Battalions'], ['red', 'Khalsa Infantry', [31.56, 74.315], 'Khalsa Battalions'],
      ['red', 'Irregular Sowars', [31.62, 74.36], 'Ghorcharas'], ['red', 'Irregular Sowars', [31.62, 74.36], 'Ghorcharas'],
      ['red', 'Khalsa Infantry', [31.585, 74.39], 'Sher Singh’s Battalions'], ['red', 'Khalsa Infantry', [31.585, 74.39], 'Khalsa Battalions'],
      ['red', 'Khalsa Infantry', [31.578, 74.375], 'Khalsa Battalions'], ['red', 'Khalsa Infantry', [31.578, 74.375], 'Khalsa Battalions'],
      ['red', 'Khalsa Infantry', [31.592, 74.37], 'Khalsa Battalions'], ['red', 'Khalsa Infantry', [31.592, 74.37], 'Khalsa Battalions'],
      ['red', 'Khalsa Infantry', [31.57, 74.36], 'Khalsa Battalions'], ['red', 'Khalsa Infantry', [31.57, 74.36], 'Khalsa Battalions'],
      ['red', 'Khalsa Infantry', [31.55, 74.36], 'Mian Mir Battalions'], ['red', 'Khalsa Infantry', [31.55, 74.36], 'Mian Mir Battalions'],
      ['red', 'Khalsa Infantry', [31.565, 74.30], 'Fauj-i-Khas'], ['red', 'Khalsa Infantry', [31.565, 74.30], 'Fauj-i-Khas'],
      ['red', 'Khalsa Infantry', [31.598, 74.355], 'Khalsa Battalions'], ['red', 'Khalsa Infantry', [31.598, 74.355], 'Khalsa Battalions'],
      ['red', 'Light Field Gun', [31.582, 74.385], 'Khalsa Topkhana'], ['red', 'Light Field Gun', [31.582, 74.385], 'Khalsa Topkhana'],
      ['red', 'Light Field Gun', [31.575, 74.35], 'Khalsa Topkhana'], ['red', 'Heavy Battery', [31.575, 74.35], 'Sher Singh’s Siege Guns'],
      ['red', 'Heavy Battery', [31.56, 74.34], 'Sher Singh’s Siege Guns'],
      ['red', 'Irregular Sowars', [31.60, 74.40], 'Ghorcharas'], ['red', 'Irregular Sowars', [31.60, 74.40], 'Ghorcharas'],
      ['red', 'Irregular Sowars', [31.545, 74.33], 'Ghorcharas'], ['red', 'Light Dragoons', [31.545, 74.33], 'Ghorchara Khas'],
      ['red', 'Irregular Sowars', [31.61, 74.33], 'Ghorcharas'],
    ],
    powers: [
      { id: 'regency', name: 'The regent’s Lahore', chief: 'Maharani Chand Kaur', seat: 'lahorefort', npc: false, side: 'azure', color: '#3f6f8f', note: 'The fort and the walled city', extraSeats: ['lahore'] },
      { id: 'sher', name: 'Sher Singh’s camp', chief: 'Kanwar Sher Singh', seat: 'shalimar', npc: false, side: 'red', color: '#94493a', note: 'Where the Khalsa army camps', extraSeats: ['mianmir', 'anarkali', 'shahdara', 'baghbanpura'] },
    ],
    labels: [
      { text: 'Ravi', lat: 31.635, lon: 74.27, cls: 'water', tier: 1, angle: -35 },
      { text: 'Grand Trunk Road', lat: 31.596, lon: 74.43, cls: 'route', tier: 2, angle: -8 },
    ],
  },

  // Rohtas, 1764, after Hari Ram Gupta, History of the Sikhs III (1999),
  // pp. 213-14, and Ganda Singh, Ahmad Shah Durrani (1959), pp. 294-95. After
  // the sack of Sirhind, Charat Singh Sukerchakia and Gujjar Singh Bhangi
  // pushed north-west over the Jhelum. Sarbuland Khan, Ahmad Shah's uncle and
  // his faujdar at Rohtas, met them with (Gupta) 12,000 men, was beaten and shut
  // himself in the fort. The siege made no progress until Charat Singh feigned
  // a retreat, drew the garrison out and took Sarbuland Khan, whom he let go
  // for a ransom of two lakh. The Sikh numbers are not recorded; the misls
  // fought mostly as horse, with Akali foot. Round 1 is the day the Sikhs reach
  // the Jhelum. Rohtas itself was not stormed in 1764 (or in 1767, when it fell
  // from within after a siege of months), so the Sikhs win by taking two of the
  // faujdari's seats, or its faujdar.
  rohtas: {
    map: 'rohtas', group: 'rohtas', mode: 'historic',
    title: 'The Battle of Rohtas',
    year: 1764,
    region: 'Jhelum · Rohtas',
    blurb: '1764. After the sack of Sirhind, Charat Singh of the Sukerchakia misl and Gujjar Singh of the Bhangis ride north-west over the Chenab to the Jhelum. Sarbuland Khan, Ahmad Shah Abdali’s uncle and his faujdar at Rohtas, comes down to the river with some 12,000 Afghans to stop them. Behind him stands Sher Shah’s fortress, four kilometres of wall round a broken hilltop that no army has stormed.',
    first: 'red',
    vpTarget: Infinity,
    roundLimit: 8,
    goal: {
      forts: ['rohtas', 'jhelum', 'dina'], need: 2, attacker: 'red', short: 'Win the faujdari', general: true,
      attackerWins: 'The faujdari of Rohtas is lost to the Afghans: the Sukerchakias and the Bhangis hold the country from the Jhelum to the Salt Range, and the road to Kabul is cut.',
      generalWins: 'Drawn out by a feigned retreat, Sarbuland Khan is cut off and taken. Charat Singh lets Ahmad Shah’s uncle go for two lakh of rupees, and the country from the Jhelum to the Indus passes to the Sikh chiefs.',
      defenderWins: 'Sarbuland Khan still holds the faujdari of Rohtas as the season closes, and the road from Kabul stays open to Ahmad Shah.',
    },
    sides: {
      azure: { name: 'Durrani Army', short: 'Durrani', adj: 'Durrani', pitch: 'Sarbuland Khan’s Afghans hold the Jhelum crossing, with Rohtas behind them. Stop the Sikhs at the river, keep at least two of Rohtas, Jhelum and Dina, and do not let the faujdar be taken.', tag: 'Moves second · hold the faujdari for 8 days' },
      red: { name: 'Sikh Misls', short: 'Misls', adj: 'Sikh', pitch: 'Charat Singh’s and Gujjar Singh’s horse come up from Gujrat. Cross the Jhelum and beat Sarbuland Khan in the field. Hold two of Rohtas, Jhelum and Dina at the end of a day, or draw the faujdar out and take him.', tag: 'Moves first · take the faujdari or its faujdar' },
    },
    generals: {
      azure: { name: 'Sarbuland Khan', title: 'Faujdar of Rohtas, uncle of Ahmad Shah Abdali', leads: 'Sarbuland Khan’s Guard' },
      red: { name: 'Sardar Charat Singh', title: 'Chief of the Sukerchakia misl', leads: 'Charat Singh’s Sowars' },
    },
    // The Afghans' road home over the Bakrala pass; the Sikhs' back to Gujrat.
    homeBase: { azure: [33.10, 73.445], red: [32.81, 73.86] },
    walls: { rohtas: 2 },
    strongpoints: ['rohtas', 'jhelum', 'dina', 'sarai', 'mangla'],
    startOwners: { rohtas: 'azure', jhelum: 'azure', dina: 'azure', sarai: 'red', mangla: null },
    startUnits: [
      // Sarbuland Khan's army at the Jhelum crossing, Rohtas behind it.
      ['azure', 'Irregular Sowars', [32.952, 73.68], 'Sarbuland Khan’s Guard'], ['azure', 'Irregular Sowars', [32.952, 73.68], 'Durrani Horse'],
      ['azure', 'Matchlockmen', 'jhelum', 'Afghan Jezailchis'], ['azure', 'Zamburak', 'jhelum', 'Durrani Zamburaks'],
      ['azure', 'Dhal & Talwar', [32.935, 73.70], 'Afghan Swordsmen'], ['azure', 'Matchlockmen', [32.935, 73.70], 'Afghan Jezailchis'],
      ['azure', 'Irregular Sowars', [32.97, 73.70], 'Durrani Horse'], ['azure', 'Zamburak', [32.97, 73.70], 'Durrani Zamburaks'],
      ['azure', 'Irregular Sowars', [32.915, 73.69], 'Qizilbash Horse'], ['azure', 'Dhal & Talwar', [32.915, 73.69], 'Afghan Swordsmen'],
      ['azure', 'Matchlockmen', 'rohtas', 'Rohtas Garrison'], ['azure', 'Jingal', 'rohtas', 'Rohtas Wall Guns'],
      ['azure', 'Matchlockmen', 'dina', 'Dina Post'],
      // The Sukerchakia and Bhangi horse on the Gujrat side.
      ['red', 'Irregular Sowars', [32.90, 73.79], 'Charat Singh’s Sowars'], ['red', 'Mounted Matchlocks', [32.90, 73.79], 'Sukerchakia Sowars'],
      ['red', 'Irregular Sowars', [32.88, 73.81], 'Sukerchakia Sowars'], ['red', 'Mounted Matchlocks', [32.88, 73.81], 'Sukerchakia Sowars'],
      ['red', 'Irregular Sowars', [32.925, 73.78], 'Gujjar Singh’s Sowars'], ['red', 'Mounted Matchlocks', [32.925, 73.78], 'Bhangi Sowars'],
      ['red', 'Irregular Sowars', [32.86, 73.80], 'Bhangi Sowars'], ['red', 'Zamburak', [32.86, 73.80], 'Bhangi Zamburaks'],
      ['red', 'Matchlockmen', 'sarai', 'Bhangi Musketeers'], ['red', 'Zamburak', 'sarai', 'Bhangi Zamburaks'],
      ['red', 'Dhal & Talwar', [32.895, 73.765], 'Akali Nihangs'], ['red', 'Dhal & Talwar', [32.895, 73.765], 'Akali Nihangs'],
      ['red', 'Irregular Sowars', [33.0, 73.835], 'Akali Sowars'], ['red', 'Zamburak', [33.0, 73.835], 'Sukerchakia Zamburaks'],
    ],
    powers: [
      { id: 'durrani', name: 'Durrani Rohtas', chief: 'Sarbuland Khan', seat: 'rohtas', npc: false, side: 'azure', color: '#3f6f8f', note: 'The faujdari of Rohtas', extraSeats: ['jhelum', 'dina', 'bakrala'] },
      { id: 'misls', name: 'The misls', chief: 'Sardar Charat Singh', seat: [32.85, 73.84], npc: false, side: 'red', color: '#94493a', note: 'Gujjar Singh’s country towards Gujrat', extraSeats: ['sarai', 'jatlan'] },
    ],
    labels: [
      { text: 'Jhelum', lat: 32.86, lon: 73.66, cls: 'water', tier: 1, angle: 50 },
      { text: 'Grand Trunk Road', lat: 33.03, lon: 73.50, cls: 'route', tier: 2, angle: -50 },
    ],
  },

  // Open campaign: the season before, the Afghans spread across their posts
  // and the two misls coming separately, Gujjar Singh by the Mangla ferry.
  rohtaso: {
    map: 'rohtas', group: 'rohtas', mode: 'open',
    title: 'The Battle of Rohtas',
    year: 1764,
    region: 'Jhelum · Rohtas',
    blurb: '1764, before the armies meet. Sarbuland Khan’s Afghans are spread across the faujdari of Rohtas, at the fort, at Jhelum and Dina and on the Mangla ferry. Charat Singh rides up the Gujrat road for the Jhelum crossing; Gujjar Singh’s Bhangis are coming round by Jatlan for the Mangla ferry.',
    first: 'red',
    vpTarget: Infinity,
    roundLimit: 14,
    goal: {
      forts: ['rohtas', 'jhelum', 'dina'], need: 2, attacker: 'red', short: 'Win the faujdari', general: true,
      attackerWins: 'The faujdari of Rohtas is lost to the Afghans: the Sukerchakias and the Bhangis hold the country from the Jhelum to the Salt Range, and the road to Kabul is cut.',
      generalWins: 'Sarbuland Khan is cut off and taken. Charat Singh lets Ahmad Shah’s uncle go for two lakh of rupees, and the country from the Jhelum to the Indus passes to the Sikh chiefs.',
      defenderWins: 'Sarbuland Khan still holds the faujdari of Rohtas as the season closes, and the road from Kabul stays open to Ahmad Shah.',
    },
    sides: {
      azure: { name: 'Durrani Army', short: 'Durrani', adj: 'Durrani', pitch: 'Sarbuland Khan’s Afghans hold Rohtas, Jhelum, Dina and the Mangla ferry. Gather before the two misls join, beat one of them at the river, keep two of Rohtas, Jhelum and Dina, and keep the faujdar out of their hands.', tag: 'Moves second · hold the faujdari for 14 days' },
      red: { name: 'Sikh Misls', short: 'Misls', adj: 'Sikh', pitch: 'Charat Singh comes up the Gujrat road; Gujjar Singh’s Bhangis reach Jatlan on day 3. Cross the Jhelum, join hands, and hold two of Rohtas, Jhelum and Dina at the end of a day, or take the faujdar.', tag: 'Moves first · take the faujdari or its faujdar' },
    },
    generals: {
      azure: { name: 'Sarbuland Khan', title: 'Faujdar of Rohtas, uncle of Ahmad Shah Abdali', leads: 'Sarbuland Khan’s Guard' },
      red: { name: 'Sardar Charat Singh', title: 'Chief of the Sukerchakia misl', leads: 'Charat Singh’s Sowars' },
    },
    homeBase: { azure: [33.10, 73.445], red: [32.81, 73.86] },
    walls: { rohtas: 2 },
    strongpoints: ['rohtas', 'jhelum', 'dina', 'sarai', 'mangla'],
    startOwners: { rohtas: 'azure', jhelum: 'azure', dina: 'azure', sarai: null, mangla: 'azure' },
    startUnits: [
      ['azure', 'Irregular Sowars', [32.975, 73.60], 'Sarbuland Khan’s Guard'], ['azure', 'Irregular Sowars', [32.975, 73.60], 'Durrani Horse'],
      ['azure', 'Dhal & Talwar', [32.985, 73.585], 'Afghan Swordsmen'], ['azure', 'Zamburak', [32.985, 73.585], 'Durrani Zamburaks'],
      ['azure', 'Matchlockmen', 'rohtas', 'Rohtas Garrison'], ['azure', 'Jingal', 'rohtas', 'Rohtas Wall Guns'],
      ['azure', 'Matchlockmen', 'jhelum', 'Afghan Jezailchis'], ['azure', 'Zamburak', 'jhelum', 'Durrani Zamburaks'],
      ['azure', 'Matchlockmen', 'dina', 'Dina Post'], ['azure', 'Irregular Sowars', 'mangla', 'Mangla Post'],
      ['azure', 'Dhal & Talwar', [32.95, 73.64], 'Afghan Swordsmen'], ['azure', 'Irregular Sowars', 'bakrala', 'Qizilbash Horse'],
      ['red', 'Irregular Sowars', [32.83, 73.845], 'Charat Singh’s Sowars'], ['red', 'Mounted Matchlocks', [32.83, 73.845], 'Sukerchakia Sowars'],
      ['red', 'Irregular Sowars', [32.815, 73.83], 'Sukerchakia Sowars'], ['red', 'Mounted Matchlocks', [32.815, 73.83], 'Sukerchakia Sowars'],
      ['red', 'Matchlockmen', [32.845, 73.855], 'Sukerchakia Musketeers'], ['red', 'Zamburak', [32.845, 73.855], 'Sukerchakia Zamburaks'],
    ],
    reinforcements: [
      { round: 3, side: 'red', at: [33.04, 73.84], name: 'Gujjar Singh’s Bhangis', note: 'came round by Jatlan', units: [['Irregular Sowars', 'Gujjar Singh’s Sowars'], ['Mounted Matchlocks', 'Bhangi Sowars'], ['Irregular Sowars', 'Bhangi Sowars'], ['Zamburak', 'Bhangi Zamburaks'], ['Matchlockmen', 'Bhangi Musketeers'], ['Dhal & Talwar', 'Akali Nihangs']] },
    ],
    powers: [
      { id: 'durrani', name: 'Durrani Rohtas', chief: 'Sarbuland Khan', seat: 'rohtas', npc: false, side: 'azure', color: '#3f6f8f', note: 'The faujdari of Rohtas', extraSeats: ['jhelum', 'dina', 'bakrala', 'mangla'] },
      { id: 'misls', name: 'The misls', chief: 'Sardar Charat Singh', seat: [32.85, 73.84], npc: false, side: 'red', color: '#94493a', note: 'Gujjar Singh’s country towards Gujrat', extraSeats: ['jatlan'] },
    ],
    labels: [
      { text: 'Jhelum', lat: 32.86, lon: 73.66, cls: 'water', tier: 1, angle: 50 },
      { text: 'Grand Trunk Road', lat: 33.03, lon: 73.50, cls: 'route', tier: 2, angle: -50 },
    ],
  },
};
