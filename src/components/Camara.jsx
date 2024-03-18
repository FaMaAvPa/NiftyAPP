import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, ImageBackground } from 'react-native';
import Constants from 'expo-constants';
import { Camera} from 'expo-camera';
import * as FaceDetector from 'expo-face-detector'
import { Entypo } from '@expo/vector-icons'

import OvalProgressIndicator  from './OvalProgressIndicator';


const CameraApp = () => {
  const [hasCameraPermissions, setHasCameraPermissions] = useState(null)
  const [image, setImage] = useState(null)
  const cameraRef = useRef(null)
  
  const [detectedFaces, setDetectedFaces] = useState([])

  const [progress, setProgress] = useState(0.5)

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync()
      console.log(cameraStatus.status)
      setHasCameraPermissions(cameraStatus.status === 'granted')
    })();
  }, [])
  
  const permissionsFunction = async () => {
    console.log('boton apretado')
    const cameraStatus = await Camera.requestCameraPermissionsAsync();
    console.log(cameraStatus.status)
    setHasCameraPermissions(cameraStatus.status === 'granted');
  };

  const takePicture = async () => {
    // if (cameraRef) {
    //   try {
    //     const data = await cameraRef.current.takePictureAsync();
    //     setImage(data.uri)
        setProgress(progress + 0.1)
        console.log(progress)
    //     console.log(data.uri)
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
  }

  const handleFaceDetected = ({ faces }) => {
    if (faces.length > 0) {
      console.log('Faces detected: '+ faces.length)
      setDetectedFaces(faces)
    } else {
      console.log('No faces detected')
    }
  }

  const renderFaceBoxes = () =>{
    return detectedFaces.map((face, index) => (
      <View key={index} style={[styles.faceBox, {left: face.bounds.origin.x, top: face.bounds.origin.y, width: face.bounds.size.width, height: face.bounds.size.height}]}></View>
    ))
  }

  // if(hasCameraPermissions === false){
  //   return (
  //     <View style={styles.errorContainer}>
  //       <Text style={styles.textErrorMessage}>Debes permitir el acceso a la camara</Text>
  //       <Pressable onPress={permissionsFunction}><Text style={styles.textErrorMessage}>Permitir Acceso</Text></Pressable>
  //       <Text>Para poder utilizar todas las funciones de nuestra aplicación, necesitamos acceso a la cámara. Por favor, habilita los permisos de la cámara desde la configuración de tu dispositivo:</Text>
  //         <Text>1 - Abre la aplicación de Configuración en tu dispositivo.</Text>
  //         <Text>2 - Busca y selecciona 'Aplicaciones' o 'Administrador de aplicaciones'.</Text>
  //         <Text>3 - Encuentra nuestra aplicación en la lista y selecciónala.</Text>
  //         <Text>4 - Dentro de la configuración de la aplicación, busca la sección de permisos.</Text>
  //         <Text>5 - Habilita los permisos de la cámara.</Text>
  //         <Text>Una vez que hayas habilitado los permisos de la cámara, podrás disfrutar de todas las funciones de nuestra aplicación.</Text>
  //     </View>
  //   )
  // }

  return (
    <View style={styles.container}>
      {!image ?
      <View style={styles.cameraContainer}>
          <Camera 
            style={styles.camera} 
            ref={cameraRef} 
            type={Camera.Constants.Type.front} 
            flashMode={Camera.Constants.FlashMode.off}
            onFacesDetected={handleFaceDetected}
            faceDetectorSettings={{
              mode: FaceDetector.FaceDetectorMode.accurate,
              detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
              runClassifications: FaceDetector.FaceDetectorClassifications.all,
              minDetectionInterval: 100,
              tracking: true
            }}>
              {renderFaceBoxes()}
            <View style={styles.filtro}>
              <OvalProgressIndicator propProgress={progress} style={styles.container}/> 
            </View>
          </Camera>
          <Pressable onPress={takePicture} style={[styles.buttonContainer]}>
            <Entypo name='circle' style={styles.buttonIcon}></Entypo>
          </Pressable>
      </View>
        :
        <ImageBackground source={{uri: image}} style={styles.imageBackground}>
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
  elipse:{
    backgroundColor: 'rgba(256, 256, 256, 0.0)',
  },
  container:{ 
    flex: 1 , 
    paddingTop: Constants.statusBarHeight, 
    // backgroundColor: '#000'
  },
  imageBackground:{
    flex: 1,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  cameraContainer:{
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#f1f1f1'
  },
  camera:{
    backgroundColor: '#f1f',
    flex: 1,
    marginVertical: 100
  },
  filtro:{
    backgroundColor: 'rgba(256, 256, 256, 0.8)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  faceBox:{
    position: 'absolute',
    borderColor: '#090',
    borderWidth: 2,
    borderRadius: 5
  },
  image:{
    flex: 1,
    backgroundColor: '#190'
  },
  buttonIcon:{
    fontSize: 40,
    color: '#000'
    
  },
  textButton:{
    color: '#f1f1f1',
    fontSize: 15
  },
  buttonContainer:{
    alignItems: 'center',
    marginBottom: 60
  },
  buttonsTopContainer:{
    flexDirection: 'row',
    justifyContent : 'space-around'
  },
  textErrorMessage:{
    color: '#900',
    fontWeight: 'bold',
    // fontSize: '40'
  },
  errorContainer:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default CameraApp;