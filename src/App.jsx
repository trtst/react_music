import Sidebar from '@components/sidebar';
import Header from '@components/header';
import Login from '@components/login';
import PlayBar from '@components/playbar';
import Routers from '@router';

function App() {
    return (
        <div className='layout'>
            <Sidebar></Sidebar>
            <div className="main">
                <Header></Header>
                <div className="container">
                    <Routers></Routers>
                </div>
            </div>
            <Login />
            <PlayBar />
        </div>
    )
}

export default App;
