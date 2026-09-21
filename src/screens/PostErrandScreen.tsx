import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { errandAPI } from '../services/api';

interface Props { navigation: any; }

const PostErrandScreen: React.FC<Props> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [area, setArea] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const categories = ['Delivery', 'Cleaning', 'Shopping', 'Pet Care', 'Other'];

  const handlePostErrand = async () => {
    if (!title.trim() || description.trim().length < 20 || !category || area.trim().length < 2 || !price) {
      Alert.alert('Error', 'Enter a title, a description of at least 20 characters, a category, an area, and a budget of at least R50.');
      return;
    }
    const budget = Number(price);
    if (!Number.isFinite(budget) || budget < 50 || budget > 100000) {
      Alert.alert('Error', 'Budget must be between R50 and R100000.');
      return;
    }

    setLoading(true);
    try {
      const result = await errandAPI.createErrand({
        taskName: title.trim(),
        taskDescription: description.trim(),
        category,
        area: area.trim(),
        dateNeeded: new Date(Date.now() + 86400000).toISOString(),
        budget,
        priority: 'Standard',
        termsAccepted: true,
      });
      Alert.alert('Task created', 'Your task was created. Continue to secure payment to make it available to runners.', [
        { text: 'Continue to payment', onPress: () => navigation.navigate('Payment', { taskId: result.task.taskId, paymentUrl: result.paymentUrl }) }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || error.message || 'Failed to post task');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Post a Task</Text>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}><Text style={styles.label}>Task Title</Text><View style={[styles.inputContainer, focusedField === 'title' && styles.inputFocused]}>
            <Ionicons name="clipboard-outline" size={20} color="#666" />
            <TextInput style={styles.input} placeholder="What needs to be done?" placeholderTextColor="#999" value={title} onChangeText={setTitle} onFocus={() => setFocusedField('title')} onBlur={() => setFocusedField('')} />
          </View></View>
          <View style={styles.inputGroup}><Text style={styles.label}>Description</Text><View style={[styles.inputContainer, styles.textAreaContainer, focusedField === 'description' && styles.inputFocused]}>
            <Ionicons name="document-text-outline" size={20} color="#666" style={styles.textAreaIcon} />
            <TextInput style={[styles.input, styles.textArea]} placeholder="Provide at least 20 characters..." placeholderTextColor="#999" value={description} onChangeText={setDescription} multiline numberOfLines={4} onFocus={() => setFocusedField('description')} onBlur={() => setFocusedField('')} />
          </View></View>
          <View style={styles.inputGroup}><Text style={styles.label}>Area</Text><View style={[styles.inputContainer, focusedField === 'area' && styles.inputFocused]}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <TextInput style={styles.input} placeholder="Area / suburb" placeholderTextColor="#999" value={area} onChangeText={setArea} onFocus={() => setFocusedField('area')} onBlur={() => setFocusedField('')} />
          </View></View>
          <View style={styles.inputGroup}><Text style={styles.label}>Category</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map(cat => <TouchableOpacity key={cat} style={[styles.categoryChip, category === cat && styles.categoryChipActive]} onPress={() => setCategory(cat)}>
              <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>{cat}</Text>
            </TouchableOpacity>)}
          </ScrollView></View>
          <View style={styles.inputGroup}><Text style={styles.label}>Budget (Rands)</Text><View style={[styles.inputContainer, focusedField === 'price' && styles.inputFocused]}>
            <Text style={styles.currencySymbol}>R</Text>
            <TextInput style={[styles.input, styles.priceInput]} placeholder="50.00" placeholderTextColor="#999" value={price} onChangeText={setPrice} keyboardType="decimal-pad" onFocus={() => setFocusedField('price')} onBlur={() => setFocusedField('')} />
          </View></View>
        </View>
        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handlePostErrand} disabled={loading}>
          {loading ? <View style={styles.buttonContent}><ActivityIndicator size="small" color="white" /><Text style={styles.buttonText}>Creating...</Text></View> :
            <View style={styles.buttonContent}><Ionicons name="add-circle-outline" size={20} color="white" /><Text style={styles.buttonText}>Create Task</Text></View>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:'#f8f9fa'},content:{flexGrow:1,padding:20},title:{fontSize:28,fontWeight:'bold',textAlign:'center',marginBottom:30,color:'#333'},
 formContainer:{backgroundColor:'white',borderRadius:15,padding:20,shadowColor:'#000',shadowOffset:{width:0,height:4},shadowOpacity:0.1,shadowRadius:10,elevation:5},
 inputGroup:{marginBottom:20},label:{fontSize:16,fontWeight:'600',color:'#333',marginBottom:8},inputContainer:{flexDirection:'row',alignItems:'center',backgroundColor:'#f8f9fa',borderRadius:10,paddingHorizontal:15,paddingVertical:5,borderWidth:2,borderColor:'transparent'},inputFocused:{borderColor:'#ff6b35',backgroundColor:'#fff'},
 input:{flex:1,paddingVertical:12,paddingHorizontal:10,fontSize:16,color:'#333'},textAreaContainer:{alignItems:'flex-start',paddingVertical:10},textAreaIcon:{marginTop:5},textArea:{height:80,textAlignVertical:'top'},categoryScroll:{marginTop:5},
 categoryChip:{paddingHorizontal:16,paddingVertical:8,borderRadius:20,backgroundColor:'#f8f9fa',marginRight:10,borderWidth:1,borderColor:'#e9ecef'},categoryChipActive:{backgroundColor:'#ff6b35',borderColor:'#ff6b35'},categoryText:{fontSize:14,color:'#666',fontWeight:'500'},categoryTextActive:{color:'white'},
 currencySymbol:{fontSize:18,fontWeight:'bold',color:'#ff6b35',marginRight:5},priceInput:{fontSize:18,fontWeight:'600'},button:{backgroundColor:'#ff6b35',paddingVertical:16,borderRadius:12,marginTop:30},buttonDisabled:{opacity:0.7},buttonContent:{flexDirection:'row',alignItems:'center',justifyContent:'center'},buttonText:{color:'white',fontSize:16,fontWeight:'bold',marginLeft:8}
});
export default PostErrandScreen;