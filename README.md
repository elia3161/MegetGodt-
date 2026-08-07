# MegetGodt Invest (PWA)

Dette er en første prototype af en Progressiv Web App (PWA) til at kalkulere investeringer med månedlige indskud og renters rente.

Kernefunktioner:
- Indtast startbeløb, årligt afkast, tidshorisont (år + måneder) og månedligt indskud.
- Se månedlig tabel og vækstkurve.
- Dansk locale (DKK) som standard, let at skifte valuta.
- PWA-opsætning (vite-plugin-pwa)
- Automatisk deployment til GitHub Pages via GitHub Actions (gh-pages branch)

Kør lokalt:

1) Installer afhængigheder

npm install

2) Start dev-server

npm run dev

3) Kør tests

npm run test

Deployment via GitHub Actions:
- Når du merger til en af brancherne `main`, `master` eller `feature/pwa-investment`, workflowet bygger appen og deployer `dist/` til `gh-pages`-branch.
- Når deployment er færdig kan appen åbnes på:

  https://elia3161.github.io/MegetGodt-

(Det kan være nødvendigt at gå til repository Settings → Pages og sikre at GitHub Pages er sat til at servere fra `gh-pages`-branch (root).)

Bemærkninger:
- Vite base er sat til `/MegetGodt-/` så appen fungerer korrekt når den hostes under det path.
- Jeg har tilføjet et simpelt SVG-ikon (`public/pwa-icon.svg`). Du kan erstatte det med egne PNG/ikonfiler.

Næste skridt jeg kan tage automatisk:
- Polere UI og implementere månedligt kalender-grid.
- Tilføje CSV-eksport og localStorage persistence.

Sig til hvis jeg skal fortsætte med UI-polish + kalendergrid; ellers åbner jeg en Pull Request når du er klar til review.
