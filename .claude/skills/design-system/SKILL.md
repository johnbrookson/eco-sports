---
name: design-system
description: Use when working on design tokens, themes (basketball, indigo), CSS custom properties, adding a new color, modifying the SiteNav component with its three variants, the SaaS admin shell (sidebar, toolbar, content surfaces), working on the dark editorial surface (--profile-surface), or designing new surfaces that need to be theme-aware. Also invoke when adding a new route whose nav needs to decide between hero/primary/dark variants.
---

> **Manutenção desta skill**: última revisão refletindo o estado até `573a30c` (admin shell com sidebar, toolbar, breadcrumbs, collapse). Se você adicionou um token novo, um tema novo, um componente do shell, ou mudou a regra "nunca hardcode cor", atualize esta skill **no mesmo commit** ou commit adjacente. Ver `git log -- .claude/skills/design-system/` para histórico.

# Design system — tokens, temas, SiteNav, SaaS shell

Sistema de design do Eco-Sports em Tailwind v4 + oklch. Dois temas, paleta totalmente tokenizada, um componente de nav de marketing com 3 variantes, e um shell de admin com sidebar/toolbar/content surfaces inspirado no Fuse Layout1.

## Imperativo (30 segundos)

- **Leia a skill `conventions` primeiro** se ainda não leu nesta conversa.
- **Nunca hardcode cor nova.** Se precisa de uma cor que não existe como token, crie um token. Hardcoded colors acumulam, drift entre temas, quebram light/dark. Foi justamente o problema que resolvemos no commit `d8662ad` substituindo 11 ocorrências de `#0b0f1a` por `--profile-surface`.
- **Adicionar um token é mexer em 4 blocos + 1 registration.** Nos 4 blocos de tema (`[data-theme="indigo"]`, `[data-theme="indigo"].dark`, `[data-theme="basketball"]`, `[data-theme="basketball"].dark`) declare o token, e no `@theme inline` do final registre como `--color-nome-do-token` pra virar utility Tailwind.
- **Tokens existem em oklch.** Nunca rgb, hex ou hsl num tema novo — oklch dá consistência perceptual melhor (ajuste de luminosidade independente de hue).
- **O `SiteNav` tem 3 variantes: `hero`, `primary`, `dark`.** Cada nova página de marketing escolhe uma delas baseada no hero que ela tem embaixo. **Não** crie uma quarta variante sem discutir — duplica complexidade por muito pouco ganho.
- **`profile-surface` é o token da identidade editorial do atleta.** Usado na vitrine, nos perfis individuais, no card fallback, no teaser da home. Deliberadamente igual em light e dark mode dentro de cada tema — é uma escolha editorial, não resposta a preferência de modo.
- **O SaaS shell usa Geist (não Inter).** A fonte Geist é aplicada via CSS variable override (`--font-sans`) no `(app)/layout.tsx`. Páginas públicas continuam com Inter.
- **O theme switcher vive no SiteFooter**, não no SiteNav. Relocado no commit `8bff912` para não competir com CTAs na barra de navegação.

## Duas camadas de navegação

O sistema de design tem **dois componentes de navegação distintos**:

| Componente | Usado em | Finalidade |
|---|---|---|
| `SiteNav` | Páginas públicas/marketing (7 páginas) | Nav de marketing com variantes visuais por tipo de hero |
| Admin shell (AppSidebar + AppToolbar) | `/app/*` (área autenticada) | Shell de SaaS com sidebar recolhível, toolbar, breadcrumbs |

**Nunca misture** — SiteNav não aparece em `/app/*`, e o admin shell não aparece no marketing.

## Estado atual dos tokens

### Temas existentes

**`basketball`** — tema inicial do nicho de categorias de base. Primary laranja (~ NBA/BBB), accent navy.

- Light: `--background: oklch(0.99 0.005 70)` creme quente, `--primary: oklch(0.65 0.22 45)` laranja, `--accent: oklch(0.50 0.18 255)` navy
- Dark: `--background: oklch(0.15 0.02 250)` navy escuro, `--primary: oklch(0.72 0.20 45)` laranja clareado

**`indigo`** — tema alternativo para pivotar o nicho no futuro. Primary azul/violeta.

- Light: `--background: oklch(0.99 0.002 270)`, `--primary: oklch(0.50 0.24 270)` indigo forte, `--accent: oklch(0.60 0.22 290)` violeta
- Dark: equivalentes dark

Alternância via atributo `data-theme` no `<html>`, persistido em localStorage, trocado pelo [theme-switcher](../../../web/src/components/theme-switcher.tsx) (vive no SiteFooter).

### Tokens semânticos (comuns aos dois temas, valores diferentes por tema)

Os dois temas declaram os mesmos nomes de token, só mudam valores. Categoria por propósito:

- **Neutros**: `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--muted`, `--muted-foreground`
- **Brand**: `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--accent`, `--accent-foreground`
- **Estado**: `--destructive`, `--border`, `--input`, `--ring`
- **Charts**: `--chart-1` a `--chart-5` (usados em recharts via `var(--color-chart-N)`)
- **Sidebar**: `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border`, `--sidebar-ring` — herança shadcn, usados pelo admin shell
- **Toolbar**: `--toolbar`, `--toolbar-foreground` — adicionados em `f1674a9` para a toolbar do admin shell
- **Content surface**: `--content-surface` — adicionado em `f1674a9`. Background sutil da área de conteúdo do admin, levemente diferente de toolbar/sidebar para criar profundidade visual (off-white em light, cinza levemente mais claro em dark)
- **Hero**: `--hero-start`, `--hero-end`, `--hero-accent`, `--section-tint` — usados no hero das páginas de marketing
- **Profile surface**: `--profile-surface` — **o token de identidade editorial do atleta** (mais sobre isso abaixo)

### O token `--profile-surface`

Adicionado no commit `d8662ad`. Representa a **superfície escura editorial** usada em todas as telas do universo do atleta:

- Vitrine `/atletas` — hero escuro
- Perfil individual `/atleta/[slug]` — hero escuro, gradientes
- 404 do perfil individual — mesma linguagem
- Card da vitrine quando não há foto — fallback
- Teaser da home `/` — bloco dedicado à vitrine
- `SiteNav` variante `dark` — nav da vitrine

Valores:

| Tema | Valor oklch | Caráter |
|---|---|---|
| basketball | `oklch(0.12 0.02 260)` | Navy charcoal — evoca "ginásio com luzes apagadas" |
| indigo | `oklch(0.13 0.03 275)` | Noite indigo levemente violeta — evoca "NCAA arena à noite" |

**Mesmo valor em light e dark mode dentro de cada tema** — é uma escolha editorial ("spotlight surface"), não uma resposta à preferência do usuário.

## SaaS admin shell — sidebar, toolbar, content

Implementado em `573a30c`, inspirado no **Fuse React Layout1**. Usa tokens de sidebar (shadcn), toolbar e content-surface. Fonte Geist no lugar de Inter.

### Arquitetura de componentes

```
(app)/layout.tsx
├── SidebarProvider (context: collapsed state)
├── AppSidebar (280px expandido / 64px recolhido)
│   ├── Logo ("Eco-Sports" / "ES")
│   ├── Section label ("Navegação")
│   ├── SidebarNav (client, usePathname → active state)
│   └── SidebarUserMenu (client, dropdown: "Meu Perfil", "Sair")
├── AppToolbar (sticky, h-12/h-16)
│   ├── SidebarToggle (desktop, PanelLeftClose/Open)
│   ├── MobileSidebarToggle (Sheet drawer, < lg)
│   ├── PersonaSwitcher
│   ├── AppBreadcrumbs (client, auto-generated from pathname)
│   ├── Search + Bell action icons (placeholders)
│   └── Avatar (initials)
└── <main> (bg-content-surface)
```

### Componentes e responsabilidades

| Componente | Arquivo | Server/Client | Papel |
|---|---|---|---|
| `AppSidebar` | `components/app-sidebar.tsx` | Client | Sidebar com collapse via `useSidebar()`. Exporta `navItems` |
| `AppToolbar` | `components/app-toolbar.tsx` | Server | Toolbar sticky. Recebe `mobileToggle` como slot |
| `SidebarNav` | `components/sidebar-nav.tsx` | Client | Nav links com `usePathname()`, aceita `collapsed` prop |
| `SidebarToggle` | `components/sidebar-toggle.tsx` | Client | Botão na toolbar, `hidden lg:inline-flex` |
| `SidebarUserMenu` | `components/sidebar-user-menu.tsx` | Client | Avatar + dropdown (Meu Perfil, Sair) |
| `MobileSidebarToggle` | `components/mobile-sidebar.tsx` | Client | Sheet drawer (esquerda) para < lg |
| `SidebarProvider` | `components/sidebar-context.tsx` | Client | Context com `collapsed` + `toggle()` |
| `AppBreadcrumbs` | `components/app-breadcrumbs.tsx` | Client | Breadcrumbs auto-gerados, labels pt-BR |

### Sidebar collapse

- **Expandido**: `w-[280px]`, logo "Eco-Sports", nav com ícone + label, user com avatar + nome + email
- **Recolhido**: `w-16`, logo "ES", nav só ícones (com `title` tooltip), só avatar
- **Transição**: `transition-[width] duration-200`
- **Toggle**: botão `PanelLeftClose`/`PanelLeftOpen` na **toolbar** (não no sidebar)
- **Mobile**: não afetado pelo collapse — usa Sheet/drawer independentemente

### Fonte Geist no SaaS

A fonte Geist (pacote `geist`) é carregada no `(app)/layout.tsx` via `GeistSans.variable` e aplicada sobrescrevendo a CSS variable `--font-sans` no wrapper div:

```tsx
<div
  className={`${GeistSans.variable} ...`}
  style={{ "--font-sans": "var(--font-geist-sans)" } as React.CSSProperties}
>
```

Páginas públicas (marketing, blog, atletas) continuam usando Inter (root layout). A escolha de Geist para o SaaS segue o Fuse — fonte geométrica otimizada para interfaces densas e dashboards.

## Como adicionar um token novo

### Passo a passo

1. **Escolha o nome semântico**, não descritivo. `--coach-accent` é ruim porque amarra ao uso; `--instructor-surface` melhor se for genérico. Preferir nomes baseados em **função** (`--spotlight-bg`, `--nav-accent`) ou em **domínio** (`--profile-surface`, `--consent-callout`).

2. **Defina o valor em oklch para cada uma das 4 combinações** de tema × modo. Para tema basketball, o primary é laranja/navy; escolha um valor que harmoniza. Para indigo, azul/violeta; ajuste.

3. **Declare nos 4 blocos** de `globals.css`:

```css
/* web/src/app/globals.css */

html[data-theme="indigo"] {
  /* ... outros tokens ... */
  --novo-token: oklch(0.XX 0.XX 270);
}

html[data-theme="indigo"].dark {
  /* ... */
  --novo-token: oklch(0.XX 0.XX 270);  /* pode ser igual ou diferente */
}

html[data-theme="basketball"] {
  /* ... */
  --novo-token: oklch(0.XX 0.XX 250);  /* harmoniza com navy/laranja */
}

html[data-theme="basketball"].dark {
  /* ... */
  --novo-token: oklch(0.XX 0.XX 250);
}
```

4. **Registre no `@theme inline`** (no fim do arquivo), criando a utility Tailwind correspondente:

```css
@theme inline {
  /* ... outros @colors existentes ... */
  --color-novo-token: var(--novo-token);
}
```

Isso faz `bg-novo-token`, `text-novo-token`, `border-novo-token`, `from-novo-token`, `to-novo-token` etc virarem utilities válidas do Tailwind.

5. **Use no código** via utility Tailwind:

```tsx
<section className="bg-novo-token text-novo-token-foreground">
```

Ou via CSS var direto (quando precisa passar pra biblioteca externa como recharts):

```tsx
<Line stroke="var(--color-novo-token)" />
```

### Quando o token é igual em light e dark

Se o token representa uma **decisão editorial** (não responsiva a preferência do usuário), use o mesmo valor nos dois modos. Exemplo: `--profile-surface` tem o mesmo valor em basketball e basketball.dark. **Inclua um comentário** explicando por quê.

## SiteNav — 3 variantes, um componente

[web/src/components/site-nav.tsx](../../../web/src/components/site-nav.tsx)

### Variantes

| Variante | Usado em | Visual | Por quê |
|---|---|---|---|
| `hero` | `/` (home) | Absoluto sobre gradiente hero, transparente, texto branco | Home tem gradiente laranja atrás do nav; nav transparente deixa o hero "respirar" |
| `primary` | `/ferramentas`, `/blog`, `/blog/[slug]`, `/ecossistema`, `/para-quem` | Sticky, `bg-primary/[0.85]` + backdrop-blur, texto `primary-foreground` | Páginas institucionais com hero laranja; nav laranja sólido cria continuidade visual |
| `dark` | `/atletas` | Sticky, `bg-profile-surface/90` + backdrop-blur, texto branco | Vitrine tem hero escuro; nav escuro cria continuidade visual com `/atleta/[slug]` e evita costura dura entre nav laranja e hero escuro |

### Como decidir qual variante usar em página nova

Decisão orientada pelo hero da página:

- Hero com gradiente laranja quente → `primary`
- Hero escuro editorial (profile-surface) → `dark`
- Home com hero gigante diferenciado → `hero` (variante exclusiva da home)

**Anti-pattern**: usar `primary` sobre um hero escuro só "porque é a padrão". Cria costura visual ruim.

### Páginas que usam SiteNav hoje

7 páginas:

1. `/` — `<SiteNav variant="hero" />`
2. `/atletas` — `<SiteNav variant="dark" active="atletas" />`
3. `/para-quem` — `<SiteNav variant="primary" active="para-quem" />`
4. `/ferramentas` — `<SiteNav variant="primary" active="ferramentas" />`
5. `/blog` — `<SiteNav variant="primary" active="blog" />`
6. `/blog/[slug]` — `<SiteNav variant="primary" active="blog" />`
7. `/ecossistema` — `<SiteNav variant="primary" active="ecossistema" />`

### MobileNav é linkado por variante

Cada variante do SiteNav passa o `mobile` correspondente pro `<MobileNav variant={t.mobile} />`. `hero` → `"hero"`, `primary` → `"solid"`, `dark` → `"hero"`.

## Anti-patterns específicos do domínio

- **`bg-[#xxxxxx]`** (cor arbitrária Tailwind) para qualquer cor nova. Se não tem token, crie.
- **Modificar tokens existentes** sem checar onde são usados. `--primary` é usado em dezenas de lugares; mexer nele sem querer muda o look completo.
- **Criar um segundo componente de nav** pra uma página específica porque "é diferente". Estenda as variantes do `SiteNav` (marketing) ou os componentes do admin shell (SaaS).
- **Usar `bg-orange-500`** (cor de paleta default do Tailwind) em vez de `bg-primary`. Paleta default do Tailwind não existe — nossos temas sobrescrevem tudo.
- **Esquecer de registrar no `@theme inline`** após declarar um token. Se esquecer, o token existe mas a utility Tailwind não, e você acaba usando `style={{ background: 'var(--token)' }}` como workaround — sinal de bug de skill.
- **Esquecer de declarar nos 4 blocos**. Se declarar só em um tema, o outro tema quebra silenciosamente (Tailwind usa o fallback).
- **Misturar SiteNav e admin shell**. SiteNav é marketing, admin shell é SaaS. Nunca use um no contexto do outro.
- **Adicionar variante ao SidebarNav sem discutir**. O sidebar tem 2 estados (expandido/recolhido), não variantes visuais.

## Para profundidade, ler

- [web/src/app/globals.css](../../../web/src/app/globals.css) — fonte canônica de todos os tokens, organizada por tema
- [web/src/app/design-system/page.tsx](../../../web/src/app/design-system/page.tsx) — styleguide visual interativo
- [web/src/components/site-nav.tsx](../../../web/src/components/site-nav.tsx) — nav compartilhado do marketing
- [web/src/components/app-sidebar.tsx](../../../web/src/components/app-sidebar.tsx) — sidebar do admin shell
- [web/src/components/app-toolbar.tsx](../../../web/src/components/app-toolbar.tsx) — toolbar do admin shell
- [web/src/app/(app)/layout.tsx](../../../web/src/app/(app)/layout.tsx) — layout do SaaS que compõe os componentes
- Skill `conventions` — convenção geral de "nunca hardcode cor"
- Skill `performance-metrics` — exemplo de uso de tokens em recharts (chart strokes)
- [Tailwind v4 theme docs](https://tailwindcss.com/docs/theme) (externo) — para o mecanismo de `@theme inline`
- [oklch.com](https://oklch.com) (externo) — picker/converter de oklch
