import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {CSSTransition, TransitionGroup} from 'react-transition-group';


import Spinner from '../spinner/Spinner';
import MarvelService from '../../services/MarvelService';
import Error from '../onError/Error';

import './charList.scss';

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

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [updating, setUpdating] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);
    const [selected, setSelected] = useState(null);


    const {getAllCharacters, setProcess, process} = MarvelService();

    useEffect(() => {
        onRequest(offset, true)
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setUpdating(false) : setUpdating(true)
        getAllCharacters(offset)
            .then(readRes)
            .then(() => setProcess('confirmed'))
    }


    const readRes = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true
        }

        setCharList(charList => [...charList, ...newCharList]);
        setUpdating(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended);
    }


    const onFocus = (i, item) => {
        setSelected(i);
        props.onCharSelected(item.id)
    }

    function createElements(charList) {
        const items = charList.map((item, i) => {
            const noImg = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';
            const checkImg = item.thumbnail === noImg ? {objectFit: 'fill'} : null

            return(
                <CSSTransition 
                    timeout={500}
                    classNames="char__item"
                    key={item.id}
                >
                    <li className={`char__item ${i === selected ? 'char__item_selected' : ''}`}  // проверка i и i с фокуса если === тогда добавляю класс с выделением элемента
                        tabIndex={i + 1} 
                        onClick={() => props.onCharSelected(item.id)}
                        onFocus={() => onFocus(i, item)}                                                     // для выделения при фокусе
                        key={item.id}
                        >
                            <img src={item.thumbnail} alt="abyss" style={checkImg}/>
                            <div className="char__name">{item.name}</div>
                    </li>
                </CSSTransition>
            )
        })
        return(
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
    }
    
    return (
        <div className="char__list">
                {setContent(process, () => createElements(charList), updating)}
            <button 
                className="button button__main button__long"
                disabled={updating}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}


CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}


export default CharList;