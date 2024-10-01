import React, { createContext, useState } from 'react';

export const PricesContext = createContext(null)

export const PricesParentComponent = ({children}) => {

  const [inputCreatePriceOf, setInputCreatePriceOf] = useState('');
  const [inputCreateValuePriceOf, setInputCreateValuePriceOf] = useState('');
  const [inputCreateCategory, setInputCreateCategory] = useState('');
  const [partnersPrices, setPartnersPrices] = useState([]);
  const [prices, setPrices] = useState([]);
  
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

  const handleInputCreatePriceOf = (e) => {
    const texto = e.target.value;
    //const textCleaned = cleanString(texto);
    const textToSaved = cleanText(texto);
    setInputCreatePriceOf(textToSaved)
  };

  const handleInputCreateValuePriceOf = (e) => {
    const inputValue = e.target.value;
    if (/^\d*$/.test(inputValue)) {
        setInputCreateValuePriceOf(inputValue);
    }
  };

  const handleInputCreateCategory = (e) => {
    setInputCreateCategory(e);
  };

  const handleEmptyInputCreatePriceOf = () => {
    setInputCreatePriceOf('');
  };

  const handleEmptyInputCreateValuePriceOf = () => {
    setInputCreateValuePriceOf('');
  };

  const handlePartnersPrices = (service) => {
    setPartnersPrices(service);
  };

  const handlePrices = (service) => {
    setPrices(service);
  };
  
  return (
    <PricesContext.Provider value={{inputCreatePriceOf,inputCreateValuePriceOf,inputCreateCategory,partnersPrices,prices,handleInputCreatePriceOf,handleInputCreateValuePriceOf,handleInputCreateCategory,handlePartnersPrices,handlePrices,handleEmptyInputCreatePriceOf,handleEmptyInputCreateValuePriceOf}}>
      {children}
    </PricesContext.Provider>
  );
}