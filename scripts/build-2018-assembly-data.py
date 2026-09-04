"""Build district-grouped 2018 provincial election results from cited result tables."""
import json
import re
import sys

CONFIG = {
    "Punjab": ("=== District-wise results ===", ["PTI", "PML-N", "PML-Q", "PPP", "PRHP", "IND", "Postponed"]),
    "Sindh": ("=== District-wise results ===", ["PPP", "PTI", "MQM-P", "GDA", "Other"]),
    "Khyber Pakhtunkhwa": ("=== Results by district ===", ["PTI", "MMA", "ANP", "PML-N", "PPP", "IND"]),
    "Balochistan": ("=== District-wise results ===", ["BAP", "MMA", "BNP-M", "PTI", "ANP", "BNP-A", "HDP", "PKMAP", "JWP", "PML-N", "Postponed"]),
}

SHARED_DISTRICTS = {
    ("Balochistan", "Musakhail"): ["Musakhail", "Sherani"],
    ("Balochistan", "Ziarat"): ["Ziarat", "Harnai"],
}


def clean_name(value):
    value = re.sub(r"\{\{.*?\}\}", "", value)
    value = re.sub(r"<.*?>", "", value)
    return value.replace("'''", "").strip()


def cell_number(value):
    value = re.sub(r"<[^>]+>", "", value).replace("'''", "").strip()
    value = value.rsplit("|", 1)[-1].strip()
    if value in {"-", "–", "—", ""}:
        return 0
    match = re.search(r"\d+", value.replace(",", ""))
    return int(match.group()) if match else 0


def extract(path, province, marker, parties):
    text = json.load(open(path, encoding="utf-8"))["parse"]["wikitext"]
    start = text.find(marker)
    if start < 0:
        raise ValueError(f"No {marker} in {path}")
    table_start = text.find("{|", start)
    table_end = text.find("\n|}", table_start)
    table = text[table_start:table_end]
    district_pattern = re.compile(
        r"\[\[([^\]|]*?(?:\s+[Dd]istrict[^\]|]*|Hangu, Pakistan|Tharparkar))(?:\|([^\]]+))?\]\]"
    )
    rows = []
    for block in re.split(r"\n\|-", table)[1:]:
        matches = list(district_pattern.finditer(block))
        if not matches:
            continue
        match = matches[-1]
        name = clean_name(match.group(2) or re.sub(r"\s+[Dd]istrict$", "", match.group(1)))
        if name == "District":
            continue
        cells = [cell_number(cell) for cell in re.split(r"!!|\|\||\n[!|]", block[match.end():]) if cell.strip()]
        if len(cells) < len(parties) + 1:
            continue
        seats, counts = cells[0], cells[1:1 + len(parties)]
        party_counts = {party: count for party, count in zip(parties, counts) if count}
        counted = sum(party_counts.values())
        if counted < seats:
            party_counts["Postponed"] = party_counts.get("Postponed", 0) + seats - counted
        districts = SHARED_DISTRICTS.get((province, name), [name])
        rows.append({
            "district": " + ".join(districts),
            "districts": districts,
            "province": province,
            "seats": seats,
            "parties": party_counts,
        })
    return rows


if __name__ == "__main__":
    files = dict(argument.split("=", 1) for argument in sys.argv[1:-1])
    output = sys.argv[-1]
    rows = []
    for province, (marker, parties) in CONFIG.items():
        rows.extend(extract(files[province], province, marker, parties))
    with open(output, "w", encoding="utf-8") as handle:
        json.dump({
            "election": "Pakistan general election, 25 July 2018",
            "year": 2018,
            "basis": "General-seat winners grouped by the 2018 district labels in provincial result tables. Seats spanning multiple districts are counted only when those districts remain together in a proposed province.",
            "source": "Election Commission of Pakistan Annual Report 2018; district groupings transcribed from ECP-referenced provincial result tables",
            "districts": rows,
        }, handle, ensure_ascii=False, separators=(",", ":"))
