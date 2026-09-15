import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GlassPanel } from '../components/GlassPanel';
import { colors, radius, spacing } from '../constants/theme';

export default function CameraScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [facing] = useState('back');

  if (!permission) {
    // Permissions are still loading.
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need your permission to use the camera to scan meals.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleCapture = async () => {
    let imageUri;

    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        imageUri = photo?.uri;
      }
    } catch (e) {
      // Camera not available (e.g. simulator) - continue to result anyway.
    }

    router.push({
      pathname: '/scan-result',
      params: imageUri ? { imageUri } : undefined,
    });
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} />

      {/* Close button */}
      <SafeAreaView style={styles.topBar}>
        <GlassPanel style={styles.headerGlass} tint="dark">
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="close" size={22} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan meal</Text>
          <View style={styles.iconButton} />
        </GlassPanel>
      </SafeAreaView>

      {/* Viewfinder corners */}
      <View style={styles.viewfinder} pointerEvents="none">
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />
      </View>

      {/* Bottom controls */}
      <SafeAreaView style={styles.bottomBar}>
        <View style={styles.bottomRow}>
          <View style={styles.spacer} />
          <TouchableOpacity style={styles.shutter} onPress={handleCapture} />
          <TouchableOpacity style={styles.galleryButton}>
            <Ionicons name="images-outline" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const CORNER_SIZE = 28;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  permissionContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  permissionText: {
    textAlign: 'center',
    color: colors.text,
    fontSize: 15,
    marginBottom: spacing.lg,
  },
  permissionButton: {
    backgroundColor: colors.dark,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 12,
  },
  permissionButtonText: { color: colors.white, fontWeight: '600' },

  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  headerGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    overflow: 'hidden',
  },
  headerTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  viewfinder: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
    bottom: '30%',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: colors.white,
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 12 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 12 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 12 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 12 },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: spacing.lg,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  spacer: { width: 44 },
  shutter: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
  },
  galleryButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
