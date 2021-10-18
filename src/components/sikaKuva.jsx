import ladybug from '../assets/ladybug.png' // FAKE
// OPSEC import sikaKuva from '../assets/sikaKuva.png'

// OPSEC const SikaKuva = ({handleClick}) => <img onClick={handleClick} src={sikaKuva} id='sika-img' alt='Sian kuva'/>
const SikaKuva = ({handleClick}) => <img onClick={handleClick} src={ladybug} id='sika-img' alt='Sian kuva'/> // FAKE

export {SikaKuva}