"""Convert pkmapr GeoPackages to compact GeoJSON for the browser map."""

import json
import sqlite3
import struct
import sys


def parse_wkb(data, offset=0):
    order = "<" if data[offset] == 1 else ">"
    kind = struct.unpack_from(order + "I", data, offset + 1)[0] % 1000
    offset += 5

    if kind == 3:  # Polygon
        ring_count = struct.unpack_from(order + "I", data, offset)[0]
        offset += 4
        rings = []
        for _ in range(ring_count):
            point_count = struct.unpack_from(order + "I", data, offset)[0]
            offset += 4
            points = []
            for _ in range(point_count):
                x, y = struct.unpack_from(order + "dd", data, offset)
                offset += 16
                # Four decimals retain roughly 11 m precision, far beyond what
                # this 760 px national map can display, while cutting payload.
                points.append([round(x, 4), round(y, 4)])
            rings.append(points)
        return {"type": "Polygon", "coordinates": rings}, offset

    if kind == 6:  # MultiPolygon
        polygon_count = struct.unpack_from(order + "I", data, offset)[0]
        offset += 4
        polygons = []
        for _ in range(polygon_count):
            polygon, offset = parse_wkb(data, offset)
            polygons.append(polygon["coordinates"])
        return {"type": "MultiPolygon", "coordinates": polygons}, offset

    raise ValueError(f"Unsupported WKB geometry type: {kind}")


def gpkg_geometry(blob):
    flags = blob[3]
    envelope_type = (flags >> 1) & 0b111
    envelope_sizes = {0: 0, 1: 32, 2: 48, 3: 48, 4: 64}
    wkb_offset = 8 + envelope_sizes[envelope_type]
    return parse_wkb(blob, wkb_offset)[0]


def convert(source, table, fields, destination):
    connection = sqlite3.connect(source)
    columns = ", ".join(["geom", *fields])
    rows = connection.execute(f"SELECT {columns} FROM {table}")
    features = []
    for row in rows:
        features.append({
            "type": "Feature",
            "properties": dict(zip(fields, row[1:])),
            "geometry": gpkg_geometry(row[0]),
        })
    connection.close()
    with open(destination, "w", encoding="utf-8") as output:
        json.dump({"type": "FeatureCollection", "features": features}, output,
                  ensure_ascii=False, separators=(",", ":"))


if __name__ == "__main__":
    convert(sys.argv[1], "pak_districts_simplified",
            ["province_name", "district_name", "district_code", "area_km2"], sys.argv[2])
    convert(sys.argv[3], "pak_tehsils_simplified",
            ["province_name", "district_name", "tehsil_name", "tehsil_code", "area_km2"], sys.argv[4])
