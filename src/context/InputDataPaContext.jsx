import React, { createContext, useState } from 'react';

export const InputDataPaContext = createContext(null)

export const ParentPaComponent = ({children}) => {

  const [inputFirstNamePa, setInputFirstNamePa] = useState('');
  const [inputLastNamePa, setInputLastNamePa] = useState('');
  const [inputPhonePa, setInputPhonePa] = useState('');
  const [inputEmailPa, setInputEmailPa] = useState('');

  function regexOnlyLetters(str) {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$/;
    return regex.test(str); 
  } 

  function cleanString(input) {
    let trimmed = input.trim();
    let cleaned = trimmed.replace(/\s+/g, ' ');
    return cleaned;
  }

  const handleInputFirstNamePa = (e) => {
    const texto = e.target.value;
    if(regexOnlyLetters(texto)) {
      //const textCleaned = cleanString(texto);
      const textToSaved = cleanText(texto);
      setInputFirstNamePa(textToSaved)
    }
  };

  const handleInputLastNamePa = (e) => {
    const texto = e.target.value;
    if(regexOnlyLetters(texto)) {
      //const textCleaned = cleanString(texto);
      const textToSaved = cleanText(texto);
      setInputLastNamePa(textToSaved)
    }
  };

  const handleInputPhonePa = (e) => {
    const inputValue = e.target.value;
    if (/^\d*$/.test(inputValue)) {
      setInputPhonePa(cleanString(inputValue));
    }
  };

  const handleInputEmailPa = (e) => {
    const inputValue = e.target.value;
    //const textCleaned = cleanString(inputValue);
    const textToSaved = cleanText(inputValue);
    setInputEmailPa(textToSaved)
  };

  return (
    <InputDataPaContext.Provider value={{ inputFirstNamePa, inputLastNamePa, inputPhonePa, inputEmailPa, handleInputFirstNamePa, handleInputLastNamePa, handleInputPhonePa, handleInputEmailPa }}>
      {children}
    </InputDataPaContext.Provider>
  );
}