import React, { useState, useEffect } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { View, Text, SectionList, StyleSheet, Image, ScrollView } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { CartesianChart, Line, useChartPressState } from 'victory-native';
import { Circle, useFont } from '@shopify/react-native-skia';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';
import Animated, { SharedValue, useAnimatedProps } from 'react-native-reanimated';
import { Currency } from '@/app/interfaces/crypto';
import RNPickerSelect from 'react-native-picker-select';

Animated.addWhitelistedNativeProps({ text: true });
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  return <Circle cx={x} cy={y} r={8} color={Colors.primary} />;
}

const ChartScreen = () => {
  const { id } = useLocalSearchParams();
  const headerHeight = useHeaderHeight();
  const [activeIndex, setActiveIndex] = useState(0);
  const [currency, setCurrency] = useState('KRW'); // State to keep track of the selected currency
  const font = useFont(require('@/assets/fonts/SpaceMono-Regular.ttf'), 12);
  const { state, isActive } = useChartPressState({ x: 0, y: { price: 0 } });

  useEffect(() => {
    console.log(isActive);
    if (isActive) Haptics.selectionAsync();
  }, [isActive]);

  const currenciesQuery = useQuery({
    queryKey: ['listings'],
    queryFn: () => fetch('/api/listings').then((res) => res.json()),
  });

  const ids = currenciesQuery.data?.map((currency: Currency) => currency.id).join(',');

  const infoQuery = useQuery({
    queryKey: ['info', ids],
    queryFn: () => fetch(`/api/info?ids=${ids}`).then((res) => res.json()),
    enabled: !!ids,
  });

  const tickersQuery = useQuery({
    queryKey: ['tickers'],
    queryFn: async (): Promise<any[]> => fetch(`/api/tickers`).then((res) => res.json()),
  });

  const animatedText = useAnimatedProps(() => {
    return {
      text: `currencySymbol() ${state.y.price.value.value.toFixed(2)}`,
      defaultValue: '',
    };
  });

  const animatedDateText = useAnimatedProps(() => {
    const date = new Date(state.x.value.value);
    return {
      text: `${date.toLocaleDateString()}`,
      defaultValue: '',
    };
  });

  const currencySymbol = () => {
    switch (currency) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'KRW':
        return '₩';
      default:
        return '';
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Camell Token' }} />
      <SectionList
        keyExtractor={(i) => i.title}
        sections={[{ data: [{ title: 'Chart' }] }]}
        renderSectionHeader={() => (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingBottom: 8,
              borderBottomColor: Colors.lightGray,
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          ></ScrollView>
        )}
        ListHeaderComponent={() => (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: 21,
              }}
            >
              <Text style={styles.subtitle}>CAMT</Text>
              {currenciesQuery.data?.map((currency: Currency) => (
                <View style={{ flexDirection: 'row', gap: 4, marginTop: 150, marginRight: 150 }}>
                  <Ionicons
                    name={currency.quote.KRW.percent_change_1h > 0 ? 'caret-up' : 'caret-down'}
                    size={16}
                    color={currency.quote.KRW.percent_change_1h > 0 ? 'green' : 'red'}
                  />
                  <Text
                    style={{ color: currency.quote.KRW.percent_change_1h > 0 ? 'green' : 'red' }}
                  >
                    {currency.quote.KRW.percent_change_1h.toFixed(2)} %
                  </Text>
                </View>
              ))}
              <Image
                source={require('@/assets/images/coin.png')}
                style={{ width: 70, height: 70, marginTop: 100, marginRight: 20, marginBottom: 20}}
              />
            </View>
            <View style={{ flexDirection: 'row', gap: 10, margin: 12 }}>
              <TouchableOpacity
                style={[
                  defaultStyles.pillButtonSmall,
                  { backgroundColor: Colors.primary, flexDirection: 'row', gap: 16 },
                ]}
              >
                <Text style={[defaultStyles.buttonText, { color: '#fff' }]}>Overview</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  defaultStyles.pillButtonSmall,
                  { backgroundColor: Colors.primaryMuted, flexDirection: 'row', gap: 16 },
                ]}
              >
                <Ionicons name="add" size={24} color={Colors.primary} />
                <Text style={[defaultStyles.buttonText, { color: Colors.primary }]}>Purchase</Text>
              </TouchableOpacity>
              <RNPickerSelect
                onValueChange={(value) => setCurrency(value)}
                items={[
                  { label: 'KRW', value: 'KRW' },
                  { label: 'USD', value: 'USD' },
                  { label: 'EUR', value: 'EUR' },
                ]}
                style={{
                  ...pickerSelectStyles,
                  inputIOS: { ...pickerSelectStyles.inputIOS, ...defaultStyles.dollarSmall },
                  inputAndroid: { ...pickerSelectStyles.inputAndroid, ...defaultStyles.dollarSmall },
                }}
                value={currency}
                placeholder={{}}
                useNativeAndroidPickerStyle={false}
                Icon={() => {
                  return <Ionicons name="caret-down" size={16} color="white" style={{ marginRight: 10, marginTop: 12.5}}/>;
                }}
              />
            </View>
          </>
        )}
        renderItem={({ item }) => (
          <>
            <View style={[defaultStyles.block, { height: 500 }]}>
              {tickersQuery.data && (
                <>
                  {!isActive && (
                    <View>
                      <Text style={{ fontSize: 30, fontWeight: 'bold', color: Colors.dark }}>
                        {currencySymbol()} {tickersQuery.data[tickersQuery.data.length - 1].price.toFixed(2)}
                      </Text>
                      <Text style={{ fontSize: 18, color: Colors.gray }}>Today</Text>
                    </View>
                  )}
                  {isActive && (
                    <View>
                      <AnimatedTextInput
                        editable={false}
                        underlineColorAndroid={'transparent'}
                        style={{ fontSize: 30, fontWeight: 'bold', color: Colors.dark }}
                        animatedProps={animatedText}
                      ></AnimatedTextInput>
                      <AnimatedTextInput
                        editable={false}
                        underlineColorAndroid={'transparent'}
                        style={{ fontSize: 18, color: Colors.gray }}
                        animatedProps={animatedDateText}
                      ></AnimatedTextInput>
                    </View>
                  )}
                  <CartesianChart
                    chartPressState={state}
                    axisOptions={{
                      font,
                      tickCount: 5,
                      labelOffset: { x: -2, y: 0 },
                      labelColor: Colors.gray,
                      formatYLabel: (v) => `${v} ${currencySymbol()}`,
                      formatXLabel: (ms) => format(new Date(ms), 'MM/yy'),
                    }}
                    data={tickersQuery.data}
                    xKey="timestamp"
                    yKeys={['price']}
                  >
                    {({ points }) => (
                      <>
                        <Line points={points.price} color={Colors.primary} strokeWidth={3} />
                        {isActive && <ToolTip x={state.x.position} y={state.y.price.position} />}
                      </>
                    )}
                  </CartesianChart>
                </>
              )}
            </View>
            <View style={[defaultStyles.block, { marginTop: 20 }]}>
              <Text style={styles.overview}>Overview</Text>
              <Text style={{ color: Colors.gray }}>
                The Camell is an innovative endeavor that integrates cloud storage services with a blockchain token economy to establish a new business model. At the heart of the Camell project is the Camell Drive, a cloud storage platform based on AWS S3. This platform allows users to own independent cloud storage spaces by utilizing CAMT tokens.
              </Text>
            </View>
          </>
        )}
      ></SectionList>
    </>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 20,
    marginTop: 150,
    fontWeight: 'bold',
    color: Colors.gray,
  },
  overview: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.gray,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.gray,
  },
  categoryTextActive: {
    fontSize: 14,
    color: '#000',
  },
  categoriesBtn: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  categoriesBtnActive: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
});

export default ChartScreen;