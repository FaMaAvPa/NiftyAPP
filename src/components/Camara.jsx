import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, ImageBackground } from 'react-native';
import Svg, { Ellipse } from 'react-native-svg';
import Constants from 'expo-constants';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library'
import * as FaceDetector from 'expo-face-detector'
import { Entypo } from '@expo/vector-icons'
import CircularProgress from 'react-native-circular-progress-indicator';

const CameraApp = () => {
  const [hasCameraPermissions, setHasCameraPermissions] = useState(null)
  const [image, setImage] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.front)
  const [flash, setflash] = useState(Camera.Constants.FlashMode.off)
  const cameraRef = useRef(null)
  
  const [detectedFaces, setDetectedFaces] = useState([])

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
  //   return <View style={styles.errorContainer}><Text style={styles.textErrorMessage}>Debes permitir el acceso a la camara</Text></View>
  // }

  return (
    <View style={styles.container}>
      {!image ?
      <View style={styles.cameraContainer}>
          <Camera 
            style={styles.camera} 
            ref={cameraRef} 
            type={type} 
            flashMode={flash}
            onFacesDetected={handleFaceDetected}
            faceDetectorSettings={{
              mode: FaceDetector.FaceDetectorMode.accurate,
              detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
              runClassifications: FaceDetector.FaceDetectorClassifications.all,
              minDetectionInterval: 100,
              tracking: true
            }}>
              {renderFaceBoxes()}
            <View style={styles.rombo}>
              {/* <Svg height={'100%'} width={'100%'} >
                <Ellipse cx="50%" cy="50%" rx="80" ry="100" fill="transparent" stroke="black" strokeWidth="4" style={styles.elipse}></Ellipse>
              </Svg> */}
            <CircularProgress
              value={0}
              radius={120}
              duration={2000}
              progressValueColor={'#ecf0f1'}
              maxValue={10}
              strokeLinecap='square'
              style={styles.progress}
              width={100}
            />
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
  progress:{
    height: 100,
    width: 200
  },
  elipse:{
    backgroundColor: 'rgba(256, 256, 256, 0.0)',
  },
  container:{ 
    flex: 1 , 
    paddingTop: Constants.statusBarHeight, 
    backgroundColor: '#000'
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
  rombo:{
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