import React, { useState, useCallback } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  ImageBackground,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import setData from './../asyncStorageMethods/setData';
import MainLayout from "../Comps/MainLayout";
import { MOODS } from "../constants/moodList";
import Divider from "../Comps/Divider";


const { width } = Dimensions.get("window");

export default function Mood() {
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [notes, setNotes] = useState("");

  const toggleMood = useCallback((mood) => {
    setSelectedMoods(prev => {
      const isSelected = prev.some(m => m.id === mood.id);
      if (isSelected) {
        return prev.filter(m => m.id !== mood.id);
      } else {
        return [...prev, mood];
      }
    });
  }, []);

  const handleSave = useCallback(async () => {
    if (selectedMoods.length === 0) {
      Alert.alert("No Mood Selected", "Please select at least one mood.");
      return;
    }

    try {
      const moodEntry = {
        timestamp: new Date().toISOString(),
        moods: selectedMoods.map(mood => ({
          id: mood.id,
          emoji: mood.emoji,
          label: mood.label,
          temprature: mood.temprature,
          color: mood.color
        })),
        notes: notes.trim() || null,
        version: "1.0" // for future data migration if needed
      };
      
      setData(JSON.stringify(moodEntry));
      
      setSelectedMoods([]);
      setNotes("");
      
      Alert.alert("Saved! ✨", "Your mood has been recorded.");
    } catch (error) {
      console.error("Error saving mood:", error);
      Alert.alert("Error", "Failed to save your mood. Please try again.");
    }
  }, [selectedMoods, notes]);

  const renderMoodGrid = () => {
    const rows = [];
    for (let i = 0; i < MOODS.length; i += 3) {
      const rowMoods = MOODS.slice(i, i + 3);
      rows.push(
        <View key={i} style={styles.moodRow}>
          {rowMoods.map(mood => {
            const isSelected = selectedMoods.some(m => m.id === mood.id);
            return (
              <TouchableOpacity
                key={mood.id}
                style={[
                  styles.moodItem,
                  {backgroundColor: `${mood.color}CC`},
                  isSelected && styles.moodItemSelected
                ]}
                onPress={() => toggleMood(mood)}
                activeOpacity={0.7}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={[
                  styles.moodLabel,
                  isSelected && styles.moodLabelSelected
                ]}>
                  {mood.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }
    return rows;
  };

  return (
    <MainLayout>
        <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
            >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ImageBackground
              source={require("../src/background.png")}
              blurRadius={20}
              style={styles.backgroundImage}
            >
              <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.content}>
                  <Text style={styles.title}>How are you feeling?</Text>
                  <Text style={styles.subtitle}>Select all that apply</Text>
                  
                  <View style={styles.moodGrid}>
                    {renderMoodGrid()}
                  </View>

                  {selectedMoods.length > 0 && (
                    <View style={styles.selectedSection}>
                      <Text style={styles.selectedTitle}>Selected:</Text>
                      <View style={styles.selectedMoods}>
                        {selectedMoods.map(mood => (
                          <View key={mood.id} style={styles.selectedMoodChip}>
                            <Text style={styles.selectedMoodText}>
                              {mood.emoji} {mood.label}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  <View style={styles.notesSection}>
                    <Text style={styles.notesLabel}>
                      Tell us more (optional):
                    </Text>
                    <TextInput
                      style={styles.notesInput}
                      value={notes}
                      onChangeText={setNotes}
                      placeholder="What's on your mind?"
                      placeholderTextColor="rgba(0, 0, 0, 0.4)"
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.saveButton,
                      selectedMoods.length === 0 && styles.saveButtonDisabled
                    ]}
                    onPress={handleSave}
                    disabled={selectedMoods.length === 0}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.saveButtonText,
                      selectedMoods.length === 0 && styles.saveButtonTextDisabled
                    ]}>
                      Save My Mood ✨
                    </Text>
                  </TouchableOpacity>
                  <Divider style={{height:0}} />
                </View>
              </ScrollView>
            </ImageBackground>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c1810',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#5d4e37',
    textAlign: 'center',
    marginBottom: 30,
  },
  moodGrid: {
    marginBottom: 20,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  moodItem: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodItemSelected: {
    backgroundColor: 'rgba(224, 184, 255, 0.9)',
    borderColor: 'rgb(147, 51, 234)',
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  moodLabelSelected: {
    color: 'rgb(48, 25, 66)',
    fontWeight: '600',
  },
  selectedSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  selectedMoods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedMoodChip: {
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.3)',
  },
  selectedMoodText: {
    fontSize: 14,
    color: 'rgb(48, 25, 66)',
    fontWeight: '500',
  },
  notesSection: {
    marginBottom: 30,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  notesInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    minHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  saveButton: {
    backgroundColor: 'rgb(147, 51, 234)',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: 'rgba(146, 51, 234, 0.5)',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  saveButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
});