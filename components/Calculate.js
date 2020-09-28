import React, {PureComponent} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import firestore from "@react-native-firebase/firestore";
import Note from "./Note";
import {SearchBar} from "react-native-elements";

class Calculate extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isSearching: false,
            searchText: '',
            searchResult: [],
            calculatedList: [],
        }
    }

    async componentDidMount(): void {
        await this.getFoods();
    }

    async getFoods() {
        await firestore().collection('foods').onSnapshot(snapshot => {
            const newFoodArray = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                console.log('data', data);
                newFoodArray.push({id: doc.id, name: data.name, cal: data.cal});
            });
            this.setState({searchResult: newFoodArray});
        });

    }

    render() {
        const {calculatedList = [], isSearching, searchText} = this.state;
        let totalCal = 0;
        calculatedList.forEach(value => totalCal = totalCal + value.cal);
        return (
            <View style={styles.container}>
                <View style={styles.searchBar}>
                    <SearchBar
                        placeholder="Search"
                        searchIcon={false}
                        value={this.state.searchText}
                        onFocus={() => this.setState({isSearching: true})}
                        onChangeText={(text => this.setState({searchText: text}))}
                    />
                    {
                        isSearching &&
                        <ScrollView style={styles.searchContainer}>
                            {
                                this.state.searchResult.length === 0
                                    ? <Text>Empty List</Text>
                                    : this.state.searchResult
                                        .filter(result => result.name.toLocaleLowerCase('tr').includes(searchText.toLocaleLowerCase('tr')))
                                        .map(
                                            value =>
                                                <TouchableOpacity
                                                    key={value.id}
                                                    style={styles.searchItem}
                                                    onPress={() => {
                                                        let list = [...calculatedList];
                                                        list.push({
                                                            id: value.id,
                                                            note: value.name,
                                                            cal: value.cal,
                                                        });
                                                        this.setState({
                                                            calculatedList: list,
                                                            isSearching: false,
                                                            searchText: ''
                                                        })
                                                    }}>
                                                    <Text>{`${value.name}`}</Text>
                                                    <Text>{`Cal: ${value.cal}`}</Text>
                                                </TouchableOpacity>
                                        )
                            }
                        </ScrollView>
                    }
                </View>
                <ScrollView style={styles.resultContainer} onTouchStart={() => this.setState({isSearching: false})}>
                    {
                        calculatedList.length !== 0 &&
                        <>
                            {
                                calculatedList.map(
                                    (value, idx) => <Note key={`${value.id}${idx}`} keyVal={`${value.id}${idx}`}
                                                          deleteMethod={() => {
                                                              let list = [...calculatedList];
                                                              list = list.filter((value1, index) => index !== idx);
                                                              this.setState({calculatedList: list});
                                                          }} val={value}/>
                                )
                            }
                        </>
                    }
                </ScrollView>

                <Text style={styles.totalText}>{`Total Cal:${totalCal}`}</Text>
            </View>
        );
    }
}


export default Calculate;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    searchBar: {
        position: 'relative'
    },
    searchContainer: {
        zIndex: 1,
        flex: 1,
        position: 'absolute',
        left: 0,
        right: 0,
        alignSelf: 'center',
        width: '100%',
        marginTop: 65,
        backgroundColor: 'white'
    },
    resultContainer: {
        flex: 3,
        padding: 24
    },
    searchItem: {
        paddingRight: 20,
        paddingLeft: 20,
        paddingBottom: 10,
        paddingTop: 5,
        left: 0,
        right: 0,
        width: '100%',
        flex: 1,
        padding: 4,
        borderBottomColor: "black",
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    totalText: {
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    }
});
