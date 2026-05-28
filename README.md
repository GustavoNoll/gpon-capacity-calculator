# GPON Capacity Calculator

Calculadora web para estimar capacidade de threads GPON — portada de `int6-isp-portal/scripts/gpon_capacity_calculator.py`.

Cobre:

- Bulk contínuo
- Massives trigger
- Rotinas OLT
- SAC (tráfego ao vivo)
- API ao vivo
- Provisioning concorrente

## Uso local

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Interface

- **Dicts principais**: `scenario`, `massives`, `sac`, `api_live`, `provisioning` — editáveis na tela principal.
- **Opções avançadas**: `sac_ponlink_status_seconds`, tabela de `routines` (every_minutes, p90_seconds), import/export JSON.
- **Restaurar defaults**: volta aos valores do script Python original.

## Deploy na Vercel

1. Faça push deste repositório para o GitHub (veja abaixo).
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório.
3. Framework: **Next.js** (detectado automaticamente).
4. Deploy — sem variáveis de ambiente necessárias.

Ou via CLI:

```bash
npx vercel
```

## Criar repositório no GitHub e publicar

O ambiente local não estava autenticado no GitHub. Rode:

```bash
cd /Users/gustavonoll/Documents/projects/gpon-capacity-calculator

# login (uma vez)
gh auth login

# criar repo público e enviar
gh repo create gpon-capacity-calculator --public --source=. --remote=origin --push
```

Ou crie manualmente em github.com/new e depois:

```bash
git init
git add .
git commit -m "feat: GPON capacity calculator web app"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/gpon-capacity-calculator.git
git push -u origin main
```

## Estrutura

- `src/lib/calculator.ts` — lógica (espelha o Python)
- `src/lib/defaults.ts` — valores default do script
- `src/components/calculator-app.tsx` — UI interativa
