import React, { createContext, useState } from 'react';

export const InputDataPaLContext = createContext(null)

export const ParentPaLComponent = ({children}) => {

  const [inputFirstNamePaL, setInputFirstNamePaL] = useState('');
  const [inputLastNamePaL, setInputLastNamePaL] = useState('');
  const [inputEmailPaL, setInputEmailPaL] = useState('');
  const [inputParnerNumberDosPaL, setInputParnerNumberDosPaL] = useState('');
  const [selectOptionMembershipNumber, setSelectOptionMembershipNumber] = useState('');
  
  function regexOnlyLetters(str) {
    const regex = /^[a-zA-Z\s]*$/;
    return regex.test(str);
}

  const cleanText = (text) => {
    const replacements = {
      'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
      'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
      'ñ': 'n', 'Ñ': 'N'
    };
  
    return text.split('').map(char => replacements[char] || char).join('');
  };

  const handleInputPartnerNumberDosPaL = (e) => {
    const inputValue = e.target.value;
    if (/^\d*$/.test(inputValue)) {
      setInputParnerNumberDosPaL(inputValue);
    } 
  };

  const handleInputFirstNamePaL = (e) => {
    const texto = e.target.value;
    if(regexOnlyLetters(texto)) {
      //const textCleaned = cleanString(texto);
      const textToSaved = cleanText(texto);
      setInputFirstNamePaL(textToSaved)
    }
  };

  const handleInputLastNamePaL = (e) => {
    const texto = e.target.value;
    if(regexOnlyLetters(texto)) {
      //const textCleaned = cleanString(texto);
      const textToSaved = cleanText(texto);
      setInputLastNamePaL(textToSaved)
    }
  };

  const handleInputEmailPaL = (e) => {
    const inputValue = e.target.value;
    //const textCleaned = cleanString(inputValue);
    const textToSaved = cleanText(inputValue);
    setInputEmailPaL(textToSaved)
  };

  const handleSelectOptionMembershipNumberShL = (e) => {
    setSelectOptionMembershipNumber(e);
  };

  const handleEmptyInputFirstNamePaL = () => {
    setInputFirstNamePaL('')
  };

  const handleEmptyInputLastNamePaL = () => {
    setInputLastNamePaL('')
  };

  const handleEmptyInputPartnerNumberPaL = () => {
    setInputParnerNumberDosPaL('')
  };

  const handleEmptyInputEmailPaL = () => {
    setInputEmailPaL('')
  };
  
  return (
    <InputDataPaLContext.Provider value={{ selectOptionMembershipNumber,inputParnerNumberDosPaL,inputFirstNamePaL, inputLastNamePaL, inputEmailPaL, handleSelectOptionMembershipNumberShL,handleInputFirstNamePaL, handleInputLastNamePaL, handleInputEmailPaL,handleEmptyInputFirstNamePaL,handleEmptyInputLastNamePaL,handleEmptyInputPartnerNumberPaL,handleEmptyInputEmailPaL,handleInputPartnerNumberDosPaL }}>
      {children}
    </InputDataPaLContext.Provider>
  );
}