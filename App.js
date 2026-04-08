import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TextInput,
  TouchableOpacity, Image,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import KartuProfil from './components/KartuProfil';

// -----------------------------------------
// 2. CLASS COMPONENT (Stateful & Lifecycle) 
// -----------------------------------------
//export default class App extends Component {
export default function App() {


  // 1. Mengganti this.state Menjadi useState
  const [kodeKelas, setKodeKelas] = useState('');
  const [isHadir, setIsHadir] = useState(false);
  const [waktuAbsen, setWaktuAbsen] = useState('');
  const [jamRealtime, setJamRealtime] = useState('Memuat jam...');

  // data statis tidak butuh state
  const studentData = {
    nama: 'Budi Susanto',
    nim: '030812345',
    prodi: 'TRPL - Politeknik Astra',
  };

  // 2. Menggabungkan Mounting & Unmounting
  useEffect(() => {
    console.log('[MOUNTING] Aplikasi Presensi Dibuka.');

    // timer berjalan setiap detik
    const intervalJam = setInterval(() => {
      const waktu = new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
      setJamRealtime(waktu); // Menggantikan this.setState({ jamRealtime: waktu })
    }, 1000);

    // Cleanup function (Berfungsi layaknya componentWillUnmount)
    return () => {
      console.log('[UNMOUNTING] Aplikasi Ditutup. Membersihkan memori...');
      clearInterval(intervalJam);
    };
  }, []); // <- array kosong: Pastikan fungsi ini hanya dipanggil 1x di awal!

  // 3. Mengganti componentDidUpdate
  useEffect(() => {
    // hanya bereaksi jika state isHadir berubah menjadi true
    if (isHadir === true) {
      console.log(`[UPDATING] Sukses presensi pada pukul: ${waktuAbsen}`);
    }
  }, [isHadir, waktuAbsen]); // <-- ARRAY DEPENDENCIES: Pantau dua variabel ini

  // 4. Event handler (Tanpa 'this')
  const handleAbsen = () => {
    if (kodeKelas.trim() === '') {
      alert('Masukkan kode kelas (Simulasi QR) terlebih dahulu!');
      return;
    }

    // ubah state secara langsung dengan fungsi setter-nya
    setIsHadir(true);
    setWaktuAbsen(jamRealtime);
  };

  // 5. langsung Return UI (Hapus tulisan render() { ... })
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* header dg jam digital (Terhubung ke State) */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sistem Presensi</Text>
          {/* Panggil state langsung tanpa this.state */}
          <Text style={styles.clockText}>{jamRealtime}</Text>
        </View>

        {/* Panggil variabel langsung tanpa this.studentData */}
        <KartuProfil student={studentData} />

        {/* Seksi presensi  (CONDITIONAL RENDERING) */}
        <View style={styles.actionSection}>
          {isHadir ? (
            <View style={styles.successCard}>
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/190/190411.png' }}
                style={styles.successIcon}
              />
              <Text style={styles.successText}>Presensi Berhasil!</Text>
              <Text style={styles.timeText}>Tercatat pada: {waktuAbsen} WIB</Text>
              <Text style={styles.codeText}>Kode Terverifikasi: {kodeKelas}</Text>
            </View>
          ) : (
            <View style={styles.inputCard}>
              <Text style={styles.instructionText}>Masukkan Kode Kelas:</Text>
              <Text style={styles.noteText}>(Simulasi dari hasil Scan QR Kamera)</Text>

              <TextInput
                style={styles.input}
                placeholder="Contoh: TRPL-03"
                value={kodeKelas}
                // jauh lebih ringkas dari sebelumnya!
                onChangeText={setKodeKelas}
                autoCapitalize="characters"
              />

              {/* panggil fungsi handle tanpa this */}
              <TouchableOpacity style={styles.buttonSubmit} onPress={handleAbsen}>
                <Text style={styles.buttonText}>Konfirmasi Kehadiran</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// catatan: StyleSheet di paling bawah TIDAK PERLU DIUBAH sama sekali.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F0F9',
  },
  header: {
    backgroundColor: '#0056A0',
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#A0E0FF',
    fontSize: 14,
    marginTop: 5,
  },
  clockText: {
    color: '#A0E0FF',
    fontSize: 14,
    marginTop: 5,
  },
  actionSection: {
    marginTop: 50,
    marginHorizontal: 20,
  },
  inputCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  noteText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    marginBottom: 20,
    color: '#333',
  },
  buttonSubmit: {
    backgroundColor: '#0056A0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successCard: {
    backgroundColor: '#E8F5E9',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  successIcon: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  successText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    fontFamily: 'monospace',
  },
  codeText: {
    fontSize: 13,
    color: '#888',
    marginTop: 5,
  },
});