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
  const [progress, setProgress] = useState(0)
  const [faceMessage, setFaceMessage] = useState("Colocate en la pantalla");

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
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        setImage(data.uri)
        console.log(progress)
        console.log(data.uri)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleFaceDetected = ({ faces }) => {
    if (faces.length === 1) {
      setDetectedFaces(faces)
      if(faces[0].bounds.size.height < 150 || faces[0].bounds.size.width < 150){
        console.log('Acerca más tu cara');
        setFaceMessage("Acerca más tu cara");
      } else if(faces[0].bounds.size.height > 210 || faces[0].bounds.size.height > 210) {
        console.log('Aleja más tu cara');
        setFaceMessage("Aleja más tu cara");
      } else if(faces[0].bounds.origin.x < 100 || faces[0].bounds.origin.x > 150) {
        console.log('Pon tu cara dentro del óvalo (centra tu cara horizontalmente)');
        setFaceMessage("Pon tu cara dentro del óvalo (centra tu cara horizontalmente)");
      } else if(faces[0].bounds.origin.y < 120) {
        console.log('Baja tu cara');
        setFaceMessage("Baja tu cara");
      } else if(faces[0].bounds.origin.y > 250) {
        console.log('Sube tu cara');
        setFaceMessage("Sube tu cara");
      } else {
        console.log('Todo está correcto');
        setFaceMessage("Todo esta correcto");
        // takePicture();
      }
    } else if(faces.length > 1){
      console.log('Faces detected: ' + faces.length + ', Asegúrate de aparecer solo tú en la pantalla');
      setFaceMessage("Faces detected: " + faces.length + ", Asegúrate de aparecer solo tú en la pantalla");
    } else {
      console.log('No faces detected, Pon tu cara en la pantalla');
      setFaceMessage("No faces detected, Pon tu cara en la pantalla");
    }
  }

  const renderFaceBoxes = () =>{
    return detectedFaces.map((face, index) => (
      <View key={index} style={[styles.faceBox, {left: face.bounds.origin.x, top: face.bounds.origin.y, width: face.bounds.size.width, height: face.bounds.size.height}]}></View>
    ))
  }

  if(hasCameraPermissions === false){
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.textErrorMessage}>Debes permitir el acceso a la camara</Text>
        <Pressable onPress={permissionsFunction}><Text style={styles.textErrorMessage}>Permitir Acceso</Text></Pressable>
        <Text>Para poder utilizar todas las funciones de nuestra aplicación, necesitamos acceso a la cámara. Por favor, habilita los permisos de la cámara desde la configuración de tu dispositivo:</Text>
          <Text>1 - Abre la aplicación de Configuración en tu dispositivo.</Text>
          <Text>2 - Busca y selecciona 'Aplicaciones' o 'Administrador de aplicaciones'.</Text>
          <Text>3 - Encuentra nuestra aplicación en la lista y selecciónala.</Text>
          <Text>4 - Dentro de la configuración de la aplicación, busca la sección de permisos.</Text>
          <Text>5 - Habilita los permisos de la cámara.</Text>
          <Text>Una vez que hayas habilitado los permisos de la cámara, podrás disfrutar de todas las funciones de nuestra aplicación.</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {!image ?
        <View style={styles.cameraContainer}>
          {/* {faceMessage !== "Todo esta correcto" && (<Text style={styles.faceMessage}>{faceMessage}</Text>)}
          {faceMessage === "Todo esta correcto" && (<Text style={styles.faceMessageSuccess}>{faceMessage}</Text>)} */}

          {faceMessage === "Todo esta correcto" ? (<Text style={styles.faceMessageSuccess}>{faceMessage}</Text>) :(<Text style={styles.faceMessage}>{faceMessage}</Text>)}
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
              {/* <View style={styles.filtro}>
              </View> */}
              <OvalProgressIndicator style={styles.container} propProgress={progress}/> 
            </Camera>
            <Pressable onPress={takePicture} style={[styles.buttonContainer]}>
              <Entypo name='circle' style={styles.buttonIcon}></Entypo>
            </Pressable>
        </View>
        :
        <ImageBackground source={{uri: image}} style={styles.imageBackground}>
          <Pressable style={styles.buttonContainer} onPress={() => {setImage(null); setProgress(progress + 0.1)}}>        
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
  container:{ 
    flex: 1 , 
    paddingTop: Constants.statusBarHeight, 
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
  },
  faceMessage:{
    position: 'absolute',
    backgroundColor: '#900',
    color: '#fff',
    padding: 10,
    top: 40,
    alignSelf: 'center',
    borderRadius: 5
  },
  faceMessageSuccess:{
    position: 'absolute',
    backgroundColor: '#090',
    color: '#fff',
    padding: 10,
    top: 40,
    alignSelf: 'center',
    borderRadius: 5
  }
})

export default CameraApp;