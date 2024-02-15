import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import QuestionItem from "./QuestionItem";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";

const { height, width } = Dimensions.get("window");

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState(
    Array(questions.length).fill(-1)
  ); // Keep tracking of selected options
  const listRef = useRef();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [explanationModalVisible, setExplanationModalVisible] = useState(false);
  const [explanation, setExplanation] = useState("");

  useEffect(() => {
    // Fetch quiz questions when component mounts
    fetchQuizQuestions();
  }, []);

  useEffect(() => {
    // Updating selectedOptions state after questions are fetched
    setSelectedOptions(Array(questions.length).fill(-1));
  }, [questions]);

  const fetchQuizQuestions = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.100:8000/api/quiz/getAllQuiz"
      );
      if (response?.data?.quizQuestions) {
        setQuestions(response?.data?.quizQuestions);
      } else {
        console.error("No quiz questions found in the response.");
      }
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      // Calculate total correct and wrong answers

      const response = await axios.post(
        `http://192.168.1.100:8000/api/quiz/createQuiz`,
        {
          name: name,
          email: email,
          phone: phone,
          correct: correct,
          wrong: wrong,
        }
      );

      if (response.status === 200) {
        Alert.alert("Form Saved Successffully");
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  const OnSelectOption = (index, selectedOptionIndex) => {
    const tempData = [...questions];
    tempData[index].selectedOptionIndex = selectedOptionIndex;
    setQuestions(tempData);

    // Get the selected option
    const selectedOption = tempData[index].options[selectedOptionIndex];

    if (selectedOption === tempData[index].answer) {
      // Increment correct count if the selected option is correct
      setCorrect((prevCorrect) => prevCorrect + 1);
    } else {
      // Increment wrong count if the selected option is wrong
      setWrong((prevWrong) => prevWrong + 1);
    }

    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[index] = selectedOptionIndex;
    setSelectedOptions(updatedSelectedOptions);
  };

  const handleInfoPress = () => {
    // Dummy explanation text
    const dummyExplanation =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel enim nec sem commodo porttitor. Duis iaculis venenatis lorem, nec bibendum magna dictum a.";

    // Seting the explanation text and make the explanation modal visible
    setExplanation(dummyExplanation);
    setExplanationModalVisible(true);
  };

  return (
    <>
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 30,
          left: 20,
        }}
        onPress={() => {
          if (currentIndex > 1) {
            listRef.current.scrollToIndex({
              animated: true,
              index: parseInt(currentIndex) - 2,
            });
          }
        }}
      >
        <AntDesign name="leftcircle" size={24} color="black" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={explanationModalVisible}
        onRequestClose={() => {
          setExplanationModalVisible(false);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "grey",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              padding: 20,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <AntDesign name="infocirlceo" size={24} color="black" />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              Explanation
            </Text>
            <Text>{explanation}</Text>
            <TouchableOpacity
              style={{
                backgroundColor: "green",
                height: 50,
                borderRadius: 10,
                marginTop: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setExplanationModalVisible(false)} // Close the modal
            >
              <Text style={{ color: "#fff" }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 35,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              marginLeft: 20,
              top: 20,
              color: "#000",
            }}
          >
            Questions: {currentIndex}/{questions.length}
          </Text>
        </View>
        <View style={{ marginTop: 30 }}>
          <FlatList
            ref={listRef}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            horizontal
            onScroll={(e) => {
              const x = e.nativeEvent.contentOffset.x / width + 1;
              setCurrentIndex(x.toFixed(0));
            }}
            data={questions}
            renderItem={({ item, index }) => (
              <QuestionItem
                data={item}
                selectedOption={(x) => OnSelectOption(index, x)}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableOpacity
            style={{
              alignSelf: "flex-end",
              marginRight: 20,
            }}
            onPress={handleInfoPress}
          >
            <AntDesign name="infocirlceo" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            position: "absolute",
            bottom: 50,
            width: "100%",
          }}
        >
          {currentIndex == questions.length ? (
            <TouchableOpacity
              style={{
                backgroundColor: "green",
                height: 50,
                width: width,
                borderRadius: 10,
                marginRight: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                Alert.alert("Data Saved Succeffully", "Please Fill form");
                setModalVisible(true);
              }}
            >
              <Text style={{ color: "#fff" }}>Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                backgroundColor: "blue",
                height: 50,
                width: width,
                borderRadius: 10,
                marginRight: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                if (questions[currentIndex - 1].marked !== -1) {
                  if (currentIndex < questions.length) {
                    listRef.current.scrollToIndex({
                      animated: true,
                      index: currentIndex,
                    });
                  }
                }
              }}
            >
              <Text style={{ color: "#fff" }}>Next</Text>
            </TouchableOpacity>
          )}
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View
            style={{
              marginVertical: 10,
              backgroundColor: "white",
              height: height,
              top: 10,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              {" "}
              Please Fill form
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}> Name</Text>
            <TextInput
              onChangeText={(text) => setName(text)}
              placeholderTextColor={"black"}
              placeholder="enter your name"
              style={{
                padding: 10,
                borderColor: "#d0d0d0",
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 5,
              }}
            />
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>Email</Text>
            <TextInput
              onChangeText={(text) => setEmail(text)}
              placeholderTextColor={"black"}
              placeholder="enter your email"
              style={{
                padding: 10,
                borderColor: "#d0d0d0",
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 5,
              }}
            />
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              Mobile Number
            </Text>
            <TextInput
              onChangeText={(text) => setPhone(text)}
              placeholderTextColor={"black"}
              placeholder="enter your mobile"
              style={{
                padding: 10,
                borderColor: "#d0d0d0",
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 5,
              }}
            />
            <TouchableOpacity
              style={{
                backgroundColor: "green",
                height: 50,
                width: width,
                borderRadius: 10,
                marginRight: 20,
                justifyContent: "center",
                alignItems: "center",
                top: 20,
              }}
              onPress={handleSubmit}
            >
              <Text style={{ color: "#fff" }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default App;
