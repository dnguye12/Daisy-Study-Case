# 👋Daisy Study Case README

Topic chose: **Créneaux & Capacité**
* Liste des ateliers → bouton “+ Ajouter un créneau”
* Formulaire : date/heure, durée, capacité, prix
* Confirmation + feedback visuel (toast ou banner)
* États à gérer : validation minimale, succès, erreur
<br/>
Demo link:<br/>
https://daisy-study-case.vercel.app/
<br/><br/>

## 💡Tech Stack
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[Drizzle]: https://img.shields.io/badge/drizzle-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black
[Drizzlel-url]: https://orm.drizzle.team/
[Neon]: https://img.shields.io/badge/neondb-47A248?style=for-the-badge&logo=postgresql&logoColor=white
[Neon-url]: https://neon.com/
[ShadCN]: https://img.shields.io/badge/shadcnui-000000?style=for-the-badge&logo=shadcnui&logoColor=white
[ShadCN-url]: https://ui.shadcn.com/
[ShadCN]: https://img.shields.io/badge/shadcnui-000000?style=for-the-badge&logo=shadcnui&logoColor=white
[ShadCN-url]: https://ui.shadcn.com/
* [![Next][Next.js]][Next-url] : NextJS for full-stack development
* [![Drizzle][Drizzle]][Drizzlel-url] : Database ORM
* [![Neon][Neon]][Neon-url] : Neon DB for Postgre database
* [![ShadCN][ShadCN]][ShadCN-url] :  UI library
<br/>

## 🌸Décisions UI/UX
* **Interactive calendar**: Display the events using a calendar
* **Respect DA Daisy**: Font and color
* **Toast**: For feedback visual
<br/>

## ✅États gérés
**États gérés**: validation minimale, succès, erreur
<br/>
<br/>

## 📖Getting Started
#### 1) Prerequisites
1. First clone this repository from github or download it as a zip
```bash
git clone https://github.com/dnguye12/Cat-Chat.git
```
<br/>

2. Install the packages
```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```
<br/>

3. Setup a Neon Database
<br>

#### 2) Environment variables
Create .env at the project root with these variables:
```bash
DATABASE_URL="..."
```
<br />

#### 3) Prepare database
```bash
# Generate SQL from your Drizzle schema
# npm
npm run drizzle:generate
# yarn
yarn drizzle:generate
# pnpm
pnpm drizzle:generate
# bun
bun run drizzle:generate

# Apply migrations to Neon
# npm
npm run drizzle:push
# yarn
yarn drizzle:push
# pnpm
pnpm drizzle:push
# bun
bun run drizzle:push
```
<br />

#### 4) Run the app
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
<br />