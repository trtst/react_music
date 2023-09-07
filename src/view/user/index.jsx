import React from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';


export default function index() {
    const location = useLocation();

    console.log(location);
    return (
        <div>index</div>
    )
}
