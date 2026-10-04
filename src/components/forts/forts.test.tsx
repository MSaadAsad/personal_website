import React from "react";
import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { FortMap } from "./FortMap";
import { padarSite, PADAR_SOURCE_PLAN, GATE_SOURCE } from "./padar";
import { devaSite } from "./deva-vatala";
import { camera, crossfade } from "./map-state";
import { octagon } from "./geometry";
for (const site of [padarSite, devaSite]) {
  for (const remains of [false, true]) {
    test(`${site.id}: ${remains ? "remains" : "reconstruction"} crossfade endpoints and midpoint`, () => {
      for (const percent of [0, 50, 100]) {
        const html = renderToStaticMarkup(
          <FortMap
            site={site}
            remains={remains}
            labels
            zoom={1}
            focusGate={false}
            satelliteOpacity={percent}
            selected={site.features[0].id}
            onSelect={() => {}}
          />,
        );
        assert.match(
          html,
          new RegExp(`data-map-layer="drawing" opacity="${1 - percent / 100}"`),
        );
        assert.match(
          html,
          new RegExp(
            `data-map-layer="satellite"[^>]*opacity="${percent / 100}"`,
          ),
        );
        assert.equal(html.includes('data-layer="reconstruction"'), !remains);
        assert.equal(html.includes('data-layer="partial-remains"'), remains);
        if (percent === 100) assert.match(html, /visibility="hidden"/);
        if (remains) assert.doesNotMatch(html, /<polygon/);
        else assert.equal((html.match(/<polygon/g) || []).length, 8);
      }
    });
  }
  test(`${site.id}: camera zoom preserves the image registration`, () => {
    const initial = camera(site.viewport, 1),
      close = camera(site.viewport, 2);
    assert.equal(initial.width / 2, close.width);
    assert.equal(initial.x + initial.width / 2, close.x + close.width / 2);
    assert.equal(initial.y + initial.height / 2, close.y + close.height / 2);
  });
}
test("Padar mounds appear only in partial remains", () => {
  const full = renderToStaticMarkup(
    <svg>
      <padarSite.Scene remains={false} labels />
    </svg>,
  );
  const partial = renderToStaticMarkup(
    <svg>
      <padarSite.Scene remains labels />
    </svg>,
  );
  assert.doesNotMatch(full, /Aligned western/);
  assert.match(partial, /Aligned western/);
});
test("5 m octagons measure 5 m between opposite vertices", () => {
  const pts = octagon(0, 0, 2.5)
    .split(" ")
    .map((p) => p.split(",").map(Number));
  assert.ok(
    Math.abs(Math.hypot(pts[0][0] - pts[4][0], pts[0][1] - pts[4][1]) - 5) <
      0.001,
  );
});
test("camera focus and blend bounds", () => {
  const view = camera(padarSite.viewport, 3, padarSite.focus);
  assert.equal(view.x + view.width / 2, padarSite.focus!.x);
  assert.deepEqual(crossfade(-1), { drawing: 1, satellite: 0 });
  assert.deepEqual(crossfade(101), { drawing: 0, satellite: 1 });
});

test("Padar stays square and its straight north wall meets the fixed gate", () => {
  const { origin, east, side } = PADAR_SOURCE_PLAN;
  const gateLocal = {
    x:
      (70 *
        ((GATE_SOURCE.x - origin.x) * east.x +
          (GATE_SOURCE.y - origin.y) * east.y)) /
      (east.x ** 2 + east.y ** 2),
    y:
      (70 *
        (-(GATE_SOURCE.x - origin.x) * east.y +
          (GATE_SOURCE.y - origin.y) * east.x)) /
      (east.x ** 2 + east.y ** 2),
  };
  assert.ok(
    Math.abs(gateLocal.y + 3) < 1e-9,
    "gate opening must be 3 m outside the straight north wall",
  );
  assert.ok(gateLocal.x > 9 && gateLocal.x < side);
  const corners = [
    origin,
    { x: origin.x + east.x, y: origin.y + east.y },
    { x: origin.x + east.x - east.y, y: origin.y + east.y + east.x },
    { x: origin.x - east.y, y: origin.y + east.x },
  ];
  const vectors = corners.map((p, i) => ({
    x: corners[(i + 1) % 4].x - p.x,
    y: corners[(i + 1) % 4].y - p.y,
  }));
  for (let i = 0; i < 4; i++) {
    assert.ok(
      Math.abs(
        Math.hypot(vectors[i].x, vectors[i].y) - Math.hypot(east.x, east.y),
      ) < 1e-9,
    );
    assert.ok(
      Math.abs(
        vectors[i].x * vectors[(i + 1) % 4].x +
          vectors[i].y * vectors[(i + 1) % 4].y,
      ) < 1e-8,
    );
  }
  assert.ok(padarSite.ppm < 7);
});
test("gate follows the supplied crop while the well remains fixed", () => {
  assert.deepEqual(GATE_SOURCE, { x: 960, y: 426 });
  const well = padarSite.features.find((f) => f.id === "well")!;
  assert.equal(
    well.x,
    Number((1.0668402 * 1058 + 0.07138368 * 593 - 380.52184).toFixed(3)),
  );
  assert.equal(
    well.y,
    Number((-0.07138368 * 1058 + 1.0668402 * 593 - 166.64776).toFixed(3)),
  );
});

test("Padar remains use enclosure coordinates for both side earthworks", () => {
  const html = renderToStaticMarkup(
    <svg>
      <padarSite.Scene remains labels />
    </svg>,
  );
  assert.match(html, /transform="translate\(0 0\)" data-earthwork="true"/);
  assert.match(html, /transform="translate\(70 0\)" data-earthwork="true"/);
  assert.equal((html.match(/data-earthwork="true"/g) || []).length, 2);
});

const bearings: [typeof padarSite, RegExp[]][] = [
  [devaSite, [/Maukriala<\/text>.*?3\.5 km/, /Batala village<\/text>.*?500 m/, /LoC<\/text>.*?2\.5 km/]],
  [padarSite, [/Hir<\/text>.*?2 km/, /Doara River<\/text>.*?2 km<\/text>.*?Old course ran.*?adjacent to.*?Padar and Hir/, /Barnala<\/text>.*?2\.5 km/]],
];
for (const [site, labels] of bearings) test(`${site.id}: labels nearby places on the map`, () => {
  const html = renderToStaticMarkup(
    <FortMap
      site={site}
      remains={false}
      labels={false}
      zoom={1}
      focusGate={false}
      satelliteOpacity={0}
      selected={site.features[0].id}
      onSelect={() => {}}
    />,
  );
  assert.equal((html.match(/data-map-layer="place"/g) || []).length, site.nearby!.length);
  for (const label of labels) assert.match(html, label);
});
