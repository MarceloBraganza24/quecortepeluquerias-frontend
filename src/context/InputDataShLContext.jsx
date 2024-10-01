import React, { createContext, useState } from 'react';

export const InputDataShLContext = createContext(null)

export const ParentShLComponent = ({children}) => {

  const [inputFirstNameShL, setInputFirstNameShL] = useState('');
  const [inputLastNameShL, setInputLastNameShL] = useState('');
  const [inputEmailShL, setInputEmailShL] = useState('');
  const [inputDateShL, setInputDateShL] = useState(new Date);
  const [selectScheduleOptionShL, setSelectScheduleOptionShL] = useState('');
  const [inputAddScheduleHShL, setInputAddScheduleHShL] = useState('');
  const [inputAddScheduleMShL, setInputAddScheduleMShL] = useState('');
  const [inputOptionServiceShL, setInputOptionServiceShL] = useState('');
  const [selectOptionHairdresserShL, setInputOptionHairdresserShL] = useState('');
  const [selectOptionHeaderHairdresserShL, setInputOptionHeaderHairdresserShL] = useState('');


  //,handleOnBlurInputAddScheduleMShLM,handleOnBlurInputAddScheduleHShLM
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

  function cleanString(input) {
    let trimmed = input.trim();
    let cleaned = trimmed.replace(/\s+/g, ' ');
    return cleaned;
  }

  //const regex = /^[A-Za-zñÑ\s]*$/;

  const handleInputFirstNameShL = (e) => {
    const texto = e.target.value;
    if(regexOnlyLetters(texto)) {
      //const textCleaned = cleanString(texto);
      const textToSaved = cleanText(texto);
      setInputFirstNameShL(textToSaved)
    }
  };

  const handleEmptyInputFirstNameShL = () => {
    setInputFirstNameShL('');
  };

  const handleEmptyInputLastNameShL = () => {
    setInputLastNameShL('');
  };

  const handleEmptyInputEmailShL = () => {
    setInputEmailShL('');
  };
  
  const handleEmptyInputAddScheduleHShL = () => {
    setInputAddScheduleHShL('');
  };

  const handleEmptyInputAddScheduleMShL = () => {
    setInputAddScheduleMShL('');
  };

  const handleInputLastNameShL = (e) => {
    const texto = e.target.value;
    if(regexOnlyLetters(texto)) {
      //const textCleaned = cleanString(texto);
      const textToSaved = cleanText(texto);
      setInputLastNameShL(textToSaved)
    }
  };

  const handleInputEmailShL = (e) => {
    const texto = e.target.value;
    //const textCleaned = cleanString(texto);
    const textToSaved = cleanText(texto);
    setInputEmailShL(textToSaved)
  };

  const handleInputDateShL = (e) => {
    setInputDateShL(e);
  };

  const handleSelectScheduleOptionShL = (e) => {
    setSelectScheduleOptionShL(e);
  };

  
  const handleInputAddScheduleHShL = (e) => {
    const inputValue = e.target.value;
    if (/^\d*$/.test(inputValue)) {
        setInputAddScheduleHShL(inputValue);
    }
  };

  const handleInputAddScheduleMShL = (e) => {
    const inputValue = e.target.value;
    if (/^\d*$/.test(inputValue)) {
        setInputAddScheduleMShL(inputValue);
    }
  };

  const handleInputOptionServiceShL = (e) => {
    setInputOptionServiceShL(e);
  };

  const handleSelectOptionHairdresserShL = (e) => {
    setInputOptionHairdresserShL(e);
  };

  const handleSelectOptionHeaderHairdresserShL = (e) => {
    setInputOptionHeaderHairdresserShL(e);
  };

  const handleOnBlurInputAddScheduleHShLM = (e) => {
      const inputValue = e.target.value;
      if (/^\d*$/.test(inputValue)) {
          if(inputValue.length == 1){
            setInputAddScheduleHShL(`0${inputValue}`);
          } else {
            setInputAddScheduleHShL(inputValue);
          }
      }
  };

  const handleOnBlurInputAddScheduleMShLM = (e) => {
      const inputValue = e.target.value;
      if (/^\d*$/.test(inputValue)) {
          if(inputValue.length == 1){
              setInputAddScheduleMShL(`0${inputValue}`);
          } else {
            setInputAddScheduleMShL(inputValue);
          }
      }
  };

  return (
    <InputDataShLContext.Provider value={{ inputAddScheduleHShL,inputAddScheduleMShL,inputFirstNameShL, inputLastNameShL, inputEmailShL, inputDateShL, selectScheduleOptionShL,inputOptionServiceShL,selectOptionHairdresserShL,selectOptionHeaderHairdresserShL, handleInputFirstNameShL,handleEmptyInputFirstNameShL, handleInputLastNameShL,handleEmptyInputLastNameShL,handleEmptyInputEmailShL, handleInputEmailShL, handleInputDateShL, handleSelectScheduleOptionShL,handleInputOptionServiceShL,handleSelectOptionHairdresserShL,handleSelectOptionHeaderHairdresserShL,handleInputAddScheduleHShL,handleInputAddScheduleMShL,handleEmptyInputAddScheduleHShL,handleEmptyInputAddScheduleMShL,handleOnBlurInputAddScheduleHShLM,handleOnBlurInputAddScheduleMShLM}}>
      {children}
    </InputDataShLContext.Provider>
  );
}