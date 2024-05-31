import React from 'react';
import CustomHeader from './CustomHeader';

const TabScreenHeader = ({ title, navigation }) => {
  return (
    <>
      <CustomHeader title={title} navigation={navigation} />
    </>
  );
};

export default TabScreenHeader;