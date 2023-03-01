import "./App.css";

import DropFileInput from "./components/drag-file-input/DropFileInput";

function App() {
  const DragDrop = (files) => {
    console.log(files);
  };
  const selectFiles = (files) => {
    console.log(files);
  };

  return (
    <div className="box">
      <h2 className="header">React Drag files input</h2>
      <DropFileInput
        DragDrop={(files) => DragDrop(files)}
        selectFiles={(files) => selectFiles(files)}
      />
    </div>
  );
}

export default App;
