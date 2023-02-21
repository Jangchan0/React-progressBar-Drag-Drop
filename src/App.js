import './App.css';

import DropFileInput from './components/drag-file-input/DropFileInput';


function App() {
  return (
    <div className="box">
      <h2 className="header">
        React Drag files input
      </h2>
      <DropFileInput/>
    </div>
  );
}

export default App;
