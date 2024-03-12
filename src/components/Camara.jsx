import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library'
import { Entypo } from '@expo/vector-icons'
import { Image, ImageBackground } from 'react-native';

const CameraApp = () => {
  const [hasCameraPermissions, setHasCameraPermissions] = useState(null)
  const [image, setImage] = useState(null)
  const cameraRef = useRef(null)
  

  useEffect(() => {
    (async () => {
      MediaLibrary.requestCameraPermissionsAsync()
      const cameraStatus = await Camera.requestCameraPermissionsAsync()
      setHasCameraPermissions(cameraStatus.statatus === 'granted')
    })();
  }, [])

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        setImage(data.uri)
        console.log(data.uri)
      } catch (error) {
        console.log(error)
      }
    }
  }

  // if(hasCameraPermissions === false){
  //   return <View style={styles.errorContainer}><Text style={styles.textErrorMessage}>Debes permitir el acceso a la camara</Text></View>
  // }

  return (
    <View style={{ flex: 1 }}>
      {!image ?
        <Camera style={styles.camera} ref={cameraRef} type={Camera.Constants.Type.front} flashMode={'off'}>
          <Pressable onPress={takePicture} style={styles.buttonContainer}>
            <Entypo name='circle' style={styles.buttonIcon}></Entypo>
          </Pressable>
        </Camera>
        :
        <ImageBackground source={{uri: image}} style={styles.camera}>
          <Pressable style={styles.buttonContainer}>        
            <Entypo name='check' style={styles.buttonIcon}/>
            <Text style={styles.textButton}>Enviar</Text>
          </Pressable>
          <Pressable style={styles.buttonContainer} onPress={() => setImage(null)}>
            <Entypo name='ccw' style={styles.buttonIcon}/>
            <Text style={styles.textButton}>Reintentar</Text>
          </Pressable>
        </ImageBackground>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  camera:{
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  container:{
    flex: 1,
    backgroundColor: '#000'
  },
  image:{
    flex: 1,
    backgroundColor: '#190'
  },
  buttonIcon:{
    fontSize: 40,
    color: '#f1f1f1'
    
  },
  textButton:{
    color: '#f1f1f1',
    fontSize: 15
  },
  buttonContainer:{
    alignItems: 'center',
    marginBottom: 20
  },
  textErrorMessage:{
    color: '#900',
    fontWeight: 'bold',
    // fontSize: '10'
  },
  errorContainer:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default CameraApp;