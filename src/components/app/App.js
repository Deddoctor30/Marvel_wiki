import { lazy, Suspense } from "react";
import AppHeader from "../appHeader/AppHeader";

import {BrowserRouter as Router, Route, Routes} from "react-router-dom"; 

import Spinner from "../spinner/Spinner";

// import {MainPage, ComicsPage, SingleComicPage} from "../pages";  // можно не {...} а {*} , кроме того, изначально react ищет index.js

const Page404 = lazy(() => import('../pages/404'));                 // Ленивая загрузка
const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SingleComicPage = lazy(() => import('../pages/SingleComicPage'));
const SingleCharPage = lazy(() => import('../SingleCharPage/SingleCharPage'))

const App = () => {

    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Suspense fallback={<Spinner/>}>
                        <Routes>
                            <Route path="/" element={<MainPage/>}/>
                            <Route path="/comics" element={<ComicsPage/>}/>
                            <Route path="/comics/:comicId" element={<SingleComicPage/>}/>
                            <Route path="/char/:charNme" element={<SingleCharPage/>}/>
                            <Route path="*" element={<Page404/>}/>
                        </Routes>
                    </Suspense>
                </main>
            </div>
        </Router>
    )
}

export default App;