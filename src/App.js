const { SikaKuva } = require('./assets/sikaKuva.png')

function App() {
  console.log(`Sikakuva = ${SikaKuva}`)
  return (
    <div className="App">
      <p>Sikapeli 2021!!!</p>
      <SikaKuva/>
    </div>
  );
}

export default App;
