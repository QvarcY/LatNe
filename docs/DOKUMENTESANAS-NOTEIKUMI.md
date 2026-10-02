# LatNe dokumentēšanas noteikumi

## Kāpēc

LatNe dokumentācija nav pēcapstrāde. Tā ir daļa no izstrādes procesa.

Mērķis: pēc gada vai pieciem gadiem spēt atbildēt:
- ko mēs izdarījām;
- kāpēc;
- kas toreiz nestrādāja;
- ko izmēģinājām;
- kādi pierādījumi bija lēmumam;
- ko no tā iemācījāmies.

## 1. Hronika

`HRONIKA.md`

Cilvēkam lasāms stāsts. Raksta pēc nozīmīgiem projekta pagriezieniem.

Neiekļauj nebeidzamus termināļa logus. Saglabā jēgu un kontekstu.

## 2. Tehniskais žurnāls

`ZURNALS.md`

Detalizēts darba pieraksts.

Ja darbs prasīja vairāk nekā dažas minūtes vai mainīja projekta stāvokli, tam jāatstāj žurnāla ieraksts.

## 3. ADR — arhitektūras lēmumi

`docs/adr/`

Atsevišķs ADR tiek veidots, ja lēmums:
- ietekmē vairākus moduļus;
- nosaka valodas sintaksi;
- izvēlas vai noraida būtisku tehnoloģiju;
- rada ilgtermiņa saderības sekas;
- vēlāk var likt jautāt “kāpēc?”.

ADR netiek pārrakstīts, lai izliktos, ka pagātne nebija citāda. Ja lēmums mainās, tiek izveidots jauns ADR, kas aizstāj iepriekšējo.

## 4. Kļūdas un atklājumi

`KLUDAS-UN-ATKLAJUMI.md`

Ieraksta:
- negaidītas kompilatora kļūdas;
- nepareizus pieņēmumus;
- rīku ierobežojumus;
- grūti atrodamus defektus;
- atklājumus, kas maina turpmāko pieeju.

Neveiksmes netiek dzēstas. Tās ir zināšanas.

## 5. Eksperimenti

Ja nav zināms, vai pieeja strādās, pirms ieviešanas fiksē:
- hipotēzi;
- kritēriju, kas nozīmēs “izdevās”;
- eksperimentu;
- rezultātu;
- secinājumu.

## 6. Terminoloģija

Neviens valodas atslēgvārds nekļūst par oficiālu tikai tāpēc, ka tas ir izmantots prototipā.

Oficiāls ir tikai tas, kas terminoloģijas reģistrā ir `approved`.

## 7. Commit saite

Kad iespējams, tehniskā žurnāla ierakstā pēc darba pabeigšanas pievieno:
- branch;
- commit SHA;
- testu rezultātu;
- versiju/tagu.

## 8. Patiesums

Dokumentācija apraksta to, kas reāli notika.

Neveiksmīgs eksperiments pēc fakta netiek pārrakstīts par “plānotu izpēti”.

## 9. Rakstības stils

- latviski;
- konkrēti;
- ar tehniskiem pierādījumiem;
- saprotami cilvēkam, kas projektam pievienojas vēlāk;
- bez vajadzības izlikties, ka viss vienmēr bija skaidrs.

## 10. Sesijas beigu minimums

Pirms nozīmīgas darba sesijas beigām:
1. atjaunot `STATUSS.md`;
2. papildināt `ZURNALS.md`;
3. ja bija pagrieziena punkts — papildināt `HRONIKA.md`;
4. ja bija arhitektūras lēmums — izveidot ADR;
5. ja bija viltīga kļūda vai atklājums — papildināt kļūdu reģistru.
