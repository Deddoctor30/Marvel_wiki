import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import {CSSTransition, TransitionGroup} from 'react-transition-group';

import AppBanner from '../appBanner/AppBanner';

import Spinner from '../spinner/Spinner';
import Error from '../onError/Error';

import setContent from '../../utiles/setContent';

import './singleCharPage.scss';

import MarvelService from '../../services/MarvelService';


const SingleCharPage = () => {

    const {charNme} = useParams();                      // charId из App со значением id через спец. хук useParams()
    const [char, setChar] = useState(null);
    const [show, setShow] = useState(false);
    const {loading, error, getCharacterByName, clearError, setProcess, process} = MarvelService();

    useEffect(() => {
        updateChar()
    }, [charNme]);

    const updateChar = () => {
        clearError();
        getCharacterByName(charNme)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'))
    }
    
    const onCharLoaded = (char) => {
        setChar(char);
    }


    return (
        <div className="comic__info">
            {setContent(process, View, char)}
         </div>
    )
}

const View = (props) => {
    return (
        <>
            <Helmet>
                <meta
                name="description"
                content={`${props.data[0].name} character`}
                />
                <title>{props.data[0].name}</title>
            </Helmet>
            <AppBanner/>

            <TransitionGroup component={null}>
                <CSSTransition
                    timeout={500}
                    classNames="single-char"
                    key={props.data[0].id}
                >
                    <div className="single-char">
                        <img src={props.data[0].thumbnail} alt="x-men" className="single-char__img"/>
                        <div className="single-char__info">
                            <h2 className="single-char__name">{props.data[0].name}</h2>
                            <p className="single-char__descr">{props.data[0].description}</p>
                        </div>
                    </div>
                </CSSTransition>
            </TransitionGroup>
        </>
    )
}


export default SingleCharPage;
