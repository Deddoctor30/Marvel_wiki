import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

import Error from '../onError/Error';
import Spinner from '../spinner/Spinner';
import MarvelService from '../../services/MarvelService';

import {CSSTransition, TransitionGroup} from 'react-transition-group';

import './comics.scss';

const setContent = (process, Component, updating) => {
    switch(process) {
        case 'waiting':
            return <Spinner/>;
            break;
        case 'loading': 
            return updating ? <Component/> : <Spinner/>
            break;
        case 'confirmed':
            return <Component/>
            break;
        case 'error':
            return <Error/>
            break;
        default:
            throw new Error('Error');
    }
 }

const Comics = () => {

   const [comicsList, setComics] = useState([]);
   const [updating, setUpdating] = useState(false);
   const [offset, setOffset] = useState(110);
   const [charEnded, setCharEnded] = useState(false);


   const {loading, error, getAllComics, setProcess, process} = MarvelService();

   useEffect(() => {
       onRequest(offset, true)
   }, []);

   const onRequest = (offset, initial) => {
       initial ? setUpdating(false) : setUpdating(true)
       getAllComics(offset)
           .then(readRes)
           .then(() => setProcess('confirmed'))
   }

   const readRes = (newComicsList) => {
       let ended = false;
       if (newComicsList.length < 8) {
           ended = true
       }

       setComics(comicsList => [...comicsList, ...newComicsList]);
       setUpdating(false);
       setOffset(offset => offset + 8);
       setCharEnded(ended);
   }

   function createElements(comicsList) {
       const items = comicsList.map((item, i) => {
           return(
                <CSSTransition
                    timeout={500}
                    classNames="comics__item"
                    key={item.id}>
                    <li className={`comics__item`}
                    key={i}>
                        <Link to={`/comics/${item.id}`}>
                            <img src={item.thumbnail} alt="abyss"/>
                            <div className="comics__name">{item.title}</div>
                            <div className="comics__price">{`${item.price}$`}</div>
                        </Link>
                    </li>
                </CSSTransition>
           )
       })
       return(
           <ul className="comics__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
           </ul>
       )
   }
   

   return (
        <>
            <div className="comics__list">
             {setContent(process, () => createElements(comicsList), updating)}
                <button 
                className="button button__main button__long"
                disabled={updating}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>                                       
                <div className="inner">load more</div>
                </button>
            </div>
        </>

   )

}

export default Comics;