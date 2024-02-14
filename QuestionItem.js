import React, { useState } from "react";
import {
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";

const { height, width } = Dimensions.get("window");

const QuestionItem = ({ data, selectedOption }) => {
  const [answered, setAnswered] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);

  const getOptionColor = (index) => {
    if (answered) {
      if (index === selectedOptionIndex) {
        return data.options[index] === data.answer ? "green" : "red";
      } else if (
        index === data.options.findIndex((option) => option === data.answer)
      ) {
        return "green";
      }
    }
    return "#fff";
  };

  const handleOptionPress = (index) => {
    if (!answered) {
      setAnswered(true);
      setSelectedOptionIndex(index);
      selectedOption(index + 1);
    }
  };

  return (
    <View style={{ width: width }}>
      <Text
        style={{
          fontSize: 25,
          fontWeight: "600",
          color: "black",
          marginLeft: 20,
          marginRight: 20,
        }}
      >
        {"Ques: " + data.question}
      </Text>
      <View style={{ marginTop: 20 }}>
        <FlatList
          data={data.options}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={{
                width: "90%",
                height: 60,
                elevation: 3,
                backgroundColor: getOptionColor(index),
                marginTop: 10,
                marginBottom: 10,
                alignSelf: "center",
                alignItems: "center",
                paddingLeft: 15,
                flexDirection: "row",
              }}
              onPress={() => handleOptionPress(index)}
              disabled={answered}
            >
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: "cyan",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "600", color: "#000" }}>
                  {index === 0
                    ? "A"
                    : index === 1
                    ? "B"
                    : index === 2
                    ? "C"
                    : "D"}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  marginLeft: 20,
                  color: "#000",
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

export default QuestionItem;
