/** Build the small, attributed Data Darbar subset used by Naya Naqsha. */
import fs from 'node:fs';
import vm from 'node:vm';

const [censusPath, povertyPath, outputPath] = process.argv.slice(2);
if (!censusPath || !povertyPath || !outputPath) throw new Error('Usage: node script census_data.js poverty_data.js output.json');

const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(censusPath, 'utf8'), context);
vm.runInContext(fs.readFileSync(povertyPath, 'utf8'), context);

const normalise = value => String(value).toLowerCase().replace(/district|agency/g, '').replace(/[^a-z0-9]/g, '');
const povertyDistricts = context.window.DD_POV.districts;
const districts = {};
for (const [key, row] of Object.entries(context.window.DD_DATA)) {
  const poverty = povertyDistricts[key] || povertyDistricts[normalise(key)] || {};
  districts[normalise(key)] = {
    n: poverty.name || key,
    p: row.t1_2023_pop_total ?? null,
    l: row.t12_2023_literate_all ?? null,
    i: row.t12_2023_illiterate_all ?? null,
    u: row.t5_2023_urban_all ?? null,
    ur: row.t_emp_2023_unemployment_rate ?? null,
    lfpr: row.t_emp_2023_lfpr ?? null,
    oos: row.t12_2023_out_of_school_5_16 ?? null,
    mat: row.t_edu_2023_pct_matric_plus ?? null,
    enrol: row.pslm_net_enrolment_rate ?? null,
    num: row.pslm_numeracy_rate ?? null,
    cons: row.hies_low_n ? null : (row.hies_mean_monthly_percapita ?? null),
    fi: row.hies_low_n ? null : (row.hies_food_insecurity_pct ?? null),
    net: row.hies_low_n ? null : (row.hies_ict_pct_internet_user ?? null),
    elec: row.hies_low_n ? null : (row.hies_pct_electricity ?? null),
    mpi: poverty.mpi ?? null,
    h: poverty.H ?? null,
  };
}

const tehsils = Object.values(context.window.DD_POV.tehsils).map(row => ({
  n: row.name, d: normalise(row.dk), p: row.pop ?? null, r: row.rwi_pct ?? null,
  nl: row.nl?.['2026'] ?? row.nl_latest ?? null,
}));

fs.writeFileSync(outputPath, JSON.stringify({
  source: 'Data Darbar (darbar.adaad.org)',
  generated: '2026-09-03',
  methodology: 'PBS Census 2023 counts; district social rates are population-weighted estimates; HIES district observations are rural-only; the Data Darbar deprivation index is not the official national MPI; Meta RWI, WorldPop and VIIRS night lights are modeled proxies',
  districts, tehsils,
}));
