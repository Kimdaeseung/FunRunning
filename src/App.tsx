/* eslint-disable curly */
/* eslint-disable keyword-spacing */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import RNShake from 'react-native-shake';
import {
  Alert,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  isStepCountingSupported,
  parseStepData,
  startStepCounterUpdate,
  stopStepCounterUpdate,
} from '@dongminyu/react-native-step-counter';

import Fitness from '@ovalmoney/react-native-fitness';

import {TailwindProvider, useTailwind} from 'tailwind-rn';
import utilities from '../tailwind.json';
import appleHealthKit, {HealthInputOptions, HealthKitPermissions} from 'react-native-health';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { Circle, Svg } from 'react-native-svg';

const MAX_RUN = 1000;


interface IMyComponent{
  steps: number;
  strokeWidth?: number;
  radius?: number;
}

const MyComponent = ({ strokeWidth = 20, radius = 100, steps}: IMyComponent) => {
  const tw = useTailwind();

  const innerradius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * innerradius;

  const run_progress = steps / MAX_RUN;

  return (
    <View style={tw('w-full h-full bg-black items-center justify-center')}>
      <View style={{width:radius * 2, height:radius * 2, alignSelf:'center'} }>
        <Svg>
          <Circle r={innerradius} cx={radius} cy={radius} originX={radius} originY={radius} strokeWidth={strokeWidth} stroke={'#EE0F55'} opacity={0.2} />
          <Circle r={innerradius} cx={radius} cy={radius} originX={radius} originY={radius} fillOpacity={0} strokeWidth={strokeWidth} stroke={'#EE0F55'} 
          rotation="90" strokeDasharray={[circumference * run_progress,circumference]} strokeLinecap="round" />
        </Svg>
      </View>
      <View style={tw('items-center justify-center mt-[20px]')}>
      <Text style={[tw('text-yellow-300 text-26')]}>너의 걸음수</Text>
      <Text style={[tw('mt-[10px] text-white text-26')]}>{steps}</Text>
      </View>
    </View>
  );
};

const permissions: HealthKitPermissions = {
  permissions: {
    read:[appleHealthKit.Constants.Permissions.StepCount],
    write: [],
  },
};

const permissionsf = [
  { kind: Fitness.PermissionKinds.Steps, access: Fitness.PermissionAccesses.Write },
];

function App(): JSX.Element {
  const [hasPermissions, setHasPermission] = useState(false);

  const [fitnessPermission, setFitnessPermission] = useState(false);
  const [steps, setSteps] = useState(0);

  const permissionCheck = () => {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;
    // const platformPermissions =
    // PERMISSIONS.IOS.MOTION;
    // const requestCameraPermission = async () => {
    //   try {
    //     const result = await request(platformPermissions);
    //     console.log('result :: ',result);
    //     // result === RESULTS.GRANTED
    //     //   ? setFitnessPermission(true)
    //     //   : Alert.alert('카메라 권한을 허용해주세요');
    //   } catch (err) {
    //     Alert.alert('Camera permission err');
    //     console.warn(err);
    //   }
    // };
    // requestCameraPermission();
    
  };

  async function startStepCounter() {
    startStepCounterUpdate(new Date(), (data) => {
      console.debug(parseStepData(data));
      console.log('step :: ',data.steps);
      setSteps(data.steps);
    });
  }

  useEffect(()=>{
    // appleHealthKit.initHealthKit(permissions, (err)=>{
    //   if(err){
    //     console.log('Error getting permissions :: ',err);
    //     return;
    //   }
    //   setHasPermission(true);
    // });


    // Fitness.isAuthorized(permissionsf)
    // .then((authorized) => {
    //   // Do something
    //   setFitnessPermission(true);
    // })
    // .catch((error) => {
    //   // Do something
    //   console.log('Error getting permissions 22 :: ',error);
    // });
    // Fitness.requestPermissions(permissionsf)
    // .then((authorized) => {
    //   // Do something
    //   setFitnessPermission(true);
    // })
    // .catch((error) => {
    //   // Do something
    //   console.log('Error getting permissions 22 :: ',error);
    // });

    startStepCounter();
  },[]);

  useEffect(()=>{
    if(!fitnessPermission){
      return;
    }
    Fitness.getSteps({ startDate: '20231205', endDate: '20231206' }).then((authorized)=>{console.log('step :: ',authorized);}).catch(()=>{});
    
  },[fitnessPermission]);

  // useEffect(()=>{
  //   if(!hasPermissions){
  //     return;
  //   }

  //   const options: HealthInputOptions = {
  //     date: new Date(2023, 12, 5).toISOString(),
  //     includeManuallyAdded: false,
  //   };

  //   appleHealthKit.getStepCount(options, (err,results)=>{
  //     if(err){
  //       console.log('Error getting the steps');
  //     }
  //     setSteps(results.value);
  //   });
  // },[hasPermissions]);

  return (
    <SafeAreaView>
    <TailwindProvider utilities={utilities}>
      <MyComponent steps={steps} />
    </TailwindProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
