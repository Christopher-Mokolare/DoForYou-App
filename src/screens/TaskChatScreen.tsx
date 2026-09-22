import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tasksAPI } from '../services/api';
import { TaskChatConnection } from '../services/taskChatService';
import { Task, TaskMessage } from '../types';

const POLL_INTERVAL = 5000;

const normalizeStatus = (value: unknown) => String(value || '').replace(/_/g, '').replace(/\s/g, '').toLowerCase();

const isClosedStatus = (status: unknown) => {
  const normalized = normalizeStatus(status);
  return normalized === 'runnerpaid' || normalized === 'cancelled';
};

const displayName = (task: Task) =>
  task.acceptedByUser?.firstName
    ? `${task.acceptedByUser.firstName} ${task.acceptedByUser.lastName || ''}`.trim()
    : task.createdByUser?.firstName
      ? `${task.createdByUser.firstName} ${task.createdByUser.lastName || ''}`.trim()
      : 'Task participant';

export default function TaskChatScreen({ navigation, route }: any) {
  const task: Task = route.params.task;
  const taskId = String(task.taskId || task.id);
  const [messages, setMessages] = useState<TaskMessage[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState(false);
  const [taskState, setTaskState] = useState(task.taskStatus);
  const connectionRef = useRef<TaskChatConnection | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const mergeMessages = useCallback((incoming: TaskMessage[]) => {
    setMessages(previous => {
      const byId = new Map(previous.map(message => [String(message.id), message]));
      incoming.forEach(message => byId.set(String(message.id), message));
      return Array.from(byId.values()).sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    });
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      mergeMessages(await tasksAPI.getMessages(taskId));
    } catch (error: any) {
      if (!messages.length) setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [mergeMessages, taskId, messages.length]);

  useEffect(() => {
    let active = true;
    const connection = new TaskChatConnection();
    connectionRef.current = connection;

    fetchMessages();

    connection.connect(
      taskId,
      message => {
        if (!active) return;
        mergeMessages([{
          ...message,
          id: Number(message.id) || String(message.id),
          taskId: String(message.taskId),
        }]);
      },
      isConnected => {
        if (!active) return;
        setConnected(isConnected);
        if (isConnected && pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
        if (!isConnected && !pollRef.current) {
          pollRef.current = setInterval(fetchMessages, POLL_INTERVAL);
        }
      }
    ).catch(() => {
      if (!active) return;
      setConnected(false);
      if (!pollRef.current) pollRef.current = setInterval(fetchMessages, POLL_INTERVAL);
    });

    return () => {
      active = false;
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
      connection.leave(taskId);
      connectionRef.current = null;
    };
  }, [fetchMessages, mergeMessages, taskId]);

  const handleSend = async () => {
    const content = text.trim();
    if (!content || sending || isClosedStatus(taskState)) return;
    setSending(true);
    try {
      await tasksAPI.sendMessage(taskId, content);
      setText('');
      await fetchMessages();
    } catch (error: any) {
      Alert.alert('Message failed', error?.message || 'Unable to send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.kicker}>TASK CONVERSATION</Text>
          <Text style={styles.title} numberOfLines={1}>{task.taskName || task.taskTitle || 'Task conversation'}</Text>
          <Text style={styles.meta}>{displayName(task)} · {connected ? 'Live' : 'Syncing'}</Text>
        </View>
      </View>

      <View style={styles.context}>
        <Ionicons name="shield-checkmark-outline" size={18} color="#ff6b35" />
        <Text style={styles.contextText}>Keep task communication on DoForYou</Text>
      </View>

      <FlatList
        style={styles.list}
        contentContainerStyle={messages.length ? styles.listContent : styles.emptyContent}
        data={messages}
        keyExtractor={item => String(item.id)}
        onRefresh={fetchMessages}
        refreshing={loading}
        renderItem={({ item }) => item.isSystem ? (
          <View style={styles.systemMessage}>
            <Ionicons name="information-circle-outline" size={18} color="#666" />
            <Text style={styles.systemText}>{item.content}</Text>
          </View>
        ) : (
          <View style={[styles.messageRow, item.isCurrentUser ? styles.mine : styles.theirs]}>
            <View style={[styles.bubble, item.isCurrentUser ? styles.mineBubble : styles.theirBubble]}>
              {!item.isCurrentUser && <Text style={styles.sender}>{item.senderName}</Text>}
              <Text style={styles.messageText}>{item.content}</Text>
              <Text style={styles.time}>{new Date(item.timestamp).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Ionicons name="chatbubbles-outline" size={44} color="#aaa" />
              <Text style={styles.emptyTitle}>Start the conversation</Text>
              <Text style={styles.emptyText}>Coordinate timing, requirements and task updates here.</Text>
            </View>
          ) : null
        }
      />

      {isClosedStatus(taskState) ? (
        <View style={styles.closed}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" />
          <Text style={styles.closedText}>Conversation closed. History remains available.</Text>
        </View>
      ) : (
        <View style={styles.composer}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Write a message..."
            maxLength={1000}
            multiline
            style={styles.input}
            editable={!sending}
          />
          <TouchableOpacity onPress={handleSend} disabled={!text.trim() || sending} style={styles.send}>
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f8fa' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  iconButton: { padding: 4 },
  headerInfo: { flex: 1, marginLeft: 12 },
  kicker: { fontSize: 10, fontWeight: '700', color: '#777', letterSpacing: 1 },
  title: { fontSize: 18, fontWeight: '700', color: '#222', marginTop: 2 },
  meta: { fontSize: 12, color: '#777', marginTop: 3 },
  context: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8, backgroundColor: '#fff7f2' },
  contextText: { color: '#555', fontSize: 13 },
  list: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 24 },
  emptyContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  messageRow: { flexDirection: 'row', marginBottom: 10 },
  mine: { justifyContent: 'flex-end' },
  theirs: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '82%', borderRadius: 16, padding: 11 },
  mineBubble: { backgroundColor: '#ff6b35', borderBottomRightRadius: 4 },
  theirBubble: { backgroundColor: 'white', borderBottomLeftRadius: 4 },
  sender: { fontSize: 11, fontWeight: '700', color: '#666', marginBottom: 3 },
  messageText: { fontSize: 15, lineHeight: 21, color: '#222' },
  time: { fontSize: 10, color: '#777', marginTop: 5, alignSelf: 'flex-end' },
  systemMessage: { flexDirection: 'row', alignItems: 'center', gap: 7, padding: 10, marginVertical: 5, backgroundColor: '#eef1f4', borderRadius: 12 },
  systemText: { flex: 1, color: '#555', fontSize: 12 },
  empty: { alignItems: 'center', padding: 24 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginTop: 12, color: '#333' },
  emptyText: { textAlign: 'center', color: '#777', marginTop: 6 },
  composer: { flexDirection: 'row', alignItems: 'flex-end', padding: 10, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#e5e7eb', gap: 8 },
  input: { flex: 1, minHeight: 44, maxHeight: 110, borderWidth: 1, borderColor: '#ddd', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#fafafa' },
  send: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ff6b35' },
  closed: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  closedText: { flex: 1, color: '#666', fontSize: 13 },
});
