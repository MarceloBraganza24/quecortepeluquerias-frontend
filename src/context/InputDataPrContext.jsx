import React, { createContext, useState } from 'react';

export const InputDataPrContext = createContext(null)

export const ParentPrComponent = ({children}) => {

  const [inputBusinessNamePr, setInputBusinessNamePr] = useState('');
  const [inputCuitCuilPr, setInputCuitCuilPr] = useState('');
  const [inputPhonePr, setInputPhonePr] = useState('');
  const [inputEmailPr, setInputEmailPr] = useState('');

  const cleanText = (text) => {
    const replacements = {
      'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
      'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
      'ñ': 'n', 'Ñ': 'N'
    };
  
    return text.split('').map(char => replacements[char] || char).join('');
  };

  const handleInputBusinessNamePr = (e) => {
    const inputValue = e.target.value;
    //const textCleaned = cleanString(inputValue);
    const textToSaved = cleanText(inputValue);
    setInputBusinessNamePr(textToSaved)
  };

  const handleInputCuitCuilPr = (e) => {
    const inputValue = e.target.value;
    if (/^\d*$/.test(inputValue)) {
      setInputCuitCuilPr(inputValue);
    }
  };

  const handleInputPhonePr = (e) => {
    const inputValue = e.target.value;
    if (/^\d*$/.test(inputValue)) {
      setInputPhonePr(inputValue);
    }
  };

  const handleInputEmailPr = (e) => {
    const inputValue = e.target.value;
    //const textCleaned = cleanString(inputValue);
    const textToSaved = cleanText(inputValue);
    setInputEmailPr(textToSaved)
  };
  
  const handleEmptyInputBusinessNamePr = () => {
    setInputBusinessNamePr('');
  };

  const handleEmptyInputCuitCuilPr = () => {
    setInputCuitCuilPr('');
  };

  const handleEmptyInputPhonePr = () => {
    setInputPhonePr('');
  };

  const handleEmptyInputEmailPr = () => {
    setInputEmailPr('');
  };

  return (
    <InputDataPrContext.Provider value={{ inputBusinessNamePr, inputCuitCuilPr, inputPhonePr, inputEmailPr, handleInputBusinessNamePr, handleInputCuitCuilPr, handleInputPhonePr, handleInputEmailPr,handleEmptyInputBusinessNamePr,handleEmptyInputCuitCuilPr,handleEmptyInputPhonePr,handleEmptyInputEmailPr }}>
      {children}
    </InputDataPrContext.Provider>
  );
}