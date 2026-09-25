// Rodar: node --experimental-strip-types "app/[lang]/scene/scene.test.ts"
import assert from "node:assert/strict";
import { test } from "node:test";
import { flightPhases, flightProgress, sectionProgress } from "./progress.ts";
import { POINT_COUNT, shapes } from "./shapes.ts";

test("uma forma por seção, todas com o mesmo número de pontos finitos e dentro do quadro", () => {
  assert.equal(shapes.length, 6);
  for (const shape of shapes) {
    assert.equal(shape.length, POINT_COUNT * 3);
    for (const value of shape) {
      assert.ok(Number.isFinite(value) && Math.abs(value) <= 1.2, `fora do quadro: ${value}`);
    }
  }
});

test("progresso descansa em inteiros e cruza fronteiras de forma contínua", () => {
  const tops = [0, 1000, 2000];
  assert.equal(sectionProgress(tops, 500, 100), 0);
  assert.equal(sectionProgress(tops, 1000, 100), 0.5);
  assert.equal(sectionProgress(tops, 1500, 100), 1);
  assert.equal(sectionProgress(tops, 2050, 100), 1.75);
  assert.equal(sectionProgress(tops, 9999, 100), 2);
});

test("voo: forma o avião na lateral antes de viajar, e pousa no fim da página", () => {
  assert.deepEqual(flightPhases(0), { form: 0, travel: 0 });
  assert.deepEqual(flightPhases(0.3), { form: 1, travel: 0 });
  assert.deepEqual(flightPhases(1), { form: 1, travel: 1 });
  assert.equal(flightProgress(900, 800, 200), 0);
  assert.equal(flightProgress(500, 800, 200), 0.5);
  assert.equal(flightProgress(200, 800, 200), 1);
  // Página curta demais para rolar: pousa assim que a seção entra.
  assert.equal(flightProgress(700, 800, 800), 1);
});
