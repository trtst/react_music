import React from 'react';
import ReactDOM from 'react-dom/client';
import Layout from './App.jsx';
import { BrowserRouter } from "react-router-dom";
// import '@assets/sass/global.scss';
import '@assets/fonts/fonts.css';
import { ConfigProvider } from 'antd';

const config = {
    "token": {
        "colorPrimary": "#11b0a0",
        "colorInfo": "#11b0a0",
    }
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <ConfigProvider theme={config}>
            <Layout />
        </ConfigProvider>
    </BrowserRouter>
)
