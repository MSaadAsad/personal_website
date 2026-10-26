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
    roundLimit: 17,
    goal: {
      fort: 'manglafort', attacker: 'red', short: 'Take Mangla',
      attackerWins: 'The walls of Mangla are breached and the Sikh garrison marches out. Khari Khariyali passes to the Dogras, who will hold it for 107 years.',
      defenderWins: 'The campaigning season ends with the Khalsa banner still flying over Mangla Fort.',
    },
    sides: {
      azure: { name: 'Khalsa Garrison', short: 'Khalsa', adj: 'Khalsa', pitch: 'Surat Singh’s Sikh troops hold the Khari jagirs east of the Jhelum: Aurangabad, Sukhchainpur, Kot Kandhari, Khari and Mangla Fort. No help will come from across the river. Hold Mangla until the season ends.', tag: 'Moves second · hold Mangla for 17 days' },
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
    anonymous: ['dogracamp', 'dograhorse', 'dograpark', 'dograrear', 'dogravan'],
    strongpoints: ['sarai', 'sukhchainpur', 'kotkandhari', 'khari', 'manglafort'],
    startOwners: { sarai: 'azure', sukhchainpur: 'azure', kotkandhari: 'azure', khari: 'azure', manglafort: 'azure' },
    startUnits: [
      ['azure', 'Matchlockmen', 'manglafort', 'Khalsa Musketeers'], ['azure', 'Spearmen', 'manglafort', 'Khalsa Spearmen'],
      ['azure', 'Matchlockmen', 'sukhchainpur', 'Sukhchainpur Garrison'], ['azure', 'Spearmen', 'kotkandhari', 'Kandhari Garrison'],
      ['azure', 'Matchlockmen', 'sarai', 'Aurangabad Garrison'], ['azure', 'Light Field Gun', 'khari', 'Sikh Topkhana'],
      ['azure', 'Mounted Matchlocks', 'kotkandhari', 'Khalsa Horse'], ['azure', 'Irregular Sowars', 'khari', 'Sikh Ghorcharas'],
      // Hari Chand's army greatly outnumbers the garrisons it must reduce one by one.
      ['red', 'Dhal & Talwar', 'kotlibajar', 'Dogra Swordsmen'], ['red', 'Dhal & Talwar', 'kotlibajar', 'Dogra Swordsmen'],
      ['red', 'Light Field Gun', 'dograpark', 'Dogra Siege Guns'], ['red', 'Light Field Gun', 'dograpark', 'Dogra Guns'],
      ['red', 'Light Field Gun', 'dograrear', 'Dogra Heavy Guns'],
      ['red', 'Matchlockmen', 'dogracamp', 'Dogra Musketeers'], ['red', 'Matchlockmen', 'dogracamp', 'Dogra Musketeers'],
      ['red', 'Dhal & Talwar', 'guliana', 'Dogra Swordsmen'], ['red', 'Matchlockmen', 'guliana', 'Dogra Musketeers'],
      ['red', 'Dhal & Talwar', 'dograrear', 'Dogra Swordsmen'], ['red', 'Matchlockmen', 'dograrear', 'Dogra Musketeers'],
      ['red', 'Spearmen', 'dograhorse', 'Dogra Spearmen'], ['red', 'Zamburak', 'dograhorse', 'Camel Guns'],
      ['red', 'Irregular Sowars', 'dogravan', 'Dogra Horse'], ['red', 'Irregular Sowars', 'dogravan', 'Dogra Horse'],
    ],
    powers: [
      { id: 'khari', name: 'Khari Khariyali jagirs', chief: 'Surat Singh, for the Lahore Darbar', seat: 'manglafort', npc: false, side: 'azure', color: '#3f7b4c', note: 'Chand Kaur’s estates, held by Sikh troops', extraSeats: ['sukhchainpur', 'kotkandhari', 'sarai', 'panjeri'], limits: [{ beyond: 'panjeri', toward: 'north-east', to: 'bhimber' }] },
      { id: 'lahore', name: 'West of the Jhelum', chief: 'The Lahore Darbar, standing aside', seat: 'jhelum', npc: false, side: null, color: '#6b7280', note: 'Not part of the Khari jagirs: neither side holds it', extraSeats: ['rohtas', 'dina'] },
      { id: 'dogra', name: 'Dogra advance', chief: 'Diwan Hari Chand', seat: 'dogracamp', npc: false, side: 'red', color: '#94493a', note: 'The road from Jammu', extraSeats: ['guliana'] },
      { id: 'bhimber', name: 'Bhimber hills', chief: 'Beyond Khari Khariyali', seat: 'darhal', npc: false, side: null, color: '#7a6a52', note: 'The hill country north-east of Panjeri: not part of the jagirs' },
      { id: 'mirpur', name: 'Mirpur, beyond the ridge', chief: 'The chaudhris of Mirpur', seat: 'mirpur', npc: true, color: '#86903a', levy: { variant: 'Matchlockmen', name: 'Mirpur Levies' }, note: 'Not part of Khari; sides with whoever holds the town' },
    ],
    labels: [
      { text: 'KHARI KHARIYALI', lat: 33.03, lon: 73.765, cls: 'region', tier: 1 },
      { text: 'MIRPUR RIDGE', lat: 33.135, lon: 73.775, cls: 'region', tier: 1 },
      { text: 'Jhelum', lat: 33.05, lon: 73.705, cls: 'water', tier: 1, angle: 60 },
      { text: 'Jhelum', lat: 32.86, lon: 73.68, cls: 'water', tier: 2, angle: -50 },
      { text: 'Jari Nala', lat: 33.07, lon: 73.85, cls: 'water', tier: 2, angle: 80 },
      { text: 'Poonch', lat: 33.235, lon: 73.70, cls: 'water', tier: 2, angle: -40 },
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
      forts: ['rasul', 'lakhnawala', 'mong'], need: 1, attacker: 'red', short: 'Break the Sikh line',
      attackerWins: 'The Sikh line is broken: Sher Singh’s army is driven back over the Jhelum before Chattar Singh can join it.',
      defenderWins: 'As in January 1849, the Khalsa line still stands from Rasul to the villages: Gough has bled his army in the jungle, and Chattar Singh’s army is coming down to join Sher Singh.',
    },
    sides: {
      azure: { name: 'Khalsa Army', short: 'Khalsa', adj: 'Khalsa', pitch: 'Sher Singh’s battalions hold the Rasul ridges and the jungle south of them, with the Jhelum at their backs and Chattar Singh’s army coming on day 8. Keep Rasul, Lakhnawala and Mong until the campaign closes: lose any one at the end of a day and the line is broken.', tag: 'Moves second · hold the line for 10 days' },
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
      ['azure', 'Khalsa Infantry', [32.63, 73.562], 'Khalsa Battalions'],
      // The right: the old Bannu garrison on the villages.
      ['azure', 'Khalsa Infantry', 'lakhnawala', 'Bannu Brigade'], ['azure', 'Light Field Gun', 'lakhnawala', 'Khalsa Topkhana'],
      ['azure', 'Khalsa Infantry', [32.62, 73.54], 'Bannu Brigade'], ['azure', 'Irregular Sowars', [32.62, 73.54], 'Ghorcharas'],
      ['azure', 'Khalsa Infantry', 'chillianwala', 'Chillianwala Outpost'],
      ['azure', 'Irregular Sowars', 'mong', 'Ghorcharas'],
      // Gough's army coming up from the Chenab.
      ['red', 'Line Infantry', [32.50, 73.66], 'HM 29th Foot'], ['red', 'Sepoy Infantry', [32.50, 73.66], '30th Bengal NI'],
      ['red', 'Line Infantry', [32.49, 73.685], '2nd Bengal Europeans'], ['red', 'Sepoy Infantry', [32.49, 73.685], '31st Bengal NI'],
      ['red', 'Line Infantry', [32.51, 73.64], 'HM 24th Foot'], ['red', 'Sepoy Infantry', [32.51, 73.64], '25th Bengal NI'],
      ['red', 'Line Infantry', [32.475, 73.70], 'HM 61st Foot'], ['red', 'Sepoy Infantry', [32.475, 73.70], '36th Bengal NI'],
      ['red', 'Sepoy Infantry', 'helan', '45th Bengal NI'], ['red', 'Sepoy Infantry', 'helan', '56th Bengal NI'],
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
    roundLimit: 9,
    goal: {
      fort: 'gujrat', attacker: 'red', short: 'Take Gujrat',
      attackerWins: 'The Sikh line breaks under the guns and Gujrat falls. Within three weeks Sher Singh and Chattar Singh lay down their arms near Rawalpindi, and the Punjab is annexed.',
      defenderWins: 'The Khalsa army still holds Gujrat as the campaign closes: Gough has not broken it, and the war goes on.',
    },
    sides: {
      azure: { name: 'Khalsa Army', short: 'Khalsa', adj: 'Khalsa', pitch: 'Sher Singh’s battalions and guns hold Gujrat behind the Dwara and the Kalra villages, with Afghan horse on the right and Ghorcharas on the left. Hold Gujrat until the campaign closes, or break Gough before his reinforcements arrive.', tag: 'Moves first · hold Gujrat for 9 days' },
      red: { name: 'Army of the Punjab', short: 'British', adj: 'British', pitch: 'Gough’s army lies on the Chenab south-west of Gujrat. Gather Whish (day 3), Dundas (day 4) and Markham (day 5), move up by Trikha and Shadiwal, and break the Sikh line from the south with the heavy guns.', tag: 'Moves second · take Gujrat' },
    },
    generals: {
      azure: { name: 'Raja Sher Singh Attariwala', title: 'Commander of the Khalsa army', leads: 'Sher Singh’s Battalions' },
      red: { name: 'Lord Gough', title: 'Commander-in-Chief, India', leads: 'HM 29th Foot' },
    },
    // Each army's road home: the Sikhs' back through the Pabbi hills towards
    // Jhelum, the British across the Chenab towards Lahore.
    homeBase: { azure: [32.92, 73.80], red: [32.25, 73.95] },
    strongpoints: ['gujrat', 'kunjah', 'jalalpur', 'kharian', 'wazirabad', 'ramnagar'],
    startOwners: { gujrat: 'azure', kunjah: 'azure', jalalpur: 'azure', kharian: 'azure', wazirabad: 'red', ramnagar: 'red' },
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
      // Gough's army on the Chenab south-west of Gujrat.
      ['red', 'Line Infantry', [32.445, 73.92], 'HM 29th Foot'], ['red', 'Line Infantry', [32.445, 73.92], 'HM 24th Foot'],
      ['red', 'Line Infantry', [32.455, 73.90], 'HM 61st Foot'], ['red', 'Line Infantry', [32.455, 73.90], '2nd Bengal Europeans'],
      ['red', 'Sepoy Infantry', [32.435, 73.94], '31st Bengal NI'], ['red', 'Sepoy Infantry', [32.435, 73.94], '70th Bengal NI'],
      ['red', 'Sepoy Infantry', [32.465, 73.88], '25th Bengal NI'], ['red', 'Sepoy Infantry', [32.465, 73.88], '45th Bengal NI'],
      ['red', 'Sepoy Infantry', [32.425, 73.92], '56th Bengal NI'], ['red', 'Sepoy Infantry', [32.425, 73.92], '30th Bengal NI'],
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
};
