// Rodar: node --experimental-strip-types "app/[lang]/scene/scene.test.ts"
import assert from "node:assert/strict";
import { test } from "node:test";
import { flightArmed, flightPhases, sectionProgress } from "./progress.ts";
import { planeLanded, POINT_COUNT, projectShapes, shapes } from "./shapes.ts";

test("uma forma por seção, todas com o mesmo número de pontos finitos e dentro do quadro", () => {
  assert.equal(shapes.length, 6);
  assert.equal(Object.keys(projectShapes).length, 7);
  for (const shape of [...shapes, ...Object.values(projectShapes), planeLanded]) {
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

test("voo: forma o avião na lateral antes de viajar; o scroll só arma o voo", () => {
  assert.deepEqual(flightPhases(0), { form: 0, travel: 0 });
  assert.deepEqual(flightPhases(0.3), { form: 1, travel: 0 });
  assert.deepEqual(flightPhases(1), { form: 1, travel: 1 });
  // Arma ao subir de 65% da tela, desarma só abaixo de 75% (sem tremer na fronteira).
  assert.equal(flightArmed(0.8, false, false), false);
  assert.equal(flightArmed(0.65, false, false), true);
  assert.equal(flightArmed(0.7, false, true), true);
  assert.equal(flightArmed(0.7, false, false), false);
  assert.equal(flightArmed(0.8, false, true), false);
  // Fim da página sempre arma, mesmo com o contato abaixo do limite.
  assert.equal(flightArmed(0.9, true, false), true);
});
