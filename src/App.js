import React, { useEffect, useState } from "react";
import './App.css';
import Tmdb from "./Tmdb";
import MovieRow from "./components/MovieRow"; 
import FeatureMovie from "./components/FeatureMovie";
import Header from "./components/Header";

export default () => {

    const [movieList, setMovieList] = useState([]);
    const [featuredData, setFeaturedData] = useState(null);
    const [blackHeader, setblackHeader] = useState(false);

    useEffect(()=>{
        const loadAll = async () => {
            //Pegando a lista TOTAl
            let list = await Tmdb.getHomeList();
            let listWithResults = list.filter(item => item.items.results.length > 0);
            setMovieList(listWithResults);

            //Pegando o FeaturedData
            let originals = list.filter(i=>i.slug === 'originals');
            let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
            let chosen = originals[0].items.results[randomChosen];
            let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
            setFeaturedData(chosenInfo);
        }

        loadAll();
    }, []);

    useEffect(()=>{
        const scrolllististener = () => {
            if (window.scrollY > 10) {
                setblackHeader(true);
            }else {
                setblackHeader(false);
            }
        }

        window.addEventListener('scroll', scrolllististener);

        return () => {
            window.removeEventListener('scroll', scrolllististener)
        }
    }, [])

    return (
        <div className="page">

            <Header black={blackHeader}/>

            {featuredData &&
                <FeatureMovie item={featuredData} />
            }
            

           <section className="lists">
            {movieList.map((item, key)=>(
              <MovieRow key={key} title={item.title} items={item.items} />
            ))}
           </section>

            {movieList.length <= 0 && 
            <div className="loading">
                <img src="https://media.wired.com/photos/592744d3f3e2356fd800bf00/master/w_2560%2Cc_limit/Netflix_LoadTime.gif" />
            </div>
            }
        </div>
    );
}