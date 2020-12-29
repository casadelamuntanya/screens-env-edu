# Pantalles Educació Ambiental

[![Netlify Status](https://api.netlify.com/api/v1/badges/903ecff9-a779-4c83-bfe1-0f0de972a5dc/deploy-status)](https://app.netlify.com/sites/cdm-screens-env-edu/deploys)

Suport digital per a les dinàmiques d'educació ambiental amb escoles realitzades pel Comú d'Ordino.

[[Pantalles]](https://envedu.casadelamuntanya.tech)
[[Contingut]](https://airtable.com/tblHaoR20KN9BATvC/)
[[Issues]](https://github.com/casadelamuntanya/screens-env-edu/issues)

El contingut s'organitza en tres seccions:
1. **Visita guiada** a través d'un mapa interactiu que enllaça amb conceptes rellevants de diferents punts de l'itinerari.

2. **Catàleg de conceptes** que conté tot el contingut i les seves relacions per una consulta lliure.

3. **Qüestionari** segregat per dificultat (edat) i temàtica.

### Desenvolupament
```bash
$ git clone git@github.com:casadelamuntanya/screens-env-edu.git
$ cd screens-env-edu
$ npm install
$ npm run serve
```

### Desplegament
El desplegament es realitza automàticament a [Netlify](https://app.netlify.com/sites/cdm-screens-env-edu/settings/deploys#environment) en cada push o PR al branch predeterminat.

> :warning: Afegir els access token de totes les API utilitzades a la secció de [variables d'entorn](https://app.netlify.com/sites/cdm-screens-env-edu/settings/deploys#environment) de Netlify

---

Made with :heart: by Casa de la Muntanya
