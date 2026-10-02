# Līdzdarbošanās LatNe

Paldies par interesi palīdzēt LatNe augt.

LatNe ir agrīnā izstrādes stadijā, tāpēc vērtīgs ir ne tikai kods. Noder arī terminoloģijas argumenti, dokumentācija, piemēri, kļūdu apraksti un arhitektūras diskusijas.

## Pirms sāc

Izlasi:

1. `README.md`
2. `docs/ATSAKSANA.md`
3. `docs/STATUSS.md`
4. `ROADMAP.md`
5. `docs/ARHITEKTURA.md`

Tas palīdz saprast pašreizējo projekta robežu un izvairīties no darba pie lietām, kas vēl apzināti nav sāktas.

## Kā vari palīdzēt

### Kods

Izvēlies aktuālu darbu no `ROADMAP.md` vai atver issue, pirms sāc lielu arhitektūras izmaiņu.

### Terminoloģija

LatNe termini netiek pieņemti ar automātisku vārdu tulkošanu.

Labs terminoloģijas priekšlikums paskaidro:

- kāpēc vārds latviski skan dabiski;
- kā tas lasās reālā koda teikumā;
- vai tas nekonfliktē ar citiem terminiem;
- vai tam nav labāks kontekstuāls variants.

### Dokumentācija

Dokumentācija ir pirmās klases LatNe sastāvdaļa.

Labojumi, kas padara arhitektūru, valodas uzvedību vai projekta vēsturi saprotamāku, ir pilnvērtīgs ieguldījums.

### Kļūdas un idejas

Izmanto GitHub Issues.

Apraksti:

- ko mēģināji;
- ko gaidīji;
- kas notika;
- minimālu piemēru, ja tāds ir.

## Pirms pull request

No repozitorija saknes palaid:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\parbaudit-terminologiju.ps1
node .\packages\valoda\scripts\parbaudit-leksisko-analizi.mjs
node .\packages\valoda\scripts\parbaudit-sintaktisko-analizi.mjs
git diff --check
```

Esošajam `examples/pamata-paraugs.lat` pēc izmaiņām joprojām jāapstrādājas veiksmīgi, ja vien pats darba mērķis nav apzināti mainīt šo uzvedību.

## Darba principi

- neveic masveida terminoloģijas pārsaukšanu bez pamatojuma;
- neievies ārēju tehnoloģiju kā LatNe identitātes pamatu;
- saglabā izmaiņas mazas un saprotamas;
- sarežģītus lēmumus dokumentē;
- neizdzēs projekta vēsturi tikai tāpēc, ka gala risinājums izrādījās citāds.

## Pull request

Labs PR paskaidro:

- problēmu;
- izmaiņu;
- pārbaudi;
- zināmos ierobežojumus.

Ja izmaiņa risina GitHub issue, norādi to PR aprakstā.

## Atbalsts bez koda

Ja šobrīd negribi rakstīt kodu, vari palīdzēt arī ļoti vienkārši:

- ja LatNe šķiet interesants, atzīmē projektu ar GitHub zvaigzni;
- padalies ar projektu;
- atver labi formulētu ideju;
- atbalsti projekta darbu ar Buy Me a Coffee.

LatNe top publiski, un arī mazs ieguldījums palīdz.
