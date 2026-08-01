// Socket service stub — socket.io-client not available in this build
class SocketService {
  connect(_userId: string) {}
  disconnect() {}
  on(_event: string, _callback: (data: any) => void) {}
  emit(_event: string, _data: any) {}
}

export default new SocketService();