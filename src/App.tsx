import "./App.css";
import Navbar from "./layouts/NavbarAndFooter/Navbar";
import Footer from "./layouts/NavbarAndFooter/Footer";
import HomePage from "./layouts/HomePage/HomePage";
import SearchBooksPage from "./layouts/SearchBookPage/SearchBooksPage";

export const App = ()=> {
  return (
    <div>
      <Navbar />
      {/* <HomePage/> */}
      <SearchBooksPage/>
      <Footer/>
    </div>
  );
}

