// import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from "@/components/ui/sonner"
import Home from './pages/Home';
import { Layout } from './components/Layout';
import Empty from './pages/Empty';

function App() {

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <>
        <BrowserRouter>
          <Layout>
            <Toaster position="bottom-right" richColors />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/empty" element={<Empty />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </>
    </ThemeProvider>
  );
}

export default App;
