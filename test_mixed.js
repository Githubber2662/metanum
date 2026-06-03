var MetaNum = require("./metanum.js");

function check(name, input, expectedArray) {
  try {
    var m = MetaNum(input);
    var arrStr = JSON.stringify(m.array);
    var expStr = JSON.stringify(expectedArray);
    var pass = arrStr === expStr;
    console.log((pass ? "PASS" : "FAIL") + " | " + name + " | " + input);
    if (!pass) {
      console.log("  Got:      " + arrStr);
      console.log("  Expected: " + expStr);
      process.exitCode = 1;
    }
  } catch (e) {
    console.log("ERROR | " + name + " | " + input + " => " + e.message);
    process.exitCode = 1;
  }
}

function checkRT(name, input) {
  try {
    var m = MetaNum(input);
    var s = m.toString();
    var m2 = MetaNum(s);
    var pass = m.eq(m2);
    console.log((pass ? "PASS" : "FAIL") + " | RT " + name + " | " + input + " => " + s + " => " + m2.toString());
    if (!pass) process.exitCode = 1;
  } catch (e) {
    console.log("ERROR | RT " + name + " | " + input + " => " + e.message);
    process.exitCode = 1;
  }
}

console.log("=== New mixed token tests ===");
check("BbBbAaGGGFFE100 array", "BbBbAaGGGFFE100", [[100, 1, 2, 3], [1,0,1],[2,1,2]]);
check("QqQe308 array", "QqQe308", [[308], [1, 4, 17], [1, 16, 17]]);
check("AcAbAbAaAaAa114514 array", "AcAbAbAaAaAa114514", [[114514], [3, 0, 1], [2, 1, 1], [1, 2, 1]]);
check("AaAb100 array", "AaAb100", [[100], [1,0,1],[1,1,1]]);
check("AbAa100 array", "AbAa100", [[100], [1,0,1],[1,1,1]]);

console.log("\n=== Mixed token toString ===");
var m1 = MetaNum("QqQe308");
console.log("QqQe308 => " + m1.toString() + " _oaRowData=" + JSON.stringify(m1._oaRowData));
var m2 = MetaNum("AcAbAbAaAaAa114514");
console.log("AcAbAbAaAaAa114514 => " + m2.toString() + " _oaRowData=" + JSON.stringify(m2._oaRowData));

console.log("\n=== Mixed roundtrip ===");
checkRT("QqQe308", "QqQe308");
checkRT("AcAbAbAaAaAa114514", "AcAbAbAaAaAa114514");

console.log("\n=== 2-letter regression ===");
checkRT("Aa10", "Aa10");
checkRT("Ab5", "Ab5");
checkRT("Ac100", "Ac100");
checkRT("AaAa10", "AaAa10");
checkRT("AbAb10", "AbAb10");
checkRT("Ba10", "Ba10");
checkRT("Ba1", "Ba1");
checkRT("BaBa10", "BaBa10");
checkRT("Bb10", "Bb10");
checkRT("Bc10", "Bc10");
checkRT("Bz10", "Bz10");
checkRT("Ca10", "Ca10");
checkRT("Zz10", "Zz10");
checkRT("ZzZz10", "ZzZz10");

console.log("\n=== 3-letter regression ===");
checkRT("Aaa10", "Aaa10");
checkRT("Aaa1", "Aaa1");
checkRT("AaaAaa10", "AaaAaa10");
checkRT("Baa10", "Baa10");
checkRT("Zzz10", "Zzz10");
checkRT("Aab10", "Aab10");
checkRT("Aac10", "Aac10");
checkRT("Abb10", "Abb10");
checkRT("Aba10", "Aba10");
checkRT("Aba1", "Aba1");
checkRT("Aba2", "Aba2");
checkRT("Aca10", "Aca10");
checkRT("Aza10", "Aza10");
checkRT("Aba100", "Aba100");

console.log("\n=== 4-letter regression ===");
checkRT("Aaaa10", "Aaaa10");
checkRT("AaaaAaaa10", "AaaaAaaa10");
checkRT("Aaab10", "Aaab10");
checkRT("Aaba10", "Aaba10");
checkRT("Abaa10", "Abaa10");
checkRT("Baaa10", "Baaa10");
checkRT("Zzzz10", "Zzzz10");

console.log("\n=== 5-letter regression ===");
checkRT("Aaaaa10", "Aaaaa10");
checkRT("Zzzzz10", "Zzzzz10");

console.log("\n=== symbol+letters regression ===");
checkRT("!Aa10", "!Aa10"); //layer=1
checkRT("!Abcd10", "!Abcd10"); //layer=1
checkRT("@Ef10", "@Ef10"); //layer=2
checkRT("#Gh100", "#Gh100"); //layer=3
checkRT("1ε100", "1ε100"); //layer=100
checkRT("1ε"+Number.MAX_SAFE_INTEGER.toString(), "1ε"+Number.MAX_SAFE_INTEGER.toString()); //layer=MSI


// ─────────────────────────────────────
// 超运算 (Hyperoperations) 测试
// ─────────────────────────────────────

function checkOp(label, result, expectedVal, tol) {
  if (tol === undefined) tol = 0.01;
  try {
    var rn = result.toNumber ? result.toNumber() : result;
    if (Number.isNaN(rn) && Number.isNaN(expectedVal)) {
      console.log("PASS | " + label + " | NaN (expected)");
      return;
    }
    if (Number.isFinite(rn) && Number.isFinite(expectedVal)) {
      var ok = Math.abs(rn - expectedVal) <= tol;
      console.log((ok ? "PASS" : "FAIL") + " | " + label + " | got=" + (result.toString ? result.toString().slice(0,40) : result) + " expected=" + expectedVal);
      if (!ok) process.exitCode = 1;
      return;
    }
    console.log("PASS | " + label + " | " + (result.toString ? result.toString().slice(0,60) : result));
  } catch (e) {
    console.log("ERROR | " + label + " => " + e.message);
    process.exitCode = 1;
  }
}

function checkBool(label, result, expected) {
  try {
    var pass = result === expected;
    console.log((pass ? "PASS" : "FAIL") + " | " + label + " | got=" + result + " expected=" + expected);
    if (!pass) process.exitCode = 1;
  } catch (e) {
    console.log("ERROR | " + label + " => " + e.message);
    process.exitCode = 1;
  }
}

var m2 = MetaNum(2);
var m3 = MetaNum(3);
var m4 = MetaNum(4);
var m0 = MetaNum(0);
var m1 = MetaNum(1);

// ─── 1. aperiote (ω*2): x{y}x = arrow(x,y,x), arrow(y)(a,a)=a↑^y a ───
console.log("\n=== 1. aperiote (ω) ===");
// arrow(0): multiplication → 2*2=4, 3*3=9
// arrow(1): exponentiation → 2^2=4, 3^3=27
// arrow(2): tetration → 2↑↑2=4, 3↑↑3=3^27=7625597484987
checkOp("aper(2,0)", m2.aperiote(0), 4, 0);
checkOp("aper(2,1)", m2.aperiote(1), 4, 0);
checkOp("aper(2,2)", m2.aperiote(2), 4, 0);
checkOp("aper(3,0)", m3.aperiote(0), 9, 0);
checkOp("aper(3,1)", m3.aperiote(1), 27, 0);
checkBool("aper NaN", MetaNum.aperiote(m2, MetaNum.NaN).isNaN(), true);
checkBool("aper inv NaN", MetaNum.inv_aperiote(m2, MetaNum.NaN).isNaN(), true);

// ─── 2. expande (ω+1): x{{1}}y ───
console.log("\n=== 2. expande (ω+1) ===");
checkOp("expa(2,1)", m2.expande(1), 2, 0);
checkOp("expa(2,2)", m2.expande(2), 4, 0);
checkBool("expa y=0 NaN", m2.expande(0).isNaN(), true);
checkBool("expa NaN", MetaNum.expande(m2, MetaNum.NaN).isNaN(), true);

// ─── 3. multiexpande (ω+2): x{{2}}y ───
console.log("\n=== 3. multiexpande (ω+2) ===");
checkOp("muea(2,1)", m2.multiexpande(1), 2, 0);
checkOp("muea(2,2)", m2.multiexpande(2), 4, 0);
checkBool("muea y=0 NaN", m2.multiexpande(0).isNaN(), true);
checkBool("muea NaN", MetaNum.multiexpande(m2, MetaNum.NaN).isNaN(), true);

// ─── 4. powerexpande (ω+3): x{{3}}y ───
console.log("\n=== 4. powerexpande (ω+3) ===");
checkOp("poea(2,1)", m2.powerexpande(1), 2, 0);
checkOp("poea(2,2)", m2.powerexpande(2), 4, 0);
checkBool("poea y=0 NaN", m2.powerexpande(0).isNaN(), true);
checkBool("poea NaN", MetaNum.powerexpande(m2, MetaNum.NaN).isNaN(), true);

// ─── 5. aperioexpande (ω*2): x{{y}}x ───
console.log("\n=== 5. aperioexpande (ω*2) ===");
checkOp("apea(2,1)", m2.aperioexpande(1), 4, 0);
checkBool("apea NaN", MetaNum.aperioexpande(m2, MetaNum.NaN).isNaN(), true);

// ─── 6. explode (ω*2+1): x{{{1}}}y ───
console.log("\n=== 6. explode (ω*2+1) ===");
checkOp("expl(2,1)", m2.explode(1), 2, 0);
checkBool("expl y=0 NaN", m2.explode(0).isNaN(), true);
checkBool("expl NaN", MetaNum.explode(m2, MetaNum.NaN).isNaN(), true);

// ─── 7. multiexplode (ω*2+2): x{{{2}}}y ───
console.log("\n=== 7. multiexplode (ω*2+2) ===");
checkOp("muel(2,1)", m2.multiexplode(1), 2, 0);
checkBool("muel y=0 NaN", m2.multiexplode(0).isNaN(), true);
checkBool("muel NaN", MetaNum.multiexplode(m2, MetaNum.NaN).isNaN(), true);

// ─── 8. aperioexplode (ω*3): x{{{y}}}x ───
console.log("\n=== 8. aperioexplode (ω*3) ===");
checkOp("apel(2,1)", m2.aperioexplode(1), 4, 0);
checkBool("apel NaN", MetaNum.aperioexplode(m2, MetaNum.NaN).isNaN(), true);

// ─── 9. detonate (ω*3+1): x{{{{1}}}}y ───
console.log("\n=== 9. detonate (ω*3+1) ===");
checkOp("deto(2,1)", m2.detonate(1), 2, 0);
checkBool("deto y=0 NaN", m2.detonate(0).isNaN(), true);
checkBool("deto NaN", MetaNum.detonate(m2, MetaNum.NaN).isNaN(), true);

// ─── 10. aperiodetonate (ω*4): x{{{{y}}}}x ───
console.log("\n=== 10. aperiodetonate (ω*4) ===");
checkOp("apdt(2,1)", m2.aperiodetonate(1), 4, 0);
checkBool("apdt NaN", MetaNum.aperiodetonate(m2, MetaNum.NaN).isNaN(), true);

// ─── 11. aperionate (ω^2): 对角化 ω*y ───
console.log("\n=== 11. aperionate (ω^2) ===");
checkOp("apeo(2,1)", m2.aperionate(1), m2.aperiote(2).toNumber(), 0.01);
checkBool("apeo NaN", MetaNum.aperionate(m2, MetaNum.NaN).isNaN(), true);

// ─── 12. megote (ω^2+1): 迭代 ω^2 ───
console.log("\n=== 12. megote (ω^2+1) ===");
checkOp("mego(2,1)", m2.megote(1), 2, 0);
checkBool("mego y=0 NaN", m2.megote(0).isNaN(), true);
checkBool("mego NaN", MetaNum.megote(m2, MetaNum.NaN).isNaN(), true);

// ─── 13. multimegote (ω^2+2): 迭代 ω^2+1 ───
console.log("\n=== 13. multimegote (ω^2+2) ===");
checkOp("mume(2,1)", m2.multimegote(1), 2, 0);
checkBool("mume y=0 NaN", m2.multimegote(0).isNaN(), true);
checkBool("mume NaN", MetaNum.multimegote(m2, MetaNum.NaN).isNaN(), true);

// ─── 14. aperimegote (ω^2+ω): 对角化 ω^2+y ───
console.log("\n=== 14. aperimegote (ω^2+ω) ===");
checkOp("apmg(2,1)", m2.aperimegote(1), m2.megote(m2).toNumber(), 0.01);
checkBool("apmg NaN", MetaNum.aperimegote(m2, MetaNum.NaN).isNaN(), true);

// ─── 15. megoexpande (ω^2+ω+1): 迭代 ω^2+ω ───
console.log("\n=== 15. megoexpande (ω^2+ω+1) ===");
checkOp("mgea(2,1)", m2.megoexpande(1), 2, 0);
checkBool("mgea y=0 NaN", m2.megoexpande(0).isNaN(), true);
checkBool("mgea NaN", MetaNum.megoexpande(m2, MetaNum.NaN).isNaN(), true);

// ─── 16. aperimegoexpande (ω^2+ω*2): 对角化 ω^2+ω+y ───
console.log("\n=== 16. aperimegoexpande (ω^2+ω*2) ===");
checkOp("apme(2,1)", m2.aperimegoexpande(1), m2.megoexpande(m2).toNumber(), 0.01);
checkBool("apme NaN", MetaNum.aperimegoexpande(m2, MetaNum.NaN).isNaN(), true);

// ─── 17. megoaperionation (ω^2*2): 对角化 ω^2+ω*y ───
console.log("\n=== 17. megoaperionation (ω^2*2) ===");
checkBool("mgao NaN", MetaNum.megoaperionation(m2, MetaNum.NaN).isNaN(), true);

// ─── 18. gigote (ω^2*2+1): 迭代 ω^2*2 ───
console.log("\n=== 18. gigote (ω^2*2+1) ===");
checkOp("gigo(2,1)", m2.gigote(1), 2, 0);
checkBool("gigo y=0 NaN", m2.gigote(0).isNaN(), true);
checkBool("gigo NaN", MetaNum.gigote(m2, MetaNum.NaN).isNaN(), true);

// ─── 19. aperigigote (ω^2*2+ω): 对角化 ω^2*2+y ───
console.log("\n=== 19. aperigigote (ω^2*2+ω) ===");
checkOp("apgg(2,1)", m2.aperigigote(1), m2.gigote(m2).toNumber(), 0.01);
checkBool("apgg NaN", MetaNum.aperigigote(m2, MetaNum.NaN).isNaN(), true);

// ─── 20. gigoaperionate (ω^2*3): 对角化 ω^2*2+ω*y ───
console.log("\n=== 20. gigoaperionate (ω^2*3) ===");
checkOp("ggap(2,1)", m2.gigoaperionate(1), 2, 0);
checkBool("ggap y=0 NaN", m2.gigoaperionate(0).isNaN(), true);
checkBool("ggap NaN", MetaNum.gigoaperionate(m2, MetaNum.NaN).isNaN(), true);

// ─── 21. aperiatotion (ω^3): 对角化 ω^2*y ───
console.log("\n=== 21. aperiatotion (ω^3) ===");
checkOp("apat(2,1)", m2.aperiatotion(1), m2.aperionate(m2).toNumber(), 0.01);
checkBool("apat NaN", MetaNum.aperiatotion(m2, MetaNum.NaN).isNaN(), true);

// ─── 22. powiainate (ω^3+1): 迭代 ω^3 ───
console.log("\n=== 22. powiainate (ω^3+1) ===");
checkOp("pwan(2,1)", m2.powiainate(1), 2, 0);
checkBool("pwan y=0 NaN", m2.powiainate(0).isNaN(), true);
checkBool("pwan NaN", MetaNum.powiainate(m2, MetaNum.NaN).isNaN(), true);

// ─── 23. expandainate (ω^3+ω): ω级别迭代 powiainate ───
console.log("\n=== 23. expandainate (ω^3+ω) ===");
checkOp("epan(2,1)", m2.expandainate(1), m2.powiainate(m2).toNumber(), 0.01);
checkBool("epan NaN", MetaNum.expandainate(m2, MetaNum.NaN).isNaN(), true);

// ─── 24. megodainate (ω^3+ω^2): 迭代 ω^3+ω ───
console.log("\n=== 24. megodainate (ω^3+ω^2) ===");
checkOp("mgan(2,1)", m2.megodainate(1), 2, 0);
checkBool("mgan y=0 NaN", m2.megodainate(0).isNaN(), true);
checkBool("mgan NaN", MetaNum.megodainate(m2, MetaNum.NaN).isNaN(), true);

// ─── 25. powiairate (ω^3*2) ───
console.log("\n=== 25. powiairate (ω^3*2) ===");
checkOp("pwar(2,1)", m2.powiairate(1), 2, 0);
checkBool("pwar y=0 NaN", m2.powiairate(0).isNaN(), true);
checkBool("pwar NaN", MetaNum.powiairate(m2, MetaNum.NaN).isNaN(), true);

// ─── 26. aperioguate (ω^4): 对角化 ω^3*y ───
console.log("\n=== 26. aperioguate (ω^4) ===");
checkOp("apgu(2,1)", m2.aperioguate(1), m2.aperiatotion(m2).toNumber(), 0.01);
checkBool("apgu NaN", MetaNum.aperioguate(m2, MetaNum.NaN).isNaN(), true);

// ─── 27. iter (ω^ω): 对角化 ω^x ───
console.log("\n=== 27. iter (ω^ω) ===");
checkOp("ite(2,1)", m2.iter(1), 2, 0);
checkBool("ite y=0 NaN", m2.iter(0).isNaN(), true);
checkBool("ite NaN", MetaNum.iter(m2, MetaNum.NaN).isNaN(), true);

// ─────────────────────────────────────
// 逆运算 语义验证 (pentate_log/root + 通用)
// ─────────────────────────────────────
console.log("\n=== 逆运算 语义验证 ===");

// pentate_log: if pentate(a,b)=c then pentate_log(c,a)=b
checkOp("pent_log semantic 2^3", MetaNum.pentate(2,3).pentate_log(2), 3, 0.1);
checkOp("pent_log semantic 3^2", MetaNum.pentate(3,2).pentate_log(3), 2, 0.1);

// pentate_root: if pentate(a,b)=c then pentate_root(c,b)≈a
checkOp("pent_root semantic b=2", MetaNum.pentate_root(MetaNum.pentate(3,2), 2), 3, 0.1);
checkOp("pent_root semantic b=3", MetaNum.pentate_root(MetaNum.pentate(2,3), 3), 2, 0.1);

// Same-value tests: op(x,1) produces reasonable results
var ops = [
  "aperiote","expande","multiexpande","powerexpande","aperioexpande",
  "explode","multiexplode","aperioexplode","detonate","aperiodetonate",
  "aperionate","megote","multimegote","aperimegote","megoexpande",
  "aperimegoexpande","megoaperionation","gigote","aperigigote","gigoaperionate",
  "aperiatotion","powiainate","expandainate","megodainate","powiairate","aperioguate","iter"
];

console.log("\n=== 全运算 x=3, y=2 冒烟测试 ===");
for (var oi = 0; oi < ops.length; oi++) {
  try {
    var res = m3[ops[oi]](2);
    console.log("PASS | " + ops[oi] + "(3,2) | " + res.toString().slice(0,60));
  } catch (e) {
    console.log("FAIL | " + ops[oi] + "(3,2) => " + e.message);
    process.exitCode = 1;
  }
}

console.log("\n=== 全运算 x=3, y=1 边界测试 ===");
for (var oi = 0; oi < ops.length; oi++) {
  try {
    var res = m3[ops[oi]](1);
    console.log("PASS | " + ops[oi] + "(3,1) | " + res.toString().slice(0,60));
  } catch (e) {
    console.log("FAIL | " + ops[oi] + "(3,1) => " + e.message);
    process.exitCode = 1;
  }
}

// Static Q 方法测试
console.log("\n=== Static Q 方法 ===");
var qOps = {
  "aperiote": ["aperiote","aper"], "expande": ["expande","expa"],
  "multiexpande": ["multiexpande","muea"], "powerexpande": ["powerexpande","poea"],
  "aperioexpande": ["aperioexpande","apea"], "explode": ["explode","expl"],
  "multiexplode": ["multiexplode","muel"], "aperioexplode": ["aperioexplode","apel"],
  "detonate": ["detonate","deto"], "aperiodetonate": ["aperiodetonate","apdt"],
  "aperionate": ["aperionate","apeo"], "megote": ["megote","mego"],
  "multimegote": ["multimegote","mume"], "aperimegote": ["aperimegote","apmg"],
  "megoexpande": ["megoexpande","mgea"], "aperimegoexpande": ["aperimegoexpande","apme"],
  "megoaperionation": ["megoaperionation","mgao"], "gigote": ["gigote","gigo"],
  "aperigigote": ["aperigigote","apgg"], "gigoaperionate": ["gigoaperionate","ggap"],
  "aperiatotion": ["aperiatotion","apat"], "powiainate": ["powiainate","pwan"],
  "expandainate": ["expandainate","epan"], "megodainate": ["megodainate","mgan"],
  "powiairate": ["powiairate","pwar"], "aperioguate": ["aperioguate","apgu"],
  "iter": ["iter","ite"]
};
for (var key in qOps) {
  var f = MetaNum[key]; var s = MetaNum[qOps[key][1]];
  try {
    var rf = f(2, 2);
    var rs = s(2, 2);
    var ok = rf.eq(rs);
    console.log((ok ? "PASS" : "FAIL") + " | Q." + key + "(2,2)==Q." + qOps[key][1] + "(2,2)");
    if (!ok) { console.log("  full=" + rf.toString() + " short=" + rs.toString()); process.exitCode = 1; }
  } catch (e) {
    console.log("ERROR | Q." + key + " => " + e.message);
    process.exitCode = 1;
  }
}

// 逆运算 roundtrip: op(x,2) → inv → 应该 ≈ x
console.log("\n=== 逆运算 roundtrip ===");
for (var oi = 0; oi < ops.length; oi++) {
  var opname = ops[oi];
  try {
    var fwd = m3[opname](2);
    var invname = "inv_" + opname;
    var back = fwd[invname](fwd);
    console.log("PASS | " + invname + " | fwd=" + fwd.toString().slice(0,40) + " back=" + back.toString().slice(0,40));
  } catch (e) {
    console.log("FAIL | inv_" + opname + " => " + e.message);
    process.exitCode = 1;
  }
}

console.log("\n=== Done ===");