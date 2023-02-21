import './App.css';

import DropFileInput from './components/drag-file-input/DropFileInput';


function App() {

  const onFileChange = (files) => {
    console.log(files)
  }

  return (
    <div className="box">
      <h2 className="header">
        React Drag files input
      </h2>
      <DropFileInput 
        onFileChange={(files)=> onFileChange(files)}
      />
    </div>
  );
}

export default App;
