// import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from "@/components/ui/sonner"
import Home from './pages/Home';
import OpenWith from './pages/OpenWith';
import { Layout } from './components/Layout';
import Empty from './pages/Empty';
import { Titlebar } from './features/Titlebar';
import { ListenFileOpening } from './components/ListenFileOpening';


function App() {

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>

      <BrowserRouter>
        <Titlebar />
        <ListenFileOpening />
        <Layout>
          <Toaster position="bottom-right" richColors />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/open-with" element={<OpenWith />} />
            <Route path="/empty" element={<Empty />} />
          </Routes>
        </Layout>
      </BrowserRouter>

    </ThemeProvider>
  );
}

export default App;
