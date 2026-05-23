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
check("QqQe308 array", "QqQe308", [[308], [1, 4, 17], [1, 16, 17]]);
check("AcAbAbAaAaAa114514 array", "AcAbAbAaAaAa114514", [[114514], [3, 0, 1], [2, 1, 1], [1, 2, 1]]);
check("AaAb100 array", "AaAb100", [[100], [1,0,1],[1,1,1]]);
check("AbAa100 array (sorted)", "AbAa100", [[100], [1,0,1],[1,1,1]]);

console.log("\n=== Mixed token toString ===");
var m1 = MetaNum("QqQe308");
console.log("QqQe308 => " + m1.toString() + " _oaRowData=" + JSON.stringify(m1._oaRowData));
var m2 = MetaNum("AcAbAbAaAaAa114514");
console.log("AcAbAbAaAaAa114514 => " + m2.toString() + " _oaRowData=" + JSON.stringify(m2._oaRowData));

console.log("\n=== Mixed roundtrip ===");
checkRT("QqQe308", "QqQe308");
checkRT("AcAbAbAaAaAa114514", "AcAbAbAaAaAa114514");

console.log("\n=== 2-letter regression ===");
checkRT("Ba10", "Ba10");
checkRT("Ba1", "Ba1");
checkRT("BaBa10", "BaBa10");
checkRT("Bb10", "Bb10");
checkRT("Bc10", "Bc10");
checkRT("Bz10", "Bz10");
checkRT("Ca10", "Ca10");
checkRT("Zz10", "Zz10");
checkRT("ZzZz10", "ZzZz10");

console.log("\n=== 3-letter fundamental regression ===");
checkRT("Aaa10", "Aaa10");
checkRT("Aaa1", "Aaa1");
checkRT("AaaAaa10", "AaaAaa10");
checkRT("Baa10", "Baa10");
checkRT("Zzz10", "Zzz10");

console.log("\n=== 3-letter standard regression ===");
checkRT("Aab10", "Aab10");
checkRT("Aac10", "Aac10");
checkRT("Abb10", "Abb10");

console.log("\n=== 3-letter diag regression ===");
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

console.log("\n=== 1-letter ordinal regression ===");
checkRT("Aa10", "Aa10");
checkRT("Ab5", "Ab5");
checkRT("Ac100", "Ac100");
checkRT("AaAa10", "AaAa10");
checkRT("AbAb10", "AbAb10");

console.log("\n=== Edge cases ===");
checkRT("Ba1000000", "Ba1000000");
checkRT("Aaa100", "Aaa100");
checkRT("Aba100", "Aba100");

console.log("\n=== Done ===");