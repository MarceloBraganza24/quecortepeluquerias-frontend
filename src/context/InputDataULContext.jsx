import React, { createContext, useState } from 'react';

export const InputDataULContext = createContext(null)

export const ParentULComponent = ({children}) => {

  const [inputFirstNameUL, setInputFirstNameUL] = useState('');
  const [inputLastNameUL, setInputLastNameUL] = useState('');
  const [inputEmailUL, setInputEmailUL] = useState('');
  const [inputPasswordUL, setInputPasswordUL] = useState('');

  const cleanText = (text) => {
    const replacements = {
      'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
      'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
      'ñ': 'n', 'Ñ': 'N'
    };
  
    return text.split('').map(char => replacements[char] || char).join('');
  };

  function regexOnlyLetters(str) {
    const regex = /^[a-zA-Z\s]*$/;
    return regex.test(str);
  }

    const handleInputFirstNameUL = (e) => {
        const texto = e.target.value;
        if(regexOnlyLetters(texto)) {
          //const textCleaned = cleanString(texto);
          const textToSaved = cleanText(texto);
          setInputFirstNameUL(textToSaved)
        }   
    };

    const handleInputLastNameUL = (e) => {
        const texto = e.target.value;
        if(regexOnlyLetters(texto)) {
          //const textCleaned = cleanString(texto);
          const textToSaved = cleanText(texto);
          setInputLastNameUL(textToSaved)
        }   
    };
  
    const handleInputPasswordUL = (e) => {
      const inputValue = e.target.value;
      setInputPasswordUL(inputValue);
    };

    const handleInputEmailUL = (e) => {
        const inputValue = e.target.value;
        //const textCleaned = cleanString(inputValue);
        const textToSaved = cleanText(inputValue);
        setInputEmailUL(textToSaved)
    };

    const handleEmptyInputFirstNameUL = () => {
        setInputFirstNameUL('');
    };

    const handleEmptyInputLastNameUL = () => {
        setInputLastNameUL('');
    };
  
    const handleEmptyInputPasswordUL = () => {
      setInputPasswordUL('');
    };

    const handleEmptyInputEmailUL = () => {
        setInputEmailUL('');
    };

  return (
    <InputDataULContext.Provider value={{ inputFirstNameUL, inputLastNameUL, inputPasswordUL, inputEmailUL, handleInputFirstNameUL, handleInputLastNameUL, handleInputPasswordUL, handleInputEmailUL,handleEmptyInputFirstNameUL,handleEmptyInputLastNameUL,handleEmptyInputPasswordUL,handleEmptyInputEmailUL }}>
      {children}
    </InputDataULContext.Provider>
  );
}