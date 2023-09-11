import React from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';


export default function index() {
    const location = useLocation();

    return (
        <div>index</div>
    )
}
