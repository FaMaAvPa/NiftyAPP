import React from "react";
import { Text, View, TextInput, StyleSheet, Button, Linking } from "react-native"; 

var usuario;
var contraseña;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    textos: {
        color: 'white',
        margin: 10
    },
    inputs: {
        borderWidth: 2,
        borderColor: '#0FFF50',
        width: 200,
        paddingHorizontal: 5,
        margin: 10,
        color: 'white',
        borderRadius: 10
    },
    espacioBlanco: {
        marginVertical: 25
    }
})

const Login = () => {
    return(

        <View style={styles.container}>
            <Text style={styles.textos}>Usuario</Text>
            <TextInput style={styles.inputs} placeholder="Usuario" id="inputUsuario"></TextInput>
            <Text style={styles.espacioBlanco}></Text>
            <Text style={styles.textos}>Contraseña</Text>
            <TextInput style={styles.inputs} placeholder="Contraseña" id="inputContraseña"></TextInput>
            <Text style={styles.espacioBlanco}></Text>
            <Text style={styles.espacioBlanco}></Text>
            <Button color="#00D2A5" 
            title="Iniciar Sesión"
            />
        </View>
    )
}

export default Login
