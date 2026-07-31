if (!this.MetaNum) MetaNum =  require("metanum.js");

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
    }
  } catch (e) {
    console.log("ERROR | " + name + " | " + input + " => " + e.message);
  }
}

function checkRT(name, input) {
  try {
    var m = MetaNum(input);
    var s = m.toString();
    var m2 = MetaNum(s);
    var pass = m.eq(m2);
    console.log((pass ? "PASS" : "FAIL") + " | RT " + name + " | " + input + " => " + s + " => " + m2.toString());
    if (!pass) console.log("  Got:      " + m2.toString());
  } catch (e) {
    console.log("ERROR | RT " + name + " | " + input + " => " + e.message);
  }
}

console.log("\n=== 1-letter regression ===");
checkRT("E308", "E308");
checkRT("EE100", "EE100");
checkRT("FE10", "E^9999999998 10000000000");
checkRT("G10", "F^8 E^8 10000000000");
checkRT("J1000", "I^998 H^8 G^8 F^8 E^8 10000000000");
checkRT("Z10", "Y^8 X^8 W^8 V^8 U^8 T^8 S^8 R^8 Q^8 P^8 O^8 N^8 M^8 L^8 K^8 J^8 I^8 H^8 G^8 F^8 E^8 10000000000");

console.log("\n=== 2-letter regression ===");
checkRT("Aa10", "Aa10");
checkRT("Ab5", "Ab5");
checkRT("Ac100", "Ac100");
checkRT("AaAa10", "AaAa10");
checkRT("AbAb10", "AbAb10");
checkRT("Ba10", "Ba10");
checkRT("BaBa10", "BaBa10");
checkRT("Bb10", "Bb10");
checkRT("Bc10", "Bc10");
checkRT("Bz10", "Bz10");
checkRT("Ca10", "Ca10");
checkRT("Zz10", "Zz10");

console.log("\n=== 3-letter regression ===");
checkRT("Aaa10", "Aaa10");
checkRT("Aaa1000", "Aaa1000");
checkRT("AaaAaa10", "AaaAaa10");
checkRT("Aab10", "Aab10");
checkRT("Aac10", "Aac10");
checkRT("Aba10", "Aba10");
checkRT("Abb10", "Abb10");
checkRT("Aza10", "Aza10");
checkRT("Baa10", "Baa10");
checkRT("Zzz10", "Zzz10");

console.log("\n=== 4-letter regression ===");
checkRT("Aaaa10", "Aaaa10");
checkRT("Aaaa1000", "Aaaa1000");
checkRT("AaaaAaaa10", "AaaaAaaa10");
checkRT("Aaab10", "Aaab10");
checkRT("Aaba10", "Aaba10");
checkRT("Abaa10", "Abaa10");
checkRT("Baaa10", "Baaa10");
checkRT("Zzzz10", "Zzzz10");

console.log("\n=== symbol+letters regression ===");
checkRT("!Aa10", "!Aa10"); //layer=1
checkRT("!Abcd10", "!Abcd10"); //layer=1
checkRT("@Ef10", "@Ef10"); //layer=2
checkRT("#Gh100", "#Gh100"); //layer=3
checkRT("1ε100", "1ε100"); //layer=100
checkRT("1ε9007199254740991", "1ε9007199254740991"); //layer=MSI

console.log("\n=== mixed token tests ===");
check("BbBbAaGGGFFE100 array", "BbBbAaGGGFFE100", [[100, 1, 2, 3], [1,0,1],[2,1,2]]);
check("QqQe308 array", "QqQe308", [[308], [1, 4, 17], [1, 16, 17]]);
checkRT("BbBbAaGGGFFE100", "BbBbAaGGGFFE100");
checkRT("QqQe308", "QqQe308");

// ─────────────────────────────────────
// hyperoperations test
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
      console.log((ok ? "PASS" : "FAIL") + " | " + label + " | got=" + (result.toString ? result.toString().slice(0,100) : result) + " expected=" + expectedVal);
      return;
    }
    console.log("PASS | " + label + " | " + (result.toString ? result.toString().slice(0,100) : result));
  } catch (e) {
    console.log("ERROR | " + label + " => " + e.message);
  }
}

function checkBool(label, result, expected) {
  try {
    var pass = result === expected;
    console.log((pass ? "PASS" : "FAIL") + " | " + label + " | got=" + result + " expected=" + expected);
  } catch (e) {
    console.log("ERROR | " + label + " => " + e.message);
  }
}

// ─────────────────────────────────────
// big number (> MSI) vs small number (< MSI) all operations test
// ─────────────────────────────────────
var m0 = MetaNum(0);
var m1 = MetaNum(1);
var m2 = MetaNum(2);
var m3 = MetaNum(3);
var m4 = MetaNum(4);
var mT = MetaNum.arrow(3,3,3);
var MSI = 9007199254740991;
var mSmall = MetaNum(1e6);           // 1,000,000 < MSI
var mSmall2 = MetaNum(1e9);          // 1,000,000,000 < MSI
var mBig = MetaNum(1e16);            // 10,000,000,000,000,000 > MSI
var mBig2 = MetaNum(1e20);           // > MSI


console.log("\n=== basic arithmetic (< MSI vs > MSI) ===");
checkOp("add small", mSmall.add(5), 1000005, 0);
checkBool("add big", mBig.add(5).toString() === "E16", true);
checkOp("sub small", mSmall.sub(5), 999995, 0);
checkBool("sub big", mBig.sub(5).toString() === "E16", true);
checkOp("mul small", mSmall.mul(2), 2000000, 0);
checkBool("mul big", mBig.mul(2).toString() === "E16.30103", true);
checkOp("div small", mSmall.div(2), 500000, 0);
checkBool("div big", mBig.div(2).toString() === "4999999999999999", true);

console.log("\n=== power operations (< MSI vs > MSI) ===");
checkOp("pow small", MetaNum(2).pow(10), 1024, 0);
checkOp("pow big", MetaNum(2).pow(60), 1.15292150461e18, 0.01);
checkOp("exp small", MetaNum(2).exp(), 7.38905609893065, 1e-8);
checkOp("exp big", MetaNum(40).exp(), 2.35385266837e17, 0.01);

console.log("\n=== roots (< MSI vs > MSI) ===");
checkOp("sqrt small", MetaNum(1e6).sqrt(), 1000, 0);
checkOp("sqrt big", mBig.sqrt(), 100000000, 0);
checkOp("cbrt small", MetaNum(1e9).cbrt(), 1000, 0.01);
checkOp("cbrt big", mBig.cbrt(), 215443.469, 0.01);
checkOp("root small", MetaNum(1e9).root(3), 1000, 0.01);
checkOp("root big 4th", mBig.root(4), 10000, 0);
checkOp("root big 10th", mBig2.root(10), 100, 0);

console.log("\n=== logarithms (< MSI vs > MSI) ===");
checkOp("log10 small", mSmall.log10(), 6, 0);
checkOp("log10 big 1e20", mBig2.log10(), 20, 0);
checkOp("log10 big 1e16", mBig.log10(), 16, 0);
checkOp("log small", mSmall.log(100), 3, 0.01);
checkOp("log big", mBig.log(100), 8, 0.01);
checkOp("ln small", mSmall.ln(), Math.log(1e6), 1e-6);
checkOp("ln big", mBig.ln(), Math.log(1e16), 1e-6);

console.log("\n=== factorial, gamma and Lambert W (< MSI vs > MSI) ===");
checkOp("fact small", MetaNum(5).fact(), 120, 0);
checkOp("fact big", MetaNum(20).fact(), 2.43290200817664e18, 0.01);
checkOp("gamma small", MetaNum(0.5).gamma(), Math.sqrt(Math.PI), 1e-6);
checkOp("gamma big", MetaNum(20).gamma(), 1.21645100408832e17, 0.01);
checkOp("lambertw small", MetaNum(1).lambertw(), 0.5671432904097838, 1e-6);
checkOp("lambertw big", MetaNum(1e16).lambertw(), 33.334760768448184, 1e-6);

console.log("\n=== rounding and modulus (< MSI vs > MSI) ===");
checkOp("floor small", MetaNum(3.7).floor(), 3, 0);
checkBool("floor big", MetaNum(1e16 + 0.5).floor().toString() === "E16", true);
checkOp("ceil small", MetaNum(3.2).ceil(), 4, 0);
checkBool("ceil big", MetaNum(1e16 + 0.5).ceil().toString() === "E16", true);
checkOp("round small", MetaNum(3.5).round(), 4, 0);
checkBool("round big", MetaNum(1e16 + 0.5).round().toString() === "E16", true);
checkOp("mod small", MetaNum(10).mod(3), 1, 0);
checkOp("mod big", MetaNum(1e16).mod(3), 1, 0);

console.log("\n=== other unary operations (< MSI vs > MSI) ===");
checkOp("abs small", MetaNum(-5).abs(), 5, 0);
checkBool("abs big", MetaNum(-1e16).abs().toString() === "E16", true);
checkOp("neg small", MetaNum(5).neg(), -5, 0);
checkBool("neg big", MetaNum(1e16).neg().toString() === "-E16", true);
checkOp("rec small", MetaNum(4).rec(), 0.25, 0);
checkOp("rec big", MetaNum(1e16).rec(), 1e-16, 1e-20);

console.log("\n=== hyperoperation base (< MSI vs > MSI) ===");
checkOp("tetr small", MetaNum(2).tetr(3), 16, 0);
checkBool("tetr big", MetaNum(1e16).tetr(3).toString() === "EEE17.20412", true);
checkOp("pent small", MetaNum(2).pent(2), 4, 0);
checkBool("pent big", MetaNum(1e16).pent(3).toString() === "FFE16", true);
checkOp("arrow small", MetaNum(2).arrow(2)(3), 16, 0);
checkBool("arrow big", MetaNum(1e16).arrow(3)(4).toString() === "FFFE16", true);
checkBool("chain small", MetaNum(2).chain(4, 3).toString() === "E^65532 19727.7804056", true);
checkBool("chain big", MetaNum(1e16).chain(4, 3).toString() === "FFFE16", true);
checkOp("ssrt small", MetaNum(27).ssrt(), 3, 0.01);
checkOp("ssrt big", MetaNum(1e16).ssrt(), 13.97, 0.01);
checkOp("slog small", MetaNum(16).slog(2), 3, 0.01);
checkOp("slog big", MetaNum(1e16).slog(2), 4.41, 0.01);
checkOp("linear_sroot small", MetaNum(100).linear_sroot(3), 2.2128, 0.01);
checkOp("linear_sroot big", MetaNum(1e16).linear_sroot(3), 3.09, 0.01);
checkOp("layeradd small", MetaNum(10).layeradd(), 1e10, 0.01);
checkBool("layeradd big", MetaNum(1e16).layeradd().toString() === "EE16", true);
checkOp("layeradd10 small", MetaNum(10).layeradd10(), 1e10, 0.01);
checkBool("layeradd10 big", MetaNum(1e16).layeradd10().toString() === "EE16", true);

// ─────────────────────────────────────
// (pentate_log/root)
// ─────────────────────────────────────
console.log("\n=== pentate_log/root ===");

// pentate_log: if pentate(a,b)=c then pentate_log(c,a)=b
checkOp("pent_log semantic 2^3", MetaNum.pentate(2,3).pentate_log(2), 3, 0.1);
checkOp("pent_log semantic 3^2", MetaNum.pentate(3,2).pentate_log(3), 2, 0.1);

// pentate_root: if pentate(a,b)=c then pentate_root(c,b)≈a
checkOp("pent_root semantic b=2", MetaNum.pentate_root(MetaNum.pentate(3,2), 2), 3, 0.1);
checkOp("pent_root semantic b=3", MetaNum.pentate_root(MetaNum.pentate(2,3), 3), 2, 0.1);

//hyperoperation definition from https://googology.fandom.com/wiki/Template:ExtendedOps

// ─── 1. aperiote (ω): x{y}x = arrow(x,y,x), arrow(y)(a,a)=a↑^y a ───
// arrow(0): multiplication → 2*2=4, 3*3=9
// arrow(1): exponentiation → 2^2=4, 3^3=27
// arrow(2): tetration → 2↑↑2=4, 3↑↑3=3^27=7625597484987
console.log("\n=== 1. aperiote (ω) ===");
checkOp("aper(3,0)", m3.aperiote(0), 9, 0);
checkOp("aper(3,1)", m3.aperiote(1), 27, 0);
checkOp("aper(3,2)", m3.aperiote(2), 7625597484987, 0);
checkOp("aper(3,4)", m3.aperiote(4)); //3↑↑↑↑3
checkOp("aper(4,3)", m4.aperiote(3)); //4↑↑↑4
checkBool("aper NaN", MetaNum.aperiote(m3, MetaNum.NaN).isNaN(), true);
checkBool("aper inv NaN", MetaNum.inv_aperiote(m3, MetaNum.NaN).isNaN(), true);

// ─── 2. expande (ω+1): x{{1}}y ───
// expande: iterated aperiote, x{{1}}y=x{x{...}x}x where there are y x's from the center out
// e.g. 3{{1}}2=3{3}3=3↑↑↑3
console.log("\n=== 2. expande (ω+1) ===");
checkOp("expa(3,1)", m3.expande(1), 3, 0);
checkOp("expa(3,2)", m3.expande(2)); //3↑↑↑3
checkOp("expa(3,4)", m3.expande(4)); //3{3{3{3}3}3}3
checkOp("expa(4,3)", m4.expande(3)); //4{4{4}4}4
checkBool("expa y=0 NaN", m3.expande(0).isNaN(), true);
checkBool("expa NaN", MetaNum.expande(m3, MetaNum.NaN).isNaN(), true);

// ─── 3. multiexpande (ω+2): x{{2}}y ───
// multiexpande: iterated expande, x{{2}}y=x{{1}}x{{1}}... with y x's
// e.g. 3{{2}}2=3{{1}}3=3{3{3}3}3=3↑…(3↑↑↑3 arrows)…↑3
console.log("\n=== 3. multiexpande (ω+2) ===");
checkOp("muea(3,4)", m3.multiexpande(4));
checkOp("muea(4,3)", m4.multiexpande(3));
checkBool("muea y=0 NaN", m3.multiexpande(0).isNaN(), true);
checkBool("muea NaN", MetaNum.multiexpande(m3, MetaNum.NaN).isNaN(), true);

// ─── 4. powerexpande (ω+3): x{{3}}y ───
// powerexpande: iterated multiexpande, x{{3}}y=x{{2}}x{{2}}... with y x's
// e.g. 3{{3}}2=3{{2}}3=3{{1}}3{{1}}3
console.log("\n=== 4. powerexpande (ω+3) ===");
checkOp("poea(3,4)", m3.powerexpande(4));
checkOp("poea(4,3)", m4.powerexpande(3));
checkBool("poea y=0 NaN", m3.powerexpande(0).isNaN(), true);
checkBool("poea NaN", MetaNum.powerexpande(m3, MetaNum.NaN).isNaN(), true);

// ─── 5. aperioexpande (ω*2): x{{y}}x ───
// aperioexpande: diagonalization of ω+y, x{{y}}x
// e.g. 3{{10}}3=3{{9}}3{{9}}3
console.log("\n=== 5. aperioexpande (ω*2) ===");
checkOp("apea(3,4)", m3.aperioexpande(4));
checkOp("apea(4,3)", m4.aperioexpande(3));
checkBool("apea NaN", MetaNum.aperioexpande(m3, MetaNum.NaN).isNaN(), true);

// ─── 6. explode (ω*2+1): x{{{1}}}y ───
console.log("\n=== 6. explode (ω*2+1) ===");
checkOp("expl(3,4)", m3.explode(4));
checkOp("expl(4,3)", m4.explode(3));
checkBool("expl y=0 NaN", m3.explode(0).isNaN(), true);
checkBool("expl NaN", MetaNum.explode(m3, MetaNum.NaN).isNaN(), true);

// ─── 7. multiexplode (ω*2+2): x{{{2}}}y ───
console.log("\n=== 7. multiexplode (ω*2+2) ===");
checkOp("muel(3,4)", m3.multiexplode(4));
checkOp("muel(4,3)", m4.multiexplode(3));
checkBool("muel y=0 NaN", m3.multiexplode(0).isNaN(), true);
checkBool("muel NaN", MetaNum.multiexplode(m3, MetaNum.NaN).isNaN(), true);

// ─── 8. aperioexplode (ω*3): x{{{y}}}x ───
console.log("\n=== 8. aperioexplode (ω*3) ===");
checkOp("apel(3,4)", m3.aperioexplode(4));
checkOp("apel(4,3)", m4.aperioexplode(3));
checkBool("apel NaN", MetaNum.aperioexplode(m3, MetaNum.NaN).isNaN(), true);

// ─── 9. detonate (ω*3+1): x{{{{1}}}}y ───
console.log("\n=== 9. detonate (ω*3+1) ===");
checkOp("deto(3,4)", m3.detonate(4));
checkOp("deto(4,3)", m4.detonate(3));
checkBool("deto y=0 NaN", m3.detonate(0).isNaN(), true);
checkBool("deto NaN", MetaNum.detonate(m3, MetaNum.NaN).isNaN(), true);

// ─── 10. aperiodetonate (ω*4): x{{{{y}}}}x ───
console.log("\n=== 10. aperiodetonate (ω*4) ===");
checkOp("apdt(3,4)", m3.aperiodetonate(4));
checkOp("apdt(4,3)", m4.aperiodetonate(3));
checkBool("apdt NaN", MetaNum.aperiodetonate(m3, MetaNum.NaN).isNaN(), true);

// ─── 11. aperionate (ω^2): diagonalization of ω*y ───
console.log("\n=== 11. aperionate (ω^2) ===");
checkOp("apeo(3,4)", m3.aperionate(4));
checkOp("apeo(4,3)", m4.aperionate(3));
checkBool("apeo NaN", MetaNum.aperionate(m3, MetaNum.NaN).isNaN(), true);

// ─── 12. megote (ω^2+1): 迭代 ω^2 ───
console.log("\n=== 12. megote (ω^2+1) ===");
checkOp("mego(3,4)", m3.megote(4));
checkOp("mego(4,3)", m4.megote(3));
checkBool("mego y=0 NaN", m3.megote(0).isNaN(), true);
checkBool("mego NaN", MetaNum.megote(m3, MetaNum.NaN).isNaN(), true);

// ─── 13. multimegote (ω^2+2): 迭代 ω^2+1 ───
console.log("\n=== 13. multimegote (ω^2+2) ===");
checkOp("mume(3,4)", m3.multimegote(4));
checkOp("mume(4,3)", m4.multimegote(3));
checkBool("mume y=0 NaN", m3.multimegote(0).isNaN(), true);
checkBool("mume NaN", MetaNum.multimegote(m3, MetaNum.NaN).isNaN(), true);

// ─── 14. aperimegote (ω^2+ω): 对角化 ω^2+y ───
console.log("\n=== 14. aperimegote (ω^2+ω) ===");
checkOp("apmg(3,4)", m3.aperimegote(4));
checkOp("apmg(4,3)", m4.aperimegote(3));
checkBool("apmg NaN", MetaNum.aperimegote(m3, MetaNum.NaN).isNaN(), true);

// ─── 15. megoexpande (ω^2+ω+1): 迭代 ω^2+ω ───
console.log("\n=== 15. megoexpande (ω^2+ω+1) ===");
checkOp("mgea(3,4)", m3.megoexpande(4));
checkOp("mgea(4,3)", m4.megoexpande(3));
checkBool("mgea y=0 NaN", m3.megoexpande(0).isNaN(), true);
checkBool("mgea NaN", MetaNum.megoexpande(m3, MetaNum.NaN).isNaN(), true);

// ─── 16. aperimegoexpande (ω^2+ω*2): 对角化 ω^2+ω+y ───
console.log("\n=== 16. aperimegoexpande (ω^2+ω*2) ===");
checkOp("apme(3,4)", m3.aperimegoexpande(4));
checkOp("apme(4,3)", m4.aperimegoexpande(3));
checkBool("apme NaN", MetaNum.aperimegoexpande(m3, MetaNum.NaN).isNaN(), true);

// ─── 17. megoaperionate (ω^2*2): 对角化 ω^2+ω*y ───
console.log("\n=== 17. megoaperionate (ω^2*2) ===");
checkOp("mgao(3,4)", m3.megoaperionate(4));
checkOp("mgao(4,3)", m4.megoaperionate(3));
checkBool("mgao NaN", MetaNum.megoaperionate(m3, MetaNum.NaN).isNaN(), true);

// ─── 18. gigote (ω^2*2+1): 迭代 ω^2*2 ───
console.log("\n=== 18. gigote (ω^2*2+1) ===");
checkOp("gigo(3,4)", m3.gigote(4));
checkOp("gigo(4,3)", m4.gigote(3));
checkBool("gigo y=0 NaN", m3.gigote(0).isNaN(), true);
checkBool("gigo NaN", MetaNum.gigote(m3, MetaNum.NaN).isNaN(), true);

// ─── 19. aperigigote (ω^2*2+ω): 对角化 ω^2*2+y ───
console.log("\n=== 19. aperigigote (ω^2*2+ω) ===");
checkOp("apgg(3,4)", m3.aperigigote(4));
checkOp("apgg(4,3)", m4.aperigigote(3));
checkBool("apgg NaN", MetaNum.aperigigote(m3, MetaNum.NaN).isNaN(), true);

// ─── 20. gigoaperionate (ω^2*3): 对角化 ω^2*2+ω*y ───
console.log("\n=== 20. gigoaperionate (ω^2*3) ===");
checkOp("ggap(3,4)", m3.gigoaperionate(4));
checkOp("ggap(4,3)", m4.gigoaperionate(3));
checkBool("ggap y=0 NaN", m3.gigoaperionate(0).isNaN(), true);
checkBool("ggap NaN", MetaNum.gigoaperionate(m3, MetaNum.NaN).isNaN(), true);

// ─── 21. aperiatote (ω^3): 对角化 ω^2*y ───
console.log("\n=== 21. aperiatote (ω^3) ===");
checkOp("apat(3,4)", m3.aperiatote(4));
checkOp("apat(4,3)", m4.aperiatote(3));
checkBool("apat NaN", MetaNum.aperiatote(m3, MetaNum.NaN).isNaN(), true);

// ─── 22. powiainate (ω^3+1): 迭代 ω^3 ───
console.log("\n=== 22. powiainate (ω^3+1) ===");
checkOp("pwan(3,4)", m3.powiainate(4));
checkOp("pwan(4,3)", m4.powiainate(3));
checkBool("pwan y=0 NaN", m3.powiainate(0).isNaN(), true);
checkBool("pwan NaN", MetaNum.powiainate(m3, MetaNum.NaN).isNaN(), true);

// ─── 23. expandainate (ω^3+ω): ω级别迭代 powiainate ───
console.log("\n=== 23. expandainate (ω^3+ω) ===");
checkOp("epan(3,4)", m3.expandainate(4));
checkOp("epan(4,3)", m4.expandainate(3));
checkBool("epan NaN", MetaNum.expandainate(m3, MetaNum.NaN).isNaN(), true);

// ─── 24. megodainate (ω^3+ω^2): 迭代 ω^3+ω ───
console.log("\n=== 24. megodainate (ω^3+ω^2) ===");
checkOp("mgan(3,4)", m3.megodainate(4));
checkOp("mgan(4,3)", m4.megodainate(3));
checkBool("mgan y=0 NaN", m3.megodainate(0).isNaN(), true);
checkBool("mgan NaN", MetaNum.megodainate(m3, MetaNum.NaN).isNaN(), true);

// ─── 25. powiairate (ω^3*2) ───
console.log("\n=== 25. powiairate (ω^3*2) ===");
checkOp("pwar(3,4)", m3.powiairate(4));
checkOp("pwar(4,3)", m4.powiairate(0).isNaN(), true);
checkBool("pwar NaN", MetaNum.powiairate(m3, MetaNum.NaN).isNaN(), true);

// ─── 26. aperioguate (ω^4): 对角化 ω^3*y ───
console.log("\n=== 26. aperioguate (ω^4) ===");
checkOp("apgu(3,4)", m3.aperioguate(4));
checkOp("apgu(4,3)", m4.aperioguate(3));
checkBool("apgu NaN", MetaNum.aperioguate(m3, MetaNum.NaN).isNaN(), true);

// ─── 27. iter (ω^ω): 对角化 ω^x ───
console.log("\n=== 27. iter (ω^ω) ===");
checkOp("ite(3,4)", m3.iter(4));
checkOp("ite(4,3)", m4.iter(3));
checkBool("ite y=0 NaN", m3.iter(0).isNaN(), true);
checkBool("ite NaN", MetaNum.iter(m3, MetaNum.NaN).isNaN(), true);

// ─── 28. itermult (ω^ω+1): 迭代 ω^ω ───
console.log("\n=== 28. itermult (ω^ω+1) ===");
checkOp("itmu(3,4)", m3.itermult(4));
checkOp("itmu(4,3)", m4.itermult(3));
checkBool("itmu y=0 NaN", m3.itermult(0).isNaN(), true);
checkBool("itmu NaN", MetaNum.itermult(m3, MetaNum.NaN).isNaN(), true);

// ─── 29. cuboiter (ω^ω*2) ───
console.log("\n=== 29. cuboiter (ω^ω*2) ===");
checkOp("cube(3,4)", m3.cuboiter(4));
checkOp("cube(4,3)", m4.cuboiter(3));
checkBool("cube NaN", MetaNum.cuboiter(m3, MetaNum.NaN).isNaN(), true);

// ─── 30. expoiter (ω^(ω+1)) ───
console.log("\n=== 30. expoiter (ω^(ω+1)) ===");
checkOp("expo(3,4)", m3.expoiter(4));
checkOp("expo(4,3)", m4.expoiter(3));
checkBool("expo NaN", MetaNum.expoiter(m3, MetaNum.NaN).isNaN(), true);

// ─── 31. trioterate (ω^(ω*2)) ───
console.log("\n=== 31. trioterate (ω^(ω*2)) ===");
checkOp("tria(3,4)", m3.trioterate(4));
checkOp("tria(4,3)", m4.trioterate(3));
checkBool("tria NaN", MetaNum.trioterate(m3, MetaNum.NaN).isNaN(), true);

// ─── 32. trixxate (ω^(ω^2)) ───
console.log("\n=== 32. trixxate (ω^(ω^2)) ===");
checkOp("trix(3,4)", m3.trixxate(4));
checkOp("trix(4,3)", m4.trixxate(3));
checkBool("trix NaN", MetaNum.trixxate(m3, MetaNum.NaN).isNaN(), true);

// ─── 33. aperixxate (ω^(ω^ω)) ───
console.log("\n=== 33. aperixxate (ω^(ω^ω)) ===");
checkOp("apix(3,4)", m3.aperixxate(4));
checkOp("apix(4,3)", m4.aperixxate(3));
checkBool("apix NaN", MetaNum.aperixxate(m3, MetaNum.NaN).isNaN(), true);

// ─── 34. epsilonate (ε₀) ───
console.log("\n=== 34. epsilonate (ε₀) ===");
checkOp("epsl(3,4)", m3.epsilonate(4));
checkOp("epsl(4,3)", m4.epsilonate(3));
checkBool("epsl NaN", MetaNum.epsilonate(m3, MetaNum.NaN).isNaN(), true);

// Same-value tests: op(x,1) produces reasonable results
var ops = [
  "aperiote","expande","multiexpande","powerexpande","aperioexpande",
  "explode","multiexplode","aperioexplode","detonate","aperiodetonate",
  "aperionate","megote","multimegote","aperimegote","megoexpande",
  "aperimegoexpande","megoaperionate","gigote","aperigigote","gigoaperionate",
  "aperiatote","powiainate","expandainate","megodainate","powiairate","aperioguate","iteration",
  "itermult","cuboiter","expoiter","trioterate","trixxate","aperixxate","epsilonate"
];

console.log("\n=== all hyperoperations x=1, y=3 test ===");
for (var oi = 0; oi < ops.length; oi++) {
  try {
    var res = m1[ops[oi]](3);
    if (res.eq(1)) console.log("PASS | " + ops[oi] + "(1,3) | " + res.toString().slice(0,100));
    else console.log("FAIL | " + ops[oi] + "(1,3) => " + res.toString().slice(0,100));
  } catch (e) {
    console.log("ERROR | " + ops[oi] + "(1,3) => " + e.message);
  }
}

console.log("\n=== all hyperoperations x=3, y=1 test ===");
for (var oi = 0; oi < ops.length; oi++) {
  try {
    var res = m3[ops[oi]](1);
    console.log("PASS | " + ops[oi] + "(3,1) | " + res.toString().slice(0,100));
  } catch (e) {
    console.log("ERROR | " + ops[oi] + "(3,1) => " + e.message);
  }
}

// 逆运算 roundtrip: op(10,x) → inv → 应该 ≈ x
console.log("\n=== inv hyperoperations roundtrip test ===");
var m10 = MetaNum(10);
for (var oi = 0; oi < ops.length; oi++) {
  var opname = ops[oi];
  try {
    var fwd = m10[opname](3);
    var invname = "inv_" + opname;
    var back = fwd[invname](m10);
    if(back.eq(m3)) console.log("PASS | " + invname + " | fwd=" + fwd.toString().slice(0,100) + " back=" + back.toString().slice(0,100));
    else console.log("FAIL | " + invname + " | fwd=" + fwd.toString().slice(0,100) + " back=" + back.toString().slice(0,100));
  } catch (e) {
    console.log("ERROR | inv_" + opname + " => " + e.message);
  }
}

console.log("\n=== hyperoperation (x > MSI) (not fully implemented) ===");
var mBigBase = MetaNum(1e16);
var hyperOps = [
  "aperiote","expande","multiexpande","powerexpande","aperioexpande",
  "explode","multiexplode","aperioexplode","detonate","aperiodetonate",
  "aperionate","megote","multimegote","aperimegote","megoexpande",
  "aperimegoexpande","megoaperionation","gigote","aperigigote","gigoaperionate",
  "aperiatote","powiainate","expandainate","megodainate","powiairate","aperioguate","iteration",
  "itermult","cuboiter","expoiter","trioterate","trixxate","aperixxate","epsilonate"
];
for (var oi = 0; oi < hyperOps.length; oi++) {
  try {
    var res = mBigBase[hyperOps[oi]](1);
    console.log("PASS | " + hyperOps[oi] + "(1e16,3) | " + res.toString().slice(0,100));
  } catch (e) {
    console.log("FAIL | " + hyperOps[oi] + "(1e16,3) => " + e.message);
  }
}

console.log("\n=== hyperoperation (y > MSI) ===");
for (var oi = 0; oi < hyperOps.length; oi++) {
  try {
    var res = mBigBase[hyperOps[oi]](2);
    console.log("PASS | " + hyperOps[oi] + "(3,1e16) | " + res.toString().slice(0,100));  
  } catch (e) {
    console.log("FAIL | " + hyperOps[oi] + "(3,1e16) => " + e.message);
  }
}

console.log("\n=== inverse operation (> MSI) roundtrip ===");
var invOps = [
  "inv_aperiote","inv_expande","inv_multiexpande","inv_powerexpande","inv_aperioexpande",
  "inv_explode","inv_multiexplode","inv_aperioexplode","inv_detonate","inv_aperiodetonate",
  "inv_aperionate","inv_megote","inv_multimegote","inv_aperimegote","inv_megoexpande",
  "inv_aperimegoexpande","inv_megoaperionate","inv_gigote","inv_aperigigote","inv_gigoaperionate",
  "inv_aperiatote","inv_powiainate","inv_expandainate","inv_megodainate","inv_powiairate","inv_aperioguate","inv_iteration",
  "inv_itermult","inv_cuboiter","inv_expoiter","inv_trioterate","inv_trixxate","inv_aperixxate","inv_epsilonate"
];
for (var oi = 0; oi < invOps.length; oi++) {
  try {
    var fwd = mBigBase[hyperOps[oi]](2);
    var back = fwd[invOps[oi]](fwd);
    console.log("PASS | " + invOps[oi] + " | fwd=" + fwd.toString().slice(0,100) + " back=" + back.toString().slice(0,100));
  } catch (e) {
    console.log("FAIL | " + invOps[oi] + " => " + e.message);
  }
}

// ─────────────────────────────────────
// hyperoperation iteration tests (嵌套超运算)
// ─────────────────────────────────────
console.log("\n=== hyperoperation iteration tests (not fully implemented) ===");

// aperiote (ω): x{y}x nested
checkOp("aper(3,aper(3,0))", m3.aperiote(m3.aperiote(0).toNumber()), m3.aperiote(9));
checkOp("aper(3,aper(3,1))", m3.aperiote(m3.aperiote(1).toNumber()), m3.aperiote(27));
checkOp("aper(3,aper(3,2))", m3.aperiote(m3.aperiote(2)));

// expande (ω+1): x{{1}}y nested
checkOp("expa(3,expa(3,1))", m3.expande(m3.expande(1)));
checkOp("expa(3,expa(3,2))", m3.expande(m3.expande(2)));
checkOp("expa(4,expa(4,1))", m4.expande(m4.expande(1)));

// multiexpande (ω+2): x{{2}}y nested
checkOp("muea(3,muea(3,1))", m3.multiexpande(m3.multiexpande(1)));
checkOp("muea(3,muea(3,2))", m3.multiexpande(m3.multiexpande(2)));
checkOp("muea(4,muea(4,1))", m4.multiexpande(m4.multiexpande(1)));

// powerexpande (ω+3): x{{3}}y nested
checkOp("poea(3,poea(3,1))", m3.powerexpande(m3.powerexpande(1)));
checkOp("poea(3,poea(3,2))", m3.powerexpande(m3.powerexpande(2)));
checkOp("poea(4,poea(4,1))", m4.powerexpande(m4.powerexpande(1)));

// aperioexpande (ω*2): x{{y}}x nested
checkOp("apea(3,apea(3,1))", m3.aperioexpande(m3.aperioexpande(1)));
checkOp("apea(3,apea(3,2))", m3.aperioexpande(m3.aperioexpande(2)));
checkOp("apea(4,apea(4,1))", m4.aperioexpande(m4.aperioexpande(1)));

// explode (ω*2+1): x{{{1}}}y nested
checkOp("expl(3,expl(3,1))", m3.explode(m3.explode(1)));
checkOp("expl(3,expl(3,2))", m3.explode(m3.explode(2)));
checkOp("expl(4,expl(4,1))", m4.explode(m4.explode(1)));

// multiexplode (ω*2+2): x{{{2}}}y nested
checkOp("muel(3,muel(3,1))", m3.multiexplode(m3.multiexplode(1)));
checkOp("muel(3,muel(3,2))", m3.multiexplode(m3.multiexplode(2)));
checkOp("muel(4,muel(4,1))", m4.multiexplode(m4.multiexplode(1)));

// aperioexplode (ω*3): x{{{y}}}x nested
checkOp("apel(3,apel(3,1))", m3.aperioexplode(m3.aperioexplode(1)));
checkOp("apel(3,apel(3,2))", m3.aperioexplode(m3.aperioexplode(2)));
checkOp("apel(4,apel(4,1))", m4.aperioexplode(m4.aperioexplode(1)));

// detonate (ω*3+1): x{{{{1}}}}y nested
checkOp("deto(3,deto(3,1))", m3.detonate(m3.detonate(1)));
checkOp("deto(3,deto(3,2))", m3.detonate(m3.detonate(2)));
checkOp("deto(4,deto(4,1))", m4.detonate(m4.detonate(1)));

// aperiodetonate (ω*4): x{{{{y}}}}x nested
checkOp("apdt(3,apdt(3,1))", m3.aperiodetonate(m3.aperiodetonate(1)));
checkOp("apdt(3,apdt(3,2))", m3.aperiodetonate(m3.aperiodetonate(2)));
checkOp("apdt(4,apdt(4,1))", m4.aperiodetonate(m4.aperiodetonate(1)));

// aperionate (ω^2): diagonalization nested
checkOp("apeo(3,apeo(3,1))", m3.aperionate(m3.aperionate(1)));
checkOp("apeo(3,apeo(3,2))", m3.aperionate(m3.aperionate(2)));
checkOp("apeo(4,apeo(4,1))", m4.aperionate(m4.aperionate(1)));

// megote (ω^2+1): nested
checkOp("mego(3,mego(3,1))", m3.megote(m3.megote(1)));
checkOp("mego(3,mego(3,2))", m3.megote(m3.megote(2)));
checkOp("mego(3,mego(3,3))", m3.megote(m3.megote(3)));

// multimegote (ω^2+2): nested
checkOp("mume(3,mume(3,1))", m3.multimegote(m3.multimegote(1)));
checkOp("mume(3,mume(3,2))", m3.multimegote(m3.multimegote(2)));
checkOp("mume(4,mume(4,1))", m4.multimegote(m4.multimegote(1)));

// aperimegote (ω^2+ω): nested
checkOp("apmg(3,apmg(3,1))", m3.aperimegote(m3.aperimegote(1)));
checkOp("apmg(3,apmg(3,2))", m3.aperimegote(m3.aperimegote(2)));
checkOp("apmg(4,apmg(4,1))", m4.aperimegote(m4.aperimegote(1)));

// megoexpande (ω^2+ω+1): nested
checkOp("mgea(3,mgea(3,1))", m3.megoexpande(m3.megoexpande(1)));
checkOp("mgea(3,mgea(3,2))", m3.megoexpande(m3.megoexpande(2)));
checkOp("mgea(4,mgea(4,1))", m4.megoexpande(m4.megoexpande(1)));

// aperimegoexpande (ω^2+ω*2): nested
checkOp("apme(3,apme(3,1))", m3.aperimegoexpande(m3.aperimegoexpande(1)));
checkOp("apme(3,apme(3,2))", m3.aperimegoexpande(m3.aperimegoexpande(2)));
checkOp("apme(4,apme(4,1))", m4.aperimegoexpande(m4.aperimegoexpande(1)));

// megoaperionate (ω^2*2): nested
checkOp("mgao(3,mgao(3,1))", m3.megoaperionate(m3.megoaperionate(1)));
checkOp("mgao(3,mgao(3,2))", m3.megoaperionate(m3.megoaperionate(2)));
checkOp("mgao(4,mgao(4,1))", m4.megoaperionate(m4.megoaperionate(1)));

// gigote (ω^2*2+1): nested
checkOp("gigo(3,gigo(3,1))", m3.gigote(m3.gigote(1)));
checkOp("gigo(3,gigo(3,2))", m3.gigote(m3.gigote(2)));
checkOp("gigo(4,gigo(4,1))", m4.gigote(m4.gigote(1)));

// aperigigote (ω^2*2+ω): nested
checkOp("apgg(3,apgg(3,1))", m3.aperigigote(m3.aperigigote(1)));
checkOp("apgg(3,apgg(3,2))", m3.aperigigote(m3.aperigigote(2)));
checkOp("apgg(4,apgg(4,1))", m4.aperigigote(m4.aperigigote(1)));

// gigoaperionate (ω^2*3): nested
checkOp("ggap(3,ggap(3,1))", m3.gigoaperionate(m3.gigoaperionate(1)));
checkOp("ggap(3,ggap(3,2))", m3.gigoaperionate(m3.gigoaperionate(2)));
checkOp("ggap(4,ggap(4,1))", m4.gigoaperionate(m4.gigoaperionate(1)));

// aperiatote (ω^3): nested
checkOp("apat(3,apat(3,1))", m3.aperiatote(m3.aperiatote(1)));
checkOp("apat(3,apat(3,2))", m3.aperiatote(m3.aperiatote(2)));
checkOp("apat(4,apat(4,1))", m4.aperiatote(m4.aperiatote(1)));

// powiainate (ω^3+1): nested
checkOp("pwan(3,pwan(3,1))", m3.powiainate(m3.powiainate(1)));
checkOp("pwan(3,pwan(3,2))", m3.powiainate(m3.powiainate(2)));
checkOp("pwan(4,pwan(4,1))", m4.powiainate(m4.powiainate(1)));

// expandainate (ω^3+ω): nested
checkOp("epan(3,epan(3,1))", m3.expandainate(m3.expandainate(1)));
checkOp("epan(3,epan(3,2))", m3.expandainate(m3.expandainate(2)));
checkOp("epan(4,epan(4,1))", m4.expandainate(m4.expandainate(1)));

// megodainate (ω^3+ω^2): nested
checkOp("mgan(3,mgan(3,1))", m3.megodainate(m3.megodainate(1)));
checkOp("mgan(3,mgan(3,2))", m3.megodainate(m3.megodainate(2)));
checkOp("mgan(4,mgan(4,1))", m4.megodainate(m4.megodainate(1)));

// powiairate (ω^3*2): nested
checkOp("pwar(3,pwar(3,1))", m3.powiairate(m3.powiairate(1)));
checkOp("pwar(3,pwar(3,2))", m3.powiairate(m3.powiairate(2)));
checkOp("pwar(4,pwar(4,1))", m4.powiairate(m4.powiairate(1)));

// aperioguate (ω^4): nested
checkOp("apgu(3,apgu(3,1))", m3.aperioguate(m3.aperioguate(1)));
checkOp("apgu(3,apgu(3,2))", m3.aperioguate(m3.aperioguate(2)));
checkOp("apgu(4,apgu(4,1))", m4.aperioguate(m4.aperioguate(1)));

// iter (ω^ω): nested
checkOp("iter(3,iter(3,1))", m3.iter(m3.iter(1)));
checkOp("iter(3,iter(3,2))", m3.iter(m3.iter(2)));
checkOp("iter(4,iter(4,1))", m4.iter(m4.iter(1)));

// itermult (ω^ω+1): nested
checkOp("itmu(3,itmu(3,1))", m3.itermult(m3.itermult(1)));
checkOp("itmu(3,itmu(3,2))", m3.itermult(m3.itermult(2)));
checkOp("itmu(4,itmu(4,1))", m4.itermult(m4.itermult(1)));

// cuboiter (ω^ω*2): nested
checkOp("cube(3,cube(3,1))", m3.cuboiter(m3.cuboiter(1)));
checkOp("cube(3,cube(3,2))", m3.cuboiter(m3.cuboiter(2)));
checkOp("cube(4,cube(4,1))", m4.cuboiter(m4.cuboiter(1)));

// expoiter (ω^(ω+1)): nested
checkOp("expo(3,expo(3,1))", m3.expoiter(m3.expoiter(1)));
checkOp("expo(3,expo(3,2))", m3.expoiter(m3.expoiter(2)));
checkOp("expo(4,expo(4,1))", m4.expoiter(m4.expoiter(1)));

// trioterate (ω^(ω*2)): nested
checkOp("tria(3,tria(3,1))", m3.trioterate(m3.trioterate(1)));
checkOp("tria(3,tria(3,2))", m3.trioterate(m3.trioterate(2)));
checkOp("tria(4,tria(4,1))", m4.trioterate(m4.trioterate(1)));

// trixxate (ω^(ω^2)): nested
checkOp("trix(3,trix(3,1))", m3.trixxate(m3.trixxate(1)));
checkOp("trix(3,trix(3,2))", m3.trixxate(m3.trixxate(2)));
checkOp("trix(4,trix(4,1))", m4.trixxate(m4.trixxate(1)));

// aperixxate (ω^(ω^ω)): nested
checkOp("apix(3,apix(3,1))", m3.aperixxate(m3.aperixxate(1)));
checkOp("apix(3,apix(3,2))", m3.aperixxate(m3.aperixxate(2)));
checkOp("apix(4,apix(4,1))", m4.aperixxate(m4.aperixxate(1)));

// epsilonate (ε₀): nested
checkOp("epsl(3,epsl(3,1))", m3.epsilonate(m3.epsilonate(1)));
checkOp("epsl(3,epsl(3,2))", m3.epsilonate(m3.epsilonate(2)));
checkOp("epsl(4,epsl(4,1))", m4.epsilonate(m4.epsilonate(1)));

// ─── triple nested iteration ───
console.log("\n=== triple nested hyperoperation tests ===");
checkOp("aper(3,aper(3,aper(3,1)))", m3.aperiote(m3.aperiote(m3.aperiote(1))));
checkOp("expa(3,expa(3,expa(3,1)))", m3.expande(m3.expande(m3.expande(1))));
checkOp("expl(3,expl(3,expl(3,1)))", m3.explode(m3.explode(m3.explode(1))));
checkOp("deto(3,deto(3,deto(3,1)))", m3.detonate(m3.detonate(m3.detonate(1))));
checkOp("mego(3,mego(3,mego(3,1)))", m3.megote(m3.megote(m3.megote(1))));
checkOp("iter(3,iter(3,iter(3,1)))", m3.iter(m3.iter(m3.iter(1))));
checkOp("epsl(3,epsl(3,epsl(3,1)))", m3.epsilonate(m3.epsilonate(m3.epsilonate(1))));

// ─── cross-operation iteration (跨运算嵌套) ───
console.log("\n=== cross-operation iteration tests ===");
checkOp("aper(3,expa(3,1))", m3.aperiote(m3.expande(1)));
checkOp("expa(3,aper(3,1))", m3.expande(m3.aperiote(1)));
checkOp("expl(3,apea(3,1))", m3.explode(m3.aperioexpande(1)));
checkOp("deto(3,apel(3,1))", m3.detonate(m3.aperioexplode(1)));
checkOp("mego(3,apeo(3,1))", m3.megote(m3.aperionate(1)));
checkOp("iter(3,apgu(3,1))", m3.iter(m3.aperioguate(1)));
checkOp("epsl(3,apix(3,1))", m3.epsilonate(m3.aperixxate(1)));

console.log("\n=== Done ===");