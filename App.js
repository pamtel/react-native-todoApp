/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ICON from 'react-native-vector-icons/MaterialIcons';
const COLORS = {primary: '#1f145c', white: '#fff'};

const App = () => {
  const [todos, setTodos] = useState([]);
  const [textInput, setTextInput] = useState('');

  useEffect(() => {
    saveTodoToUserDevice(todos);
  }, [todos]);

  useEffect(() => {
    getTodosFromUserDevice();
  }, []);

  const addTodo = () => {
    if (textInput === '') {
      Alert.alert('Error', 'Please add a todo');
    } else {
      const newTodo = {
        id: Math.random(),
        task: textInput,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setTextInput('');
    }
  };

  const saveTodoToUserDevice = async todos => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem('todos', stringifyTodos);
    } catch (e) {
      console.log('save', e);
    }
  };

  const getTodosFromUserDevice = async () => {
    try {
      const todos = await AsyncStorage.getItem('todos');
      if (todos != null) {
        setTodos(JSON.parse(todos));
      }
    } catch (error) {
      console.log('get', error);
    }
  };

  const markTodoComplete = todoId => {
    console.log(todoId);
    const newTodos = todos.map(item => {
      if (item.id === todoId) {
        return {...item, completed: true};
      }
      return item;
    });
    setTodos(newTodos);
  };

  const deleteTodo = todoId => {
    const newTodos = todos.filter(item => item.id !== todoId);
    setTodos(newTodos);
  };

  const clearTodo = () => {
    if (todos.length < 1) {
      Alert.alert('Noting to clear');
    } else {
      Alert.alert('confirm', 'Are you sure you want to delete', [
        {
          text: 'Yes',
          onPress: () => setTodos([]),
        },
        {text: 'No'},
      ]);
    }
  };

  const ListItem = ({todo}) => {
    return (
      <View style={styles.listItem}>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              textDecorationLine: todo.completed ? 'line-through' : 'none',
            }}>
            {todo?.task}
          </Text>
        </View>
        {!todo.completed && (
          <TouchableOpacity style={[styles.actionIcon]}>
            <ICON
              name="done"
              size={20}
              color={COLORS.white}
              onPress={() => markTodoComplete(todo.id)}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.actionIcon, {backgroundColor: 'red'}]}>
          <ICON
            name="delete"
            size={20}
            color={COLORS.white}
            onPress={() => deleteTodo(todo.id)}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <View style={styles.header}>
        <Text style={{fontWeight: 'bold', fontSize: 20, color: COLORS.primary}}>
          TODO APP
        </Text>
        <ICON name="delete" size={25} color="red" onPress={clearTodo} />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 20, paddingBottom: 100}}
        data={todos}
        renderItem={({item}) => <ListItem todo={item} />}
      />
      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Add Todo"
            value={textInput}
            onChangeText={text => setTextInput(text)}
          />
        </View>
        <TouchableOpacity onPress={addTodo}>
          <View style={styles.iconContainer}>
            <ICON name="add" color={COLORS.primary} size={30} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listItem: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },
  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    borderRadius: 3,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    color: COLORS.white,
    backgroundColor: COLORS.primary,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    elevation: 40,
    flex: 1,
    height: 50,
    marginVertical: 20,
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  iconContainer: {
    height: 50,
    width: 50,
    marginLeft: 10,
    backgroundColor: COLORS.white,
    borderRadius: 25,
    elevation: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
