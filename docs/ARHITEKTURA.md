# LatNe arhitektūra — sākotnējā robeža

LatNe tiek dalīta divos konceptuālos slāņos.

## 1. LatNe valoda

- terminoloģijas reģistrs;
- tokenizeris / lexer;
- parseris;
- AST;
- transformācijas;
- koda ģenerēšana;
- source maps;
- diagnostika;
- CLI.

## 2. LatNe web slānis

Tiks sākts vēlāk.

Valodas kodolam jāspēj eksistēt un tikt testētam neatkarīgi no web slāņa.

## Galvenais ierobežojums

Ārēja bibliotēka nedrīkst kļūt par LatNe identitātes vai publiskās arhitektūras definīciju tikai tāpēc, ka tā ir ērta sākotnējā implementācijā.
