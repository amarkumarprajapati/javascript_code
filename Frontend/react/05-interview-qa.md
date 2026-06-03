# React Rapid-Fire Q&A

> Quick answers to revise the night before. Say them out loud.

1. **What is React?** UI library; component-based, declarative, virtual DOM.
2. **JSX?** HTML-like syntax compiled to `React.createElement`.
3. **Virtual DOM?** In-memory tree; diffed (reconciliation) to update only changed real DOM nodes.
4. **Keys?** Stable identity for list items; avoid index for dynamic lists.
5. **Props vs state?** Props immutable from parent; state internal & mutable.
6. **Why is setState async/batched?** Performance; use updater function for dependent updates.
7. **Controlled vs uncontrolled?** State-driven vs DOM/ref-driven inputs.
8. **useEffect dependency array?** `[]` once, `[deps]` on change, none = every render.
9. **useEffect cleanup?** Returned function; runs before next effect & on unmount.
10. **useMemo vs useCallback?** Memoize value vs function reference.
11. **useRef?** Mutable value across renders without re-render; DOM access.
12. **Custom hook?** Reusable stateful logic; name starts with `use`.
13. **React.memo?** Skip re-render on shallow-equal props.
14. **What causes re-render?** State/props change or parent re-render.
15. **Context API purpose?** Avoid prop drilling for shared data.
16. **Context downside?** All consumers re-render on value change.
17. **Lifting state up?** Move shared state to common parent.
18. **Fragment?** Group children without extra DOM node (`<>...</>`).
19. **Pure component?** Renders same output for same props/state.
20. **HOC?** Function taking a component, returning an enhanced component.
21. **Render props?** Share logic via a function-as-child prop.
22. **Error boundary?** Class component catching render errors (`componentDidCatch`).
23. **Lazy loading?** `React.lazy` + `Suspense` for code splitting.
24. **Reconciliation?** Diffing algorithm matching old/new VDOM.
25. **Strict Mode?** Dev tool; double-invokes effects to surface bugs.
26. **Why hooks over classes?** Simpler logic reuse, no `this`, less boilerplate.
27. **Rules of hooks?** Top level only; only in React functions.
28. **Prop drilling fix?** Context / state library / composition.
29. **Redux flow?** dispatch → reducer → store → selector → UI.
30. **Server state tool?** React Query / SWR (cache, refetch, dedupe).
31. **Controlled form submit?** `onSubmit` + `preventDefault` + state values.
32. **useReducer vs useState?** Reducer for complex/related transitions.
33. **Synthetic event?** React's cross-browser wrapper around native events.
34. **How to prevent unnecessary child renders?** memo + stable props (useCallback/useMemo).
35. **What is hydration?** Attaching React to server-rendered HTML (Next.js/SSR).

---

> Extra question bank: `React_Interview_Questions_Converted.md` in this folder.
