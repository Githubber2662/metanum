# MetaNum

- MetaNum v1.0 by dlsdl

A huge number library holding up to X↑↑X&9e15.

This reaches level f<sub>ε₀</sub>, which is the limit of well-defined expressions in BEAF, hence the name.

MetaNum provides a robust implementation of hierarchical number representation based on the Hardy hierarchy (HH) and ordinal arithmetic. It can handle numbers far beyond standard JavaScript Number limits, using a sophisticated multi-dimensional array structure to represent ordinal numbers up to ε₀ (ω^ω^ω^……with ω floors). Internally, each MetaNum instance is represented as:

- **sign**: 1 (positive) or -1 (negative)
- **layer**: Non-negative integer representing the ω exponent tower height
- **array**: 2-dimensional array `[[r0, e, f, g, ...], [count, level], ...]` where the first row holds the base value and finite hyper-operation exponents, and subsequent rows hold ordinal terms

## Installation

```bash
npm install metanum
```

## Creating Instances

```javascript
// From a plain number
const a = new MetaNum(42);
const b = MetaNum.fromNumber(-3.14);

// From a string (supports scientific notation, hyper-operations, letter notation, brackets, etc.)
const c = new MetaNum("1.5e308");
const d = MetaNum.fromString("10^^5");            // tetration: 10^^5
const e = MetaNum.fromString("E100#2");           // Hyper-E: 10^10^100 (googolplex)
const f = MetaNum.fromString("GF^2E^3 123");      // letter notation
const g = MetaNum.fromString("F3 100");           // GF^2E^3 = 10↑↑↑10↑↑10↑↑10↑10↑10↑123
const h = MetaNum.fromString("[[10], [1, 3]]");   // bracket notation

// From an array
const i = MetaNum.fromArray([3.14, 1, 2]);        // [[3.14, 1, 2]]
const j = MetaNum.fromArray([10], 1, 1);          // layer 1

// From an object / JSON
const k = MetaNum.fromJSON('{"sign":1,"array":[[42]],"layer":0}');
const l = MetaNum.fromObject({ sign: 1, array: [[1, 2]], layer: 0 });

// From BigInt
const m = MetaNum.fromBigInt(10n ** 100n);

// From Hyper-E notation
const n = MetaNum.fromHyperE("EE100");
```

## Constants

```javascript
MetaNum.ZERO               // 0
MetaNum.ONE                // 1
MetaNum.TWO                // 2
MetaNum.TEN                // 10
MetaNum.E                  // Math.E
MetaNum.LN2                // Math.LN2
MetaNum.LN10               // Math.LN10
MetaNum.PI                 // π
MetaNum.SQRT2              // √2
MetaNum.MAX_SAFE_INTEGER   // 9007199254740991
MetaNum.NaN                // NaN
MetaNum.POSITIVE_INFINITY  // Infinity
MetaNum.NEGATIVE_INFINITY  // -Infinity
MetaNum.GRAHAMS_NUMBER     // Graham's number (approximation)
MetaNum.TRITRI             // 3↑↑↑3 = 3^^^3
MetaNum.QqQe308            // QqQe308 (for incremental games)
```

## Basic Usage

```javascript
// Arithmetic
const sum = MetaNum.add(15, 27);           // 42 (static)
const diff = new MetaNum(27).sub(15);      // 12 (instance)
const product = new MetaNum(15).mul(27);   // 405
const quotient = new MetaNum(27).div(15);  // 1.8

// Power & roots
new MetaNum(2).pow(10);          // 1024
new MetaNum(100).sqrt();         // 10
new MetaNum(27).cbrt();          // 3
new MetaNum(8).root(3);          // 2
new MetaNum(10).exp();           // e^10

// Logarithms
new MetaNum(100).log10();               // 2
new MetaNum(8).log(2);                  // 3
new MetaNum(Math.E).ln();               // 1

// Comparison
const x = new MetaNum(10), y = new MetaNum(20);
x.lt(y);     // true
x.gt(y);     // false
x.eq(y);     // false
x.lte(y);    // true
x.gte(y);    // false
x.neq(y);    // true
x.min(y);    // 10
x.max(y);    // 20

// Comparison with tolerance
x.eq_tolerance(new MetaNum(10.0001), 1e-3);  // true
x.cmp_tolerance(y, 1e-7);                     // -1

// Sign checks
x.ispos();   // true
x.isneg();   // false
x.isNaN();   // false
x.isFinite(); // true
x.isint();   // true

// Rounding
new MetaNum(3.7).floor();   // 3
new MetaNum(3.2).ceil();    // 4
new MetaNum(3.5).round();   // 4

// Reciprocal & absolute
new MetaNum(4).rec();       // 0.25
new MetaNum(-5).abs();      // 5
new MetaNum(5).neg();       // -5

// Factorial & Gamma
new MetaNum(5).fact();      // 120
new MetaNum(0.5).gamma();   // Γ(0.5) = √π

// Modulo
new MetaNum(10).mod(3);     // 1

// Lambert W function
new MetaNum(1).lambertw();  // Ω ≈ 0.5671
```

## Hyper-Operations (Tetration & Beyond)

```javascript
// Tetration: a^^b
new MetaNum(2).tetr(3);         // 2^^3 = 2^2^2 = 16
new MetaNum(2).tetr(4);         // 2^^4 = 65536
MetaNum.tetr(2, 5);             // 2^^5

// With payload (offset)
new MetaNum(10).tetr(2, new MetaNum(5));  // 10^^2 with payload 5

// Pentation: a^^^b
new MetaNum(2).pent(3);         // 2^^^3

// General arrow notation: a↑^n b
new MetaNum(2).arrow(3)(4);     // 2↑↑↑4 (pentation)
MetaNum.arrow(3, 4, 3);         // 3↑↑↑↑3 = g_1

// Chain notation
new MetaNum(2).chain(4, 3);     // 2→4→3

// Aperiation: a↑^a a
new MetaNum(2).aper(3);         // 2↑↑↑2 = 4
```

## Super-logarithm & Super-root

```javascript
// Super-logarithm (inverse of tetration)
new MetaNum(16).slog(2);        // slog_2(16) = 3
new MetaNum(65536).slog();      // slog_10(65536) ≈ 2

// Super-square-root
new MetaNum(27).ssrt();         // ssqrt(27)

// Linear super-root
new MetaNum(100).linear_sroot(3); // ³ss̅r̅t̅(100)

// Layer arithmetic
new MetaNum(10).layeradd(3);    // add 3 layers of exponentiation
new MetaNum(10).layeradd10(3);  // 10^^3 (explicit base 10)
```

## Diagonalization / Expansion Hierarchy

These functions represent iterated diagonalizations at increasing ordinal levels:

```javascript
const x = new MetaNum(10);

// Level ω+1: iterate aperiate
x.expande(3);           // expande(x, 3) = iterated aperiate

// Level ω*2+1: iterate expande
x.multiexpande(3);      // multiexpande(x, 3)

// Level ω*3+1: iterate multiexpande
x.powerexpande(3);

// Level ω^ω: diagonalize ω^x operations
x.aperioexpansion(3);   // apea(x, 3)

// Level ω^ω+1: iterate aperioexpansion
x.explode(3);           // expl(x, 3)

// Level ω^ω*2: diagonalize explode iterations
x.multiexplode(3);      // muel(x, 3)

// Level ω^(ω+1): diagonalize ω^ω*y
x.aperioexplode(3);     // apel(x, 3)

// Level ω^(ω+1)+1: iterate aperioexplode
x.detonate(3);          // deto(x, 3)

// Level ω^(ω*2): diagonalize ω^(ω+1)*y
x.aperionate(3);        // apeo(x, 3)

// Level ω^(ω*2)+1: iterate aperionate
x.megote(3);            // mego(x, 3)

// Level ω^(ω*2+ω): diagonalize ω^(ω*2)*y
x.aperimegote(3);       // apmg(x, 3)

// Level ω^(ω*2+ω)+1: iterate aperimegote
x.megoexpande(3);       // mgea(x, 3)

// Level ω^(ω^2): diagonalize ω^(ω*2)
x.megoaperionation(3);  // mgao(x, 3)

// Level ω^(ω^2)+1: iterate megoaperionation
x.gigote(3);            // gigo(x, 3)

// Level ω^(ω^3): diagonalize ω^(ω^2)*y
x.aperiatotion(3);      // apat(x, 3)

// Level ω^(ω^3)+1: iterate aperiatotion
x.powiainate(3);        // pwan(x, 3)

// Level ω^(ω^ω): universal diagonalizer (generalizes to arbitrary ordinals)
x.iter(3);              // iter(x, 3)
```

## Inverse Operations

Each expansion operation has a corresponding inverse for decrementing ordinal structure:

```javascript
x.i_aper(z)     // inverse of aperiate
x.i_expa(z)     // inverse of expande
x.i_muea(z)     // inverse of multiexpande
x.i_poea(z)     // inverse of powerexpande
x.i_apea(z)     // inverse of aperioexpansion
x.i_expl(z)     // inverse of explode
x.i_muel(z)     // inverse of multiexplode
x.i_apel(z)     // inverse of aperioexplode
x.i_deto(z)     // inverse of detonate
x.i_apeo(z)     // inverse of aperionate
x.i_mego(z)     // inverse of megote
x.i_apmg(z)     // inverse of aperimegote
x.i_mgea(z)     // inverse of megoexpande
x.i_mgao(z)     // inverse of megoaperionation
x.i_gigo(z)     // inverse of gigote
x.i_apat(z)     // inverse of aperiatotion
x.i_pwan(z)     // inverse of powiainate
x.i_ite(z)      // inverse of iter
```

## Layer & Serialization

```javascript
// Layer manipulation
new MetaNum(10).layerUp();     // promote to layer+1
new MetaNum(10).layerDown();   // demote to layer-1

// Output formats
new MetaNum(123).toString();               // "123"
new MetaNum(1e308).toString();             // "E308"
new MetaNum(100).toNumber();               // 100
new MetaNum(100).valueOf();                // "100"
new MetaNum(100).toFixed(2);               // "100.00"
new MetaNum(100).toExponential(2);         // "1.00e+2"
new MetaNum(100).toPrecision(3);           // "100"
new MetaNum(100).toHyperE();               // "100"
new MetaNum(100).toStringWithDecimalPlaces(4); // "100.0000"
new MetaNum(100).toJSON();                 // {sign:1, array:[[100]], layer:0}
```

## Utility Functions

```javascript
// Binomial coefficient
new MetaNum(10).choose(3);     // C(10,3) = 120

// Hyper-operation
MetaNum.hyper(4, 2, 3);        // 2^^3 = 16  (n=4 means tetration)

// Geometric series
MetaNum.sumGeometricSeries(5, 1, 2);       // 1+2+4+8+16 = 31
MetaNum.affordGeometricSeries(100, 1, 2, 0);

// Arithmetic series
MetaNum.sumArithmeticSeries(5, 1, 2);      // 1+3+5+7+9 = 25
MetaNum.affordArithmeticSeries(100, 1, 2, 0);

// Configuration
MetaNum.config({ maxRows: 200, maxCols: 200, maxArrow: 1e6, debug: 1 });
```

## Mathematical Background

The library implements the Hardy hierarchy (HH), which is a hierarchy of functions indexed by ordinal numbers. The representation uses Cantor normal form for ordinals, where:

- ω represents the first infinite ordinal
- ω^ω represents ω raised to the power of ω
- ε₀ is the limit of ω, ω^ω, ω^ω^ω, ...

For more information, see: <https://en.wikipedia.org/wiki/Ordinal_arithmetic>

The layer parameter indicates the height of the ω exponent tower, allowing representation of increasingly large ordinals.

## dlsdl's Letter Notation

Modified from PsiCubed's letter notation(<https://googology.fandom.com/wiki/User_blog:PsiCubed2/My_Letter_Notation>)

The idea here is to extend the PsiCubed's letter notation to much larger numbers reach level ε0 of FGH or HH. The properties we wish to preserve here are:

(1) Any number has a unique standard representation in the system.

(2) Given the standard representation of two numbers, one can immediately tell which one is larger without any calculations.

### The format of the proposed notation

Our final notation will look like this:

\[symbol]\[letter]\[number]

where \[symbol] can be one of the following: empty,!,@,#,$,%,&,……

where \[letter] can be one of the following: E,F,G,H,……,Aa,Ab,Ac,……,Ba,Bb,……,Aaa,……

and \[number] can be any positive real number (nonintegers included).

### The First Levels: A Continuous version of Knuth Arrows

We'll define:

Eα=10^α

Fα = EEEE...EEE(10^frac(α)) with int(α) E's

Gα = FFFF...FFF(10^frac(α)) with int(α) F's

Hα = GGGG...GGG(10^frac(α)) with int(α) G's

then we'll have I,J,K,... to Z ,each with the same definition as Hα.

Note that according to these definitions we have:

(1) For α≤1: Eα = Fα = Gα = Hα = ... = Zα = 10^α

(2) For any integer β: Eβ = 10↑β, Fβ = 10↑↑β, Gβ = 10↑↑↑β, Hβ = 10↑↑↑↑β

the γ-th letter β represents 10(γ-4 arrows)β

So the above definitions are indeed an extention of Knuth arrows to nonintegers.

### Letter-Canonical Forms

If α is a number greater than 1 and Γ is a one of the letters E,F,G,H,...,ζ then there is a unique number β such that:

α = Γβ.

And we call "Γβ" the Γ-Canonical Form of the number α.

For example, the E-Canonical form of 1000 is E3:

E3 = 10^3 = 1000.

And the F-Canonical form of 1000 is about F1.47712:

F1.47712 = E(10^0.47712) ≈ E3 = 10^3 = 1000.

### Binary-Letter-Canonical Forms

To recreate ordinary scientific notation, we'll define a binary version of the letter functions like this:

Let Γ be one of the letters E,F,G,H,...,ζ Let β be a nonnegative integer and α be a real number between 1 and 10. Then:

αΓβ = Γ(β+log(α))

For Example:

7E3 = E(3+log(7)) = 10^(3+log(7)) = 7\*10^3 = 7000

7F3 = F(3+log(7)) = EEE(10^log(7)) = EEE7 = 10^10^10^7

So αEβ is nothing more than ordinary scientific notation.

And αFβ is a power tower of β 10's topped by an α.

And again, given any specific letter (E,F,G,H,...,ζ), ANY number greater than 1 has a unique representation as αΓβ (with 1≤α<β). So we can call this the Binary-Γ-Canonical Form of α.

### Defining Aa - The First Diagonalization

In the previous section we've defined an infinite sequence of functions, so we can diagonalize over them:

let 1|α = Eα, 2|α = Fα, 3|α = Gα, ..., 22|α = Zα.

we had: Aaα = α|10.

So Aa is comparable to f\_ω\_(n) in the FGH.

But there are a couple of problems here:

(1) α|10 isn't yet defined for noninteger α.

(2) Aa1 would be 1|10 = 10^10 rather than 10 = E1 = F1 = G1 =...= Z1. This would have caused trouble later on, when we define the higher levels.To solve these two problems, we'll give a definition for α|10 and amend the definition of Aa:

(i) α|10 = (int(α)+1)|2\*5^frac(α)

(ii) For α<2: Aaα = Gα

(iii) For α≥2: Aaα = α|10

The seemingly complex expression in rule (i) simply gives us a smooth geometric curve between 2 and 10. This ensures that Aa would be continuous, given the identity 10↑(β)10 = 10↑(β+1)2.

### Ab,Ac,Ad,...,Az and their Universal Canonical Forms

The definitions of Ab,Ac,Ad,...,Az are simple enough:

Abα = AaAa...AaAa(10^frac(α)) with int(α) Aa's

Acα = AbAb...AbAb(10^frac(α)) with int(α) Ab's

then we have Ad,Ae,...,Az, each with the same definition as Ab and Ac.

And that's it. So A(the β+1-th letter) is comparable to f\_ω+β\_(n) in the FGH.

Again we have Ab0=Ac0=Ad0=...=Az0=1, Ab1=Ac1=Ad1=...=Az1=10, and Ab,Ac,Ad,...,Az are all continuous. So any number greater than 1 has a unique Ab to Az Canonical Form.

Moreover, since Aa10=Ab2 and Ab10=Ac2, we can extend our definition of the "Universal Canonical Form" up to Az10:

(1) if α<100 (that's E2) then we write down the E-Canonical Form of α.

(2) Otherwise, we write α as Γβ for some letter combinations Γ and 2≤β<10. If there is more than one possible choice, we choose the letter combination which comes first in order.

### Defining from Ba to Bz

We already know how to do recursion (F,G,H,I,...,ζ) and simple diagonalization (Aa) in our continuous system, so we can easily extend our system up to ω×2-level in the FGH. In order to track our progress, we'll use the format (1,β)|α and define:

(1,0)|α = Aaα

(1,β+1)|α = (1,β)|(1,β)|...|(1,β)|10^frac(α) with int(α) (1,β)'s

And define Baα in a way similar to Aaα:

(i) (1,α)|10 = (1,int(α)+1)|2\*5^frac(α)

(ii) For α<2: Baα = (1,3)|α

(iii) For α≥2: Baα = (1,α)|10

This gives rise to writing numbers in Ba-Canonical form and extend the Universal Canonical Form up to Ba10 ,which is about f\_ω×2\_(10) in the FGH.

Then we can define Bb,Bc, Bd,...,Bz with recursions in a similar way. Bbα = BaBa...BaBa(10^frac(α)) with int(α) Ba's, and Bcα = BbBb...BbBb(10^frac(α)) with int(α) Bb's, etc. B(the β+1-th letter) is comparable to f\_ω\*2+β\_(n) in the FGH.

### A Supporting Array Notation and Aaa

We can, of-course, repeat what we did in the previous section as many times as we wish and get the following ω^2-level notation (β,γ ≥ 0 are integers, and α≥0 is real):

(i) (0,1)|α = 10^α

(ii) (β,γ+1)|α = (β,γ)|(β,γ)|...|(β,γ)|10^frac(α) with int(α) (β,γ)'s

(iii) (β,α)|10 = (β,int(α)+1)|2\*5^frac(α)

(iv) For α<2: (β+1,0)|α = (β,3)|α

(v) For α≥2: (β+1,0)|α = (β,α)|10

Note that (β,γ) is comparable to f\_ω\*β+γ\_(α) in the FGH. Also, if we read (0,γ)|α as γ|α, this notation is a direct extension of everything we did before this section. Also, in this new notation we can write Baα = (2,0)|α, Bbα = (2,1)|α,... Bzα = (2,25)|α.

So QqQe308 is about f\_ω17+16\_(f\_ω17+4\_(308)).

And with this new supporting notation we can now to define Aaaα:

(i) For α<2: Aaaα = (2,1)|α

(ii) For α≥2: Aaaα = (int(α),10\*frac(α))|10

With rule (ii) containing a very neat trick that allows us to do the double-diagonalization with a single number: Aaa1.5 = (2,1)|1.5, Aaa2.5 = (2,5)|10

At any rate, it isn't too difficult to see that Aaa behaves "nicely" and allows us to speak of Aaa-Canonical Forms of any number. And since Aaa2=Ba10, Aaa3=Ca10,..., Aaa26=Za10, this also enables us to write the Unversal Canonical Form of any number about f\_ω^2\_(10) in the FGH.

### Arrays with more than two variable, and !Aa

Array notations can be easily extended to a multivariable array notation, like so:

(i) For α≤1: (anything)|α = 10^α

(ii) (β,γ,δ,...,ν+1)|α = (β,γ,δ,...,ν)|(β,γ,δ,...,ν)|...|(β,γ,δ,...,ν)|10^frac(α) with int(α) (β,γ,δ,...,ν)'s

(iii) (β,γ,δ,...,ν,α)|10 = (β,γ,δ,...,ν,int(α+1))|2\*5^frac(α)

(iv) For 1<α<2: (β,γ,δ,...,μ+1,<κ zeros>)|α = (β,γ,δ,...,μ,2,<κ-1 zeros>)|10^(α-1)

(v) For α≥2: (β,γ,δ,...,μ+1,<κ zeros>)|α = (β,γ,δ,...,μ,α,<κ-1 zeros>)|10

(vi) (β,γ,δ,...,α,<κ zeros>)|10 = (β,γ,δ,...,int(α),frac(α)\*10,<κ-1 zeros>)|10

(vii) (0,...,0,β,γ,δ,...,μ)|α = (β,γ,δ,...,μ)|α

The first 5 rules are a simple and direct extention of the 2-variable arrays notation, and Rule vii simply states that leading zeros can be ommitted.

Rule vi is an interesting one, though. It basically tells us that if we have an array which ends with (...,α,0,0,...,0) then the digits of the fractional part of α are to be distributed among the zeros. For example:

- (114,514,1.9198,0,0,0,0)|10 = (114,514,1,9,1,9,8)|10.

Now, all that is left to do is to define !Aa, which is about f\_ω^ω\_(10) in the FGH.

For α<2: !Aaα = (1,0,1)|α

For α≥2: !Aaα = (10^frac(α),0,...,0)|10 with int(α) zeros.

Then we have !Aa2 = Aaa10, !Aa3 = Aaaa10,... Just like the previous letters, any number can be written as !Aaα. Here, it is actually the binary form of α!Aaβ = !Aa(β+logα) which has the most intuitive meaning for β≥2:

In terms of the array notation, β+1 tells us how many numbers are in the array and the digits of α tell us the what those numbers are. For example: 1.2345!Aa4 = (1,2,3,4,5)|10

And in terms of FGH ordinals, β gives us the maximum power of ω and the digits of α give us the coefficents of the various powers of ω: 1.2345!Aa4 \~ f\_ω^4+ω^3\*2+ω^2\*3+ω\*4+5\_(10). Actually, these neat relations are also true for β=1 and α≥2, so 2.5!Aa1 = (2,5)|10.

### Higher dimensional arrays and @Aa

With the definition of the array notation and the symbol !, one can easily define palanar array notation function. In this notation, the comma is short for \[0], and the dimensional seperator is \[1], ζ's represent 0's and dimensional seperators (or can be empty) and κ zeroes. κ+1 zerores means a group of zeroes and dimensional seperators starting with at least 1 zero. κ zeroes is that but it doesn't need to start with a zero.

(i) Other rules are the same from linear array notation

(ii) (β,γ,δ,...,μ+1\[1]0,ζ)|α = (β,γ,δ,...,μ\[1]1,0,0,ζ)|10^(x-1) for 1\<x<2

(iii) (β,γ,δ,...,μ+1\[1]0,ζ)|α = (β,γ,δ,...,μ\[1]10^frac(x),0,...,0,ζ)|10 with int(x) 0's for x=>2

(iv) (β,γ,δ,...,α\[1]0,ζ)|10, κ = frac(α)\*10

It equals to (β,γ,δ,...,int(α)\[1]10^frac(κ),0,...,0,ζ)|10 with int(κ) 0's where κ >=1 or there is only 1 \[1] and there is a 1 before it, or (β,γ,δ,...,int(α)\[1]frac(κ),ζ)|10 otherwise

(v) (...\[1]0,...,0,β,γ...)|α = (...\[1]β,γ...)|α

Rule 2 and 3 are the case where the last nonzero entry is at the end of a plane and is an integer. Rule 4 is when the last nonzero entry is at the end of a plane, you use the fractional part of the last entry, and put it in the next row.

By adding ! before a letter notation, it changes from HH to FGH. Aa represents H\_ω, so !Aa represents f\_ω which equals to H\_ω^ω. Then we can define !Ab (f\_ω^(ω+1)_(10) in FGH), !Ac, !Ad,..., !Az with the same meaning as !Aa, and !Ba(f\_ω^(ω2)_(10) in FGH), !Bb, !Bc, ..., !Bz, !Aaa, etc. Comparing these with the previous letters, we can see that notations with ! symbol have a more ω^ in FGH than those without ! symbol.

Fractional number of rows, columns, etc.. are defined in the same way as in the linear array notation, \[0] is the comma. ζ is an array of 0's and dimensional seperators.

For level comparison, first compare the levels of the highest-leveled seperators. If they are equal, then compare the number of highest-leveled subseperators. If there are the same number, compare everything in the seperator after the last occurance of the highest-leveled seperator in a seperator. If they are equal, do that with the string before the last ocurrence of the highest-leveled seperator. If they are the same, the seperators have the same level.

Now, all that is left to do is to define @Aa, which is about f\_ω^ω^ω\_(10) in the FGH.

For α<2: @Aaα = (1\[1,0,0]0)|α

For α≥2: @Aaα = (1\[10^frac(α),0,...,0]0)|10 with int(α) zeros.

### Nested arrays and more symbols

The Definiton of more symbols is similar to the definition of @Aa.

\#Aa \~ f\_ω^ω^ω^ω\_(10)

$Aa \~ f\_ω^ω^ω^ω^ω\_(10)

And there are more symbols : % & \~ < > ? and symbol combinations like !!, !@, !#, @!.

Then we can define (the β-th symbol or symbol combination)Aa = f\_ω^ω^...^ω(β+1 ω's)\_(10)

### Definition of the final letter: ε

ε represents exponent tower layers of ω, and it is comparable to f\_ε0\_(10) in the FGH.

αεβ \~ f\_ω^ω^...^ω(β ω's)\_(α)

#### Using dlsdl's letter notation, the biggest number we can define in Metanum is about ε1.797e308.

## Update log

- 2026-5-23 v1.0 Rewritten and add even more hyper operations
- 2026-2-24 v0.4 Add hyper operations and extend fromString
- 2026-2-11 v0.3 Reconstruct code and correct calculating functions
- 2026-2-6 v0.2 New Metanum data structure with Cantor normal form
- 2026-2-1 v0.1 First commit

