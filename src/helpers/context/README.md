# 🌟 AppContext Utility

A **lightweight**, **reusable** global state management solution for **React** applications.  
Leverages **React Context** + **useReducer** to provide a **clean, scalable way** to manage and share state across your app.

---

## 🚀 Features

- ✅ **Centralized State**: Manage global state in one place.
- ✅ **Reducer Pattern**: Predictable state updates using actions.
- ✅ **Custom Hook**: Easy access to state and dispatch via `useAppContext`.
- ✅ **Performance Optimized**: Memoized context value to prevent unnecessary re-renders.
- ✅ **Safe Access**: Built-in guard to ensure context is used within the provider.

---

## 📦 Installation

Simply copy the `context` folder into your project's helper or utils directory:

```text
src/
  helpers/
    context/
      ├── context.jsx
      ├── innitialState.jsx
      ├── setState.jsx
      └── README.md
```

---

## 🛠️ Usage

### 1. Wrap your application with `AppProvider`

In your root component (e.g., `App.js` or `index.js`), wrap your application with the `AppProvider`.

```jsx
import { AppProvider } from "./helpers/context/context";

function App() {
  return (
    <AppProvider>
      <YourComponents />
    </AppProvider>
  );
}

export default App;
```

### 2. Access State and Dispatch

Use the `useAppContext` hook in any child component to access the global state and dispatch actions.

```jsx
import { useAppContext } from "./helpers/context/context";

const ProductList = () => {
  const { state, dispatch } = useAppContext();
  const { products, loading } = state;

  const updateLoading = () => {
    dispatch({ type: "SET_LOADING", payload: true });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={updateLoading}>Start Loading</button>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
};
```

---

## 📚 API Reference

### Initial State

The default state is defined in `innitialState.jsx`:

| Property | Type | Description |
| :--- | :--- | :--- |
| `loading` | `boolean` | Indicates if data is being fetched or processed. |
| `products` | `Array` | List of products (imported from data source). |

### Actions

State updates are handled by the reducer in `setState.jsx`.

| Action Type | Payload Type | Description |
| :--- | :--- | :--- |
| `SET_LOADING` | `boolean` | Updates the `loading` state. |
| `SET_PRODUCTS` | `Array` | Updates the `products` list. |

---

## � Best Practices

- **Keep State Minimal**: Only put truly global state in the context. Local state should remain in components.
- **Action Constants**: For larger apps, consider defining action types as constants to avoid typos.
- **Async Actions**: For complex async logic, consider creating a separate actions file or using a pattern to handle side effects before dispatching.
