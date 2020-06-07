import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import * as Permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner';
import firebase from 'firebase';
import db from '../config'
export default class transactionScreen extends React.Component {
  constructor(){
    super();
    this.state={
      hasCameraPermissions:null,
       scanned:false,
        
        buttonState:'normal',
         scanBookId:'',
         scanStudentId:'',
        }

      
  }
  getCameraPermissions = async(id)=>{
    const {status}=await Permissions.askAsync(Permissions.CAMERA)
    this.setState({
      hasCameraPermissions:status==="granted",
      buttonState:id,
      scanned:false
    })
  }
  handleBarcodeScan = async({type,data})=>{
    const {buttonState} = this.state
    if(buttonState==="BOOKID"){
    this.setState({scanned:true,scanBookId:data, buttonState:'normal'})
  }
  else if(buttonState==="STUDENTID"){
    this.setState({
      scanned: true,
      scanStudentId: data,
      buttonState: 'normal'
    });
}
  }
  handleTransaction = (async)=>{
    var transactionmessage = null
    db.collection("BOOKS").doc(this.state.scanBookId).get().then((doc)=>{
      var book = doc.data()
      if(book.bookavailability){
        this.initiatebookissue();
        transactionmessage = "bookissued"

      }
      else{
        this.initiatebookreturn();
        transactionmessage = "bookreturn"
      }
      
    })
    this.setState({transactionmessage:transactionmessage})
  }
  initiatebookissue=async()=>{
    db.collection("transaction").add({
      'studentid':this.state.scanStudentId,
      'bookid':this.state.scanBookId,
      'date':firebase.firestore.Timestamp.now().toDate(),
      'transactiontype':"issue"
    })
    db.collection("BOOKS").doc(this.state.scanBookId).update({
      'bookavailability':false
    })
    db.collection("STUDENTS").doc(this.state.scanStudentId).update({
      'NOofbooksissued':firebase.firestore.FieldValue.increment(1)
    })
    Alert.alert('book issued')
    this.setState({scanStudentId:'',scanBookId:''})
  }
  initiatebookreturn=async()=>{
    db.collection("transaction").add({
      'studentid':this.state.scanStudentId,
      'bookid':this.state.scanBookId,
      'date':firebase.firestore.Timestamp.now().toDate(),
      'transactiontype':"return"
    })
    db.collection("BOOKS").doc(this.state.scanBookId).update({
      'bookavailability':true
    })
    db.collection("STUDENTS").doc(this.state.scanStudentId).update({
      'NOofbooksissued':firebase.firestore.FieldValue.increment(-1)
    })
    Alert.alert('book returned')
    this.setState({scanStudentId:'',scanBookId:''})
  }
    render(){
const hasCameraPermissions=this.state.hasCameraPermissions;
const scanned = this.state.scanned;    
const buttonState = this.state.buttonState;
if(buttonState!=="normal" && hasCameraPermissions){
  return(
    <BarCodeScanner
     onBarCodeScanned={scanned?undefined:this.handleBarcodeScan}
    style = {StyleSheet.absoluteFillObject}/>
    
  )
}
else if(buttonState==="normal"){
return (
    <View style={styles.container}>
      <View>
        <Image 
        source={require('../assets/booklogo.jpg')} 
        style={{width:30,height:45}}/>
        <Text style = {{textAlign:'center',fontSize:20}}>wirlib</Text></View>      
       
       
        <View style={styles.inputView}>
        <TextInput style={styles.inputBox}
        placeholder="BOOKID" value={this.state.scanBookId}/>
         <TouchableOpacity style={styles.scanButton} 
         onPress={()=>{this.getCameraPermissions("BOOKID")}}>  
         <Text style={styles.buttonText}>Scan </Text>
         </TouchableOpacity>
         </View>


         <View style={styles.inputView}>
        <TextInput style={styles.inputBox}
        placeholder="STUDENTID" 
        value={this.state.scanStudentId}/>
         <TouchableOpacity style={styles.scanButton} 
         onPress={()=>{this.getCameraPermissions("STUDENTID")}}>
           <Text style={styles.buttonText}>Scan</Text>
         </TouchableOpacity>
         </View>
       <TouchableOpacity style={styles.submitbutton} onPress={async()=>{var transactionmessage = await this.handleTransaction()}}>
<Text style={styles.subtext}>submit</Text>
       </TouchableOpacity>
    </View>
  );
}
}
}

const styles = StyleSheet.create({container:{
  flex:1,
  justifyContent:'center',
  alignItems:'center'},
displayText:{
  fontSize : 20,
  textDecorationLine:'underline',
},
scanButton:{
  backgroundColor:'red',
  margin:10,
},
buttonText:{
  fontSize:22,
},
inputView:{
flexDirection:'row',
margin:25,
},
inputBox:{
  width:120,
  height:20,
  borderWidth:2,
  fontSize:18,
},
submitbutton:{
  backgroundColor:'green',
  width:50,
  height:35,
},
subtext:{
  textAlign:'center',
  fontSize:16,
  color:'black',
}

})