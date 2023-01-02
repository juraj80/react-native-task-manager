import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";

const DraggableExample = () => {
  const [data, setData] = useState([
    {
      id: "c1b1-46c2-aed5-3ad53abb28ba",
      title: "First Item",
    },
    {
      id: "c605-48d3-a4f8-fbd91aa97f63",
      title: "Second Item",
    },
    {
      id: "3da1-471f-bd96-145571e29d72",
      title: "Third Item",
    },
  ]);
  const renderItem = ({ item, drag, isActive }) => (
    <ScaleDecorator>
      <TouchableOpacity
        onLongPress={drag}
        disabled={isActive}
        style={styles.item}
      >
        <Text style={styles.title}>{item.title}</Text>
      </TouchableOpacity>
    </ScaleDecorator>
  );

  return (
    <View>
      <DraggableFlatList
        data={data}
        onDragEnd={({ data }) => setData(data)}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default DraggableExample;
