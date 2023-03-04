import { useState, useEffect } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { 
    heroesFetching, 
    heroesFetched, 
    heroesFetchingError,
    filtersFetched,
    filtersFetching,
    filtersFetchingError
 } from '../../actions';

const HeroesAddForm = () => {
    const [newHeroe, setHeroe] = useState({
        name: '',
        description: '',
        element: '',
    });
    // const [filtersList, setFiltersList] = useState([]);
    
    const { heroes, filters } = useSelector(state => state);
    const dispatch = useDispatch();
    const { request } = useHttp();

    useEffect(() => {
        dispatch(filtersFetching());
        request("http://localhost:3001/filters")
            .then(data => dispatch(filtersFetched(data)))
            .catch(() => dispatch(filtersFetchingError()))
        // eslint-disable-next-line
    }, [])
    
    //controlling form
    const onValueInputChange = (e) => {
        setHeroe({
            ...newHeroe,
            [e.target.name]: e.target.value,
        });
    };

    const onSendingHeroe = (e) => {
        e.preventDefault();
        
        const {name, description} = newHeroe;

        // checking for missing characters in input and textarea
        if ([name, description].every(item => item.trim().length !== 0 )) {
            
            const heroeWithId = { ...newHeroe, id: uuidv4() };
            const newHeroesList = [heroeWithId, ...heroes];
    
            dispatch(heroesFetching());
            request("http://localhost:3001/heroes", "POST", JSON.stringify(heroeWithId))
                .then(dispatch(heroesFetched(newHeroesList)))
                .catch(() => dispatch(heroesFetchingError()))

        } else if ([name, description].some(item => item.trim().length === 0 )) {
            alert('Text value must contain symbols, not just spaces');
        }

        setHeroe({
            name: '',
            description: '',
            element: '',
        });
    }
    
    let listOptions = null;
    if (Array.isArray(filters)) {
        listOptions = filters.filter(item => item !== 'all').map(item => {
            return <option key={uuidv4()} value={item}>{item.slice(0, 1).toUpperCase() + item.slice(1)}</option>
        })
    }
    
    return (
        <form onSubmit={onSendingHeroe} className="border p-4 shadow-lg rounded">
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Name of the new hero</label>
                <input
                    required
                    onChange={(e) => onValueInputChange(e)}
                    type="text"
                    name="name"
                    className="form-control"
                    id="name"
                    value={newHeroe.name}
                    placeholder="Как меня зовут?" />
            </div>

            <div className="mb-3">
                <label htmlFor="description" className="form-label fs-4">Description</label>
                <textarea
                    required
                    onChange={(e) => onValueInputChange(e)}
                    name="description"
                    className="form-control"
                    id="description"
                    value={newHeroe.description}
                    placeholder="Что я умею?"
                    style={{ "height": '130px' }} />
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Select hero element</label>
                <select
                    required
                    onChange={(e) => onValueInputChange(e)}
                    className="form-select"
                    id="element"
                    value={newHeroe.element}
                    name="element">
                    <option key="start" value="">I own the element...</option>
                    {listOptions}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Create</button>
        </form>
    )
}

export default HeroesAddForm;