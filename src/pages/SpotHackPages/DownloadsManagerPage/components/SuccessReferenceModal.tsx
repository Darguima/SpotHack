import React, {useEffect} from 'react';
import {StyleSheet, Modal, View} from 'react-native';

import ReferenceStatusView from './ReferenceStatusView';

interface SuccessReferenceModalProps {
  referenceStatus: 'editing id' | 'not founded' | 'founded' | 'referenced';
  navigationPop: (count?: number | undefined) => void;
}

const SuccessReferenceModal: React.FC<SuccessReferenceModalProps> = ({
  referenceStatus,
  navigationPop,
}) => {
  useEffect(() => {
    if (referenceStatus === 'referenced') {
      setTimeout(() => {
        navigationPop(2);
      }, 1000);
    }
  }, [referenceStatus]);

  return (
    <Modal animationType={'fade'} visible={referenceStatus === 'referenced'}>
      <View style={styles.container}>
        <ReferenceStatusView
          statusText="Playlist Referenced"
          color="#0f0"
          iconName="check-circle"
          containerStyle={styles.referenceStatusView}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',

    width: '100%',
    height: '100%',

    backgroundColor: '#000',
  },

  referenceStatusView: {
    paddingTop: 0,
    borderWidth: 0,
  },
});

export default SuccessReferenceModal;
