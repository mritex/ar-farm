# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Run commands

### Development
Starts the Vite development server.
```powershell
npm run dev
```

### Production Build
Creates a `dist` folder with production-ready assets.
```powershell
npm run build
```

### Preview
Preview the production build locally.
```powershell
npm run preview
```

### Linting
Run ESLint to check for code issues.
```powershell
npm run lint
```

## Git Commands

### Push changes to main
Save and upload your local changes to the main branch.
```powershell
git add .
git commit -m "Update footer and README"
git push origin main
```

## Admin Panel

The AR Farm website includes a built-in administrative panel to manage the Shop products without editing code.

### Accessing the Panel
- **URL**: `/admin` or `/admin/login`
- **Default Credentials**:
- **Username**: `admin`
- **Password**: `admin123`

### Features
- **Add Products**: Add new products with name, price, category, and image.
- **Delete Products**: Remove old or out-of-stock items.
- **Live Sync**: Changes are instantly reflected on the [Shop Page](/shop).

### How to Update Your Shop
1. **Open the Admin Panel**: Go to `/admin` and log in.
2. **Modify Products**: Change prices or add new products.
3. **Commit Changes**: Click the **"Update the Shop page"** button at the bottom.
4. **Finalize**: Paste the copied code into `src/data/products.json` and save.

### Persistence (Important)

Currently, the admin panel uses **`localStorage`** to persist data. 
- **Demo Mode**: Changes you make are saved in your browser. If you refresh or close the tab, the changes remain.
- **Production Mode**: To make changes visible to *all* visitors, you need to connect a database.

#### How to connect a Database (Firebase Example)
1. **Initialize Firebase**: Install `firebase` and create a `src/firebase.js` file with your config.
2. **Update Context**: Modify `ProductContext.jsx` to fetch/push data to Firestore instead of `localstorage`.
   ```javascript
   // Example Firestore sync
   useEffect(() => {
     const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
       setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
     });
     return unsubscribe;
   }, []);
   ```

---

## Technical Details

- **Framework**: React 19 + Vite 8
- **State Management**: React Context API (`ProductContext`)
- **Icons**: Lucide React
- **Authentication**: Session-based (Hardcoded for demo)



