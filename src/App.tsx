import Footer from "./components/block/footer";
import Header from "./components/sections/header";
import Hero from "./components/sections/hero";
import { Toaster } from "./components/ui/sonner";

const App = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Hero />
      <Footer />
      <Toaster />
    </div>
  );
};

export default App;
