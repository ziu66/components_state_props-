import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, Animated, Easing,
} from 'react-native';

function PixelWindowCard({
  title, titleBg, children, showControls = true,
}: {
  title: string; titleBg: string; children: React.ReactNode; showControls?: boolean;
}) {
  return (
    <View style={win.card}>
      {/* Title bar */}
      <View style={[win.titleBar, { backgroundColor: titleBg }]}>
        <Text style={win.titleText}>{title}</Text>
        {showControls && (
          <View style={win.winBtns}>
            <View style={[win.winBtn, { backgroundColor: '#FFD600' }]}>
              <Text style={win.winBtnText}>_</Text>
            </View>
            <View style={[win.winBtn, { backgroundColor: '#FF9800' }]}>
              <Text style={win.winBtnText}>□</Text>
            </View>
            <View style={[win.winBtn, { backgroundColor: '#F44336' }]}>
              <Text style={win.winBtnText}>✕</Text>
            </View>
          </View>
        )}
      </View>
      {/* Window border accent */}
      <View style={win.borderAccent} />
      <View style={win.body}>{children}</View>
    </View>
  );
}

function WaterJug({ count }: { count: number }) {
  const MAX = 200;
  const JUG_HEIGHT = 150;
  // Water empties out once the count hits zero, and stays empty for negatives
  const fillPercent = Math.min(Math.max(count / MAX, 0), 1);
  const isFull = fillPercent >= 0.9;

  const animFill = useRef(new Animated.Value(fillPercent * JUG_HEIGHT)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const wasFull = useRef(false);

  useEffect(() => {
    Animated.timing(animFill, {
      toValue: fillPercent * JUG_HEIGHT,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.out(Easing.quad),
    }).start();
  }, [fillPercent]);

  // Shake the jug whenever it newly reaches "FULL!"
  useEffect(() => {
    if (isFull && !wasFull.current) {
      shakeAnim.setValue(0);
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 8, duration: 45, useNativeDriver: true, easing: Easing.linear }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 45, useNativeDriver: true, easing: Easing.linear }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 45, useNativeDriver: true, easing: Easing.linear }),
        Animated.timing(shakeAnim, { toValue: -6, duration: 45, useNativeDriver: true, easing: Easing.linear }),
        Animated.timing(shakeAnim, { toValue: 4, duration: 45, useNativeDriver: true, easing: Easing.linear }),
        Animated.timing(shakeAnim, { toValue: -4, duration: 45, useNativeDriver: true, easing: Easing.linear }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 45, useNativeDriver: true, easing: Easing.linear }),
      ]).start();
    }
    wasFull.current = isFull;
  }, [isFull]);

  const waterColor =
    fillPercent < 0.25 ? '#90CAF9' :
    fillPercent < 0.5  ? '#42A5F5' :
    fillPercent < 0.75 ? '#1E88E5' : '#1565C0';

  const label =
    fillPercent <= 0   ? 'EMPTY' :
    fillPercent < 0.25 ? 'LOW'   :
    fillPercent < 0.5  ? 'HALF'  :
    fillPercent < 0.9  ? 'HIGH'  : 'FULL!';

  return (
    <Animated.View style={[jug.wrapper, { transform: [{ translateX: shakeAnim }] }]}>
      {/* Pouring spout / lip */}
      <View style={jug.spout} />

      <View style={jug.bodyWrap}>
        {/* Handle */}
        <View style={jug.handle} />

        {/* Pitcher body */}
        <View style={jug.container}>
          <Animated.View style={[jug.fill, { height: animFill, backgroundColor: waterColor }]}>
            <View style={jug.wave}>
              {[...Array(10)].map((_, i) => (
                <View key={i} style={[jug.waveBump, { backgroundColor: waterColor }]} />
              ))}
            </View>
          </Animated.View>

          {[0.25, 0.5, 0.75].map((pct, i) => (
            <View key={i} style={[jug.tick, { bottom: pct * JUG_HEIGHT }]}>
              <View style={jug.tickLine} />
            </View>
          ))}

          {/* Glassy highlight */}
          <View style={jug.shine} />

          <Text style={jug.number}>{count}</Text>
        </View>

        {/* Base shadow to ground the pitcher */}
        <View style={jug.baseShadow} />
      </View>

      <View style={[jug.labelBox, { borderColor: waterColor }]}>
        <Text style={[jug.label, { color: waterColor }]}>{label}</Text>
      </View>
    </Animated.View>
  );
}

function PixelButton({ label, color, shadowColor, onPress, onLongPress, onPressOut, scale }: {
  label: string; color: string; shadowColor: string;
  onPress: () => void; onLongPress?: () => void;
  onPressOut?: () => void; scale: Animated.Value;
}) {
  return (
    <Animated.View style={{ transform: [{ scale }], width: '100%', marginBottom: 10 }}>
      {/* Outer pixel border */}
      <View style={[pbtn.outerBorder]}>
        {/* Shadow bottom */}
        <View style={[pbtn.shadowBot, { backgroundColor: shadowColor }]} />
        {/* Button face */}
        <View style={[pbtn.face, { backgroundColor: color }]}>
          {/* Top shine */}
          <View style={pbtn.shineTop} />
          <View style={pbtn.shineLeft} />
          {/* Dark inset corners */}
          <View style={pbtn.cornerTL} />
          <View style={pbtn.cornerTR} />
          <View style={pbtn.cornerBL} />
          <View style={pbtn.cornerBR} />
          <TouchableOpacity
            onPress={onPress}
            onLongPress={onLongPress}
            onPressOut={onPressOut}
            delayLongPress={300}
            activeOpacity={0.85}
            style={pbtn.touchable}
          >
            <Text style={pbtn.text}>{label}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

function CounterDisplay({ count, onAdd, onMinus, onReset }: {
  count: number; onAdd: () => void; onMinus: () => void; onReset: () => void;
}) {
  const addScale   = useRef(new Animated.Value(1)).current;
  const minusScale = useRef(new Animated.Value(1)).current;
  const resetScale = useRef(new Animated.Value(1)).current;
  const addInterval   = useRef<ReturnType<typeof setInterval> | null>(null);
  const minusInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const pulse = (scale: Animated.Value) => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.94, duration: 60, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
      Animated.timing(scale, { toValue: 1,    duration: 60, useNativeDriver: true, easing: Easing.in(Easing.ease) }),
    ]).start();
  };

  const startLongPress = (action: () => void, s: Animated.Value, ref: React.MutableRefObject<ReturnType<typeof setInterval> | null>) => {
    action(); pulse(s);
    ref.current = setInterval(() => { action(); pulse(s); }, 100);
  };

  const stopLongPress = (ref: React.MutableRefObject<ReturnType<typeof setInterval> | null>) => {
    if (ref.current) { clearInterval(ref.current); ref.current = null; }
  };

  return (
    <PixelWindowCard title="CHILD COMPONENT" titleBg="#5B8DD9" showControls={false}>
      <WaterJug count={count} />
      <PixelButton
        label="▲  ADD COUNT"
        color="#5B8DD9" shadowColor="#2A4A8F"
        scale={addScale}
        onPress={() => { onAdd(); pulse(addScale); }}
        onLongPress={() => startLongPress(onAdd, addScale, addInterval)}
        onPressOut={() => stopLongPress(addInterval)}
      />
      <PixelButton
        label="▼  MINUS COUNT"
        color="#D95B5B" shadowColor="#8F2A2A"
        scale={minusScale}
        onPress={() => { onMinus(); pulse(minusScale); }}
        onLongPress={() => startLongPress(onMinus, minusScale, minusInterval)}
        onPressOut={() => stopLongPress(minusInterval)}
      />
      <PixelButton
        label="↺  RESET"
        color="#8A9BB0" shadowColor="#445566"
        scale={resetScale}
        onPress={() => { onReset(); pulse(resetScale); }}
      />
    </PixelWindowCard>
  );
}

export default function ParentScreen() {
  const [count, setCount] = useState(100);
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 55, friction: 8 }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], width: '100%' }}>

          {/* Title */}
          <Text style={styles.pageTitle}>COUNTER APP</Text>
          <View style={styles.titlePixelRow}>
            {[...Array(14)].map((_, i) => (
              <View key={i} style={[styles.titlePixel, { backgroundColor: i % 2 === 0 ? '#2196F3' : '#90CAF9' }]} />
            ))}
          </View>

          <PixelWindowCard title="PARENT COMPONENT" titleBg="#1565C0">

            {/* State locker */}
            <View style={styles.stateBox}>
              <View style={styles.stateBoxInner}>
                <Text style={styles.stateBoxLabel}>STATE LOCKER</Text>
                <Text style={styles.stateBoxValue}>count: {count}</Text>
              </View>
            </View>

            <CounterDisplay
              count={count}
              onAdd={()   => setCount(p => p + 1)}
              onMinus={()  => setCount(p => p - 1)}
              onReset={()  => setCount(100)}
            />
          </PixelWindowCard>

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const win = StyleSheet.create({
  card: {
    width: '100%',
    borderWidth: 3,
    borderColor: '#1a2a4a',
    backgroundColor: '#fff',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 8,
  },
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  titleText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 2,
    flex: 1,
  },
  winBtns: {
    flexDirection: 'row',
    gap: 5,
  },
  winBtn: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  winBtnText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#000',
    lineHeight: 10,
  },
  borderAccent: {
    height: 3,
    backgroundColor: '#C8D8F0',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#8AAAD0',
  },
  body: {
    backgroundColor: '#EEF4FF',
    padding: 14,
    alignItems: 'center',
  },
});

const jug = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginVertical: 12,
  },
  // Small angled pouring lip at the top-left of the pitcher
  spout: {
    width: 34,
    height: 18,
    backgroundColor: '#E3F2FD',
    borderWidth: 3,
    borderColor: '#1565C0',
    borderBottomWidth: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 6,
    alignSelf: 'flex-start',
    marginLeft: 14,
    marginBottom: -4,
    transform: [{ rotate: '-10deg' }],
    zIndex: 2,
  },
  bodyWrap: {
    position: 'relative',
    alignItems: 'center',
  },
  // "D" shaped ring that reads as a jug handle, tucked behind the body
  handle: {
    position: 'absolute',
    right: -30,
    top: 24,
    width: 46,
    height: 82,
    borderWidth: 9,
    borderLeftWidth: 0,
    borderColor: '#1565C0',
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
    backgroundColor: 'transparent',
    zIndex: 0,
  },
  container: {
    width: 150,
    height: 150,
    backgroundColor: '#E3F2FD',
    borderWidth: 3,
    borderColor: '#1565C0',
    borderTopLeftRadius: 58,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 60,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  fill: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute', top: -6,
    flexDirection: 'row', width: '120%', left: -10,
  },
  waveBump: {
    width: 16, height: 12, borderRadius: 6,
    marginHorizontal: 1, opacity: 0.6,
  },
  tick: {
    position: 'absolute', right: 0, left: 0,
    alignItems: 'flex-end', paddingRight: 10,
  },
  tickLine: {
    width: 14, height: 2,
    backgroundColor: 'rgba(21,101,192,0.3)',
  },
  shine: {
    position: 'absolute',
    top: 12, left: 24,
    width: 14, height: '70%',
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 10,
    transform: [{ rotate: '6deg' }],
  },
  number: {
    fontSize: 38, fontWeight: 'bold',
    color: '#0D47A1', zIndex: 1,
  },
  baseShadow: {
    width: 110,
    height: 12,
    borderRadius: 60,
    backgroundColor: 'rgba(21,101,192,0.18)',
    marginTop: -4,
  },
  labelBox: {
    marginTop: 12, paddingHorizontal: 16, paddingVertical: 4,
    borderWidth: 2, backgroundColor: '#fff',
  },
  label: { fontWeight: 'bold', fontSize: 12, letterSpacing: 3 },
});

const pbtn = StyleSheet.create({
  outerBorder: {
    borderWidth: 2,
    borderColor: '#000',
    position: 'relative',
  },
  shadowBot: {
    position: 'absolute',
    bottom: -4, left: 2, right: -4,
    top: 2,
    zIndex: 0,
  },
  face: {
    position: 'relative',
    overflow: 'hidden',
    zIndex: 1,
  },
  shineTop: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 5, backgroundColor: 'rgba(255,255,255,0.45)',
    zIndex: 2,
  },
  shineLeft: {
    position: 'absolute', top: 0, left: 0, bottom: 0,
    width: 4, backgroundColor: 'rgba(255,255,255,0.25)',
    zIndex: 2,
  },
  cornerTL: {
    position: 'absolute', top: 0, left: 0,
    width: 3, height: 3, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 3,
  },
  cornerTR: {
    position: 'absolute', top: 0, right: 0,
    width: 3, height: 3, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 3,
  },
  cornerBL: {
    position: 'absolute', bottom: 0, left: 0,
    width: 3, height: 3, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 3,
  },
  cornerBR: {
    position: 'absolute', bottom: 0, right: 0,
    width: 3, height: 3, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 3,
  },
  touchable: {
    paddingVertical: 13,
    alignItems: 'center',
    width: '100%',
    zIndex: 4,
  },
  text: {
    color: '#fff', fontSize: 14,
    fontWeight: 'bold', letterSpacing: 2,
  },
});

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#C8D8F0' },
  scroll: { padding: 16, alignItems: 'center', justifyContent: 'center', flexGrow: 1 },
  pageTitle: {
    fontSize: 30, fontWeight: 'bold', color: '#0D47A1',
    textAlign: 'center', letterSpacing: 5, marginBottom: 6,
  },
  titlePixelRow: {
    flexDirection: 'row', justifyContent: 'center',
    gap: 3, marginBottom: 16,
  },
  titlePixel: {
    width: 10, height: 10, borderRadius: 1,
  },
  parentTitle: {
    fontSize: 15, fontWeight: 'bold',
    color: '#0D47A1', marginBottom: 10,
    letterSpacing: 1, textAlign: 'center',
    alignSelf: 'center',
  },
  stateBox: {
    width: '100%',
    borderWidth: 3,
    borderColor: '#1a2a4a',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 0,
    elevation: 4,
  },
  stateBoxInner: {
    backgroundColor: '#1565C0',
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: 'rgba(255,255,255,0.3)',
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(255,255,255,0.2)',
  },
  stateBoxLabel: {
    color: '#90CAF9', fontSize: 11,
    fontWeight: 'bold', letterSpacing: 3,
  },
  stateBoxValue: {
    color: '#fff', fontSize: 24, fontWeight: 'bold',
  },
});