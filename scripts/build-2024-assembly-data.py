"""Extract district-level 2024 provincial election results from cited result tables."""
import json
import re
import sys

CONFIG = {
    "Punjab": ("Results by district", ["PTI-backed IND", "PML-N", "PML-Q", "PPP", "IPP", "IND", "Other", "Postponed"]),
    "Sindh": ("Results by district", ["PPP", "MQM-P", "PTI-backed IND", "JI", "GDA", "IND", "Other"]),
    "Khyber Pakhtunkhwa": ("Results by district", ["PTI-backed IND", "JUI-F", "PML-N", "PPP", "PTI-P", "ANP", "IND", "Other", "Postponed"]),
    "Balochistan": ("District-wise results", ["PPP", "PML-N", "JUI-F", "BAP", "NP", "ANP", "BNP-M", "BNP-A", "JI", "HDT"]),
}

def clean_name(value):
    value = re.sub(r"\{\{.*?\}\}", "", value)
    value = re.sub(r"<.*?>", "", value)
    return value.replace("'''", "").strip()

def cell_number(line):
    value = line.rsplit("|", 1)[-1]
    value = re.sub(r"<[^>]+>", "", value).replace("'''", "").strip()
    if value in {"-", "–", "—", ""}: return 0
    match = re.search(r"\d+", value.replace(",", ""))
    return int(match.group()) if match else 0

def extract(path, province, marker, parties):
    text = json.load(open(path, encoding="utf-8"))["parse"]["wikitext"]
    start = text.find(marker)
    if start < 0: raise ValueError(f"No {marker} in {path}")
    table_start = text.find("{|", start)
    table_end = text.find("|}", table_start)
    table = text[table_start:table_end]
    rows = []
    district_pattern = re.compile(r"\[\[([^\]|]*?(?:\s+[Dd]istrict[^\]|]*|Hangu, Pakistan|Tharparkar))(?:\|([^\]]+))?\]\]")
    for block in re.split(r"\n\|-", table)[1:]:
        matches = list(district_pattern.finditer(block))
        if not matches: continue
        match = matches[-1]
        name = clean_name(match.group(2) or re.sub(r"\s+[Dd]istrict$", "", match.group(1)))
        lines = [line for line in block[match.end():].splitlines() if line.startswith(("|", "!"))]
        values = [cell_number(line) for line in lines]
        if len(values) < len(parties) + 1: continue
        seats, counts = values[0], values[1:1 + len(parties)]
        rows.append({"district": name, "province": province, "seats": seats,
                     "parties": {party: count for party, count in zip(parties, counts) if count}})
    return rows

if __name__ == "__main__":
    files = dict(arg.split("=", 1) for arg in sys.argv[1:-1])
    output = sys.argv[-1]
    rows = []
    for province, (marker, parties) in CONFIG.items():
        rows.extend(extract(files[province], province, marker, parties))
    with open(output, "w", encoding="utf-8") as handle:
        json.dump({
            "election": "Pakistan general election, 8 February 2024",
            "basis": "General-seat winners grouped by district; PTI-backed independents identified separately where the source table does so.",
            "source": "ECP-referenced 2024 provincial election result tables",
            "districts": rows,
        }, handle, ensure_ascii=False, separators=(",", ":"))
