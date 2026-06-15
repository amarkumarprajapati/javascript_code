# Deloitte Interview Prep — Managed Services Engineer II (Frontend / Next.js)
**Role:** Managed Services Engineer II — DFO&I Team  
**Stack Focus:** React, Next.js, TypeScript, Jest, REST/GraphQL, CI/CD, GenAI Tools

---

## 1. React & Next.js

### Core Concepts
- What is the difference between SSR, SSG, and ISR in Next.js? When would you choose each?
- Explain React Server Components (RSC). How are they different from Client Components?
- How does the Next.js App Router differ from the Pages Router in terms of data fetching, caching, and layout?
- What is hydration in Next.js and what problems can cause hydration errors?
- How does `Suspense` work in React 18? How does it integrate with Next.js streaming?
- What is the purpose of `use client` and `use server` directives in the App Router?
- How do you handle layout nesting and shared UI in Next.js App Router?

### State Management
- How do you manage shared state across pages in a Next.js app? (Context API, Zustand, Redux, Jotai)
- When would you lift state vs use a global store? What are the tradeoffs?
- How do you avoid unnecessary re-renders in a large React application?

### Components & Design Systems
- How do you build reusable, composable components that work across multiple teams?
- How do you enforce consistency when contributing to a shared design system?
- What are compound components and when would you use them?
- How do you handle theming (dark/light mode) in a React + Tailwind or CSS-in-JS setup?
- Explain the difference between controlled and uncontrolled components. When do you use each?

### Routing & Navigation
- How does dynamic routing work in Next.js App Router? (route segments, catch-all, parallel routes)
- How do you handle redirects, 404s, and error boundaries in Next.js?
- How do you implement route-based code splitting in Next.js?

---

## 2. JavaScript (ES6+)

### Core Language
- Explain the JavaScript event loop. What are microtasks vs macrotasks? Give examples.
- What is the difference between `==` and `===`? Explain type coercion with examples.
- Explain closures. Give a real-world use case where you applied one.
- What is the difference between `var`, `let`, and `const`? What is the temporal dead zone?
- How does prototypal inheritance work in JavaScript?

### Async JavaScript
- How do Promises work internally? Explain the difference between `Promise.all`, `Promise.allSettled`, `Promise.race`, and `Promise.any`.
- What is `async/await`? How does error handling work with it?
- What happens if you don't `await` an async function? What are the risks?
- How do you cancel a fetch request? (AbortController)

### Advanced Concepts
- What is debouncing vs throttling? Implement one from scratch.
- Explain memoization. How does it relate to `useMemo` and `useCallback` in React?
- What are generators and iterators? When would you use them?
- How does `WeakMap` differ from `Map`? When is it useful?
- What causes memory leaks in a React app? How do you detect and fix them?

---

## 3. TypeScript

- What is the difference between `interface` and `type` in TypeScript? When do you use each?
- Explain generics in TypeScript. Give a practical example from a project.
- What are utility types? Explain `Partial`, `Pick`, `Omit`, `Required`, `Readonly`.
- What is a discriminated union? How does it help with type narrowing?
- How do you type the props of a higher-order component (HOC) or a render prop pattern?
- How do you handle `unknown` vs `any` types? Why should you avoid `any`?
- What is `as const` and when is it useful?

---

## 4. Testing (Jest & React Testing Library)

### Jest
- How do you mock an API call in Jest? Explain `jest.fn()`, `jest.mock()`, and MSW (Mock Service Worker).
- What is the difference between `jest.mock()` and manual mocks?
- How do you test a module that has side effects (timers, Date, Math.random)?
- What is snapshot testing? When is it useful and when does it become a liability?

### React Testing Library
- What is the difference between `getBy`, `queryBy`, and `findBy`? When do you use each?
- How do you test a component that fetches data on mount? Walk through your approach.
- What is `userEvent` vs `fireEvent`? Which do you prefer and why?
- How do you test form submission and validation?
- How do you test a component that uses React Context?

### Testing Strategy
- How do you decide what to unit test vs integration test vs E2E test?
- How do you think about test coverage — is 80% enough? What matters more than percentage?
- How do you maintain test suites as the codebase grows and requirements change?
- Have you used Playwright or Cypress for E2E? How do you integrate it with CI?

---

## 5. Performance & Optimization

### Core Web Vitals
- What are Core Web Vitals? Explain LCP, CLS, INP (and old FID). How have you improved them?
- How do you measure frontend performance in production? (Lighthouse, Web Vitals API, RUM tools)

### Bundle & Runtime
- How do you reduce bundle size in a Next.js app? (code splitting, dynamic imports, tree shaking)
- What is lazy loading? How do you implement it for images and components in Next.js?
- How does Next.js handle image optimization (`next/image`)? What are the tradeoffs?
- What are the differences between static assets on CDN vs served through Next.js?

### React Performance
- When and how do you use `React.memo`, `useMemo`, and `useCallback`? Can overusing them hurt performance?
- How do you profile a React app to find performance bottlenecks? (React DevTools Profiler)
- What is virtualization (windowing)? When do you use `react-window` or `react-virtual`?
- How do you avoid layout thrashing in your CSS/JS?

---

## 6. Accessibility (a11y)

- What is WCAG 2.1? What is the difference between Level A, AA, and AAA compliance?
- How do ARIA roles, states, and properties work? Give a concrete example.
- How do you ensure keyboard navigation works correctly for a custom dropdown or modal?
- How do you test accessibility? (screen readers, axe-core, jest-axe)
- What is the difference between `aria-label`, `aria-labelledby`, and `aria-describedby`?
- How do you handle focus management when a modal opens and closes?
- What is the importance of color contrast ratios and how do you check them?

---

## 7. APIs, Auth & Security

### REST & GraphQL
- How do you handle API error states in the UI — loading, error, empty, and success states?
- How do you implement optimistic UI updates? What are the rollback strategies?
- What is the difference between REST and GraphQL? When would you choose GraphQL?
- How do you handle pagination in a UI? (offset vs cursor-based)

### Authentication & Authorization
- Explain the difference between JWT-based auth and session-based auth. What are the tradeoffs on the frontend?
- Why should you NOT store JWTs in `localStorage`? Where should you store them?
- How does OAuth 2.0 / OIDC flow work? How would you implement it in Next.js (e.g. with NextAuth.js / Auth.js)?
- What is PKCE and why is it used in public clients?
- How do you handle token refresh and silent authentication?

### Security (OWASP Basics)
- What is XSS? How does React protect against it by default and where can it still happen?
- What is CSRF? How do you prevent it in a Next.js app?
- What are Content Security Policy (CSP) headers? How do you configure them in Next.js?
- How do you safely use `dangerouslySetInnerHTML`? When would you ever need to?
- What is clickjacking and how do you protect against it?

---

## 8. CI/CD & Git Workflows

- What CI/CD pipelines have you worked with? (GitHub Actions, GitLab CI, Azure DevOps)
- Describe your Git branching strategy. (Gitflow, trunk-based, feature branches)
- How does your code get from a PR to production? Walk through the full pipeline.
- How do you handle environment variables securely across staging and production in Next.js?
- What are blue-green deployments and canary releases? Have you used either?
- How do you handle database migrations in a CI/CD pipeline?

---

## 9. Observability & Monitoring

- What tools have you used for error tracking and monitoring? (Sentry, Datadog, New Relic)
- How do you log frontend errors in production? What information do you capture?
- How do you monitor Core Web Vitals in production (not just dev/Lighthouse)?
- How do you debug a performance issue that only happens in production?
- What is distributed tracing and how does a frontend tie into it?

---

## 10. GenAI Tools & AI-Assisted Development

- How do you use GitHub Copilot or similar tools in your daily workflow?
- How do you verify AI-generated code for correctness, security, and performance?
- Give an example of when AI-assisted code needed significant correction — what was the issue?
- What are the IP and data-handling risks when using AI coding tools with client code?
- How do you think about the balance between AI acceleration and code quality standards?

---

## 11. Agile & Delivery

- Describe your Agile workflow — what ceremonies do you participate in?
- How do you estimate frontend tasks? What factors do you consider?
- How do you handle scope creep mid-sprint?
- How do you communicate delivery risk or blockers to stakeholders?
- Describe how you clarify requirements and define acceptance criteria with a product manager.
- How do you handle a situation where design specs are incomplete or conflict with technical constraints?

---

## 12. Code Quality & Engineering Standards

- What do you look for in a code review? What standards do you enforce?
- How do you enforce code quality standards across a team? (ESLint, Prettier, Husky, SonarQube)
- What is your approach to technical debt — how do you balance it against delivery?
- How do you document components and APIs for other developers?
- How do you approach refactoring a legacy codebase without breaking existing functionality?

---

## 13. System Design (Frontend Focus)

- How would you design a large-scale Next.js application for a global e-commerce client?
- How would you implement micro-frontends? What are the tradeoffs?
- How do you handle internationalization (i18n) and localization in a Next.js app?
- How would you build a real-time dashboard (live data)? What technologies would you use?
- How would you architect a component library that is shared across multiple products?
- How do you approach content management — headless CMS integration in Next.js?

---

## 14. Behavioural / HR

- Tell me about yourself and your journey as a frontend developer.
- Walk me through your most complex project. What was your individual contribution?
- Tell me about a time you disagreed with a technical decision made by a stakeholder or senior engineer. How did you handle it?
- Describe a situation where you had to deliver under a tight deadline without compromising quality.
- Tell me about a time you mentored a junior developer. What approach did you take?
- Describe a situation where your code had a bug in production. How did you handle it?
- How do you stay updated with the rapidly changing frontend ecosystem?
- How do you handle working with offshore or distributed teams?

---

## 15. Deloitte-Specific Questions

- Why do you want to work at Deloitte over a product company?
- What do you know about the Digital Foundry Operate & Innovations (DFO&I) team?
- How do you see your role contributing to client outcomes, not just code delivery?
- How do you approach working across multiple clients with different tech stacks and standards?
- Where do you see yourself in 2–3 years? How does this role fit your growth plan?
- Deloitte values include integrity, inclusion, and making an impact. Can you give an example of when you demonstrated one of these?

---

## Quick Prep Checklist

| Area | Must Revise | Priority |
|------|-------------|----------|
| Next.js App Router & RSC | SSR vs SSG vs ISR, Server Components, caching | 🔴 High |
| React hooks deep dive | useMemo, useCallback, useEffect pitfalls | 🔴 High |
| Jest + RTL | Mock API, async testing, userEvent | 🔴 High |
| Auth | JWT vs session, OAuth/OIDC, NextAuth.js | 🔴 High |
| OWASP basics | XSS, CSRF, CSP in Next.js | 🔴 High |
| Core Web Vitals | LCP, CLS, INP — how to measure & fix | 🟡 Medium |
| TypeScript | Generics, utility types, discriminated unions | 🟡 Medium |
| Accessibility | WCAG, ARIA, focus management | 🟡 Medium |
| CI/CD | GitHub Actions, env vars, deployment flow | 🟡 Medium |
| System Design | Micro-frontends, real-time, i18n | 🟢 Good to have |
| GenAI tools | Copilot usage + verification example | 🟡 Medium |

---

*Prepared for Deloitte DFO&I — Managed Services Engineer II interview. Based on official JD (Requisition 353062).*
