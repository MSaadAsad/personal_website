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
      { round: 8, side: 'red', at: [30.39, 71.66], name: 'The Zamzama', note: 'was dragged down from Lahore', units: [['Great Gun', 'Zamzama'], ['Khalsa Infantry', 'Beldars and Escort']] },
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
    title: 'The Multan Campaign, 1848–49',
    year: 1848,
    region: 'Shujabad · Multan',
    blurb: '17 June 1848. Diwan Mulraj’s army under Rung Ram lies across the Multan road below Shujabad. The Nawab of Bahawalpur’s Daudpotras are at Goweyn fifteen miles south, and Herbert Edwardes, with his Pathan levies and Cortlandt’s Sikh regulars, is across the Chenab at the Gaggianwalluh ferry with a handful of boats. Whoever reaches the Kineyree ferry first decides the opening; behind it all stand the walls of Multan.',
    first: 'red',
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
      { round: 6, side: 'red', at: [29.95, 71.75], name: 'Sheikh Imamuddin’s division', note: 'came in from the east', units: [['Khalsa Infantry', 'Sheikh Imamuddin’s Division'], ['Light Field Gun', 'Imamuddin’s Guns']] },
      { round: 11, side: 'red', at: [30.335, 71.69], name: 'Whish’s division', note: 'came down from Lahore with the Bengal siege train', units: [['Line Infantry', 'HM 10th Foot'], ['Line Infantry', 'HM 32nd Foot'], ['Sepoy Infantry', '49th Bengal NI'], ['Sepoy Infantry', '72nd Bengal NI'], ['Heavy Battery', 'Bengal Siege Train'], ['Horse Artillery', 'Bengal Horse Artillery']] },
      { round: 12, side: 'azure', at: 'multan', name: 'Mulraj’s new levies', note: 'were raised in the city', units: [['Matchlockmen', 'Multani Levies'], ['Matchlockmen', 'Multani Levies']] },
      { round: 21, side: 'red', at: [29.635, 71.67], name: 'The Bombay column', note: 'came up from Sindh with its own siege train', units: [['Line Infantry', 'HM 60th Rifles'], ['Line Infantry', '1st Bombay Fusiliers'], ['Sepoy Infantry', '3rd Bombay NI'], ['Heavy Battery', 'Bombay Siege Train'], ['Irregular Sowars', 'Scinde Horse']] },
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
    walls: { lahorefort: 7, lahore: 2 },
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

  // Historic mode: the same opening, with the campaign's events as they fell
  // out: Sher Singh's defection, the raising of the first siege, the magazine.
  multan1849h: {
    map: 'shujabad', group: 'multan1849', mode: 'historic',
    modeNote: 'Edwardes’s numbers, and the campaign as it fell out',
    title: 'The Multan Campaign, 1848–49',
    year: 1848,
    region: 'Shujabad · Multan',
    blurb: '17 June 1848. Diwan Mulraj’s army under Rung Ram lies across the Multan road below Shujabad. The Nawab of Bahawalpur’s Daudpotras are at Goweyn fifteen miles south, and Herbert Edwardes, with his Pathan levies and Cortlandt’s Sikh regulars, is across the Chenab at the Gaggianwalluh ferry with a handful of boats. Whoever reaches the Kineyree ferry first decides the opening; behind it all stand the walls of Multan.',
    first: 'red',
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
      { round: 15, side: 'azure', text: 'Raja Sher Singh and the Darbar troops went over to Mulraj, and Whish raised the siege', flash: 'SHER SINGH GOES OVER', defect: { names: ['Sher Singh’s Sikhs', 'Sher Singh’s Ghorcharas'], to: 'azure' } },
      { round: 18, side: 'azure', text: 'Sher Singh marched north from Multan to join his father’s rising', flash: 'SHER SINGH MARCHES NORTH', depart: ['Sher Singh’s Sikhs', 'Sher Singh’s Ghorcharas'] },
      { round: 23, side: 'red', text: 'The great magazine in Multan’s citadel blew up', flash: 'THE MAGAZINE EXPLODES', walls: { multanfort: -1 }, hurt: { at: 'multanfort', hp: 2 } },
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
      { round: 6, side: 'red', at: [29.95, 71.75], name: 'Sheikh Imamuddin’s division', note: 'came in from the east', units: [['Khalsa Infantry', 'Sheikh Imamuddin’s Division'], ['Light Field Gun', 'Imamuddin’s Guns']] },
      { round: 9, side: 'red', at: [30.335, 71.69], name: 'Raja Sher Singh’s Darbar troops', note: 'came down the Lahore road', units: [['Khalsa Infantry', 'Sher Singh’s Sikhs'], ['Khalsa Infantry', 'Sher Singh’s Sikhs'], ['Khalsa Infantry', 'Sher Singh’s Sikhs'], ['Irregular Sowars', 'Sher Singh’s Ghorcharas']] },
      { round: 11, side: 'red', at: [30.335, 71.69], name: 'Whish’s division', note: 'came down from Lahore with the Bengal siege train', units: [['Line Infantry', 'HM 10th Foot'], ['Line Infantry', 'HM 32nd Foot'], ['Sepoy Infantry', '49th Bengal NI'], ['Sepoy Infantry', '72nd Bengal NI'], ['Heavy Battery', 'Bengal Siege Train'], ['Horse Artillery', 'Bengal Horse Artillery']] },
      { round: 12, side: 'azure', at: 'multan', name: 'Mulraj’s new levies', note: 'were raised in the city', units: [['Matchlockmen', 'Multani Levies'], ['Matchlockmen', 'Multani Levies']] },
      { round: 21, side: 'red', at: [29.635, 71.67], name: 'The Bombay column', note: 'came up from Sindh with its own siege train', units: [['Line Infantry', 'HM 60th Rifles'], ['Line Infantry', '1st Bombay Fusiliers'], ['Sepoy Infantry', '3rd Bombay NI'], ['Heavy Battery', 'Bombay Siege Train'], ['Irregular Sowars', 'Scinde Horse']] },
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
    title: 'The Siege of Lahore, 1841',
    year: 1841,
    region: 'Lahore',
    blurb: 'January 1841. Sher Singh’s Khalsa army, some 26,000 foot, 8,000 horse and 45 guns, has come down the Amritsar road and camped at Budhu ka Awa, and the regiments at Mian Mir and the Fauj-i-Khas at Anarkali have declared for him. Raja Gulab Singh’s 5,000 Dogras and guards hold Lahore Fort and the walled city for Maharani Chand Kaur. Round 1 is 14 January; on the evening of the 17th Dhian Singh arranged a ceasefire.',
    first: 'red',
    vpTarget: Infinity,
    roundLimit: 6,
    goal: {
      fort: 'lahorefort', attacker: 'red', short: 'Take Lahore Fort',
      attackerWins: 'The fort falls to Sher Singh. Chand Kaur gives up her claim for a jagir, Gulab Singh marches out at midnight with the treasury, and Sher Singh is proclaimed Maharaja of the Punjab.',
      defenderWins: 'Lahore Fort still holds for Chand Kaur when the ceasefire comes. Sher Singh must treat with the regent’s party.',
    },
    sides: {
      azure: { name: 'Chand Kaur’s Garrison', short: 'Regency', adj: 'Regency', pitch: 'Gulab Singh’s Dogras hold Lahore Fort and the walled city for Maharani Chand Kaur. You are outnumbered six to one: hold the fort for six days, until terms can be made.', tag: 'Moves second · hold the fort for 6 days' },
      red: { name: 'Sher Singh’s Army', short: 'Sher Singh', adj: 'Khalsa', pitch: 'The Khalsa army has come over to Sher Singh. Force the city gates, bring the guns up to the Badshahi Mosque and the walls, and take Lahore Fort.', tag: 'Moves first · take the fort' },
    },
    generals: {
      azure: { name: 'Raja Gulab Singh', title: 'Holding the fort for Maharani Chand Kaur', leads: 'Gulab Singh’s Dogras' },
      red: { name: 'Kanwar Sher Singh', title: 'Son of Ranjit Singh, claimant to the throne', leads: 'Sher Singh’s Battalions' },
    },
    homeBase: { azure: null, red: [31.59, 74.47] },
    walls: { lahorefort: 6, lahore: 2 },
    strongpoints: ['lahorefort', 'lahore', 'shalimar', 'shahdara', 'anarkali', 'mianmir'],
    startOwners: { lahorefort: 'azure', lahore: 'azure', shalimar: 'red', shahdara: null, anarkali: null, mianmir: 'red' },
    startUnits: [
      ['azure', 'Dhal & Talwar', 'lahorefort', 'Gulab Singh’s Dogras'], ['azure', 'Light Field Gun', 'lahorefort', 'Fort Topkhana'],
      ['azure', 'Matchlockmen', 'lahore', 'Dogra Musketeers'], ['azure', 'Khalsa Infantry', 'lahore', 'Chand Kaur’s Guard'],
      ['azure', 'Irregular Sowars', [31.592, 74.322], 'Dogra Horse'], ['azure', 'Matchlockmen', [31.578, 74.328], 'Dogra Musketeers'],
      ['red', 'Khalsa Infantry', [31.605, 74.36], 'Khalsa Battalions'], ['red', 'Khalsa Infantry', [31.605, 74.36], 'Khalsa Battalions'],
      ['red', 'Khalsa Infantry', [31.555, 74.345], 'Khalsa Battalions'], ['red', 'Khalsa Infantry', [31.555, 74.345], 'Khalsa Battalions'],
      ['red', 'Khalsa Infantry', [31.552, 74.372], 'Khalsa Battalions'], ['red', 'Khalsa Infantry', [31.552, 74.372], 'Khalsa Battalions'],
      ['red', 'Irregular Sowars', [31.62, 74.36], 'Ghorcharas'], ['red', 'Irregular Sowars', [31.62, 74.36], 'Ghorcharas'],
      ['red', 'Khalsa Infantry', [31.585, 74.39], 'Sher Singh’s Battalions'], ['red', 'Khalsa Infantry', [31.585, 74.39], 'Khalsa Battalions'],
      ['red', 'Khalsa Infantry', [31.578, 74.375], 'Khalsa Battalions'], ['red', 'Khalsa Infantry', [31.578, 74.375], 'Khalsa Battalions'],
      ['red', 'Khalsa Infantry', [31.592, 74.37], 'Khalsa Battalions'], ['red', 'Khalsa Infantry', [31.592, 74.37], 'Khalsa Battalions'],
      ['red', 'Khalsa Infantry', [31.57, 74.36], 'Khalsa Battalions'], ['red', 'Khalsa Infantry', [31.57, 74.36], 'Khalsa Battalions'],
      ['red', 'Khalsa Infantry', [31.55, 74.36], 'Mian Mir Battalions'], ['red', 'Khalsa Infantry', [31.55, 74.36], 'Mian Mir Battalions'],
      ['red', 'Khalsa Infantry', [31.565, 74.30], 'Fauj-i-Khas'], ['red', 'Khalsa Infantry', [31.565, 74.30], 'Fauj-i-Khas'],
      ['red', 'Khalsa Infantry', [31.598, 74.355], 'Khalsa Battalions'], ['red', 'Khalsa Infantry', [31.598, 74.355], 'Khalsa Battalions'],
      ['red', 'Light Field Gun', [31.582, 74.385], 'Khalsa Topkhana'], ['red', 'Light Field Gun', [31.582, 74.385], 'Khalsa Topkhana'],
      ['red', 'Light Field Gun', [31.578, 74.362], 'Khalsa Topkhana'], ['red', 'Heavy Battery', [31.578, 74.362], 'Sher Singh’s Siege Guns'],
      ['red', 'Heavy Battery', [31.568, 74.372], 'Sher Singh’s Siege Guns'],
      ['red', 'Irregular Sowars', [31.60, 74.40], 'Ghorcharas'], ['red', 'Irregular Sowars', [31.60, 74.40], 'Ghorcharas'],
      ['red', 'Irregular Sowars', [31.545, 74.352], 'Ghorcharas'], ['red', 'Light Dragoons', [31.545, 74.352], 'Ghorchara Khas'],
      ['red', 'Irregular Sowars', [31.603, 74.378], 'Ghorcharas'],
      ['red', 'Khalsa Infantry', 'shalimar', 'Shalimar Camp Guard'], ['red', 'Khalsa Infantry', 'mianmir', 'Mian Mir Battalions'],
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
    roundLimit: 11,
    goal: {
      forts: ['rohtas', 'jhelum', 'dina'], need: 2, attacker: 'red', short: 'Win the faujdari', general: true,
      attackerWins: 'The faujdari of Rohtas is lost to the Afghans: the Sukerchakias and the Bhangis hold the country from the Jhelum to the Salt Range, and the road to Kabul is cut.',
      generalWins: 'Drawn out by a feigned retreat, Sarbuland Khan is cut off and taken. Charat Singh lets Ahmad Shah’s uncle go for two lakh of rupees, and the country from the Jhelum to the Indus passes to the Sikh chiefs.',
      defenderWins: 'Sarbuland Khan still holds the faujdari of Rohtas as the season closes, and the road from Kabul stays open to Ahmad Shah.',
    },
    sides: {
      azure: { name: 'Durrani Army', short: 'Durrani', adj: 'Durrani', pitch: 'Sarbuland Khan’s Afghans hold the Jhelum crossing, with Rohtas behind them. Stop the Sikhs at the river, keep at least two of Rohtas, Jhelum and Dina, and do not let the faujdar be taken.', tag: 'Moves second · hold the faujdari for 11 days' },
      red: { name: 'Sikh Misls', short: 'Misls', adj: 'Sikh', pitch: 'Charat Singh’s and Gujjar Singh’s horse come up from Gujrat. Cross the Jhelum and beat Sarbuland Khan in the field. Hold two of Rohtas, Jhelum and Dina at the end of a day, or draw the faujdar out and take him.', tag: 'Moves first · take the faujdari or its faujdar' },
    },
    generals: {
      azure: { name: 'Sarbuland Khan', title: 'Faujdar of Rohtas, uncle of Ahmad Shah Abdali', leads: 'Sarbuland Khan’s Guard' },
      red: { name: 'Sardar Charat Singh', title: 'Chief of the Sukerchakia misl', leads: 'Charat Singh’s Sowars' },
    },
    // The Afghans' road home over the Bakrala pass; the Sikhs' back to Gujrat.
    homeBase: { azure: [33.10, 73.445], red: [32.81, 73.86] },
    walls: { rohtas: 2 },
    strongpoints: ['rohtas', 'jhelum', 'dina', 'sarai'],
    startOwners: { rohtas: 'azure', jhelum: 'azure', dina: 'azure', sarai: 'red' },
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
      ['red', 'Irregular Sowars', [32.84, 73.79], 'Sukerchakia Sowars'], ['red', 'Irregular Sowars', [32.84, 73.79], 'Bhangi Sowars'],
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
  // and the two misls coming separately, Gujjar Singh by Jatlan.
  rohtaso: {
    map: 'rohtas', group: 'rohtas', mode: 'open',
    title: 'The Battle of Rohtas',
    year: 1764,
    region: 'Jhelum · Rohtas',
    blurb: '1764, before the armies meet. Sarbuland Khan’s Afghans are spread across the faujdari of Rohtas, at the fort, at Jhelum and Dina. Charat Singh rides up the Gujrat road for the Jhelum crossing; Gujjar Singh’s Bhangis are coming round by Jatlan.',
    first: 'red',
    vpTarget: Infinity,
    roundLimit: 18,
    goal: {
      forts: ['rohtas', 'jhelum', 'dina'], need: 2, attacker: 'red', short: 'Win the faujdari', general: true,
      attackerWins: 'The faujdari of Rohtas is lost to the Afghans: the Sukerchakias and the Bhangis hold the country from the Jhelum to the Salt Range, and the road to Kabul is cut.',
      generalWins: 'Sarbuland Khan is cut off and taken. Charat Singh lets Ahmad Shah’s uncle go for two lakh of rupees, and the country from the Jhelum to the Indus passes to the Sikh chiefs.',
      defenderWins: 'Sarbuland Khan still holds the faujdari of Rohtas as the season closes, and the road from Kabul stays open to Ahmad Shah.',
    },
    sides: {
      azure: { name: 'Durrani Army', short: 'Durrani', adj: 'Durrani', pitch: 'Sarbuland Khan’s Afghans hold Rohtas, Jhelum and Dina. Gather before the two misls join, beat one of them at the river, keep two of Rohtas, Jhelum and Dina, and keep the faujdar out of their hands.', tag: 'Moves second · hold the faujdari for 18 days' },
      red: { name: 'Sikh Misls', short: 'Misls', adj: 'Sikh', pitch: 'Charat Singh comes up the Gujrat road; Gujjar Singh’s Bhangis reach Jatlan on day 3. Cross the Jhelum, join hands, and hold two of Rohtas, Jhelum and Dina at the end of a day, or take the faujdar.', tag: 'Moves first · take the faujdari or its faujdar' },
    },
    generals: {
      azure: { name: 'Sarbuland Khan', title: 'Faujdar of Rohtas, uncle of Ahmad Shah Abdali', leads: 'Sarbuland Khan’s Guard' },
      red: { name: 'Sardar Charat Singh', title: 'Chief of the Sukerchakia misl', leads: 'Charat Singh’s Sowars' },
    },
    homeBase: { azure: [33.10, 73.445], red: [32.81, 73.86] },
    walls: { rohtas: 2 },
    strongpoints: ['rohtas', 'jhelum', 'dina', 'sarai'],
    startOwners: { rohtas: 'azure', jhelum: 'azure', dina: 'azure', sarai: null },
    startUnits: [
      ['azure', 'Irregular Sowars', [32.975, 73.60], 'Sarbuland Khan’s Guard'], ['azure', 'Irregular Sowars', [32.975, 73.60], 'Durrani Horse'],
      ['azure', 'Dhal & Talwar', [32.985, 73.585], 'Afghan Swordsmen'], ['azure', 'Zamburak', [32.985, 73.585], 'Durrani Zamburaks'],
      ['azure', 'Matchlockmen', 'rohtas', 'Rohtas Garrison'], ['azure', 'Jingal', 'rohtas', 'Rohtas Wall Guns'],
      ['azure', 'Matchlockmen', 'jhelum', 'Afghan Jezailchis'], ['azure', 'Zamburak', 'jhelum', 'Durrani Zamburaks'],
      ['azure', 'Matchlockmen', 'dina', 'Dina Post'],
      ['azure', 'Dhal & Talwar', [32.95, 73.64], 'Afghan Swordsmen'], ['azure', 'Irregular Sowars', 'bakrala', 'Qizilbash Horse'],
      ['red', 'Irregular Sowars', [32.83, 73.845], 'Charat Singh’s Sowars'], ['red', 'Mounted Matchlocks', [32.83, 73.845], 'Sukerchakia Sowars'],
      ['red', 'Irregular Sowars', [32.815, 73.83], 'Sukerchakia Sowars'], ['red', 'Mounted Matchlocks', [32.815, 73.83], 'Sukerchakia Sowars'],
      ['red', 'Matchlockmen', [32.845, 73.855], 'Sukerchakia Musketeers'], ['red', 'Zamburak', [32.845, 73.855], 'Sukerchakia Zamburaks'],
      ['red', 'Dhal & Talwar', [32.83, 73.86], 'Akali Nihangs'], ['red', 'Irregular Sowars', [32.83, 73.86], 'Sukerchakia Sowars'],
    ],
    reinforcements: [
      { round: 3, side: 'red', at: [33.04, 73.84], name: 'Gujjar Singh’s Bhangis', note: 'came round by Jatlan', units: [['Irregular Sowars', 'Gujjar Singh’s Sowars'], ['Mounted Matchlocks', 'Bhangi Sowars'], ['Irregular Sowars', 'Bhangi Sowars'], ['Zamburak', 'Bhangi Zamburaks'], ['Matchlockmen', 'Bhangi Musketeers'], ['Dhal & Talwar', 'Akali Nihangs']] },
    ],
    powers: [
      { id: 'durrani', name: 'Durrani Rohtas', chief: 'Sarbuland Khan', seat: 'rohtas', npc: false, side: 'azure', color: '#3f6f8f', note: 'The faujdari of Rohtas', extraSeats: ['jhelum', 'dina', 'bakrala'] },
      { id: 'misls', name: 'The misls', chief: 'Sardar Charat Singh', seat: [32.85, 73.84], npc: false, side: 'red', color: '#94493a', note: 'Gujjar Singh’s country towards Gujrat', extraSeats: ['jatlan'] },
    ],
    labels: [
      { text: 'Jhelum', lat: 32.86, lon: 73.66, cls: 'water', tier: 1, angle: 50 },
      { text: 'Grand Trunk Road', lat: 33.03, lon: 73.50, cls: 'route', tier: 2, angle: -50 },
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
      ['red', 'Irregular Sowars', [34.022, 71.300], 'Akbar Khan’s Horse'], ['red', 'Irregular Sowars', [34.022, 71.300], 'Durrani Horse'],
      ['red', 'Irregular Sowars', [34.025, 71.285], 'Qizilbash Horse'], ['red', 'Irregular Sowars', [34.025, 71.285], 'Durrani Horse'],
      ['red', 'Irregular Sowars', [34.028, 71.255], 'Shamsuddin Khan’s Horse'], ['red', 'Light Field Gun', [34.028, 71.255], 'Afghan Topkhana'],
      ['red', 'Light Field Gun', [34.020, 71.268], 'Afghan Topkhana'], ['red', 'Light Field Gun', [34.020, 71.268], 'Afghan Topkhana'],
      ['red', 'Matchlockmen', [34.015, 71.315], 'Afzal Khan’s Jezailchis'], ['red', 'Matchlockmen', [34.015, 71.315], 'Jezailchis'],
      ['red', 'Dhal & Talwar', [34.032, 71.310], 'Ghazis'], ['red', 'Dhal & Talwar', [34.032, 71.310], 'Ghazis'],
      ['red', 'Dhal & Talwar', [34.035, 71.275], 'Ghazis'], ['red', 'Zamburak', [34.035, 71.275], 'Afghan Zamburaks'],
      // The Afridis rising in the hills on either side of the mouth of the pass.
      ['red', 'Matchlockmen', [33.975, 71.335], 'Afridi Lashkar'], ['red', 'Matchlockmen', [34.060, 71.330], 'Afridi Lashkar'],
      // Haji Khan's levies coming down from the Mohmand hills.
      ['red', 'Matchlockmen', [34.300, 71.460], 'Bajauri Levies'], ['red', 'Matchlockmen', [34.295, 71.430], 'Mohmand Levies'],
      ['red', 'Irregular Sowars', [34.305, 71.445], 'Haji Khan’s Horse'],
    ],
    reinforcements: [
      { round: 11, side: 'azure', at: [34.005, 71.82], name: 'The army from Lahore', note: 'came up the Attock road by forced marches', units: [['Khalsa Infantry', 'Fauj-i-Khas'], ['Khalsa Infantry', 'Fauj-i-Khas'], ['Khalsa Infantry', 'Khalsa Battalions'], ['Light Dragoons', 'Ghorchara Khas'], ['Irregular Sowars', 'Ghorcharas'], ['Light Field Gun', 'Topkhana-i-Khas']] },
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
};
