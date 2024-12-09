// src/context/VoucherContext.js
import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types'; // Đảm bảo đã import PropTypes

const VoucherContext = createContext();

export const useVoucher = () => useContext(VoucherContext);

export const VoucherProvider = ({ children }) => {
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  return (
    <VoucherContext.Provider value={{ selectedVoucher, setSelectedVoucher }}>
      {children}
    </VoucherContext.Provider>
  );
};

// Thêm propTypes để kiểm tra prop `children`
VoucherProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
