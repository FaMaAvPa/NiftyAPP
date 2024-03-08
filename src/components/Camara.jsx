import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, Modal, Button, Image } from 'react-native';
import { RNCamera } from 'react-native-camera';
import ImagePicker from 'react-native-image-picker';

const CameraApp = () => {
  const cameraRef = useRef(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const takePicture = async () => {
    if (cameraRef) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      setPhotoUri(data.uri);
      setModalVisible(true); // Mostrar el modal después de tomar la foto
    }
  };

  const chooseImage = () => {
    ImagePicker.launchImageLibrary({}, (response) => {
      if (response.uri) {
        setPhotoUri(response.uri);
        setModalVisible(true); // Mostrar el modal después de seleccionar una imagen
      }
    });
  };

  const closeModal = () => {
    setModalVisible(false);
    setPhotoUri(null); // Limpiar la URI de la foto
  };

  return (
    <View style={{ flex: 1 }}>
      <RNCamera
        ref={cameraRef}
        style={{ flex: 1 }}
        type={RNCamera.Constants.Type.front}
        captureAudio={false}
      />
      <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
        <TouchableOpacity onPress={takePicture}>
          <Text style={{ fontSize: 20, marginBottom: 10, color: 'white' }}>Capturar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={chooseImage}>
          <Text style={{ fontSize: 20, marginBottom: 10, color: 'white' }}>Seleccionar imagen</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {photoUri && <Image source={{ uri: photoUri }} style={{ width: 200, height: 200 }} />}
          <Button title="Guardar" onPress={closeModal} />
          <Button title="Intentar de nuevo" onPress={closeModal} />
        </View>
      </Modal>
    </View>
  );
};

export default CameraApp;