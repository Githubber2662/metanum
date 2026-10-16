// docs/repro/issue-17.js — 复现 dlsdl/metanum Issue #17 的各条缺陷（只读诊断，不修改库）
// 依赖：与 metanum.js / format-metanum.js 同仓库根目录
// 用法：node docs/repro/issue-17.js
// 基线：metanum v2.0.2（commit 17fd56e），Node 22
"use strict";
var MetaNum = require("../../metanum.js");
global.MetaNum = MetaNum; // format-metanum.js 依赖全局 MetaNum
var format = require("../../format-metanum.js").format;

function show(label, thunk) {
  console.log("\n### " + label);
  try {
    var r = thunk();
    if (r && typeof r === "object" && r.array) {
      console.log("    array   : " + JSON.stringify(r.array));
      console.log("    layer   : " + r.layer);
      console.log("    toString: " + r.toString());
      console.log("    format  : " + format(r));
    } else {
      console.log("    " + String(r));
    }
  } catch (e) {
    console.log("    ERROR " + (e && e.name) + ": " + (e && e.message));
  }
}

console.log("============================================================");
console.log(" D01  pow(10, alpha) 在 10^-324 及更小处符号反转");
console.log("============================================================");
[-320, -323, -324, -325, -350].forEach(function (a) {
  show("pow(10," + a + ")  (期望 10^" + a + " < 1)", function () { return MetaNum.pow(10, a); });
});
show("pow(10,-324).lt(1)  (期望 true)", function () { return MetaNum.pow(10, -324).lt(1); });
show("pow(10,-324).mul(1e324)  (期望 ≈1)", function () { return MetaNum.pow(10, -324).mul(MetaNum.fromString("1e324")); });

console.log("\n============================================================");
console.log(" D02  toBeaf() 在值 > MSI 时丢失底数");
console.log("============================================================");
[[10, 15], [10, 16], [10, 100]].forEach(function (a) {
  show("BEAF(" + a.join(",") + ")  (期望 toBeaf 保留底数 10)", function () {
    var m = MetaNum.BEAF(a[0], a[1]);
    return "array=" + JSON.stringify(m.array) + " toString=" + m.toString() + " toBeaf=" + m.toBeaf();
  });
});
show("fromBeaf('{10,16}').toBeaf()  (期望 {10,16} 一类)", function () { return MetaNum.fromBeaf("{10,16}").toBeaf(); });

console.log("\n============================================================");
console.log(" D03  toBeaf() 对 3+ 项 LAN 输出内部数组 dump");
console.log("============================================================");
show("BEAF(10,2,1,1,2).toBeaf()", function () { return MetaNum.BEAF(10, 2, 1, 1, 2).toBeaf(); });
show("BEAF(4,5,6,7,8,9).toBeaf()", function () { return MetaNum.BEAF(4, 5, 6, 7, 8, 9).toBeaf(); });

console.log("\n============================================================");
console.log(" D04  format() 重复单字母折叠错误（ZZ152416 -> 1.000Z3）");
console.log("============================================================");
["Z152416", "ZZ152416", "ZZZ152416", "ZZZZ152416"].forEach(function (s) {
  show(s + "  format", function () {
    var m = MetaNum(s);
    return "array=" + JSON.stringify(m.array) + " toString=" + m.toString() + " format=" + format(m);
  });
});

console.log("\n============================================================");
console.log(" D05  !Aa(非整数) 解析为 0");
console.log("============================================================");
["!Aa0.5", "!Aa1.5", "!Aa2.5"].forEach(function (s) {
  show("MetaNum('" + s + "')  (期望 10{ω^int(α)·frac(α)}10)", function () {
    var m = MetaNum(s);
    return "array=" + JSON.stringify(m.array) + " toString=" + m.toString() + " format=" + format(m);
  });
});

console.log("\n============================================================");
console.log(" D06  !αAaβ(非整数 α) 解析为 0 / 畸形");
console.log("============================================================");
["!1.5Aa4", "!1Aa1.5", "!2.5Aa4"].forEach(function (s) {
  show("MetaNum('" + s + "')  (期望 !Aa(β+logα))", function () {
    var m = MetaNum(s);
    return "array=" + JSON.stringify(m.array) + " layer=" + m.layer + " toString=" + m.toString() + " format=" + format(m);
  });
});
show("MetaNum('!2.0000Aa4') 对照组（整数 α）", function () {
  var m = MetaNum("!2.0000Aa4");
  return "array=" + JSON.stringify(m.array) + " toString=" + m.toString() + " format=" + format(m);
});

console.log("\n============================================================");
console.log(" D07  2{序数 lambda}2  !=  4  (lambda >= ω^ω·2)");
console.log("============================================================");
[
  ["2{ω^2}2   (aperionate)", function () { return new MetaNum(2).aperionate(2); }],
  ["2{ω^ω}2   (iter)", function () { return new MetaNum(2).iter(2); }],
  ["2{ω^ω·2}2 (cuboiter)", function () { return new MetaNum(2).cuboiter(2); }],
  ["2{ω^(ω+1)}2 (expoiter)", function () { return new MetaNum(2).expoiter(2); }],
  ["2{ω^(ω·2)}2 (trioterate)", function () { return new MetaNum(2).trioterate(2); }],
  ["2{ω^(ω^2)}2 (trixxate)", function () { return new MetaNum(2).trixxate(2); }],
  ["2{ω^(ω^ω)}2 (aperixxate)", function () { return new MetaNum(2).aperixxate(2); }]
].forEach(function (x) {
  show(x[0] + "   (期望 4)", function () {
    var m = x[1]();
    return "value=" + m.toString() + " array=" + JSON.stringify(m.array) + " eq(4)=" + m.eq(4);
  });
});
show("BEAF(2,2,1,1,2) = 2{ω^2}2 对照", function () {
  var m = MetaNum.BEAF(2, 2, 1, 1, 2);
  return "value=" + m.toString() + " eq(4)=" + m.eq(4);
});

console.log("\n==================== done ====================");
