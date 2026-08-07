# MegetGodt Invest (PWA)

Dette er en første prototype af en Progressiv Web App (PWA) til at kalkulere investeringer med månedlige indskud og renters rente.

Kernefunktioner:
- Indtast startbeløb, årligt afkast, tidshorisont (år + måneder) og månedligt indskud.
- Se månedlig tabel og vækstkurve.
- Dansk locale (DKK) som standard, let at skifte valuta.
- PWA-opsætning (vite-plugin-pwa)

Kør lokalt:

1) Installer afhængigheder

npm install

2) Start dev-server

npm run dev

3) Kør tests

npm run test

Deployment:
- Byg med `npm run build` og deploy dist mappen.

Jeg har lavet en feature-branch: `feature/pwa-investment` og åbner en pull request mod din default branch.

Feedback:
- Fortæl mig hvis du vil have CSV-eksport, PDF, eller mere detaljeret kalender-visning.
