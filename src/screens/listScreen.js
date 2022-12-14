import { Button, Keyboard, Pressable, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, } from 'react-native'

import AddItem from "../components/addItem"
import Card from '../components/card';
import Lista from "../components/lista"
import ListaCompleta from "../components/completList";
import Modal from "../components/modal"
import React from 'react'
import { TASKLIST } from '../data/tasklist';
import { TASKS } from "../data/tasks"
import colors from '../constants/colors';
import { useState } from "react";

const ListScreen = ({ navigation, route }) => {
    const totalList = TASKS.filter((task) => task.tasklist === route.params.listID)
    const listSelected = TASKLIST.filter(taskList => taskList.id === route.params.listID)
    const listpending = totalList.filter(task => task.estado === 'pending')
    const listcomplete = totalList.filter(task => task.estado === 'complete')
    const [textItem, setTextItem] = useState('')
    const [list, setList] = useState([...listpending])
    const [subList, setSubList] = useState([...listcomplete])

    const [completList, setCompletList] = useState()

    const [modalVisible, setModalVisible] = useState(false)

    const [itemSelected, setItemSelected] = useState ({})

    const onHandleChange = (t) => {setTextItem(t)}

    const addItem = () => {
        setList((currentState) => [
        ...currentState,
        { id: Math.random().toString(), taskList: route.params.listID, name: textItem, estado: 'pending' },
        ])
        setTextItem('')
    }

    const completItem = (id, value) => {
        setSubList((currentState) => [
            ...currentState, {id: id, taskList: route.params.listID, name: value, estado: 'complete'},
        ])
        setList((currentState) =>
        currentState.filter((item) => item.id !== id)
    )
    }

    const selectedItem = (id) => {
        setItemSelected(list.filter((item) => item.id === id)[0])
        setModalVisible(true)
    }

    const deleteItem = () => {
        setList((currentState) =>
        currentState.filter((item) => item.id !== itemSelected.id)
        )
        setItemSelected({})
        setModalVisible(false)
    }

    const hideModal = () => {
        setModalVisible(false)
    }

    const saveChanges = () => {
        setCompletList({id: Math.random().toString(), namelist: listSelected.name, itemsPending: list, itemsComplet: subList})
        navigation.navigate('Bienvenida')
    }

    const renderItem = ({item}) => (
        <View style={styles.lista}>
            <View style={{width: '70%',}}>
                <Text style={styles.subtitulo}>{item.name}</Text>
            </View>
            <View style={{flexDirection: 'row',}}>
                <TouchableOpacity style={styles.buttoncheck} onPress={() => completItem(item.id, item.name)}>
                    <Text style={{color:"white"}}>Lista</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonlista} onPress={() => selectedItem(item.id)}>
                    <Text style={{color:"white"}}>X</Text>
                </TouchableOpacity>
            </View>
        </View>
    )

    const renderOldItem = ({item}) => (
        <View style={styles.sublista}>
            <Text style={styles.subtitulo}>{item.name}</Text>
        </View>
    )

return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <Text style={styles.midTitulo}>Crear Tareas</Text>
                <Text style={styles.subtitulo}>Agrega aqui tus tareas pendientes para hoy</Text>
                <AddItem textItem={textItem} onHandleChange={onHandleChange} addItem={addItem}/>
                <Lista list={list} renderItem={renderItem}/>
                <Modal isVisible={modalVisible} actionDeleteItem={deleteItem} actionHideModal={hideModal}/>
            </View>
            <View style={styles.subListContainer}>
                <Text style={styles.subtitulo}>Estas son las tareas completadas:</Text>
                <ListaCompleta subList={subList} renderOldItem={renderOldItem}/>
            </View>
            <View style={styles.bottomContainer}>
                <Card newStyles={{marginBottom: 100, padding: 10,}}>
                    <Text style={styles.subtitulo}>Para guardar los cambios haz click en Actualizar</Text>
                    <Pressable style={styles.saveButton} onPress={saveChanges}>
                        <Text>Actualizar</Text>
                    </Pressable>
                </Card>
            </View>
        </View>
    </TouchableWithoutFeedback>
    
)}

export default ListScreen

const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    subContainer: {
        marginBottom: 200,
        flex: 1,
        alignItems: "center",
        paddingTop: 10,
        marginTop: 5,
    },
    subListContainer: {
        marginBottom: 20,
        flex: 1,
        alignItems: "center",
        paddingTop: 10,
        marginTop: 5,
    },
    bottomContainer: {
        marginBottom: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titulo:{
        fontSize: 30,
        fontWeight: "700",
        color: colors.primary,
        marginTop: 20,
        marginLeft: 20,
    },
    midTitulo:{
        fontSize: 27,
        fontWeight: "700",
        marginBottom: 15,
        color: colors.primary,
    },
    subtitulo: {
        fontSize: 15,
        width: "80%",
    },
    whitesubtitle: {
        fontSize: 15,
        width: "80%",
        color: "white",
    },
    lista:{
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        width:"90%",
        marginTop: 10,
        marginHorizontal: 20,
        borderRadius: 5,
        backgroundColor: "rgba(0,0,0,0.05)",
        padding: 5,
    },
    sublista:{
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        width:"90%",
        marginTop: 10,
        marginHorizontal: 20,
        borderRadius: 5,
        backgroundColor: colors.light,
        padding: 5,
    },
    buttonlista:{
        backgroundColor: colors.danger,
        height: 25,
        width: 27,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
    },
    buttoncheck:{
        backgroundColor: colors.confirm,
        height: 25,
        width: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
        marginRight: 10,
    },
    saveButton: {
        backgroundColor: colors.confirm,
        height: 35,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 10,
    },
})