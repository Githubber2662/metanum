// test.js — focused regression tests for metanum Issue #17 (fork: MarchBeta2087/metanum)
//
// Run:  node test.js   (wired to `npm test`)
// Full upstream suite: `npm run test:suite` (test_mixed.js)
//
// Each vector is frozen against the defects documented in
// docs/issue-17-defects.md. See docs/repro/issue-17.js for the read-only
// diagnostic variant.
"use strict";

var MetaNum = require("./metanum.js");
global.MetaNum = MetaNum; // format-metanum.js expects the global
var format = require("./format-metanum.js").format;

var pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log("PASS | " + name); }
  else {
    fail++;
    console.log("FAIL | " + name + (extra !== undefined ? "  => " + extra : ""));
  }
}
function eq(name, got, want) {
  ok(name, got === want, "got " + JSON.stringify(got) + ", want " + JSON.stringify(want));
}

// ─────────────────────────────────────────────────────────────
// D01 · pow(10, α) must not flip sign below the double subnormal floor
// ─────────────────────────────────────────────────────────────
console.log("\n=== D01 pow(10, negative alpha) sign ===");
[-320, -323, -324, -325, -350, -400].forEach(function (a) {
  ok("pow(10," + a + ").lt(1)", MetaNum.pow(10, a).lt(1), MetaNum.pow(10, a).toString());
});
ok("pow(10,-324).mul(1e324).eq(1)",
  MetaNum.pow(10, -324).mul(MetaNum.fromString("1e324")).eq(1),
  MetaNum.pow(10, -324).mul(MetaNum.fromString("1e324")).toString());
(function monotone() {
  var prev = MetaNum.pow(10, -320), all = true;
  for (var a = -321; a >= -400; a--) {
    var v = MetaNum.pow(10, a);
    if (!v.lt(prev)) { all = false; break; }
    prev = v;
  }
  ok("pow(10,α) strictly decreasing over α ∈ [-320,-400]", all);
})();
eq("log10(10^-324) === -324", MetaNum.pow(10, -324).log10().toString(), "-324");
ok("pow(10,-320) still < 1 (no regression)", MetaNum.pow(10, -320).lt(1));

// ─────────────────────────────────────────────────────────────
// D02 · toBeaf() must keep the base for 10^e (was "{16}")
// ─────────────────────────────────────────────────────────────
console.log("\n=== D02 toBeaf base preservation ===");
(function () {
  var v16 = MetaNum.BEAF(10, 16);
  var s16 = v16.toBeaf();
  ok("BEAF(10,16).toBeaf() !== '{16}'", s16 !== "{16}", s16);
  eq("BEAF(10,16).toBeaf()", s16, "{10, 16}");
  ok("fromBeaf(BEAF(10,16).toBeaf()).eq(BEAF(10,16))", MetaNum.fromBeaf(s16).eq(v16), s16);
  var s100 = MetaNum.BEAF(10, 100).toBeaf();
  ok("BEAF(10,100) round-trip", MetaNum.fromBeaf(s100).eq(MetaNum.BEAF(10, 100)), s100);
  eq("fromBeaf('{10,16}').toBeaf()", MetaNum.fromBeaf("{10,16}").toBeaf(), "{10, 16}");
  // documented (< MSI) behavior must not regress
  eq("BEAF(10,15).toBeaf()", MetaNum.BEAF(10, 15).toBeaf(), "{1000000000000000}");
  // README examples
  eq("7625597484987.toBeaf()", new MetaNum(7625597484987).toBeaf(), "{7625597484987}");
  eq("BEAF(3,3,3).toBeaf()", MetaNum.BEAF(3, 3, 3).toBeaf(), "{3638334640023.7783}");
})();

// ─────────────────────────────────────────────────────────────
// D03 · toBeaf() must never dump internal rows; it fails loudly instead
// ─────────────────────────────────────────────────────────────
console.log("\n=== D03 toBeaf unrepresentable behavior ===");
[["BEAF(10,2,1,1,2)", MetaNum.BEAF(10, 2, 1, 1, 2)],
 ["BEAF(4,5,6,7,8,9)", MetaNum.BEAF(4, 5, 6, 7, 8, 9)],
 ["fromArray([[10],[1,2,1]])", MetaNum.fromArray([[10], [1, 2, 1]])]
].forEach(function (p) {
  var name = p[0], m = p[1], threw = null, out = null;
  try { out = m.toBeaf(); } catch (e) { threw = e; }
  ok(name + ".toBeaf() throws a typed error", threw && threw.name === "MetaNumUnrepresentableError" &&
    threw.code === "METANUM_UNREPRESENTABLE", threw ? threw.name : out);
  if (out !== null) ok(name + ".toBeaf() has no internal '[' literals", out.indexOf("[") === -1, out);
});

// ─────────────────────────────────────────────────────────────
// D04 · format() repeated single-letter chains must not fold to a tiny count
// ─────────────────────────────────────────────────────────────
console.log("\n=== D04 format repeated-letter chains ===");
(function () {
  eq("format(Z152416) unchanged", format(MetaNum("Z152416")), "1.000Z152,416");
  var z = format(MetaNum("ZZ152416"));
  var zz = format(MetaNum("ZZZ152416"));
  ok("format(ZZ152416) !== '1.000Z3'", z !== "1.000Z3", z);
  eq("format(ZZ152416)", z, "Z1.000Z152,416");
  eq("format(ZZZ152416)", zz, "ZZ1.000Z152,416");
  ok("Z/ZZ/ZZZ values strictly increasing",
    MetaNum("Z152416").lt(MetaNum("ZZ152416")) &&
    MetaNum("ZZ152416").lt(MetaNum("ZZZ152416")));
  // canonical same-letter law: AaAa300 → Aa1.000Aa300 (unchanged)
  eq("format(AaAa300) law intact", format(MetaNum("AaAa300")), "Aa1.000Aa300");
  // the buggy family (prefix top row over a dominant lower row)
  eq("format(YY10)", format(MetaNum("YY10")), "Y1.000Y10");
  eq("format(ZY10)", format(MetaNum("ZY10")), "Z1.000Y10");
  eq("format(ZZ10)", format(MetaNum("ZZ10")), "Z1.000Z10");
})();

// ─────────────────────────────────────────────────────────────
// D05 · !Aaα with real α (notation-semantics decision 1B)
// ─────────────────────────────────────────────────────────────
console.log("\n=== D05 !Aa(real alpha) ===");
(function () {
  ok("!Aa0.5 != 0", MetaNum("!Aa0.5").neq(0), MetaNum("!Aa0.5").toString());
  ok("!Aa1.5 != 0", MetaNum("!Aa1.5").neq(0), MetaNum("!Aa1.5").toString());
  ok("!Aa2.5 != 0", MetaNum("!Aa2.5").neq(0), MetaNum("!Aa2.5").toString());
  ok("!Aa1.5 === Aa1.5", MetaNum("!Aa1.5").eq(MetaNum("Aa1.5")));
  ok("!Aa2.5 === Aaa2.5", MetaNum("!Aa2.5").eq(MetaNum("Aaa2.5")));
  ok("!Aa1 < !Aa1.5 < !Aa2 < !Aa2.5 < !Aa3",
    MetaNum("!Aa1").lt(MetaNum("!Aa1.5")) && MetaNum("!Aa1.5").lt(MetaNum("!Aa2")) &&
    MetaNum("!Aa2").lt(MetaNum("!Aa2.5")) && MetaNum("!Aa2.5").lt(MetaNum("!Aa3")));
  // integer path must not regress
  ok("!Aa1 === Aa1", MetaNum("!Aa1").eq(MetaNum("Aa1")));
  ok("!Aa2 === Aaa2", MetaNum("!Aa2").eq(MetaNum("Aaa2")));
  ok("!Aa5 === Aaaaaa5", MetaNum("!Aa5").eq(MetaNum("Aaaaaa5")));
  ok("!Aa10 === Aaaaaaaaaaa10", MetaNum("!Aa10").eq(MetaNum("Aaaaaaaaaaa10")));
})();

// ─────────────────────────────────────────────────────────────
// D06 · !αAaβ = !Aa(β + log₅(α/2))  (notation-semantics §2, A1)
// ─────────────────────────────────────────────────────────────
console.log("\n=== D06 !alpha Aa beta ===");
(function () {
  function log5(x) { return Math.log(x) / Math.log(5); }
  function buildAa(x) {
    var k = Math.max(1, Math.floor(x));
    var row = [1];
    for (var i = 0; i < k; i++) row.push(0);
    row.push(1);
    return MetaNum.fromArray([[x], row]);
  }
  ok("!2.5Aa4 != 0", MetaNum("!2.5Aa4").neq(0), MetaNum("!2.5Aa4").toString());
  ok("!1.5Aa4 != 0", MetaNum("!1.5Aa4").neq(0), MetaNum("!1.5Aa4").toString());
  ok("!1Aa1.5 != 0", MetaNum("!1Aa1.5").neq(0), MetaNum("!1Aa1.5").toString());
  // formula: !αAaβ == !Aa(β + log5(α/2))
  ok("!2.5Aa4 == !Aa(4+log5(2.5/2))",
    MetaNum("!2.5Aa4").eq(buildAa(4 + log5(2.5 / 2))));
  ok("!1.5Aa4 == !Aa(4+log5(1.5/2))",
    MetaNum("!1.5Aa4").eq(buildAa(4 + log5(1.5 / 2))));
  // no regression on the documented anchor (α=2 → log5(1)=0)
  ok("!2.0000Aa4 === !Aa4", MetaNum("!2.0000Aa4").eq(MetaNum("!Aa4")));
  // legacy 1.0+ spelling still means "no mantissa"
  ok("!1.000Aa5 === !Aa5 (legacy)", MetaNum("!1.000Aa5").eq(MetaNum("!Aa5")));
  // formatter round-trips the true value as the binary form
  eq("format(!2.5Aa4)", format(MetaNum("!2.5Aa4")), "!2.500Aa4");
  ok("round-trip !2.5Aa4", MetaNum(format(MetaNum("!2.5Aa4"))).eq(MetaNum("!2.5Aa4")));
  ok("round-trip !2.376Aa999", MetaNum(format(MetaNum("!2.376Aa999"))).eq(MetaNum("!2.376Aa999")));
})();

// ─────────────────────────────────────────────────────────────
// D07 · 2{λ}2 = 4 (notation-semantics §3, rule 3)
// ─────────────────────────────────────────────────────────────
console.log("\n=== D07 2{lambda}2 ===");
(function () {
  var ops = ["aperiote", "aperionate", "iter", "itermult", "cuboiter", "expoiter",
             "trioterate", "trixxate", "aperixxate", "epsilonate"];
  // B2-a: for base 2 every infinite/successor level collapses to 4 for any
  // integer y >= 2 (rule 3 turns the argument into 2).
  [2, 3, 5, 1000].forEach(function (y) {
    ops.forEach(function (op) {
      var v = new MetaNum(2)[op](y);
      ok("2{" + op + "}" + y + " === 4", v.eq(4), v.toString());
    });
  });
  // finite levels must NOT collapse (2{1}3 = 8, 2{2}3 = 16)
  ok("2{1}3 === 8 (finite unaffected)", new MetaNum(2).arrow(1)(3).eq(8));
  ok("2{2}3 === 16 (finite unaffected)", new MetaNum(2).arrow(2)(3).eq(16));
  ok("3{ω²}1 === 3 (y=1)", new MetaNum(3).aperionate(1).eq(3));
  ok("3{ω^ω}1 === 3 (y=1)", new MetaNum(3).trixxate(1).eq(3));
})();

// ─────────────────────────────────────────────────────────────
console.log("\n─────────────────────────────────────────────");
console.log("issue-17 regression: " + pass + " passed, " + fail + " failed");
console.log("─────────────────────────────────────────────");
process.exitCode = fail === 0 ? 0 : 1;
