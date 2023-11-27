import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { Searchbar } from "../components/Searchbar";
import { CuisineFilter } from "../components/CuisineFilter";
import { RestaurantList } from "../components/RestaurantList";
import { RatingsDropdown } from "../components/RatingsDropdown";
import { useLocation } from "../context/LocationContext";
import { useRestaurant } from "../context/RestaurantContext";
import Icon from "react-native-vector-icons/MaterialIcons";

export const Home = () => {
  const { logout, isLoggedIn, userDetails, loading, accessToken } = useAuth();
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);
  const { setSearchLocation, searchLocation } = useLocation();
  const { fetchRestaurantsByFriendRating } = useRestaurant();

  // Side effect to make sure all of the details are loaded
  useEffect(() => {
    if (isLoggedIn && userDetails) setSearchLocation(userDetails.location);
  }, [isLoggedIn, userDetails]);

  //function to pass searched zipcode to the searchbar
  const handleSearch = (searchedLocation) => {
    setSearchLocation(searchedLocation);
  };

  //function to pass selected cuisine to the cuisine filter
  const handleApplyCuisineFilter = (cuisine) => {
    setSelectedCuisine(cuisine);
    console.log("Selected Cuisine: ", cuisine);
  };

  // function to logout
  const handleLogout = async () => {
    await logout();
  };

  //function to filter restaurants by rating
  const handleRatingSelection = (rating) => {
    fetchRestaurantsByFriendRating(rating);
    setShowRatingDropdown(false);
  };

  if (loading || !accessToken || !userDetails || !searchLocation) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <View style={styles.searchContainer}>
        <Searchbar
          onSearch={handleSearch}
          placeholder="Search Location (ex: Brooklyn, NY)"
        />
      </View>
      <View>
        <View style={styles.ButtonContainer}>
          <Pressable
            style={styles.buttonText}
            android_ripple={{ color: "#3A4D39" }}
            onPress={() => setShowRatingDropdown(true)}
          >
            <Text style={styles.text}>Ratings</Text>
            <Icon name="keyboard-arrow-down" size={24}/>
          </Pressable>
          <Pressable
            style={styles.buttonText}
            android_ripple={{ color: "#3A4D39" }}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.text}>Cuisines</Text>
            <Icon name="keyboard-arrow-down" size={24}/>
          </Pressable>

          {/* <Button title="Ratings" onPress={() => setShowRatingDropdown(true)} />
          <Button title="Cuisine" onPress={() => setModalVisible(true)} /> */}
        </View>
        {showRatingDropdown && (
          <RatingsDropdown onRatingSelect={handleRatingSelection} />
        )}
        <Modal
          animationType="slide" // You can change this to 'fade' or 'none'
          transparent={true} // Set to true if you want to show the underlying content
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <CuisineFilter
                onApplyFilter={handleApplyCuisineFilter}
                onClose={() => setModalVisible(false)}
                fetchCuisinesUrl={
                  "https://colab-test.onrender.com/get-cuisines"
                }
              />
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.RestaurantListContainer}>
        <RestaurantList
          location={searchLocation}
          selectedCuisine={selectedCuisine}
        />
      </View>
      <View>
        <Pressable onPress={handleLogout} style={styles.logout}>
                <Text>Logout</Text>
        </Pressable >
        <Button title="Logout"  />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'white'
  },
  searchContainer: {
    width: "50%",
    height: "25%",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  RestaurantListContainer: {
    width: "100%",
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center", // Centers the modal vertically in the container
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  ButtonContainer: {
      flexDirection: 'row',
  justifyContent: 'center', // This will center the buttons in the container
  alignItems: 'center',
  marginRight: 100,
  height: 50,
  width: 120
  },
  buttonText: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0", // Use a light grey background for the buttons
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#4F6F52",
    padding: 10,
  borderRadius: 5,
  flexDirection: 'row', // Aligns children (Text and Icon) in a row
  alignItems: 'center', // Centers children vertically
  justifyContent: 'center',
  // ... other existing styles
  marginRight: 15, 
  },
  text: {
    fontSize: 16,
    color: "#000",
  },
  logout: {
    position: 'relative',
    bottom: 50
  }
});
