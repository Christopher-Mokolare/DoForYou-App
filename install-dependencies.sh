#!/bin/bash

echo "Installing DoForYou React Native dependencies..."

# Core Redux and state management
npm install @reduxjs/toolkit react-redux redux-persist

# Real-time communication
npm install @microsoft/signalr

# Forms and validation
npm install react-hook-form yup @hookform/resolvers

# Secure storage
npm install react-native-keychain @react-native-async-storage/async-storage

# Firebase for notifications
npm install @react-native-firebase/app @react-native-firebase/messaging

# Date utilities
npm install date-fns react-native-date-picker

# Network info
npm install @react-native-community/netinfo

# Additional UI components
npm install react-native-elements react-native-vector-icons

echo "Dependencies installed successfully!"