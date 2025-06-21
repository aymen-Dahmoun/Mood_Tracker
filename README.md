# 🎬 Mood Tracker (I couldn't think of a better name)

**Mood Tracker** is a mobile application built with **React Native (Expo)** that allows users to track their **moods behaviour in real time** by simply input it, store it, and the app will show analytical content of it

---

## 🚀 Features

### 📽️ Movies Screen
- AI bot to chat about feelings
- Store the mood along with a note
- Analyse mood through time
- display all the registered moods

---

### 💬 Chat screen 
- Send and recive messages to the AI
- Powered by Gemini API
- Conversation is stored as long as the app is opened (stored in a context)
  
<img src="https://github.com/user-attachments/assets/b632d335-4280-411b-80c6-c8371558eda7" width="200"/>

---


### ❤️ Moods Screen
- Displays a list of static Moods
- Allows to select a combination of moods along with an opitional note
- Stores the chosen list of emotions with the note and additional data like date and time  
<img src="https://github.com/user-attachments/assets/43530a65-8ca1-47bf-9329-8d175ba9b19f" width="200"/>

---

### 🎞️ History screen
- Displays all the stored moods withing the Asyncstorage
- the data is displayed in cards
- Additional functionality is the delete button within each element and Delete All button 
<img src="https://github.com/user-attachments/assets/69a3c069-d0f6-4cd2-86a4-9517dae7238e" width="200"/>

---

### 🔍 Analysis Screen 
- Display four types of graphs to summerize the mood changements through time
- Plots are updated after each mood is added
<img src="https://github.com/user-attachments/assets/1ef49755-b0b1-4b58-b7af-61e1194dd947" width="200"/>

---

### 🔐 LLM API
- Used Google AI Studio to egenrate a free API key
- API key is stored in a .env file with name of envirement variable EXPO_GEMINI_API_KEY
- the model is provided with a very basic system prompt
- the history of chat is past as a stringfied javascript object along with the prompt 

---

### 7. **UI/UX Design**

* A very nice experience and easy work flow
* style is cofortable and colorful, with smooth animations using Animated API which is pre-built in react native 


## Installation

### Prerequisites

Ensure you have the following installed:

* **Node.js** and **npm** (or **yarn**)
* **React Native** environment set up on your machine (Android/iOS)
* **Gemini API** for the chat bot

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/aymen-Dahmoun/Mood_Tracker
   cd Mood_Tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up the Firebase project:

   * Go to google AI studio and generate a new API key 
   * Inside the root of the project create a .env file 
   * within the .env file create a variable EXPO_GEMINI_API_KEY and paste the generated API key

4. Run the app:


     ```bash
     npx expo start
     ```
