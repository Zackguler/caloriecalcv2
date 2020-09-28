import * as React from 'react';
import {Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity} from 'react-native';
import Note from './Note';

import firestore from '@react-native-firebase/firestore';

export default class Save extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            noteArray: [],
            noteText: '',
        }
    }

    async componentDidMount(): void {
        await this.getNotes();
    }

    async getNotes() {
        await firestore().collection('eat').onSnapshot(snapshot => {
            const newNoteArray = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                newNoteArray.push({id: doc.id, note: data.note, date: data.date});
            });
            this.setState({noteArray: newNoteArray});
        });

    }

    render() {
        let notes = this.state.noteArray.map((val, key) => {
            return <Note key={key} keyval={key} val={val}
                         deleteMethod={async () => await this.deleteNote(val.id)}/>
        });
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Calorie Calculator</Text>
                </View>
                <ScrollView style={styles.scrollContainer}>
                    {notes}
                </ScrollView>
                <View style={styles.textInput}>
                    <TextInput
                        onChangeText={(noteText) => this.setState({noteText})}
                        value={this.state.noteText}
                        placeholder='Write'
                        placeholderTextColor='white'>

                    </TextInput>
                </View>
                <TouchableOpacity onPress={this.addNote.bind(this)} style={styles.addButton}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>
        );
    }

    async addNote() {
        if (this.state.noteText) {
            let collection = firestore().collection('eat');
            var d = new Date();
            let newNote = {
                'date': `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`,
                'note': this.state.noteText
            };

            await collection.add(newNote);
            await this.getNotes();
            this.setState({noteText: ''})
        }
    }

    async deleteNote(key) {
        await firestore().collection('eat').doc(key).delete();
        await this.getNotes();
    }
}
const styles = StyleSheet.create({
    container: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        backgroundColor: '#FFD700',
        alignItems: 'stretch',
        borderBottomWidth: 10,
        borderBottomColor: '#ddd',
        height: 100
    },
    headerText: {
        color: 'black',
        fontSize: 20,
        padding: 26,
        marginTop: 30,

    },
    scrollContainer: {
        flex: 1,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 20,
    },
    textInput: {
        alignSelf: 'stretch',
        color: '#fff',
        backgroundColor: '#252525',
        borderTopWidth: 2,
        borderTopColor: '#ededed',
    },
    addButton: {
        position: 'absolute',
        zIndex: 11,
        right: 20,
        bottom: 90,
        backgroundColor: '#FFD700',
        width: 60,
        height: 60,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 24,
    },
});
