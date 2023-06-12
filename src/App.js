import './App.scss';
import AvatarMain from './components/AvatarMain/AvatarMain';
import InfoBlock from './components/InfoBlock/InfoBlock';
import Profile from './components/Profile/Profile';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Profile>
          <AvatarMain/>
          <InfoBlock/>
        </Profile>
      </header>
    </div>
  );
}

export default App;
