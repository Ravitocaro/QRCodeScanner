import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase({
  name: 'MainDB',
  location: 'default'
},
() => { },
error => { console.log(error) }
);

export default function App() {






  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Pas encore scanner'); 

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })()
  }

  // Demande de la caméra 
  useEffect( () => {
    askForCameraPermission();

  }, []);

  // Ce qui se passe quand on scann 
  const handleBarCodeScanned = ({type, data}) => {
    setScanned(true);
    setText(data);
    console.log('Type: ' + type + '\nData: ' + data);
  }

  // Check des permissions 
  if (hasPermission === null){
    return(
      <View style={styles.container}>
        <Text>Il faut accepter la permissions d'utiliser la caméra ! </Text>
      </View>
    )
  }

  // Si les accès à la caméra sont interdits
  if (hasPermission === false){
    return(
      <View style={styles.container}>
        <Text style={{margin: 10}}>Aucun accès à la caméra! </Text>
        <Button title={'Autoriser la caméra'} onPress={() => askForCameraPermission}/>
      </View>
    )
  }


  // Vue principale 
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='white'/>
      <View style={styles.barcodebox}> 
      <BarCodeScanner
      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      style={{height: 400, width:400}} />
      </View>
      <Text style={styles.maintext}>{text}</Text>

      {scanned && <Button title={'Re-scanner ?'} onPress={() => setScanned(false)} color='tomato'/>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center', 
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 50,
    backgroundColor: 'tomato',
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  }
});
